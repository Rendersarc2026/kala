import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/app/api/auth/login/route";

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
  sortOrder: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const parsed = projects.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
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
        where: { featured: true },
      });
      if (featuredCount >= 4) {
        const response = NextResponse.json(
          { error: "You can only have up to 4 featured projects. Please unfeature another project first." },
          { status: 400 }
        );
        return addSecurityHeaders(response);
      }
    }

    const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (existing) {
      const response = NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
      return addSecurityHeaders(response);
    }

    const project = await prisma.project.create({
      data: {
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
      },
    });

    const response = NextResponse.json({
      success: true,
      data: { ...project, images: JSON.parse(project.images) },
    }, { status: 201 });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Projects POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
