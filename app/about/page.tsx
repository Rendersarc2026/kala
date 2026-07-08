import { prisma } from "@/lib/prisma";
import AboutClient from "@/components/AboutClient";

// Force dynamic execution to guarantee fresh DB values on every render
export const revalidate = 0;

export default async function AboutPage() {
  // 1. Fetch team members directly from database
  let team = await prisma.teamMember.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (team.length === 0) {
    // Auto-seed initial team members from static file
    const { teamMembers: staticTeam } = await import("@/data/team");
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

  const teamData = team.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    image: member.image,
    bio: member.bio,
  }));

  return <AboutClient initialTeamMembers={teamData} />;
}
