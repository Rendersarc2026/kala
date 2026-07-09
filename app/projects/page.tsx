import { parseStringArray } from "@/lib/json";
import { prisma } from "@/lib/prisma";
import ProjectsClient from "@/components/ProjectsClient";
import { projects as staticProjects } from "@/data/projects";
import type { Project, DbProject } from "@/lib/types";

// Force dynamic execution to guarantee fresh DB values on every render
export const revalidate = 0;

export default async function ProjectsPage() {
  const dbProjects = await prisma.project.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
      { id: "asc" },
    ],
  });

  let projects: Project[];

  if (dbProjects.length > 0) {
    projects = dbProjects.map((p: DbProject) => ({
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
  } else {
    projects = staticProjects;
  }

  return <ProjectsClient initialProjects={projects} />;
}
