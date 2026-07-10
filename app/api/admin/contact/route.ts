import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";
import { isSafeMapEmbedUrl } from "@/lib/validation";

const contactSettingsSchema = z.object({
  phone: z.string().trim().min(1, "Phone is required").max(100),
  email: z.string().trim().email("Invalid email format"),
  hoursMonFri: z.string().trim().min(1, "Monday-Friday hours are required").max(100),
  hoursSat: z.string().trim().min(1, "Saturday hours are required").max(100),
  hoursSun: z.string().trim().min(1, "Sunday hours are required").max(100),
  // Rendered into <iframe src>, so it must be constrained to https Google Maps.
  mapEmbedUrl: z
    .string()
    .trim()
    .min(1, "Map embed URL is required")
    .max(1000)
    .refine(isSafeMapEmbedUrl, {
      message: "Map embed URL must be an https:// link to google.com or maps.google.com.",
    }),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    let contact = await prisma.contactSettings.findUnique({
      where: { id: "contact" },
    });

    if (!contact) {
      contact = {
        id: "contact",
        phone: "+91 87141 81942",
        email: "kalaarchitect4@gmail.com",
        hoursMonFri: "9:00 AM — 7:00 PM",
        hoursSat: "10:00 AM — 5:00 PM",
        hoursSun: "Closed",
        mapEmbedUrl: "https://maps.google.com/maps?q=Thalassery+Kerala+India&t=k&z=14&output=embed",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const response = NextResponse.json({ success: true, data: contact });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin contact GET error:", error);
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
    const parseResult = contactSettingsSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    const contact = await prisma.contactSettings.upsert({
      where: { id: "contact" },
      update: data,
      create: {
        id: "contact",
        ...data,
      },
    });

    const response = NextResponse.json({ success: true, data: contact });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin contact POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
