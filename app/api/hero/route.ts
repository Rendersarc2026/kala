import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let hero = await prisma.heroContent.findFirst({
      where: { id: "hero", is_active: true },
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
        is_active: true,
      };
    }

    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    console.error("Public hero GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
