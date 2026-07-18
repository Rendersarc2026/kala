import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const updateCoreValueSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const parseResult = updateCoreValueSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    const existingItem = await prisma.coreValue.findUnique({
      where: { id, is_active: true },
    });

    if (!existingItem) {
      const response = NextResponse.json({ error: "Item not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const updatedItem = await prisma.$transaction(async (tx) => {
      if (data.sortOrder !== undefined && data.sortOrder !== existingItem.sortOrder) {
        if (data.sortOrder > existingItem.sortOrder) {
          await tx.coreValue.updateMany({
            where: {
              is_active: true,
              sortOrder: { gt: existingItem.sortOrder, lte: data.sortOrder },
            },
            data: { sortOrder: { decrement: 1 } },
          });
        } else {
          await tx.coreValue.updateMany({
            where: {
              is_active: true,
              sortOrder: { gte: data.sortOrder, lt: existingItem.sortOrder },
            },
            data: { sortOrder: { increment: 1 } },
          });
        }
      }

      return tx.coreValue.update({
        where: { id },
        data,
      });
    });

    const response = NextResponse.json({ success: true, data: updatedItem });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin core-values PATCH error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const { id } = await params;

    const existingItem = await prisma.coreValue.findUnique({
      where: { id, is_active: true },
    });

    if (!existingItem) {
      const response = NextResponse.json({ error: "Item not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    await prisma.$transaction(async (tx) => {
      await tx.coreValue.update({
        where: { id },
        data: { is_active: false },
      });

      await tx.coreValue.updateMany({
        where: {
          is_active: true,
          sortOrder: { gt: existingItem.sortOrder },
        },
        data: {
          sortOrder: { decrement: 1 },
        },
      });
    });

    const response = NextResponse.json({ success: true });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin core-values DELETE error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
