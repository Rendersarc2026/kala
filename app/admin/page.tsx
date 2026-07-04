"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Settings,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Loader2,
  AlertCircle,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminProjects from "@/components/AdminProjects";

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

  // Profile Edit fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Change Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Fetch admin profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

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

  const fetchProfile = async () => {
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
      setUsername(data.data.username);
      setEmail(data.data.email);
    } catch (err) {
      setError("Failed to fetch admin profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);

    try {
      const res = await fetch(`/api/admin/users/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEditError(data.error || "Failed to update profile.");
        setEditLoading(false);
        return;
      }

      setEditSuccess("Profile updated successfully!");
      setProfile((prev) => (prev ? { ...prev, email, username } : null));
    } catch (err) {
      setEditError("Connection error.");
    } finally {
      setEditLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError("Passwords do not match.");
      return;
    }

    setPwdLoading(true);
    setPwdError(null);
    setPwdSuccess(null);

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
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-850">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-black" />
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Loading Admin Session...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-850">
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

      <div className="flex-1 min-w-0 text-gray-800 py-12 px-6 lg:px-12 relative overflow-hidden font-sans">
        {/* Background Ambience Decor */}
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gray-200/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gray-200/20 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto z-10 relative">

          {activeTab === "projects" && (
            <AdminProjects />
          )}

          {activeTab === "dashboard" && (
            <>
              {/* Dashboard Top Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-gray-200 mb-10">
                <div>
                  <h1 className="text-3xl font-light tracking-wide font-serif text-gray-900 flex items-center gap-3">
                    <LayoutDashboard className="w-6 h-6 text-gray-850" /> Dashboard
                  </h1>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Logged in as: {profile.username} ({profile.role})
                  </p>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Col 1: System Info & Role Check */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-[#ffffff] border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-light text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-700" /> Admin details
                    </h2>
                    <div className="space-y-4 text-xs font-light">
                      <div>
                        <span className="text-gray-400 block uppercase tracking-wider mb-0.5">Admin ID (UUID)</span>
                        <span className="font-mono text-gray-800 break-all select-text">{profile.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block uppercase tracking-wider mb-0.5">Role Authorization</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {profile.role === "SUPERADMIN" ? (
                            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-semibold px-2 py-0.5 rounded text-[10px]">
                              SUPER ADMIN
                            </span>
                          ) : (
                            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-600 font-semibold px-2 py-0.5 rounded text-[10px]">
                              ADMIN
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 block uppercase tracking-wider mb-0.5">2FA OTP Protection</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1.5 mt-1">
                          <ShieldCheck className="w-4.5 h-4.5" /> Enabled (Standard)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-[#ffffff] border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-sm font-semibold tracking-wider text-amber-600 uppercase flex items-center gap-2 mb-3">
                      <ShieldAlert className="w-4 h-4 shrink-0" /> Security compliance
                    </h2>
                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                      IDOR prevention is active. Client-supplied IDs are not trusted. Access tokens expire in 2 hours. To ensure data privacy, sessions are deleted upon logout.
                    </p>
                  </div>
                </div>

                {/* Col 2 & 3: Forms */}
                <div className="lg:col-span-2 space-y-8">

                  {/* Form 1: Profile Details */}
                  <div className="bg-[#ffffff] border border-gray-200 rounded-xl p-8 shadow-sm">
                    <h2 className="text-lg font-light text-gray-900 border-b border-gray-100 pb-3 mb-6">
                      Update Account Information
                    </h2>

                    {editError && (
                      <div className="bg-red-55 border border-red-100 text-red-600 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-5">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>{editError}</span>
                      </div>
                    )}

                    {editSuccess && (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-5">
                        <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>{editSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                          Username
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-300">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            disabled={editLoading}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full bg-[#ffffff] border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-300">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            disabled={editLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@kala.design"
                            className="w-full bg-[#ffffff] border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={editLoading || (username === profile.username && email === profile.email)}
                          className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {editLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#ffffff]" /> : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Form 2: Password Change */}
                  <div className="bg-[#ffffff] border border-gray-200 rounded-xl p-8 shadow-sm">
                    <h2 className="text-lg font-light text-gray-900 border-b border-gray-100 pb-3 mb-6">
                      Change Password
                    </h2>

                    {pwdError && (
                      <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-5">
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

                    <form onSubmit={handlePasswordChange} className="space-y-5">
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
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-[#ffffff] border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55"
                            />
                          </div>
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
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-[#ffffff] border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55"
                            />
                          </div>
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
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-[#ffffff] border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55"
                            />
                          </div>
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

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
