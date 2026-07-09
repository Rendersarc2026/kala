import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { addSecurityHeaders } from "@/lib/security-headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("admin_refresh_token");

    if (refreshTokenCookie?.value) {
      // Invalidate the session in the database
      await prisma.session.delete({
        where: { refreshToken: refreshTokenCookie.value },
      }).catch(() => {
        // Ignore errors if the session was already deleted or doesn't exist
      });
    }

    // Delete cookies on the client side
    cookieStore.delete("admin_access_token");
    cookieStore.delete("admin_refresh_token");

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Logout error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
