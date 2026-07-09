import { prisma } from "@/lib/prisma";
import AboutClient from "@/components/AboutClient";
import { teamMembers as staticTeam } from "@/data/team";

// Force dynamic execution to guarantee fresh DB values on every render
export const revalidate = 0;

export default async function AboutPage() {
  const team = await prisma.teamMember.findMany({
    orderBy: { createdAt: "asc" },
  });

  // Fall back to the bundled roster when the table is empty. Seeding is a
  // deliberate action (`npm run db:seed`), never a side effect of a page view.
  const teamData =
    team.length > 0
      ? team.map((member) => ({
          id: member.id,
          name: member.name,
          role: member.role,
          image: member.image,
          bio: member.bio,
        }))
      : staticTeam;

  return <AboutClient initialTeamMembers={teamData} />;
}
