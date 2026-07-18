"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, AlertCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";

interface AdminProfile {
  id: string;
  email: string;
  username: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
        // Not authenticated: redirect to login. Keep `loading` true so the
        // spinner stays up during the redirect instead of flashing the
        // "Authentication error" card.
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      setProfile(data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch admin profile.");
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
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
      setLoggingOut(false);
      setShowLogoutConfirm(false);
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
  else if (pathname === "/admin/services") activeTab = "services";
  else if (pathname === "/admin/process") activeTab = "process";
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
        onLogout={() => setShowLogoutConfirm(true)}
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

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans"
            onClick={() => {
              if (!loggingOut) setShowLogoutConfirm(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-white border border-gray-200 rounded-xl p-6 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100/60">
                <LogOut className="w-5 h-5" />
              </div>
              <h3 className="text-md font-semibold text-gray-900 mb-1">
                Confirm Logout
              </h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Are you sure you want to log out of the admin panel? Any unsaved changes will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={loggingOut}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 border border-red-700 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Signing out...
                    </>
                  ) : (
                    "Logout"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
