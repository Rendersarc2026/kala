import React from "react";
import { prisma } from "@/lib/prisma";
import WhyChooseUsClient from "@/components/WhyChooseUsClient";

export const dynamic = "force-dynamic";

export default async function WhyChooseUsPage() {
  const whyChooseUsItems = await prisma.whyChooseUsItem.findMany({
    where: { is_active: true },
    orderBy: { sortOrder: "asc" },
  });

  const comparisonItems = await prisma.comparisonItem.findMany({
    where: { is_active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <WhyChooseUsClient
      whyChooseUsItems={whyChooseUsItems}
      comparisonItems={comparisonItems}
    />
  );
}
