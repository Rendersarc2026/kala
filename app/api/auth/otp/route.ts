import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  verifyPreAuthToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";
import { addSecurityHeaders } from "../login/route";

const otpVerifySchema = z.object({
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Get pre-auth token from cookies
    const cookieStore = await cookies();
    const preAuthTokenCookie = cookieStore.get("admin_pre_auth_token");

    if (!preAuthTokenCookie?.value) {
      const response = NextResponse.json(
        { error: "Session expired or invalid. Please login again." },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    const payload = verifyPreAuthToken(preAuthTokenCookie.value);
    if (!payload) {
      const response = NextResponse.json(
        { error: "Session expired or invalid. Please login again." },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    // 2. Parse and validate body
    const body = await request.json().catch(() => ({}));
    const parseResult = otpVerifySchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid OTP format", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const { code } = parseResult.data;

    // 3. Hash submitted OTP and lookup in DB
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const now = new Date();

    const activeOtp = await prisma.otp.findFirst({
      where: {
        adminId: payload.adminId,
        codeHash,
        expiresAt: { gt: now },
      },
    });

    if (!activeOtp) {
      const response = NextResponse.json(
        { error: "Invalid or expired OTP code." },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    // 4. Retrieve admin user to get the role and check password-change status
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.adminId },
    });

    if (!admin) {
      const response = NextResponse.json({ error: "Admin user not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    // OTP succeeded: delete all OTPs for this admin
    await prisma.otp.deleteMany({
      where: { adminId: admin.id },
    });

    // 5. Generate Access & Refresh Tokens
    const claims = { adminId: admin.id, role: admin.role };
    const accessToken = signAccessToken(claims);
    const refreshToken = signRefreshToken(claims);

    // Save refresh token session in database
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.session.create({
      data: {
        adminId: admin.id,
        refreshToken,
        expiresAt: sessionExpiry,
      },
    });

    // 6. Set access & refresh tokens in httpOnly, secure cookies, and clear pre-auth cookie
    cookieStore.delete("admin_pre_auth_token");

    cookieStore.set("admin_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60, // 2 hours
      path: "/",
    });

    cookieStore.set("admin_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      mustChangePassword: false,
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error("OTP Verification error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
