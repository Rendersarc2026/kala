import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let contact = await prisma.contactSettings.findUnique({
      where: { id: "contact" },
    });

    if (!contact) {
      contact = {
        id: "contact",
        phone: "+1 (555) 0199",
        email: "studio@kaladesign.com",
        hoursMonFri: "9:00 AM — 7:00 PM",
        hoursSat: "10:00 AM — 5:00 PM",
        hoursSun: "Closed",
        mapEmbedUrl: "https://maps.google.com/maps?q=Thalassery+Kerala+India&t=k&z=14&output=embed",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error("Public contact GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
