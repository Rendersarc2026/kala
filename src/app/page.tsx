import { prisma } from "@/lib/db";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import CoreValues from "@/components/site/CoreValues";
import Testimonials from "@/components/site/Testimonials";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const slides = await prisma.heroContent.findMany({
    orderBy: { slideOrder: "asc" },
  });

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero slides={slides} />
      <Services services={services} />
      <CoreValues />
      <Testimonials />
      <Footer />
    </main>
  );
}
