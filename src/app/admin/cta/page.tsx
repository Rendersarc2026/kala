import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CtaManager from "@/components/admin/CtaManager";

export const dynamic = "force-dynamic";

export default async function AdminCtaPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const cta = await prisma.ctaSection.findUnique({
    where: { id: "cta" },
  });

  return <CtaManager initialData={cta} />;
}
