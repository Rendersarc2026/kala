import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className={`group block ${className}`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-bone-dark mb-4">
        {/* Project Image */}
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105"
          priority={project.featured}
        />
        
        {/* Overlay Hover State */}
        <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex items-center justify-center">
          <span className="bg-bone/90 backdrop-blur-sm text-charcoal text-xs uppercase tracking-widest font-sans font-medium px-5 py-3 rounded-none shadow-sm transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
            View Project
          </span>
        </div>

        {/* Project Tag */}
        <span className="absolute top-4 left-4 bg-bone/95 text-charcoal text-[9px] uppercase tracking-widest font-sans font-semibold px-2.5 py-1">
          {project.category}
        </span>
      </div>

      {/* Project Details */}
      <div className="space-y-1.5 px-1 text-center">
        <h3 className="font-serif text-lg text-charcoal group-hover:text-terracotta transition-colors duration-300">
          {project.title}
        </h3>
        <p className="font-sans text-xs text-charcoal-light font-light">
          {project.location} &bull; {project.year}
        </p>
        <span className="font-sans text-[10px] tracking-wider text-charcoal-light uppercase block">
          {project.area}
        </span>
      </div>
    </Link>
  );
}
