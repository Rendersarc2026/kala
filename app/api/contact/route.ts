import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let contact = await prisma.contactSettings.findFirst({
      where: { id: "contact", is_active: true },
    });

    if (!contact) {
      contact = {
        id: "contact",
        phone: "+91 87141 81942",
        email: "hello@kalainteriors.com",
        hoursMonFri: "9:00 AM — 7:00 PM",
        hoursSat: "10:00 AM — 5:00 PM",
        hoursSun: "Closed",
        mapEmbedUrl: "https://maps.google.com/maps?q=11.7474785,75.4945499&z=17&output=embed",
        is_active: true,
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
