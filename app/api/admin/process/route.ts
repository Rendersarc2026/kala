import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth-helper";
import { addSecurityHeaders } from "@/lib/security-headers";

const createProcessSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(1000),
  details: z.string().trim().min(1).max(1500),
  sortOrder: z.number().int().default(1),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
      return addSecurityHeaders(response);
    }

    const processSteps = await prisma.processStep.findMany({
      where: { is_active: true },
      orderBy: { sortOrder: "asc" },
    });

    const response = NextResponse.json({ success: true, data: processSteps });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin process GET error:", error);
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
    const parseResult = createProcessSchema.safeParse(body);

    if (!parseResult.success) {
      const response = NextResponse.json(
        { error: "Invalid inputs", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const data = parseResult.data;

    const processStep = await prisma.$transaction(async (tx) => {
      await tx.processStep.updateMany({
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

      return tx.processStep.create({
        data: {
          title: data.title,
          description: data.description,
          details: data.details,
          sortOrder: data.sortOrder,
        },
      });
    });

    const response = NextResponse.json({
      success: true,
      data: processStep,
    }, { status: 201 });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Admin process POST error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addSecurityHeaders(response);
  }
}
