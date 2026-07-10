"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

interface AdminProfile {
  id: string;
  email: string;
  username: string;
  role: string;
  mustChangePassword: boolean;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        fetch("/api/admin/profile").then((res) => {
          if (!res.ok) {
            router.replace("/admin/login");
          }
        }).catch(() => {
          router.replace("/admin/login");
        });
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/admin/profile");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setProfile(data.data);
    } catch (err) {
      setError("Failed to fetch admin profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-800">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-black" />
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Loading Admin Session...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-800">
        <div className="text-center bg-[#ffffff] p-8 border border-gray-200 rounded-xl max-w-sm shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p className="text-sm mb-4 font-light text-gray-700">{error || "Authentication error."}</p>
          <button
            onClick={() => router.push("/admin/login")}
            className="bg-black text-[#ffffff] text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Active tab derived from current URL pathname
  let activeTab = "dashboard";
  if (pathname === "/admin/home") activeTab = "home";
  else if (pathname === "/admin/projects") activeTab = "projects";
  else if (pathname === "/admin/about") activeTab = "about";
  else if (pathname === "/admin/testimonials") activeTab = "testimonials";
  else if (pathname === "/admin/enquiries") activeTab = "enquiries";
  else if (pathname === "/admin/contact") activeTab = "contact";

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={(tabId) => {
          if (tabId === "dashboard") router.push("/admin");
          else router.push(`/admin/${tabId}`);
        }}
        onLogout={handleLogout}
        username={profile.username}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 min-w-0 text-gray-800 pt-24 pb-12 px-6 lg:py-12 lg:px-12 lg:pl-72 relative overflow-hidden font-sans">
        {/* Background Ambience Decor */}
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gray-200/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gray-200/20 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto z-10 relative">
          {children}
        </div>
      </div>
    </div>
  );
}
