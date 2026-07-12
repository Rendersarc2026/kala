"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  UserCheck,
  LayoutDashboard,
  CheckCircle,
  UserPlus,
  Mail,
  Trash2,
} from "lucide-react";

interface AdminProfile {
  id: string;
  email: string;
  username: string;
  role: string;
  mustChangePassword: boolean;
}

export default function AdminDashboardPage() {
  const superadminEmail = process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL;
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin User Management fields
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [removingAdminId, setRemovingAdminId] = useState<string | null>(null);

  async function fetchProfile() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/profile");
      if (!res.ok) {
        // Not authenticated: redirect to login and keep the spinner up during
        // the redirect rather than flashing the "Authentication error" card.
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

  async function fetchAdmins() {
    setAdminsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setAdminsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setAddingAdmin(true);
    setAdminError(null);
    setAdminSuccess(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAdminError(data.error || "Failed to add admin user.");
        return;
      }

      setAdminSuccess("Admin user added successfully!");
      setNewAdminEmail("");
      fetchAdmins(); // Refresh admin list
    } catch (err) {
      setAdminError("Connection error.");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!window.confirm("Are you sure you want to remove this admin?")) return;

    setRemovingAdminId(adminId);
    setAdminError(null);
    setAdminSuccess(null);

    try {
      const res = await fetch(`/api/admin/users/${adminId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setAdminError(data.error || "Failed to remove admin user.");
        return;
      }

      setAdminSuccess("Admin user removed successfully!");
      fetchAdmins(); // Refresh admin list
    } catch (err) {
      setAdminError("Connection error.");
    } finally {
      setRemovingAdminId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-10 bg-white border border-gray-200 rounded-xl max-w-sm mx-auto shadow-sm p-6">
        <AlertCircle className="w-10 h-10 text-red-550 mx-auto mb-4" />
        <p className="text-sm mb-4 font-light text-gray-700">{error || "Authentication error."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
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
        {/* Manage Admin Users */}
        <div className="bg-[#ffffff] border border-gray-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-light text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-gray-800" /> Add New Admin Email
          </h2>

          {adminError && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          {adminSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-5">
              <CheckCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{adminSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                disabled={addingAdmin}
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="w-full bg-[#ffffff] border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55"
              />
            </div>
            <button
              type="submit"
              disabled={addingAdmin || !newAdminEmail.trim()}
              className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {addingAdmin ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#ffffff]" />
              ) : (
                "Add Admin"
              )}
            </button>
          </form>

          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-widest">
            Registered Admins
          </h3>
          
          {adminsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="border border-gray-150 rounded-lg overflow-hidden bg-[#fafafa]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 font-semibold">
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Username</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Date Added</th>
                      {profile.role === "SUPERADMIN" && profile.email === superadminEmail && (
                        <th className="p-3 text-right">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((adminItem) => (
                      <tr key={adminItem.id} className="border-b border-gray-200 hover:bg-white text-gray-700">
                        <td className="p-3 font-medium select-text">{adminItem.email}</td>
                        <td className="p-3 select-text">{adminItem.username}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-200/60 text-gray-800 uppercase tracking-widest">
                            {adminItem.role}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">
                          {new Date(adminItem.createdAt).toLocaleDateString()}
                        </td>
                        {profile.role === "SUPERADMIN" && profile.email === superadminEmail && (
                          <td className="p-3 text-right">
                            {adminItem.id !== profile.id ? (
                              <button
                                disabled={removingAdminId === adminItem.id}
                                onClick={() => handleRemoveAdmin(adminItem.id)}
                                className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold uppercase tracking-wider text-[10px] border border-red-200 hover:border-red-400 bg-red-50/50 hover:bg-red-50 px-2.5 py-1.5 rounded transition-all cursor-pointer disabled:opacity-50"
                              >
                                {removingAdminId === adminItem.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                                Remove
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest italic pr-2">
                                You
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
