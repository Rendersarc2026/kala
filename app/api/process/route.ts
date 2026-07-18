import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const processSteps = await prisma.processStep.findMany({
      where: { is_active: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: processSteps });
  } catch (error) {
    console.error("Process GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
