import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import { parseStringArray } from "@/lib/json";
import type { Project, DbProject, DbTestimonial } from "@/lib/types";

// Force dynamic execution to guarantee fresh DB values on every render
export const revalidate = 0;

const FALLBACK_HERO = {
  label: "From concept to completion.",
  heading: "WE TURN SPACE|INTO PLACE",
  backgroundImageUrl: "/interior/jason-wang-NxAwryAbtIw-unsplash.jpg.jpeg",
};

const FALLBACK_ABOUT = {
  label: "About Kala Studio",
  heading:
    "We sculpt tactile, honest spaces focused on tectonic integrity and sensory warmth. Trusted by clients who demand precision, beauty, and care.",
};

export default async function Home() {
  // These four reads are independent, so issue them concurrently rather than
  // paying four sequential round trips on every render.
  const [dbProjects, hero, about, dbTestimonials] = await Promise.all([
    prisma.project.findMany({
      where: { is_active: true },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "asc" },
        { id: "asc" },
      ],
    }),
    prisma.heroContent.findFirst({ where: { id: "hero", is_active: true } }),
    prisma.aboutSection.findFirst({ where: { id: "about-teaser", is_active: true } }),
    prisma.testimonial.findMany({
      where: { is_active: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const projects: Project[] = dbProjects.map((p: DbProject) => ({
    title: p.title,
    slug: p.slug,
    category: p.category as 'residential' | 'commercial' | 'hospitality',
    location: p.location,
    area: p.area,
    year: p.year,
    client: p.client,
    description: p.description,
    narrative: p.narrative,
    heroImage: p.heroImage,
    images: parseStringArray(p.images),
    featured: p.featured,
  }));

  const heroData = hero
    ? { label: hero.label, heading: hero.heading, backgroundImageUrl: hero.backgroundImageUrl }
    : FALLBACK_HERO;

  const aboutData = about ? { label: about.label, heading: about.heading } : FALLBACK_ABOUT;

  // Render the bundled copy when the table is empty. Seeding is a deliberate
  // action (`npm run db:seed`), never a side effect of a public page view.
  const testimonials =
    dbTestimonials.length > 0
      ? dbTestimonials.map((t: DbTestimonial) => ({
          id: t.id,
          quote: t.quote,
          clientName: t.clientName,
          location: t.location,
          projectType: t.projectType,
          image: t.image || undefined,
        }))
      : staticTestimonials;

  return (
    <HomeClient
      initialProjects={projects}
      initialHero={heroData}
      initialAbout={aboutData}
      initialTestimonials={testimonials}
    />
  );
}
