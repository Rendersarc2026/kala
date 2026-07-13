import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";
import { parseStringArray } from "@/lib/json";

const updateProjectSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
  title: z.string().trim().min(1).max(200).optional(),
  category: z.enum(["residential", "commercial", "hospitality"]).optional(),
  location: z.string().trim().min(1).max(200).optional(),
  area: z.string().trim().min(1).max(100).optional(),
  year: z.string().trim().min(1).max(20).optional(),
  client: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(500).optional(),
  narrative: z.string().trim().min(1).optional(),
  heroImage: z.string().trim().min(1).max(500).optional(),
  images: z.array(z.string().trim().min(1)).max(3, "You can have a maximum of 3 gallery images").optional(),
  featured: z.boolean().optional(),
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

    const project = await prisma.project.findFirst({ where: { id, is_active: true } });
    if (!project) {
      const response = NextResponse.json({ error: "Project not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      data: { ...project, images: parseStringArray(project.images) },
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Project GET error:", error);
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

    const existing = await prisma.project.findFirst({ where: { id, is_active: true } });
    if (!existing) {
      const response = NextResponse.json({ error: "Project not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = updateProjectSchema.safeParse(body);

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

    if (data.featured && !existing.featured) {
      const featuredCount = await prisma.project.count({
        where: {
          featured: true,
          is_active: true,
          id: { not: id }
        },
      });
      if (featuredCount >= 4) {
        const response = NextResponse.json(
          { error: "You can only have up to 4 featured projects. Please unfeature another project first." },
          { status: 400 }
        );
        return addSecurityHeaders(response);
      }
    }

    if (data.slug) {
      const slugExists = await prisma.project.findFirst({
        where: { slug: data.slug, id: { not: id } },
      });
      if (slugExists) {
        const response = NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
        return addSecurityHeaders(response);
      }
    }

    const updateData: Record<string, unknown> = { ...data };
    if (updateData.images) {
      updateData.images = JSON.stringify(updateData.images);
    }

    const project = await prisma.$transaction(async (tx) => {
      // If sortOrder is being changed, shift existing project sort orders to make room
      if (data.sortOrder !== undefined && data.sortOrder !== existing.sortOrder) {
        await tx.project.updateMany({
          where: {
            id: { not: id },
            sortOrder: {
              gte: data.sortOrder,
            },
          },
          data: {
            sortOrder: {
              increment: 1,
            },
          },
        });
      }

      return await tx.project.update({
        where: { id },
        data: updateData,
      });
    });

    const response = NextResponse.json({
      success: true,
      data: { ...project, images: parseStringArray(project.images) },
    });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Project PATCH error:", error);
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

    const existing = await prisma.project.findFirst({ where: { id, is_active: true } });
    if (!existing) {
      const response = NextResponse.json({ error: "Project not found" }, { status: 404 });
      return addSecurityHeaders(response);
    }

    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id },
        data: { is_active: false },
      });

      await tx.project.updateMany({
        where: {
          sortOrder: {
            gt: existing.sortOrder,
          },
        },
        data: {
          sortOrder: {
            decrement: 1,
          },
        },
      });
    });

    const response = NextResponse.json({ success: true, message: "Project deleted successfully" });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Project DELETE error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
