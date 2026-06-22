"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Image,
  Info,
  Briefcase,
  FolderKanban,
  FileText,
  Mail,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Hero Slideshow", href: "/admin/hero", icon: Image },
    { name: "About Studio", href: "/admin/about", icon: Info },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Portfolio Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Journal Posts", href: "/admin/blog", icon: FileText },
    { name: "CTA Banners", href: "/admin/cta", icon: Mail },
  ];

  return (
    <aside className="w-64 bg-[#0d0d0d] border-r border-white/5 flex flex-col h-screen fixed top-0 left-0 z-30">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-white">KALA.</h2>
          <span className="text-[9px] tracking-wider text-white/40 uppercase">MANAGEMENT</span>
        </div>
      </div>

      {/* Sidebar Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 text-xs tracking-wider uppercase font-medium transition-all duration-300 rounded-none ${
                isActive
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Icon size={16} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center space-x-3 px-4 py-3 text-xs tracking-wider uppercase text-white/50 hover:text-white transition-colors duration-300"
        >
          <ExternalLink size={16} />
          <span>View Website</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center space-x-3 px-4 py-3 text-xs tracking-wider uppercase text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all duration-300 rounded-none focus:outline-none"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
