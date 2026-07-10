import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { addSecurityHeaders } from "@/lib/security-headers";
import {
  checkLockout,
  recordFailedAttempt,
  generateOtp,
  deliverOtp,
  checkOtpRateLimit,
  signPreAuthToken,
} from "@/lib/auth";

// Schema validation for input
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(100, "Email must be under 100 characters")
    .trim(),
});

// Returned whether or not the identifier resolves to a real admin, so that the
// response cannot be used to enumerate valid admin accounts. Authentication is
// passwordless, so a valid identifier is half of the credential.
const GENERIC_LOGIN_RESPONSE = {
  success: true,
  message: "If that account exists, an OTP code has been sent to its registered email.",
  requireOtp: true,
};

export async function POST(request: NextRequest) {
  try {
    // 1. Get client IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || null;

    // 2. Parse and validate inputs using Zod
    const body = await request.json().catch(() => ({}));
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const { identifier } = parseResult.data;

    // Sanitization to prevent simple injection or control character attacks
    const sanitizedIdentifier = identifier.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

    // 3. Find Admin User strictly by email
    const admin = await prisma.adminUser.findUnique({
      where: { email: sanitizedIdentifier },
    });

    const targetIdentifier = admin ? admin.email : sanitizedIdentifier;

    // 4. Lockout Check
    const lockout = await checkLockout(targetIdentifier);
    if (lockout.isLocked) {
      const response = NextResponse.json(
        {
          error: `Too many failed login attempts. This account is locked. Please try again after ${lockout.retryAfterSeconds} seconds.`,
          retryAfter: lockout.retryAfterSeconds,
        },
        { status: 423 }
      );
      return addSecurityHeaders(response);
    }

    if (!admin) {
      await recordFailedAttempt(targetIdentifier, ip);
      const response = NextResponse.json(
        { error: "Username or email does not exist." },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    // 5. Throttle OTP issuance per account. Without this an attacker can mint an
    // unbounded number of simultaneously-valid codes (mail-bombing the admin and
    // shrinking the search space for a blind guess).
    const otpRateLimited = await checkOtpRateLimit(admin.id);
    if (otpRateLimited) {
      const response = NextResponse.json(
        {
          error: "Too many OTP requests. Please wait a few minutes before requesting another code.",
          retryAfter: 300,
        },
        { status: 429, headers: { "Retry-After": "300" } }
      );
      return addSecurityHeaders(response);
    }

    // 6. Issue a fresh OTP, invalidating any codes still outstanding for this
    // account so that exactly one code is live at a time. Outstanding codes are
    // expired in place rather than deleted, because checkOtpRateLimit counts
    // rows in the window — deleting them would reset the limiter each issuance.
    const now = new Date();
    const { code, hash } = generateOtp();
    await prisma.$transaction([
      prisma.otp.updateMany({
        where: { adminId: admin.id, expiresAt: { gt: now } },
        data: { expiresAt: now },
      }),
      prisma.otp.create({
        data: {
          adminId: admin.id,
          codeHash: hash,
          expiresAt: new Date(now.getTime() + 5 * 60 * 1000), // 5 minute expiry
        },
      }),
    ]);

    // 7. Deliver OTP
    await deliverOtp(admin.email, code);

    // 8. Set Pre-Auth Token Cookie
    const preAuthToken = signPreAuthToken({
      adminId: admin.id,
      email: admin.email,
      type: "pre_auth",
    });

    const cookieStore = await cookies();
    cookieStore.set("admin_pre_auth_token", preAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60, // 5 minutes
      path: "/",
    });

    return addSecurityHeaders(NextResponse.json(GENERIC_LOGIN_RESPONSE));
  } catch (error) {
    console.error("Login error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
