import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonials as staticTestimonials } from "@/data/testimonials";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Fall back to the bundled copy when the table is empty. A public GET must
    // never write to the database — concurrent requests would insert duplicates.
    const data = testimonials.length > 0 ? testimonials : staticTestimonials;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Public testimonials GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
