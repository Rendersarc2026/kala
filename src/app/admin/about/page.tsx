import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AboutManager from "@/components/admin/AboutManager";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const about = await prisma.aboutSection.findUnique({
    where: { id: "about" },
  });

  return <AboutManager initialData={about} />;
}
