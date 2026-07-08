"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Loader2,
  AlertCircle,
  UserCheck,
  LayoutDashboard,
  CheckCircle,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHome from "@/components/AdminHome";
import AdminProjects from "@/components/AdminProjects";
import AdminAbout from "@/components/AdminAbout";
import AdminTestimonials from "@/components/AdminTestimonials";
import AdminContact from "@/components/AdminContact";
import AdminTeam from "@/components/AdminTeam";

interface AdminProfile {
  id: string;
  email: string;
  username: string;
  role: string;
  mustChangePassword: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Change Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdFieldErrors, setPwdFieldErrors] = useState<Record<string, string>>({});

  const clearPwdFieldError = (field: string) => {
    if (pwdFieldErrors[field]) {
      setPwdFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Handle back button after logout (bfcache restore) — re-check auth
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
    setLoading(true);
    setError(null);
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

  // Fetch admin profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const errors: Record<string, string> = {};
    if (!currentPassword.trim()) {
      errors.currentPassword = "Current password is required.";
    }
    if (!newPassword.trim()) {
      errors.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters.";
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setPwdFieldErrors(errors);
      return;
    }

    setPwdLoading(true);
    setPwdError(null);
    setPwdSuccess(null);
    setPwdFieldErrors({});

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPwdError(data.error || "Failed to change password.");
        setPwdLoading(false);
        return;
      }

      setPwdSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwdError("Connection error.");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        username={profile.username}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 min-w-0 text-gray-800 py-12 px-6 lg:px-12 lg:pl-72 relative overflow-hidden font-sans">
        {/* Background Ambience Decor */}
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gray-200/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gray-200/20 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto z-10 relative">

          {activeTab === "home" && (
            <div className="space-y-8">
              <AdminHome />
              <AdminAbout />
            </div>
          )}

          {activeTab === "projects" && (
            <AdminProjects />
          )}

          {activeTab === "about" && (
            <AdminTeam />
          )}

          {activeTab === "testimonials" && (
            <AdminTestimonials />
          )}

          {activeTab === "contact" && (
            <AdminContact />
          )}

          {activeTab === "dashboard" && (
            <>
              {/* Dashboard Top Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-gray-200 mb-10">
                <div>
                  <h1 className="text-3xl font-light tracking-wide font-serif text-gray-900 flex items-center gap-3">
                    <LayoutDashboard className="w-6 h-6 text-gray-800" /> Dashboard
                  </h1>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Logged in as: {profile.username} ({profile.role})
                  </p>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="max-w-4xl space-y-8">
                  {/* Password Change */}
                  <div className="bg-[#ffffff] border border-gray-200 rounded-xl p-8 shadow-sm">
                    <h2 className="text-lg font-light text-gray-900 border-b border-gray-100 pb-3 mb-6">
                      Change Password
                    </h2>

                    {pwdError && (
                      <div className="bg-red-55 border border-red-100 text-red-655 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-5">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>{pwdError}</span>
                      </div>
                    )}

                    {pwdSuccess && (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-5">
                        <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>{pwdSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handlePasswordChange} noValidate className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                            Current Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-300">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              type="password"
                              disabled={pwdLoading}
                              value={currentPassword}
                              onChange={(e) => { setCurrentPassword(e.target.value); clearPwdFieldError("currentPassword"); }}
                              placeholder="••••••••"
                              className={`w-full bg-[#ffffff] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                                pwdFieldErrors.currentPassword ? "border-red-500 focus:border-red-500" : "border-gray-200"
                              }`}
                            />
                          </div>
                          {pwdFieldErrors.currentPassword && (
                            <p className="text-xs text-red-500 mt-1">{pwdFieldErrors.currentPassword}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-300">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              type="password"
                              disabled={pwdLoading}
                              value={newPassword}
                              onChange={(e) => { setNewPassword(e.target.value); clearPwdFieldError("newPassword"); }}
                              placeholder="••••••••"
                              className={`w-full bg-[#ffffff] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                                pwdFieldErrors.newPassword ? "border-red-500 focus:border-red-500" : "border-gray-200"
                              }`}
                            />
                          </div>
                          {pwdFieldErrors.newPassword && (
                            <p className="text-xs text-red-500 mt-1">{pwdFieldErrors.newPassword}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-300">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              type="password"
                              disabled={pwdLoading}
                              value={confirmPassword}
                              onChange={(e) => { setConfirmPassword(e.target.value); clearPwdFieldError("confirmPassword"); }}
                              placeholder="••••••••"
                              className={`w-full bg-[#ffffff] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                                pwdFieldErrors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-gray-200"
                              }`}
                            />
                          </div>
                          {pwdFieldErrors.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">{pwdFieldErrors.confirmPassword}</p>
                          )}
                        </div>

                      </div>

                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={pwdLoading || !currentPassword || !newPassword || !confirmPassword}
                          className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                          {pwdLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#ffffff]" /> : "Update Password"}
                        </button>
                      </div>
                    </form>
                  </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
