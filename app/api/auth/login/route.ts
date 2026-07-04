import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  checkLockout,
  recordFailedAttempt,
  resetFailedAttempts,
  generateOtp,
  deliverOtp,
  checkOtpRateLimit,
  signPreAuthToken,
  verifyPassword,
} from "@/lib/auth";

// Schema validation for input
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Username or email is required")
    .max(100, "Identifier must be under 100 characters")
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .max(100, "Password must be under 100 characters"),
});

// Helper to set security headers to prevent XSS, clickjacking, etc.
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Content-Security-Policy", "default-src 'self'; frame-ancestors 'none'; object-src 'none';");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  return response;
}

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

    const { identifier, password } = parseResult.data;

    // Sanitization to prevent simple injection or control character attacks
    const sanitizedIdentifier = identifier.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

    // 3. Lockout Check
    const lockout = await checkLockout(sanitizedIdentifier);
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

    // 4. Find Admin User by email or username
    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: sanitizedIdentifier },
          { username: sanitizedIdentifier },
        ],
      },
    });

    if (!admin) {
      await recordFailedAttempt(sanitizedIdentifier, ip);
      const response = NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      return addSecurityHeaders(response);
    }

    // 5. Verify Password
    const passwordMatches = await verifyPassword(password, admin.hashedPassword);
    if (!passwordMatches) {
      await recordFailedAttempt(sanitizedIdentifier, ip);
      const response = NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      return addSecurityHeaders(response);
    }

    // Success - reset failed attempts
    await resetFailedAttempts(sanitizedIdentifier);

    // 6. Check OTP request rate limiting (max 3 per 5 min)
    const isRateLimited = await checkOtpRateLimit(admin.id);
    if (isRateLimited) {
      const response = NextResponse.json(
        { error: "Too many OTP requests. Please wait 5 minutes before trying again." },
        { status: 429 }
      );
      return addSecurityHeaders(response);
    }

    // 7. Generate and save OTP
    const { code, hash } = generateOtp();
    await prisma.otp.create({
      data: {
        adminId: admin.id,
        codeHash: hash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minute expiry
      },
    });

    // 8. Deliver OTP
    await deliverOtp(admin.email, code);

    // 9. Set Pre-Auth Token Cookie
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

    const response = NextResponse.json({
      success: true,
      message: "Password verified. OTP code sent to your registered email.",
      requireOtp: true,
      mustChangePassword: admin.mustChangePassword,
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Login error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
