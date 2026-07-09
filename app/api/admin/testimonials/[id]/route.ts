import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const updateTestimonialSchema = z.object({
  quote: z.string().trim().min(1).optional(),
  clientName: z.string().trim().min(1).max(200).optional(),
  location: z.string().trim().min(1).max(200).optional(),
  projectType: z.string().trim().min(1).max(100).optional(),
  image: z.string().trim().max(500).optional().nullable(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const { id } = await context.params;

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      const response = NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json({ success: true, data: testimonial });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Testimonial GET error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const { id } = await context.params;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      const response = NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = updateTestimonialSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    if (Object.keys(data).length === 0) {
      const response = NextResponse.json({ error: "No fields to update provided" }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });

    const response = NextResponse.json({ success: true, data: testimonial });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Testimonial PATCH error:", error);
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

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      const response = NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    await prisma.testimonial.delete({ where: { id } });

    const response = NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Testimonial DELETE error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
