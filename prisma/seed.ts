import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing records to avoid conflicts
  await prisma.adminUser.deleteMany({});
  await prisma.heroContent.deleteMany({});
  await prisma.aboutSection.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.ctaSection.deleteMany({});

  // 2. Seed Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@kala.design',
      hashedPassword,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 3. Seed Hero Slides
  const slides = [
    {
      label: 'STUDIO',
      heading: 'MINIMALIST LUXURY HOMES',
      buttonText: 'EXPLORE PROJECTS',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600',
      slideOrder: 1,
    },
    {
      label: 'ARCHITECTURE',
      heading: 'STRUCTURAL POETRY',
      buttonText: 'OUR WORK',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600',
      slideOrder: 2,
    },
    {
      label: 'DESIGN',
      heading: 'CURATED INTERIORS',
      buttonText: 'VIEW SHOWCASE',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1600',
      slideOrder: 3,
    },
  ];

  for (const slide of slides) {
    await prisma.heroContent.create({ data: slide });
  }
  console.log('Seed Hero Content completed.');

  // 4. Seed About Section
  await prisma.aboutSection.create({
    data: {
      id: 'about',
      label: 'WHO WE ARE',
      heading: 'WE DESIGN SPACES THAT INSPIRE EMOTION AND TRANQUILITY',
      paragraph: 'Kala is a boutique architecture and interior design studio. We believe in the power of restraint. Our approach is defined by clean lines, organic materials, and a dialogue between light and shadow. We craft bespoke residential and commercial environments that feel both timeless and contemporary.',
      image1Url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
      image2Url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800',
      buttonText: 'OUR STORY',
    },
  });
  console.log('Seed About Section completed.');

  // 5. Seed Services
  const services = [
    {
      iconName: 'Compass',
      title: 'Interior Architecture',
      description: 'Detailed layout, lighting schemes, and structural integration mapping to elevate spatial flow.',
      sortOrder: 1,
    },
    {
      iconName: 'Layers',
      title: 'Bespoke Furnishing',
      description: 'Sourcing and custom design of fine furniture, textiles, and lighting objects tailored to the architectural language.',
      sortOrder: 2,
    },
    {
      iconName: 'Layout',
      title: 'Space Planning',
      description: 'Reimagining configurations to maximize functionality, circulation, and custom tailored spatial alignment.',
      sortOrder: 3,
    },
    {
      iconName: 'Sparkles',
      title: 'Art Curation',
      description: 'Selecting fine art installations, objects, and sculpture that harmonize with our interior designs.',
      sortOrder: 4,
    },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }
  console.log('Seed Services completed.');

  // 6. Seed Projects
  const projects = [
    {
      title: 'THE OAK RESIDENCE',
      categoryLabel: 'INTERIOR',
      imageUrl: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=800',
      sortOrder: 1,
    },
    {
      title: 'VALLEY VILLA',
      categoryLabel: 'ARCHITECTURE',
      imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800',
      sortOrder: 2,
    },
    {
      title: 'SOHO PENTHOUSE',
      categoryLabel: 'INTERIOR',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800',
      sortOrder: 3,
    },
    {
      title: 'BRUTALIST PAVILION',
      categoryLabel: 'ARCHITECTURE',
      imageUrl: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=800',
      sortOrder: 4,
    },
    {
      title: 'CLAY HOUSE',
      categoryLabel: 'RESIDENTIAL',
      imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800',
      sortOrder: 5,
    },
    {
      title: 'MONOLITH RETREAT',
      categoryLabel: 'ARCHITECTURE',
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
      sortOrder: 6,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log('Seed Projects completed.');

  // 7. Seed Blog/News Section
  const blogPosts = [
    {
      title: 'The Art of Restraint in Modern Homes',
      excerpt: 'Exploring how negative space and curated material selections create breathing room in urban architectures.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
      categoryTag: 'DESIGN',
      sortOrder: 1,
    },
    {
      title: 'Sourcing Organic Textures',
      excerpt: 'How linen, clay-plaster, and raw oak bring tactile warmth and human scale to minimalist structures.',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800',
      categoryTag: 'MATERIALS',
      sortOrder: 2,
    },
    {
      title: 'Concrete and Light: A Dialogue',
      excerpt: 'Investigating the emotional response triggered by raw concrete surfaces under shifting daylight conditions.',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800',
      categoryTag: 'ARCHITECTURE',
      sortOrder: 3,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }
  console.log('Seed Blog Posts completed.');

  // 8. Seed CTA Section
  await prisma.ctaSection.create({
    data: {
      id: 'cta',
      heading: 'READY TO BRING YOUR VISION TO LIFE?',
      subtext: "We collaborate with clients worldwide who share our appreciation for quality, detail, and honest materials. Let's discuss your next project.",
      buttonText: 'CONTACT US',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600',
    },
  });
  console.log('Seed CTA Section completed.');

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
