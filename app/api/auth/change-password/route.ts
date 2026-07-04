import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "../login/route";

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required")
    .max(100, "Current password must be under 100 characters"),
  newPassword: z
    .string()
    .min(1, "New password is required")
    .max(100, "New password must be under 100 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate session, allowing users with mustChangePassword = true
    const authResult = await authenticateAdmin(request, { allowMustChangePassword: true });
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const adminId = authResult.admin.id;

    // 2. Parse and validate body inputs using Zod
    const body = await request.json().catch(() => ({}));
    const parseResult = changePasswordSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const { currentPassword, newPassword } = parseResult.data;

    // Fetch the admin user record from the database to get the hashed password
    const adminRecord = await prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!adminRecord) {
      const response = NextResponse.json({ error: "Admin record not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    // 3. Verify Current Password
    const isCurrentPasswordCorrect = await verifyPassword(
      currentPassword,
      adminRecord.hashedPassword
    );

    if (!isCurrentPasswordCorrect) {
      const response = NextResponse.json(
        { error: "Incorrect current password." },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    // Prevent using the same password
    if (currentPassword === newPassword) {
      const response = NextResponse.json(
        { error: "New password must be different from the current password." },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    // 4. Enforce Password Strength Validation
    const strengthResult = validatePasswordStrength(newPassword);
    if (!strengthResult.isValid) {
      const response = NextResponse.json(
        { error: strengthResult.message },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    // 5. Hash and save the new password
    const newHashedPassword = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      // Update password and clear change flag
      await tx.adminUser.update({
        where: { id: adminId },
        data: {
          hashedPassword: newHashedPassword,
          mustChangePassword: false,
        },
      });

      // Clear all active sessions (force re-auth on all other devices)
      await tx.session.deleteMany({
        where: { adminId },
      });
    });

    // 6. Log the current device back in with new tokens
    const claims = { adminId: adminRecord.id, role: adminRecord.role };
    const accessToken = signAccessToken(claims);
    const refreshToken = signRefreshToken(claims);

    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.session.create({
      data: {
        adminId: adminRecord.id,
        refreshToken,
        expiresAt: sessionExpiry,
      },
    });

    const cookieStore = await cookies();
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
      message: "Password changed successfully. All other active sessions have been signed out.",
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Change password error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
