import React from "react";
import { prisma } from "@/lib/prisma";
import ProcessTimeline from "@/components/ProcessTimeline";

export const dynamic = "force-dynamic";

export default async function ProcessPage() {
  const steps = await prisma.processStep.findMany({
    where: { is_active: true },
    orderBy: { sortOrder: "asc" },
  });

  return <ProcessTimeline steps={steps} />;
}
