"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  FolderKanban,
  MessageSquare,
  Home,
  Info,
  MapPin,
  Mail,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  username: string;
  isOpen: boolean;
  onToggle: () => void;
}

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "home", label: "Home Page", icon: Home },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "about", label: "About Page", icon: Info },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "enquiries", label: "Enquiries", icon: Mail },
  { id: "contact", label: "Contact Info", icon: MapPin },
];

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  username,
  isOpen,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return null;
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 right-4 z-50 bg-[#121212] border border-[#ffffff]/20 rounded-lg p-2.5 text-[#ffffff] cursor-pointer"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 right-0 bottom-0 z-40 bg-[#121212] border-b lg:border-b-0 lg:border-r border-[#ffffff]/10 flex flex-col transition-all duration-300 h-screen overflow-y-auto lg:right-auto lg:w-64 lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto"
        }`}
      >
        {/* Brand */}
        <div className="px-6 pt-8 pb-6 border-b border-[#ffffff]/10">
          <h1 className="text-xl tracking-[0.3em] text-[#ffffff] font-serif font-bold">
            KALA
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#ffffff]/40 font-semibold mt-1">
            Admin Panel
          </p>
        </div>

        {/* Tabs */}
        <nav className="flex-1 py-4 space-y-1 px-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  if (isOpen) {
                    onToggle();
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium uppercase tracking-widest transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#ffffff]/10 text-[#ffffff] border border-[#ffffff]/20"
                    : "text-[#ffffff]/50 hover:text-[#ffffff]/80 hover:bg-[#ffffff]/5 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User info & logout */}
        <div className="px-3 py-4 border-t border-[#ffffff]/10">
          <div className="px-4 pb-3 mb-3 border-b border-[#ffffff]/5">
            <p className="text-xs text-[#ffffff]/60 truncate">{username}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-500/5 border border-transparent transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
