import { prisma } from "@/lib/db";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import CoreValues from "@/components/site/CoreValues";
import Testimonials from "@/components/site/Testimonials";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const slides = await prisma.heroContent.findMany({
    orderBy: { slideOrder: "asc" },
  });

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-black">
      <Hero slides={slides} />
      <Services services={services} />
      <CoreValues />
      <Testimonials />
    </div>
  );
}
