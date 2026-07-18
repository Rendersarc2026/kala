import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const updateProcessSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(1000).optional(),
  details: z.string().trim().min(1).max(1500).optional(),
  sortOrder: z.number().int().optional(),
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

    const existing = await prisma.processStep.findFirst({ where: { id, is_active: true } });
    if (!existing) {
      const response = NextResponse.json({ error: "Process step not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = updateProcessSchema.safeParse(body);

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

    const processStep = await prisma.$transaction(async (tx) => {
      if (data.sortOrder !== undefined && data.sortOrder !== existing.sortOrder) {
        if (data.sortOrder < existing.sortOrder) {
          await tx.processStep.updateMany({
            where: {
              is_active: true,
              sortOrder: {
                gte: data.sortOrder,
                lt: existing.sortOrder,
              },
            },
            data: { sortOrder: { increment: 1 } },
          });
        } else {
          await tx.processStep.updateMany({
            where: {
              is_active: true,
              sortOrder: {
                gt: existing.sortOrder,
                lte: data.sortOrder,
              },
            },
            data: { sortOrder: { decrement: 1 } },
          });
        }
      }

      return tx.processStep.update({
        where: { id },
        data,
      });
    });

    const response = NextResponse.json({
      success: true,
      data: processStep,
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin process PATCH error:", error);
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

    const existing = await prisma.processStep.findFirst({ where: { id, is_active: true } });
    if (!existing) {
      const response = NextResponse.json({ error: "Process step not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    await prisma.$transaction(async (tx) => {
      await tx.processStep.update({
        where: { id },
        data: { is_active: false },
      });

      await tx.processStep.updateMany({
        where: {
          is_active: true,
          sortOrder: {
            gt: existing.sortOrder,
          },
        },
        data: {
          sortOrder: { decrement: 1 },
        },
      });
    });

    const response = NextResponse.json({ success: true, message: "Process step deleted successfully" });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin process DELETE error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
