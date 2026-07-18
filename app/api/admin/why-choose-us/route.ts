import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const createWhySchema = z.object({
  title: z.string().trim().min(1),
  image: z.string().trim().min(1),
  description: z.string().trim().min(1),
  extended: z.string().trim().min(1),
  sortOrder: z.number().int().default(1),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const items = await prisma.whyChooseUsItem.findMany({
      where: { is_active: true },
      orderBy: { sortOrder: "asc" },
    });

    const response = NextResponse.json({ success: true, data: items });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin why-choose-us GET error:", error);
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
    const parseResult = createWhySchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    const item = await prisma.$transaction(async (tx) => {
      await tx.whyChooseUsItem.updateMany({
        where: {
          is_active: true,
          sortOrder: {
            gte: data.sortOrder,
          },
        },
        data: {
          sortOrder: { increment: 1 },
        },
      });

      return tx.whyChooseUsItem.create({
        data,
      });
    });

    const response = NextResponse.json({ success: true, data: item }, { status: 201 });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin why-choose-us POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
