import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { addSecurityHeaders } from "@/lib/security-headers";

const createEnquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(100),
  phone: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .max(30)
    .regex(/^[0-9+\s()-]+$/, "Invalid phone number format"),
  projectType: z.string().trim().min(1, "Project type is required").max(100),
  message: z.string().trim().min(1, "Message/brief is required").max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parseResult = createEnquirySchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        projectType: data.projectType,
        message: data.message,
        status: "NEW",
      },
    });

    const response = NextResponse.json({
      success: true,
      data: enquiry,
    }, { status: 201 });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Public enquiries POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
