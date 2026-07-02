'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';

type CategoryFilter = 'all' | 'residential' | 'commercial' | 'hospitality';

export default function ProjectsIndex() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter((p) => p.category === activeFilter);

  const filterTabs: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'hospitality', label: 'Hospitality' },
  ];

  return (
    <div className="w-full pt-28 pb-24 md:pb-36 bg-studio-gray">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Intro */}
        <section className="mb-16 md:mb-24">
          <div className="mb-8">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold">
              Selected works
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal font-light leading-[1.15] tracking-wide mb-6">
            Portfolio
          </h1>
          <p className="font-sans text-sm sm:text-base text-charcoal-muted max-w-xl font-light leading-relaxed">
            A curated overview of our residential estates, biophilic commercial spaces, and detailed hospitality environments.
          </p>
        </section>

        {/* Client-side filter controls */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-charcoal/10 pb-6 mb-16">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative py-1 font-sans text-xs tracking-widest uppercase font-semibold transition-colors duration-300 ${
                  isActive ? 'text-terracotta' : 'text-charcoal-light hover:text-charcoal'
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.span
                    layoutId="activeFilterUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-terracotta"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 md:gap-y-32"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              return (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-lg italic text-charcoal-light">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
