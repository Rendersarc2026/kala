import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonials as staticTestimonials } from "@/data/testimonials";

export async function GET() {
  try {
    let testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (testimonials.length === 0) {
      // Auto-seed initial testimonials into database
      await prisma.testimonial.createMany({
        data: staticTestimonials.map((t) => ({
          quote: t.quote,
          clientName: t.clientName,
          location: t.location,
          projectType: t.projectType,
          image: t.image || null,
        })),
      });

      testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "asc" },
      });
    }

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Public testimonials GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
