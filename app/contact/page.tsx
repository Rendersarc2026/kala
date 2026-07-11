import { prisma } from "@/lib/prisma";
import ContactClient from "@/components/ContactClient";
import { isSafeMapEmbedUrl } from "@/lib/validation";

const DEFAULT_MAP_EMBED_URL =
  "https://maps.google.com/maps?q=11.7474785,75.4945499&z=17&output=embed";

// Force dynamic execution to guarantee fresh DB values on every render
export const revalidate = 0;

export default async function ContactPage() {
  // 1. Fetch contact details directly from database
  let contact = await prisma.contactSettings.findUnique({
    where: { id: "contact" },
  });

  if (!contact) {
    contact = {
      id: "contact",
      phone: "+91 87141 81942",
      email: "kalaarchitect4@gmail.com",
      hoursMonFri: "9:00 AM — 7:00 PM",
      hoursSat: "10:00 AM — 5:00 PM",
      hoursSun: "Closed",
      mapEmbedUrl: DEFAULT_MAP_EMBED_URL,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const contactData = {
    phone: contact.phone,
    email: contact.email,
    hoursMonFri: contact.hoursMonFri,
    hoursSat: contact.hoursSat,
    hoursSun: contact.hoursSun,
    // Rows written before the embed URL was validated may hold an unsafe scheme.
    mapEmbedUrl: isSafeMapEmbedUrl(contact.mapEmbedUrl)
      ? contact.mapEmbedUrl
      : DEFAULT_MAP_EMBED_URL,
  };

  return <ContactClient initialContact={contactData} />;
}
