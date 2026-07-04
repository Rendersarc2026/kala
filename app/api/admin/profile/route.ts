import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/app/api/auth/login/route";

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      data: authResult.admin,
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Profile GET error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
