import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate admin
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    let about = await prisma.aboutSection.findFirst({
      where: { id: "about-teaser", is_active: true },
    });

    if (!about) {
      about = {
        id: "about-teaser",
        label: "About Kala Studio",
        heading: "We sculpt tactile, honest spaces focused on tectonic integrity and sensory warmth. Trusted by clients who demand precision, beauty, and care.",
        paragraph: "",
        image1Url: "",
        image2Url: "",
        buttonText: "",
        is_active: true,
      };
    }

    const response = NextResponse.json({ success: true, data: about });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin about GET error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate admin
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    // 2. Parse request body
    const body = await request.json().catch(() => ({}));
    const label = typeof body.label === "string" ? body.label.trim() : "";
    const heading = typeof body.heading === "string" ? body.heading.trim() : "";

    if (!label || !heading) {
      const response = NextResponse.json({ error: "Required fields label and heading cannot be empty or whitespace only" }, { status: 400 });
      return addSecurityHeaders(response);
    }

    // 3. Upsert configuration
    const about = await prisma.aboutSection.upsert({
      where: { id: "about-teaser" },
      update: {
        label,
        heading,
        // Saving content restores the row if it was previously deactivated.
        is_active: true,
      },
      create: {
        id: "about-teaser",
        label,
        heading,
        paragraph: "",
        image1Url: "",
        image2Url: "",
        buttonText: "",
      },
    });

    const response = NextResponse.json({ success: true, data: about });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin about POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
