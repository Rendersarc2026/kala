import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/app/api/auth/login/route";

const createTestimonialSchema = z.object({
  quote: z.string().trim().min(1, "Quote is required"),
  clientName: z.string().trim().min(1, "Client Name is required").max(200),
  location: z.string().trim().min(1, "Location is required").max(200),
  projectType: z.string().trim().min(1, "Project Type is required").max(100),
  image: z.string().trim().max(500).optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "asc" },
    });

    const response = NextResponse.json({ success: true, data: testimonials });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin testimonials GET error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = createTestimonialSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    const testimonial = await prisma.testimonial.create({
      data: {
        quote: data.quote,
        clientName: data.clientName,
        location: data.location,
        projectType: data.projectType,
        image: data.image || null,
      },
    });

    const response = NextResponse.json({
      success: true,
      data: testimonial,
    }, { status: 201 });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin testimonials POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
