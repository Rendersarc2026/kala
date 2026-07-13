import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let about = await prisma.aboutSection.findFirst({
      where: { id: "about-teaser", is_active: true },
    });

    if (!about) {
      about = {
        id: "about-teaser",
        label: "About Kala Studio",
        heading: "We sculpt tactile, honest spaces focused on tectonic integrity and sensory warmth. Trusted by clients who demand precision, beauty, and care.",
        paragraph: "",
        image1Url: "",
        image2Url: "",
        buttonText: "",
        is_active: true,
      };
    }

    return NextResponse.json({ success: true, data: about });
  } catch (error) {
    console.error("Public about GET error:", error);
    return NextResponse.json({ error: "Failed to fetch about teaser data." }, { status: 500 });
  }
}
