import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Image, Briefcase, FolderKanban, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch counts from database
  const heroCount = await prisma.heroContent.count();
  const serviceCount = await prisma.service.count();
  const projectCount = await prisma.project.count();
  const blogCount = await prisma.blogPost.count();

  const cards = [
    {
      name: "Hero Slideshow",
      count: heroCount,
      href: "/admin/hero",
      icon: Image,
      desc: "Hero slides and landing carousel images",
    },
    {
      name: "Services",
      count: serviceCount,
      href: "/admin/services",
      icon: Briefcase,
      desc: "Cards displaying core design specialties",
    },
    {
      name: "Portfolio grid",
      count: projectCount,
      href: "/admin/projects",
      icon: FolderKanban,
      desc: "Selected project works archive items",
    },
    {
      name: "Journal blog",
      count: blogCount,
      href: "/admin/blog",
      icon: FileText,
      desc: "Studio reflections, news and journal entries",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-light tracking-wide uppercase">Dashboard Overview</h1>
        <p className="text-white/40 text-[10px] tracking-widest uppercase mt-2">
          Signed in as: {session.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="bg-[#121212] border border-white/5 p-6 hover:border-white/10 transition-all duration-500 flex items-start justify-between"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                    {card.name}
                  </h3>
                  <p className="text-xs text-white/40 font-light mt-1">{card.desc}</p>
                </div>
                <div className="text-3xl font-light">{card.count}</div>
                <Link
                  href={card.href}
                  className="inline-block text-[10px] tracking-widest font-bold uppercase border-b border-white pb-0.5 hover:text-white/70 hover:border-white/70 transition-colors duration-300"
                >
                  Manage Content
                </Link>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5">
                <Icon size={20} className="text-white/50" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Setup Actions */}
      <div className="bg-[#121212] border border-white/5 p-6 space-y-4">
        <h3 className="text-xs font-bold tracking-widest uppercase text-white/70">
          Standalone Sections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/about"
            className="flex items-center justify-between p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-all duration-300 text-xs tracking-wider uppercase"
          >
            <span>Edit Studio Bio (About)</span>
            <span>&rarr;</span>
          </Link>
          <Link
            href="/admin/cta"
            className="flex items-center justify-between p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-all duration-300 text-xs tracking-wider uppercase"
          >
            <span>Edit Contact CTA Banner</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
