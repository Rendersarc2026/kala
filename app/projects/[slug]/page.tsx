import { parseStringArray } from "@/lib/json";
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Maximize, User } from 'lucide-react';
import { projects as staticProjects } from '@/data/projects';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  let project;
  let nextProject;

  const dbProject = await prisma.project.findUnique({
    where: { slug },
  });

  if (dbProject) {
    project = {
      ...dbProject,
      images: parseStringArray(dbProject.images),
    };

    let nextDbProject = await prisma.project.findFirst({
      where: {
        OR: [
          {
            sortOrder: {
              gt: dbProject.sortOrder,
            },
          },
          {
            sortOrder: dbProject.sortOrder,
            createdAt: {
              gt: dbProject.createdAt,
            },
          },
          {
            sortOrder: dbProject.sortOrder,
            createdAt: dbProject.createdAt,
            id: {
              gt: dbProject.id,
            },
          },
        ],
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "asc" },
        { id: "asc" },
      ],
    });

    if (!nextDbProject) {
      nextDbProject = await prisma.project.findFirst({
        orderBy: [
          { sortOrder: "asc" },
          { createdAt: "asc" },
          { id: "asc" },
        ],
      });
    }

    nextProject = nextDbProject ? {
      ...nextDbProject,
      images: parseStringArray(nextDbProject.images),
    } : project;
  } else {
    // Fallback to static projects
    const projectIndex = staticProjects.findIndex((p) => p.slug === slug);
    if (projectIndex === -1) {
      notFound();
    }
    project = staticProjects[projectIndex];
    nextProject = staticProjects[(projectIndex + 1) % staticProjects.length];
  }

  return (
    <div className="w-full bg-studio-gray">
      {/* 1. Full-Screen Hero */}
      <section className="relative h-[85vh] w-full flex items-end overflow-hidden bg-charcoal">
        <img
          src={project.heroImage}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-studio-gray via-studio-gray/40 to-transparent z-10" />

        {/* Hero Metadata Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pb-16 w-full flex flex-col space-y-4">
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-300 w-fit mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to projects</span>
          </Link>
          
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-terracotta font-semibold">
            {project.category}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-light tracking-wide leading-none">
            {project.title}
          </h1>
        </div>
      </section>

      {/* 2. Project Description & Meta Grid */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Metadata Column */}
          <div className="lg:col-span-4 border-t border-charcoal/10 pt-8 space-y-6">
            <h3 className="font-sans text-[10px] tracking-[0.25em] uppercase font-bold text-charcoal-light">
              Specifications
            </h3>
            
            <div className="space-y-4 font-sans text-sm">
              <div className="flex justify-between py-2 border-b border-charcoal/5">
                <span className="text-charcoal-light flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-terracotta/70 stroke-[1.5px]" /> Location
                </span>
                <span className="text-charcoal font-medium">{project.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-charcoal/5">
                <span className="text-charcoal-light flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-terracotta/70 stroke-[1.5px]" /> Area
                </span>
                <span className="text-charcoal font-medium">{project.area}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-charcoal/5">
                <span className="text-charcoal-light flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-terracotta/70 stroke-[1.5px]" /> Year Completed
                </span>
                <span className="text-charcoal font-medium">{project.year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-charcoal/5">
                <span className="text-charcoal-light flex items-center gap-2">
                  <User className="h-4 w-4 text-terracotta/70 stroke-[1.5px]" /> Client
                </span>
                <span className="text-charcoal font-medium text-right">{project.client}</span>
              </div>
            </div>
          </div>

          {/* Right Narrative Column */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-light leading-relaxed">
              {project.description}
            </h2>
            <div className="font-sans text-charcoal-muted text-sm md:text-base leading-relaxed font-light space-y-4">
              {project.narrative.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Asymmetric Image Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="pb-24 md:pb-36 bg-studio-gray overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
          <div className="mb-12">
            <h3 className="font-sans text-[10px] tracking-[0.25em] uppercase font-bold text-charcoal-light">
              Visual Documentation
            </h3>
          </div>

          {/* Gallery Layout */}
          {project.images.length === 1 && (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-bone-dark border border-charcoal/5 shadow-sm">
              <img
                src={project.images[0]}
                alt={`${project.title} Gallery 1`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          {project.images.length === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-bone-dark border border-charcoal/5 shadow-sm">
                <img
                  src={project.images[0]}
                  alt={`${project.title} Gallery 1`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-bone-dark border border-charcoal/5 shadow-sm">
                <img
                  src={project.images[1]}
                  alt={`${project.title} Gallery 2`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {project.images.length >= 3 && (
            <div className="space-y-12 md:space-y-20">
              {/* Image 1: Large full-bleed style container */}
              {project.images[0] && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-bone-dark border border-charcoal/5 shadow-sm">
                  <img
                    src={project.images[0]}
                    alt={`${project.title} Gallery 1`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Images 2 & 3: Asymmetric Split Grid */}
              {(project.images[1] || project.images[2]) && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                  {project.images[1] && (
                    <div className="md:col-span-5 relative aspect-[4/5] w-full overflow-hidden bg-bone-dark border border-charcoal/5 shadow-sm">
                      <img
                        src={project.images[1]}
                        alt={`${project.title} Gallery 2`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {project.images[2] && (
                    <div className="md:col-span-7 md:mt-16 relative aspect-[4/3] w-full overflow-hidden bg-bone-dark border border-charcoal/5 shadow-sm">
                      <img
                        src={project.images[2]}
                        alt={`${project.title} Gallery 3`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          </div>
        </section>
      )}

      {/* 4. Bottom CTA: Next Project Transition */}
      <Link href={`/projects/${nextProject.slug}`} className="group relative block h-[50vh] w-full bg-charcoal overflow-hidden">
        <img
          src={nextProject.heroImage}
          alt={nextProject.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#121212]/50 z-10" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/50 mb-3 block">
            Next Project
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-light tracking-wide group-hover:text-terracotta transition-colors duration-500 mb-6">
            {nextProject.title}
          </h2>
          <div className="flex items-center space-x-2 text-white text-xs uppercase tracking-widest font-semibold border-b border-white/20 pb-2 group-hover:border-terracotta group-hover:text-terracotta transition-all duration-300">
            <span>Explore space</span>
            <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1 duration-300" />
          </div>
        </div>
      </Link>
    </div>
  );
}
