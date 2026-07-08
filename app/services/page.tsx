import React from "react";
import { prisma } from "@/lib/prisma";
import { services as staticServices } from "@/data/services";
import ServicesClient from "@/components/ServicesClient";

export const revalidate = 0; // Dynamic server rendering

export default async function ServicesPage() {
  let dbServices = [];
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });

    if (services.length === 0) {
      // Auto-seed initial services in database
      await prisma.service.createMany({
        data: staticServices.map((s, idx) => ({
          title: s.title,
          description: s.description,
          image: s.image,
          details: JSON.stringify(s.details),
          sortOrder: idx,
        })),
      });

      const seeded = await prisma.service.findMany({
        orderBy: { sortOrder: "asc" },
      });
      dbServices = seeded;
    } else {
      dbServices = services;
    }
  } catch (error) {
    console.error("Failed to fetch services in Server Component:", error);
    // Fallback to static services
    dbServices = staticServices.map((s, idx) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      image: s.image,
      details: JSON.stringify(s.details),
      sortOrder: idx,
    }));
  }

  const parsedServices = dbServices.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    image: s.image,
    details: (() => {
      try {
        return JSON.parse(s.details) as string[];
      } catch {
        return [];
      }
    })(),
    sortOrder: s.sortOrder,
  }));

  return <ServicesClient initialServices={parsedServices} />;
}
