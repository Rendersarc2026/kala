import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { DbProject } from "@/lib/types";
import { parseStringArray } from "@/lib/json";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const createProjectSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().trim().min(1, "Title is required").max(200),
  category: z.enum(["residential", "commercial", "hospitality"]),
  location: z.string().trim().min(1, "Location is required").max(200),
  area: z.string().trim().min(1, "Area is required").max(100),
  year: z.string().trim().min(1, "Year is required").max(20),
  client: z.string().trim().min(1, "Client is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(500),
  narrative: z.string().trim().min(1, "Narrative is required"),
  heroImage: z.string().trim().min(1, "Hero image is required").max(500),
  images: z.array(z.string().trim().min(1)).max(3, "You can have a maximum of 3 gallery images"),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(1),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const projects = await prisma.project.findMany({
      where: { is_active: true },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "asc" },
        { id: "asc" },
      ],
    });

    const parsed = projects.map((p: DbProject) => ({
      ...p,
      images: parseStringArray(p.images),
    }));

    const response = NextResponse.json({ success: true, data: parsed });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Projects GET error:", error);
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
    const parseResult = createProjectSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    if (data.featured) {
      const featuredCount = await prisma.project.count({
        where: { featured: true, is_active: true },
      });
      if (featuredCount >= 4) {
        const response = NextResponse.json(
          { error: "You can only have up to 4 featured projects. Please unfeature another project first." },
          { status: 400 }
        );
        return addSecurityHeaders(response);
      }
    }

    // `slug` is unique across every row, including soft-deleted ones. Only a live
    // project is a genuine conflict; a deleted one still holding the slug is
    // revived in place below, so deleting and re-adding a project keeps working.
    const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (existing?.is_active) {
      const response = NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
      return addSecurityHeaders(response);
    }

    const fields = {
      slug: data.slug,
      title: data.title,
      category: data.category,
      location: data.location,
      area: data.area,
      year: data.year,
      client: data.client,
      description: data.description,
      narrative: data.narrative,
      heroImage: data.heroImage,
      images: JSON.stringify(data.images),
      featured: data.featured,
      sortOrder: data.sortOrder,
    };

    const project = await prisma.$transaction(async (tx) => {
      // Shift existing project sort orders to make room for the new project
      await tx.project.updateMany({
        where: {
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

      if (existing) {
        return await tx.project.update({
          where: { id: existing.id },
          data: { ...fields, is_active: true },
        });
      }

      return await tx.project.create({ data: fields });
    });

    const response = NextResponse.json({
      success: true,
      data: { ...project, images: parseStringArray(project.images) },
    }, { status: 201 });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Projects POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
