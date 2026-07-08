"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Image as ImageIcon,
  Users,
} from "lucide-react";

interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const emptyForm: Omit<TeamMemberData, "id"> = {
  name: "",
  role: "",
  bio: "",
  image: "",
};

export default function AdminTeam() {
  const [team, setTeam] = useState<TeamMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Omit<TeamMemberData, "id">>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [toast, setToast] = useState<{
    id: string;
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/team");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load team members");
      setTeam(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setForm((prev) => ({ ...prev, image: json.url }));
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.image;
        return copy;
      });
      showToast("Photo uploaded successfully!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to upload photo", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (member: TeamMemberData) => {
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: Record<string, string> = {};
    const name = form.name.trim();
    const role = form.role.trim();
    const image = form.image.trim();
    const bio = form.bio.trim();

    if (!name) {
      errors.name = "Name is required and cannot contain only whitespace.";
    }
    if (!role) {
      errors.role = "Role is required and cannot contain only whitespace.";
    }
    if (!bio) {
      errors.bio = "Biography is required and cannot contain only whitespace.";
    }
    if (!image) {
      errors.image = "Profile photo is required. Please upload an image.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/team/${editingId}`
        : "/api/admin/team";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, image, bio }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save team member");

      if (editingId) {
        setTeam((prev) =>
          prev.map((t) => (t.id === editingId ? json.data : t))
        );
        showToast("Team member updated successfully!");
      } else {
        setTeam((prev) => [...prev, json.data]);
        showToast("Team member created successfully!");
      }
      closeForm();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save team member", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete team member");

      setTeam((prev) => prev.filter((t) => t.id !== id));
      showToast("Team member deleted successfully!");
      setDeleteConfirm(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete team member", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Manager */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-6 right-6 z-[100]"
          >
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-xs font-medium shadow-lg backdrop-blur-md transition-all ${
                toast.type === "success"
                  ? "bg-emerald-50/90 border-emerald-100 text-emerald-800"
                  : toast.type === "warning"
                  ? "bg-amber-50/90 border-amber-100 text-amber-800"
                  : "bg-red-50/90 border-red-100 text-red-800"
              }`}
            >
              {toast.type === "success" && <CheckCircle className="w-4 h-4 shrink-0" />}
              {toast.type === "warning" && <AlertCircle className="w-4 h-4 shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-light tracking-wide font-serif text-gray-900 flex items-center gap-3">
            <Users className="w-6 h-6 text-gray-800" /> Team Members
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            Manage your design team roster and profile bios
          </p>
        </div>

        {!showForm && (
          <button
            onClick={openAddForm}
            className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Member
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error Loading Team Members</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main content layout */}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-light text-gray-900">
                {editingId ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    disabled={saving}
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Elena Rostova"
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                      fieldErrors.name ? "border-red-500 focus:border-red-500" : "border-gray-200"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    name="role"
                    disabled={saving}
                    value={form.role}
                    onChange={handleInputChange}
                    placeholder="Principal Designer"
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                      fieldErrors.role ? "border-red-500 focus:border-red-500" : "border-gray-200"
                    }`}
                  />
                  {fieldErrors.role && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.role}</p>
                  )}
                </div>

                {/* Bio (Full Width) */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Biography (Bio)
                  </label>
                  <textarea
                    name="bio"
                    disabled={saving}
                    value={form.bio}
                    onChange={handleInputChange}
                    placeholder="Biography / profile summary..."
                    rows={4}
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 resize-none font-sans font-light ${
                      fieldErrors.bio ? "border-red-500 focus:border-red-500" : "border-gray-200"
                    }`}
                  />
                  {fieldErrors.bio && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.bio}</p>
                  )}
                </div>

                {/* Profile Photo */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Team member profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50">
                        {uploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          "Upload Profile Photo"
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={saving || uploadingImage}
                        />
                      </label>
                      <p className="text-[9px] text-gray-400 font-light">JPG, PNG or WEBP. Max 5MB.</p>
                    </div>
                  </div>
                  {fieldErrors.image && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.image}</p>
                  )}
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="border border-gray-200 text-gray-700 font-semibold text-[10px] uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage || !form.image}
                  className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffffff]" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {editingId ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-gray-550" />
                <span className="text-xs uppercase tracking-widest font-semibold">Loading Team Roster...</span>
              </div>
            ) : team.length === 0 ? (
              <div className="text-center py-16 bg-[#ffffff] border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400">
                <Users className="w-10 h-10 mb-3 text-gray-300 font-light" />
                <p className="font-serif text-lg text-gray-900 font-light">No Team Members Found</p>
                <p className="text-xs mt-1 max-w-xs">Create team member profiles to display them on the About page.</p>
                <button
                  onClick={openAddForm}
                  className="mt-5 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                  <motion.div
                    key={member.id}
                    layout
                    className="bg-[#ffffff] border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between relative group hover:border-gray-300 transition-all duration-300"
                  >
                    {/* Member photo and info */}
                    <div>
                      <div className="relative aspect-[4/5] w-full bg-gray-50 border-b border-gray-100 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditForm(member)}
                            className="p-2 bg-[#ffffff] hover:bg-gray-100 text-gray-800 hover:text-black rounded-lg shadow-md border border-gray-200 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => setDeleteConfirm(member.id)}
                            className="p-2 bg-[#ffffff] hover:bg-red-55 text-red-600 hover:text-red-700 rounded-lg shadow-md border border-gray-200 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div>
                          <h4 className="text-base text-gray-900 font-serif font-light">
                            {member.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-light mt-0.5 tracking-wider uppercase">
                            {member.role}
                          </p>
                        </div>
                        <p className="text-xs font-sans font-light text-gray-500 leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      </div>
                    </div>

                    {/* Delete Confirmation Overlay */}
                    <AnimatePresence>
                      {deleteConfirm === member.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#ffffff]/95 p-6 flex flex-col items-center justify-center text-center z-10"
                        >
                          <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                          <h4 className="text-sm font-semibold text-gray-900">Delete Team Member?</h4>
                          <p className="text-xs text-gray-500 mt-1 max-w-xs">This will permanently delete {member.name} from the studio roster.</p>
                          <div className="flex items-center gap-3 mt-5">
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              disabled={deleting}
                              className="border border-gray-200 text-gray-700 font-semibold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              disabled={deleting}
                              className="bg-red-600 text-white font-semibold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-red-700 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {deleting ? (
                                <Loader2 className="w-3 h-3 animate-spin text-[#ffffff]" />
                              ) : (
                                "Yes, Delete"
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
