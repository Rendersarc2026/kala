"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plus } from "lucide-react";

interface ProjectData {
  id: string;
  title: string;
  categoryLabel: string;
  imageUrl: string;
  sortOrder: number;
}

interface PortfolioGridProps {
  projects: ProjectData[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  // Sort projects by sortOrder
  const sortedProjects = [...projects].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="showcase" className="py-24 md:py-36 bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-8 h-[1px] bg-white/40" />
            <span className="text-xs tracking-widest font-semibold text-white/50 uppercase">
              STUDIO ARCHIVE
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase">
            SELECTED PROJECTS
          </h2>
        </div>

        {/* 3-Column Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-55px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="group relative h-[480px] overflow-hidden bg-zinc-950 cursor-pointer"
            >
              {/* Image Container */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </motion.div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 transition-opacity duration-300 group-hover:via-black/50" />

              {/* Center "+" Icon Reveal */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="p-4 bg-white text-black rounded-full"
                >
                  <Plus size={20} className="stroke-[1.5]" />
                </motion.div>
              </div>

              {/* Project Info (Bottom Left) */}
              <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col pointer-events-none">
                <span className="text-[10px] tracking-[0.25em] font-semibold text-white/60 mb-2 uppercase">
                  {project.categoryLabel}
                </span>
                <h3 className="text-xl font-light tracking-wide text-white uppercase group-hover:translate-x-2 transition-transform duration-500">
                  {project.title}
                </h3>
              </div>

              {/* Border lines overlay for extra structure */}
              <div className="absolute inset-0 border border-white/5 pointer-events-none group-hover:border-white/15 transition-colors duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
