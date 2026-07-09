import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMembers as staticTeam } from "@/data/team";

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Fall back to the bundled roster when the table is empty. A public GET must
    // never write to the database — concurrent requests would insert duplicates.
    const data = team.length > 0 ? team : staticTeam;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Public team GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
