import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className={`group block ${className}`}>
      
      {/* Background Image Container */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-bone-dark mb-5">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-105"
          priority={project.featured}
        />
        
        {/* Overlay Hover State */}
        <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex items-center justify-center">
          <div className="bg-bone/95 backdrop-blur-sm text-charcoal flex items-center gap-2 px-6 py-3 shadow-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1]">
            <span className="text-xs uppercase tracking-widest font-sans font-medium">View Project</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Project Details - Architectural Left-Aligned Layout */}
      <div className="flex flex-col items-start text-left px-1">
        
        {/* Category & Year Row */}
        <div className="w-full flex justify-between items-center mb-2">
          <span className="font-sans text-[10px] text-terracotta uppercase tracking-[0.2em] font-semibold">
            {project.category}
          </span>
          <span className="font-sans text-[10px] text-charcoal-light uppercase tracking-widest">
            {project.year}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="font-serif text-2xl text-charcoal group-hover:text-terracotta transition-colors duration-300">
          {project.title}
        </h3>
        
        {/* Thin Divider */}
        <div className="w-full h-[1px] bg-charcoal/10 my-3 group-hover:bg-terracotta/30 transition-colors duration-500" />
        
        {/* Location & Area Row */}
        <div className="w-full flex justify-between items-center">
          <p className="font-sans text-xs text-charcoal-light font-light">
            {project.location}
          </p>
          <span className="font-sans text-[10px] tracking-[0.15em] text-charcoal-light uppercase">
            {project.area}
          </span>
        </div>
        
      </div>
      
    </Link>
  );
}
