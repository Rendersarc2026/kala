import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyAccessToken } from "./auth";

export interface AuthSuccess {
  authenticated: true;
  admin: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export interface AuthFailure {
  authenticated: false;
  status: number;
  error: string;
}

export type AuthResult = AuthSuccess | AuthFailure;

/**
 * The super admin is the single account allowed to manage the admin roster
 * (create and remove other admins). Identified by both role and the configured
 * email, so that a stray `role = "SUPERADMIN"` row in the database is not on its
 * own sufficient to take over user management.
 */
export function isSuperAdmin(admin: AuthSuccess["admin"]): boolean {
  const superadminEmail = process.env.SUPERADMIN_EMAIL || process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL;
  if (!superadminEmail) return false;

  return (
    admin.role === "SUPERADMIN" &&
    admin.email.toLowerCase() === superadminEmail.toLowerCase()
  );
}

/**
 * Authenticates the admin using the access token from cookies.
 *
 * A deactivated admin (is_active = false) is rejected here rather than only
 * being hidden from listings, so that revoking an admin takes effect on their
 * next request even though their access token is still cryptographically valid.
 */
export async function authenticateAdmin(request: NextRequest): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("admin_access_token")?.value;

    if (!accessToken) {
      return {
        authenticated: false,
        status: 401,
        error: "Authentication required. Access token missing.",
      };
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return {
        authenticated: false,
        status: 401,
        error: "Session expired or invalid. Please login again or refresh your session.",
      };
    }

    const admin = await prisma.adminUser.findFirst({
      where: { id: payload.adminId, is_active: true },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    if (!admin) {
      return {
        authenticated: false,
        status: 403,
        error: "Admin user not found or access revoked.",
      };
    }

    return {
      authenticated: true,
      admin,
    };
  } catch (error) {
    console.error("Auth helper error:", error);
    return {
      authenticated: false,
      status: 500,
      error: "Internal authentication error.",
    };
  }
}
