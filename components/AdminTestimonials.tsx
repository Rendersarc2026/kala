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
  MessageSquare,
} from "lucide-react";

interface TestimonialData {
  id: string;
  quote: string;
  clientName: string;
  location: string;
  projectType: string;
  image?: string | null;
}

const emptyForm: Omit<TestimonialData, "id"> = {
  quote: "",
  clientName: "",
  location: "",
  projectType: "Residential",
  image: "",
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<TestimonialData, "id">>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonials");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load testimonials");
      setTestimonials(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const openEditForm = (testimonial: TestimonialData) => {
    setForm({
      quote: testimonial.quote,
      clientName: testimonial.clientName,
      location: testimonial.location,
      projectType: testimonial.projectType,
      image: testimonial.image || "",
    });
    setEditingId(testimonial.id);
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
    const quote = form.quote.trim();
    const clientName = form.clientName.trim();
    const location = form.location.trim();
    const projectType = form.projectType.trim();
    const image = form.image ? form.image.trim() : null;

    if (!quote) {
      errors.quote = "Quote / Review is required and cannot contain only whitespace.";
    }
    if (!clientName) {
      errors.clientName = "Client Name is required and cannot contain only whitespace.";
    }
    if (!location) {
      errors.location = "Project / Location is required and cannot contain only whitespace.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : "/api/admin/testimonials";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote, clientName, location, projectType, image }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save testimonial");

      if (editingId) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editingId ? json.data : t))
        );
        showToast("Testimonial updated successfully!");
      } else {
        setTestimonials((prev) => [...prev, json.data]);
        showToast("Testimonial created successfully!");
      }
      closeForm();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save testimonial", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete testimonial");

      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      showToast("Testimonial deleted successfully!");
      setDeleteConfirm(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete testimonial", "error");
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
            <MessageSquare className="w-6 h-6 text-gray-850" /> Testimonials
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            Manage customer feedback and reviews
          </p>
        </div>

        {!showForm && (
          <button
            onClick={openAddForm}
            className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Testimonial
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error Loading Testimonials</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main content grid */}
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
                {editingId ? "Edit Testimonial" : "Create New Testimonial"}
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
                
                {/* Quote (Full Width) */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Quote / Review
                  </label>
                  <textarea
                    name="quote"
                    disabled={saving}
                    value={form.quote}
                    onChange={handleInputChange}
                    placeholder=" Alexandra & Peter Sterling..."
                    rows={4}
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 resize-none font-sans font-light ${
                      fieldErrors.quote ? "border-red-500 focus:border-red-500" : "border-gray-200"
                    }`}
                  />
                  {fieldErrors.quote && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.quote}</p>
                  )}
                </div>

                {/* Client Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    disabled={saving}
                    value={form.clientName}
                    onChange={handleInputChange}
                    placeholder=" Alexandra & Peter Sterling"
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                      fieldErrors.clientName ? "border-red-500 focus:border-red-500" : "border-gray-200"
                    }`}
                  />
                  {fieldErrors.clientName && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.clientName}</p>
                  )}
                </div>

                {/* Project Location */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Project / Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    disabled={saving}
                    value={form.location}
                    onChange={handleInputChange}
                    placeholder=" Aurelia Penthouse, New York"
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                      fieldErrors.location ? "border-red-500 focus:border-red-500" : "border-gray-200"
                    }`}
                  />
                  {fieldErrors.location && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.location}</p>
                  )}
                </div>

                {/* Project Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">
                    Project Type
                  </label>
                  <select
                    name="projectType"
                    disabled={saving}
                    value={form.projectType}
                    onChange={handleInputChange}
                    className="w-full bg-[#ffffff] border border-gray-200 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 appearance-none cursor-pointer"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Hospitality">Hospitality</option>
                  </select>
                </div>

                {/* Client Avatar / Photo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">
                    Client Photo (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Client avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    
                    <label className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50">
                      {uploadingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Upload Photo"
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={saving || uploadingImage}
                      />
                    </label>
                    
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, image: "" }))}
                        className="text-red-500 hover:text-red-700 text-[10px] uppercase tracking-wider font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
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
                  disabled={saving || uploadingImage}
                  className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffffff]" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {editingId ? "Save Changes" : "Create Testimonial"}
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
                <span className="text-xs uppercase tracking-widest font-semibold">Loading Testimonials...</span>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-16 bg-[#ffffff] border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400">
                <MessageSquare className="w-10 h-10 mb-3 text-gray-300 font-light" />
                <p className="font-serif text-lg text-gray-900 font-light">No Testimonials Found</p>
                <p className="text-xs mt-1 max-w-xs">Create customer testimonials to display them on the homepage slider.</p>
                <button
                  onClick={openAddForm}
                  className="mt-5 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Add Testimonial
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative group hover:border-gray-300 transition-all duration-300"
                  >
                    {/* Testimonial Quote */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <span className="font-serif text-4xl text-gray-200 leading-none select-none">&ldquo;</span>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 opacity-100 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditForm(t)}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => setDeleteConfirm(t.id)}
                            className="p-2 text-gray-400 hover:text-red-650 hover:bg-red-50/50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm font-sans font-light text-gray-700 leading-relaxed italic pr-4">
                        {t.quote}
                      </p>
                    </div>

                    {/* Client details card at bottom */}
                    <div className="flex items-center gap-4.5 border-t border-gray-100 pt-5 mt-6">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                        {t.image ? (
                          <img
                            src={t.image}
                            alt={t.clientName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-serif text-sm text-gray-400 font-medium uppercase">
                            {t.clientName.split(" ").map((n) => n[0]).join("")}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm text-gray-900 font-serif font-light truncate">
                          {t.clientName}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-light mt-0.5 tracking-wider truncate uppercase">
                          {t.location} • <span className="font-semibold text-gray-500">{t.projectType}</span>
                        </p>
                      </div>
                    </div>

                    {/* Delete Confirmation Overlay */}
                    <AnimatePresence>
                      {deleteConfirm === t.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-white/95 rounded-2xl p-6 flex flex-col items-center justify-center text-center z-10"
                        >
                          <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                          <h4 className="text-sm font-semibold text-gray-900">Delete Testimonial?</h4>
                          <p className="text-xs text-gray-500 mt-1 max-w-xs">This will permanently delete Alexandra & Peter Sterling&apos;s testimonial. This action cannot be undone.</p>
                          <div className="flex items-center gap-3 mt-5">
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              disabled={deleting}
                              className="border border-gray-200 text-gray-700 font-semibold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
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
