import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { DbService } from "@/lib/types";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";
import { parseStringArray } from "@/lib/json";

const createServiceSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(1000),
  image: z.string().trim().min(1).max(500),
  details: z.array(z.string().trim().min(1)).min(1),
  sortOrder: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const parsed = services.map((s: DbService) => ({
      ...s,
      details: parseStringArray(s.details),
    }));

    const response = NextResponse.json({ success: true, data: parsed });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin services GET error:", error);
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
    const parseResult = createServiceSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    const service = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        details: JSON.stringify(data.details),
        sortOrder: data.sortOrder,
      },
    });

    const response = NextResponse.json({
      success: true,
      data: { ...service, details: parseStringArray(service.details) },
    }, { status: 201 });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin services POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
