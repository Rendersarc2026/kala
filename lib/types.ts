export interface Project {
  slug: string;
  title: string;
  category: 'residential' | 'commercial' | 'hospitality';
  location: string;
  area: string; // e.g. "4,200 sq.ft"
  year: string;
  client: string;
  description: string;
  narrative: string;
  heroImage: string;
  images: string[];
  featured: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  location: string;
  projectType: string;
  image?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string[];
}

export interface DbProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  area: string;
  year: string;
  client: string;
  description: string;
  narrative: string;
  heroImage: string;
  images: string;
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbService {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbTestimonial {
  id: string;
  quote: string;
  clientName: string;
  location: string;
  projectType: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
