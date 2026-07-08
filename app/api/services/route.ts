import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DbService } from "@/lib/types";
import { services as staticServices } from "@/data/services";

export async function GET() {
  try {
    let services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });

    if (services.length === 0) {
      // Auto-seed initial services in database
      await prisma.service.createMany({
        data: staticServices.map((s, idx) => ({
          title: s.title,
          description: s.description,
          image: s.image,
          details: JSON.stringify(s.details),
          sortOrder: idx,
        })),
      });

      services = await prisma.service.findMany({
        orderBy: { sortOrder: "asc" },
      });
    }

    const parsed = services.map((s: DbService) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      image: s.image,
      details: JSON.parse(s.details) as string[],
      sortOrder: s.sortOrder,
    }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Public services GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
