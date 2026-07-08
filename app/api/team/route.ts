import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMembers as staticTeam } from "@/data/team";

export async function GET() {
  try {
    let team = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (team.length === 0) {
      // Auto-seed initial team members into database
      await prisma.teamMember.createMany({
        data: staticTeam.map((m) => ({
          name: m.name,
          role: m.role,
          image: m.image,
          bio: m.bio,
        })),
      });

      team = await prisma.teamMember.findMany({
        orderBy: { createdAt: "asc" },
      });
    }

    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error("Public team GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
