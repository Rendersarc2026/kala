import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const updateTeamMemberSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  role: z.string().trim().min(1).max(200).optional(),
  image: z.string().trim().min(1).max(500).optional(),
  bio: z.string().trim().min(1).optional(),
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

    const member = await prisma.teamMember.findFirst({ where: { id, is_active: true } });
    if (!member) {
      const response = NextResponse.json({ error: "Team member not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json({ success: true, data: member });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Team member GET error:", error);
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

    const existing = await prisma.teamMember.findFirst({ where: { id, is_active: true } });
    if (!existing) {
      const response = NextResponse.json({ error: "Team member not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = updateTeamMemberSchema.safeParse(body);

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

    const member = await prisma.teamMember.update({
      where: { id },
      data,
    });

    const response = NextResponse.json({ success: true, data: member });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Team member PATCH error:", error);
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

    const existing = await prisma.teamMember.findFirst({ where: { id, is_active: true } });
    if (!existing) {
      const response = NextResponse.json({ error: "Team member not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    await prisma.teamMember.update({
      where: { id },
      data: { is_active: false },
    });

    const response = NextResponse.json({ success: true, message: "Team member deleted successfully" });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Team member DELETE error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
