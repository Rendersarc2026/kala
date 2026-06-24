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
