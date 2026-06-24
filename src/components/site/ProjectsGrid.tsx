"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  imageUrl: string;
};

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (projects.length === 0) {
    return (
      <p className="font-sans text-2xl text-charcoal/30 text-center py-24">
        No projects yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
      {projects.map((project, i) => (
        <div
          key={project.id}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="project-card opacity-0 translate-y-10 transition-none"
          style={{ transitionDelay: `${(i % 3) * 80}ms` }}
        >
          <Link href={`/projects/${project.id}`} className="group block">
            <div className="relative w-full aspect-[2/3] overflow-hidden bg-ivory-dark">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
