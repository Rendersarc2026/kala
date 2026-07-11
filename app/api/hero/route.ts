import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let hero = await prisma.heroContent.findUnique({
      where: { id: "hero" },
    });

    if (!hero) {
      // Default initial banner
      hero = {
        id: "hero",
        label: "From concept to completion.",
        heading: "WE TURN SPACE|INTO PLACE",
        buttonText: "Discover Projects",
        backgroundImageUrl: "/interior/jason-wang-NxAwryAbtIw-unsplash.jpg.jpeg",
        slideOrder: 1,
      };
    }

    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    console.error("Public hero GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
