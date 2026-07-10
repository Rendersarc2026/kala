import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const updateEnquirySchema = z.object({
  status: z.string().trim().min(1).max(50),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const { id } = await context.params;

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing || !existing.is_active) {
      const response = NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = updateEnquirySchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: {
        status: parseResult.data.status,
      },
    });

    const response = NextResponse.json({ success: true, data: enquiry });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Enquiry PATCH error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const { id } = await context.params;

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing || !existing.is_active) {
      const response = NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    await prisma.enquiry.update({
      where: { id },
      data: { is_active: false },
    });

    const response = NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Enquiry DELETE error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
