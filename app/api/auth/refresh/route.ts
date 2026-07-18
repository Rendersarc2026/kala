import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  SESSION_EXPIRY_MS,
  SESSION_EXPIRY_SECONDS,
} from "@/lib/auth";
import { addSecurityHeaders } from "@/lib/security-headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("admin_refresh_token");

    if (!refreshTokenCookie?.value) {
      const response = NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
      return addSecurityHeaders(response);
    }

    const tokenValue = refreshTokenCookie.value;

    // 1. Verify Refresh Token JWT signature/expiry
    const payload = verifyRefreshToken(tokenValue);
    if (!payload) {
      // Invalidate cookie
      cookieStore.delete("admin_refresh_token");
      cookieStore.delete("admin_access_token");
      const response = NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
      return addSecurityHeaders(response);
    }

    // 2. Look up the refresh token session in the database
    const dbSession = await prisma.session.findUnique({
      where: { refreshToken: tokenValue },
      include: { admin: true },
    });

    const now = new Date();

    // A deactivated admin must not be able to mint fresh tokens from a session
    // that outlived their removal, so the account is re-checked on every refresh.
    if (!dbSession || dbSession.expiresAt <= now || !dbSession.admin.is_active) {
      // Clean up invalid session if it exists in the database
      if (dbSession) {
        await prisma.session.delete({ where: { id: dbSession.id } }).catch(() => {});
      }

      cookieStore.delete("admin_refresh_token");
      cookieStore.delete("admin_access_token");
      const response = NextResponse.json({ error: "Session expired or revoked" }, { status: 401 });
      return addSecurityHeaders(response);
    }

    // 3. Refresh Token Rotation (RTR)
    // Delete the used session to prevent replay attacks
    await prisma.session.delete({
      where: { id: dbSession.id },
    });

    // 4. Generate new tokens
    const claims = { adminId: dbSession.admin.id, role: dbSession.admin.role };
    const newAccessToken = signAccessToken(claims);
    const newRefreshToken = signRefreshToken(claims);

    // Save new session in database
    const sessionExpiry = new Date(Date.now() + SESSION_EXPIRY_MS); // 12 hours
    await prisma.session.create({
      data: {
        adminId: dbSession.admin.id,
        refreshToken: newRefreshToken,
        expiresAt: sessionExpiry,
      },
    });

    // 5. Set new cookies
    cookieStore.set("admin_access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_EXPIRY_SECONDS, // 12 hours
      path: "/",
    });

    cookieStore.set("admin_refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_EXPIRY_SECONDS, // 12 hours
      path: "/",
    });

    const response = NextResponse.json({
      success: true,
      message: "Tokens refreshed successfully.",
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Token refresh error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
