import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DbProject } from "@/lib/types";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const parsed = projects.map((p: DbProject) => ({
      ...p,
      images: JSON.parse(p.images),
    }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Public projects GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
