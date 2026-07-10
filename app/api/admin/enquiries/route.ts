import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const enquiries = await prisma.enquiry.findMany({
      where: { is_active: true },
      orderBy: { createdAt: "desc" },
    });

    const response = NextResponse.json({ success: true, data: enquiries });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin enquiries GET error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
