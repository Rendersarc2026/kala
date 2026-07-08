import { prisma } from "@/lib/prisma";
import ContactClient from "@/components/ContactClient";

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

  const contactData = {
    phone: contact.phone,
    email: contact.email,
    hoursMonFri: contact.hoursMonFri,
    hoursSat: contact.hoursSat,
    hoursSun: contact.hoursSun,
    mapEmbedUrl: contact.mapEmbedUrl,
  };

  return <ContactClient initialContact={contactData} />;
}
