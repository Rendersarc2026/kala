import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const createCoreValueSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  sortOrder: z.number().int().default(1),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    let items = await prisma.coreValue.findMany({
      where: { is_active: true },
      orderBy: { sortOrder: "asc" },
    });

    if (items.length === 0) {
      // Seed initial items
      const VALUES = [
        { title: "Tectonic Purity", description: "We believe architecture should be honest. We prioritize structural logic and reject superficial ornamentation, allowing spaces to speak through form, scale, and volume.", sortOrder: 1, number: "01" },
        { title: "Sensory Warmth", description: "Minimalism doesn't have to feel cold. We select tactile materials—honed travertine, brushed oak, and organic linens—to engage the senses and create a deep feeling of home.", sortOrder: 2, number: "02" },
        { title: "Absolute Transparency", description: "Trust is built through clarity. From detailed itemized pricing lists to direct communications, we keep you informed and empowered at every milestone.", sortOrder: 3, number: "03" },
        { title: "Uncompromising Craft", description: "We partner with master stonemasons, carpenters, and metalsmiths to ensure every door profile, joint, and surface finish meets gallery standards.", sortOrder: 4, number: "04" },
      ];
      await prisma.coreValue.createMany({ data: VALUES });
      items = await prisma.coreValue.findMany({
        where: { is_active: true },
        orderBy: { sortOrder: "asc" },
      });
    }

    const formattedItems = items.map((item, index) => ({
      ...item,
      number: String(index + 1).padStart(2, "0")
    }));

    const response = NextResponse.json({ success: true, data: formattedItems });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin core-values GET error:", error);
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
    const parseResult = createCoreValueSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    const item = await prisma.$transaction(async (tx) => {
      await tx.coreValue.updateMany({
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

      return tx.coreValue.create({
        data: {
          ...data,
          number: String(data.sortOrder).padStart(2, "0")
        },
      });
    });

    const response = NextResponse.json({ success: true, data: item }, { status: 201 });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin core-values POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
