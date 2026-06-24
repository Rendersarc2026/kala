"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ProjectData {
  id: string;
  title: string;
  categoryLabel: string;
  imageUrl: string;
  sortOrder: number;
}

interface FeaturedProjectsProps {
  projects: ProjectData[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const displayed = [...projects]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 4);

  return (
    <section id="featured-work" className="py-24 md:py-36 bg-[var(--ivory)]">
      <div className="max-w-7xl mx-auto px-8 md:px-14">
        {/* Header row */}
        <div className="flex items-end justify-between mb-14 md:mb-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--muted)] font-medium mb-4">
              Studio Portfolio
            </p>
            <h2 className="font-sans text-4xl md:text-5xl font-light text-[var(--charcoal)] leading-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors duration-300 border-b border-transparent hover:border-[var(--charcoal)]/30 pb-0.5"
          >
            View All →
          </Link>
        </div>

        {/* Grid — first card is wider */}
        {displayed.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`bg-[var(--ivory-dark)] animate-pulse ${
                  i === 0 ? "md:col-span-2 aspect-[4/3]" : "aspect-square"
                }`}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.09 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
          >
            {displayed.map((project, i) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                className={`group relative overflow-hidden bg-[var(--ivory-dark)] ${
                  i === 0 ? "md:col-span-2 aspect-[4/3]" : "aspect-square"
                }`}
              >
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes={
                    i === 0
                      ? "(max-width:768px) 100vw, 50vw"
                      : "(max-width:768px) 50vw, 25vw"
                  }
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-1">
                    {project.categoryLabel}
                  </p>
                  <h3 className="font-sans text-sm font-light text-white">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Mobile view-all */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors"
          >
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
