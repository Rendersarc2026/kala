import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";
import { parseStringArray } from "@/lib/json";

const updateServiceSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(1000).optional(),
  image: z.string().trim().min(1).max(500).optional(),
  details: z.array(z.string().trim().min(1)).min(1).optional(),
  sortOrder: z.number().int().optional(),
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

    const service = await prisma.service.findFirst({ where: { id, is_active: true } });
    if (!service) {
      const response = NextResponse.json({ error: "Service not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      data: { ...service, details: parseStringArray(service.details) },
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Service GET error:", error);
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

    const existing = await prisma.service.findFirst({ where: { id, is_active: true } });
    if (!existing) {
      const response = NextResponse.json({ error: "Service not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = updateServiceSchema.safeParse(body);

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

    const updateData: Record<string, unknown> = { ...data };
    if (updateData.details) {
      updateData.details = JSON.stringify(updateData.details);
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    const response = NextResponse.json({
      success: true,
      data: { ...service, details: parseStringArray(service.details) },
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Service PATCH error:", error);
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

    const existing = await prisma.service.findFirst({ where: { id, is_active: true } });
    if (!existing) {
      const response = NextResponse.json({ error: "Service not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    await prisma.service.update({
      where: { id },
      data: { is_active: false },
    });

    const response = NextResponse.json({ success: true, message: "Service deleted successfully" });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Service DELETE error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
