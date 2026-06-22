import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import HeroManager from "@/components/admin/HeroManager";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const slides = await prisma.heroContent.findMany({
    orderBy: { slideOrder: "asc" },
  });

  return <HeroManager initialSlides={slides} />;
}
