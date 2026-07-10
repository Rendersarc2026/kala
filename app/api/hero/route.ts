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
        backgroundImageUrl: "https://vwyjryydpalialkrbtwk.supabase.co/storage/v1/object/public/kala%20images/interior/piqsels.com-id-frfbp.jpg",
        slideOrder: 1,
      };
    }

    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    console.error("Public hero GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
