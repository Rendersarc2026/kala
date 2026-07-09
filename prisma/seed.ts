/**
 * Idempotent database seed.
 *
 * Content used to be seeded lazily from public GET handlers, which meant an
 * unauthenticated request could write to the database and concurrent requests
 * could insert duplicate rows. Seeding lives here instead — run it once against
 * a fresh database:
 *
 *   npm run db:seed
 */
// Explicit .ts extensions: this file runs under `node --experimental-strip-types`,
// whose ESM resolver does not guess extensions the way a bundler does.
import { prisma } from "../lib/prisma.ts";
import { teamMembers } from "../data/team.ts";
import { testimonials } from "../data/testimonials.ts";
import { services } from "../data/services.ts";

async function seedTeam(): Promise<string> {
  const existing = await prisma.teamMember.count();
  if (existing > 0) return `team: skipped (${existing} rows present)`;

  await prisma.teamMember.createMany({
    data: teamMembers.map((m) => ({
      name: m.name,
      role: m.role,
      image: m.image,
      bio: m.bio,
    })),
  });
  return `team: seeded ${teamMembers.length} rows`;
}

async function seedTestimonials(): Promise<string> {
  const existing = await prisma.testimonial.count();
  if (existing > 0) return `testimonials: skipped (${existing} rows present)`;

  await prisma.testimonial.createMany({
    data: testimonials.map((t) => ({
      quote: t.quote,
      clientName: t.clientName,
      location: t.location,
      projectType: t.projectType,
      image: t.image || null,
    })),
  });
  return `testimonials: seeded ${testimonials.length} rows`;
}

async function seedServices(): Promise<string> {
  const existing = await prisma.service.count();
  if (existing > 0) return `services: skipped (${existing} rows present)`;

  await prisma.service.createMany({
    data: services.map((s, idx) => ({
      title: s.title,
      description: s.description,
      image: s.image,
      details: JSON.stringify(s.details),
      sortOrder: idx,
    })),
  });
  return `services: seeded ${services.length} rows`;
}

async function main() {
  const results = await Promise.all([seedTeam(), seedTestimonials(), seedServices()]);
  for (const line of results) console.log(line);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
