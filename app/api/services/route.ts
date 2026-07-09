import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { services as staticServices } from "@/data/services";
import { parseStringArray } from "@/lib/json";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });

    // Fall back to the bundled copy when the table is empty. A public GET must
    // never write to the database — concurrent requests would insert duplicates.
    const data =
      services.length > 0
        ? services.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            image: s.image,
            details: parseStringArray(s.details),
            sortOrder: s.sortOrder,
          }))
        : staticServices.map((s, idx) => ({ ...s, sortOrder: idx }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Public services GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
