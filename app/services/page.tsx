import React from "react";
import { prisma } from "@/lib/prisma";
import { services as staticServices } from "@/data/services";
import ServicesClient from "@/components/ServicesClient";
import { parseStringArray } from "@/lib/json";

export const revalidate = 0; // Dynamic server rendering

export default async function ServicesPage() {
  let dbServices: Awaited<ReturnType<typeof prisma.service.findMany>> = [];

  try {
    dbServices = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    console.error("Failed to fetch services in Server Component:", error);
  }

  // Fall back to the bundled copy when the table is empty or unreachable.
  // Seeding is a deliberate action (`npm run db:seed`), never a page-view side effect.
  const parsedServices =
    dbServices.length > 0
      ? dbServices.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          image: s.image,
          details: parseStringArray(s.details),
          sortOrder: s.sortOrder,
        }))
      : staticServices.map((s, idx) => ({ ...s, sortOrder: idx }));

  return <ServicesClient initialServices={parsedServices} />;
}
