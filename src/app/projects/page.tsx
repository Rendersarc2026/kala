import { prisma } from "@/lib/db";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import ProjectsGrid from "@/components/site/ProjectsGrid";

export const metadata = {
  title: "Featured Projects | KALA DESIGN STUDIO",
  description:
    "A curated portfolio of architectural and interior design projects spanning residential, commercial, and hospitality spaces.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <Navbar />

      {/* Page header */}
      <section className="pt-40 pb-12 md:pt-52 md:pb-16 px-8 md:px-14 max-w-7xl mx-auto">
        {/* <h1 className="font-sans text-5xl md:text-7xl font-light text-charcoal leading-tight">
          Projects
        </h1> */}
      </section>

      {/* 3-column grid */}
      <section className="pb-24 px-8 md:px-14 max-w-screen-xl mx-auto">
        <ProjectsGrid projects={projects} />
      </section>

      <Footer />
    </main>
  );
}
