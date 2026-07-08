import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";
import type { Project } from "@/lib/types";
import type { Project as PrismaProject, Testimonial as PrismaTestimonial } from "@prisma/client";

// Force dynamic execution to guarantee fresh DB values on every render
export const revalidate = 0;

export default async function Home() {
  // 1. Fetch projects directly from database
  const dbProjects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const projects: Project[] = dbProjects.map((p: PrismaProject) => ({
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
    images: JSON.parse(p.images) as string[],
    featured: p.featured,
  }));

  // 2. Fetch hero banner config directly from database
  let hero = await prisma.heroContent.findUnique({
    where: { id: "hero" },
  });

  if (!hero) {
    hero = {
      id: "hero",
      label: "From concept to completion.",
      heading: "WE TURN SPACE|INTO PLACE",
      buttonText: "Discover Projects",
      backgroundImageUrl: "",
      slideOrder: 1,
    };
  }

  const heroData = {
    label: hero.label,
    heading: hero.heading,
    backgroundImageUrl: hero.backgroundImageUrl,
  };

  // 3. Fetch about section teaser directly from database
  let about = await prisma.aboutSection.findUnique({
    where: { id: "about-teaser" },
  });

  if (!about) {
    about = {
      id: "about-teaser",
      label: "About Kala Studio",
      heading: "We sculpt tactile, honest spaces focused on tectonic integrity and sensory warmth. Trusted by clients who demand precision, beauty, and care.",
      paragraph: "",
      image1Url: "",
      image2Url: "",
      buttonText: "",
    };
  }

  const aboutData = {
    label: about.label,
    heading: about.heading,
  };

  // 4. Fetch testimonials directly from database
  let dbTestimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (dbTestimonials.length === 0) {
    const { testimonials: staticTestimonials } = await import("@/data/testimonials");
    await prisma.testimonial.createMany({
      data: staticTestimonials.map((t) => ({
        quote: t.quote,
        clientName: t.clientName,
        location: t.location,
        projectType: t.projectType,
        image: t.image || null,
      })),
    });

    dbTestimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  const testimonials = dbTestimonials.map((t: PrismaTestimonial) => ({
    id: t.id,
    quote: t.quote,
    clientName: t.clientName,
    location: t.location,
    projectType: t.projectType,
    image: t.image || undefined,
  }));

  return (
    <HomeClient
      initialProjects={projects}
      initialHero={heroData}
      initialAbout={aboutData}
      initialTestimonials={testimonials}
    />
  );
}
