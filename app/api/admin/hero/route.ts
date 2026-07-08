import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/app/api/auth/login/route";

const updateHeroSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(200, "Label must be less than 200 characters"),
  heading: z.string().trim().min(1, "Heading is required").max(500, "Heading must be less than 500 characters"),
  backgroundImageUrl: z.string().trim().min(1, "Background image is required").max(500, "Background image URL must be less than 500 characters"),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    let hero = await prisma.heroContent.findUnique({
      where: { id: "hero" },
    });

    if (!hero) {
      hero = {
        id: "hero",
        label: "From concept to completion.",
        heading: "WE TURN SPACE|INTO PLACE",
        buttonText: "Discover Projects",
        backgroundImageUrl: "",
        slideOrder: 1,
      };
    }

    const response = NextResponse.json({ success: true, data: hero });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin hero GET error:", error);
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
    const parseResult = updateHeroSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    const hero = await prisma.heroContent.upsert({
      where: { id: "hero" },
      update: {
        label: data.label,
        heading: data.heading,
        backgroundImageUrl: data.backgroundImageUrl,
      },
      create: {
        id: "hero",
        label: data.label,
        heading: data.heading,
        backgroundImageUrl: data.backgroundImageUrl,
        buttonText: "Discover Projects",
        slideOrder: 1,
      },
    });

    const response = NextResponse.json({ success: true, data: hero });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin hero POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
