import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyAccessToken, JwtPayload } from "./auth";

export interface AuthSuccess {
  authenticated: true;
  admin: {
    id: string;
    email: string;
    username: string;
    role: string;
    mustChangePassword: boolean;
  };
}

export interface AuthFailure {
  authenticated: false;
  status: number;
  error: string;
}

export type AuthResult = AuthSuccess | AuthFailure;

/**
 * Authenticates the admin using the access token from cookies.
 * By default, it blocks access if the admin has mustChangePassword=true,
 * unless allowMustChangePassword is set to true.
 */
export async function authenticateAdmin(
  request: NextRequest,
  options?: { allowMustChangePassword?: boolean }
): Promise<AuthResult> {
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

    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.adminId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        mustChangePassword: true,
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
