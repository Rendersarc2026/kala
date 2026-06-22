import { prisma } from "@/lib/db";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Services from "@/components/site/Services";
import PortfolioGrid from "@/components/site/PortfolioGrid";
import Blog from "@/components/site/Blog";
import ContactCta from "@/components/site/ContactCta";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch content from PostgreSQL
  const slides = await prisma.heroContent.findMany({
    orderBy: { slideOrder: "asc" },
  });

  const about = await prisma.aboutSection.findUnique({
    where: { id: "about" },
  });

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const posts = await prisma.blogPost.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const cta = await prisma.ctaSection.findUnique({
    where: { id: "cta" },
  });

  return (
    <main className="min-h-screen bg-black">
      {/* Fixed transparent navigation */}
      <Navbar />

      {/* Hero slider section */}
      <Hero slides={slides} />

      {/* Who We Are: About section */}
      {about && <About data={about} />}

      {/* What We Do: Services section */}
      <Services services={services} />

      {/* Project Showcase grid */}
      <PortfolioGrid projects={projects} />

      {/* Blog & News feed */}
      <Blog posts={posts} />

      {/* Call To Action banner */}
      {cta && <ContactCta data={cta} />}

      {/* Studio footer */}
      <Footer />
    </main>
  );
}
