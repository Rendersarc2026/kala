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
  Layers,
  Trash,
} from "lucide-react";

interface ServiceData {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string[];
  sortOrder: number;
}

const emptyForm: Omit<ServiceData, "id"> & { sortOrder: number | string } = {
  title: "",
  description: "",
  image: "",
  details: [""],
  sortOrder: 1,
};

export default function AdminServices() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ServiceData, "id"> & { sortOrder: number | string }>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ServiceData, string>>>({});
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

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/services");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load services");
      setServices(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "sortOrder" ? (value === "" ? "" : isNaN(parseInt(value)) ? 1 : parseInt(value)) : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDetailChange = (index: number, value: string) => {
    const updatedDetails = [...form.details];
    updatedDetails[index] = value;
    setForm((prev) => ({ ...prev, details: updatedDetails }));
  };

  const addDetailField = () => {
    setForm((prev) => ({ ...prev, details: [...prev.details, ""] }));
  };

  const removeDetailField = (index: number) => {
    if (form.details.length <= 1) return;
    const updatedDetails = form.details.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, details: updatedDetails }));
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
      showToast("Service image uploaded successfully!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const openAddForm = () => {
    setForm({
      ...emptyForm,
      sortOrder: services.length + 1,
    });
    setEditingId(null);
    setFieldErrors({});
    setShowForm(true);
  };

  const openEditForm = (service: ServiceData) => {
    setForm({
      title: service.title,
      description: service.description,
      image: service.image,
      details: service.details.length > 0 ? service.details : [""],
      sortOrder: service.sortOrder,
    });
    setEditingId(service.id);
    setFieldErrors({});
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
    setSaving(true);

    const errs: Partial<Record<keyof ServiceData, string>> = {};

    if (!form.title.trim()) errs.title = "Service title is required";
    if (!form.description.trim()) errs.description = "Description is required";

    const orderValue = typeof form.sortOrder === "string" ? parseInt(form.sortOrder) : form.sortOrder;
    if (isNaN(orderValue || 0) || (orderValue || 0) < 1) {
      errs.sortOrder = "Order must be 1 or greater";
    }

    if (!form.image) errs.image = "Service image is required";

    const cleanedDetails = form.details.map((d) => d.trim()).filter((d) => d !== "");
    if (cleanedDetails.length === 0) {
      errs.details = "Please add at least one deliverable item";
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      if (errs.details) showToast(errs.details, "warning");
      setSaving(false);
      return;
    }

    setFieldErrors({});

    try {
      const url = editingId
        ? `/api/admin/services/${editingId}`
        : "/api/admin/services";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sortOrder: typeof form.sortOrder === "string" ? (parseInt(form.sortOrder) || 1) : form.sortOrder,
          details: cleanedDetails,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save service");

      if (editingId) {
        showToast("Service updated successfully!");
      } else {
        showToast("Service created successfully!");
      }
      await fetchServices();
      closeForm();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save service", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete service");

      await fetchServices();
      showToast("Service deleted successfully!");
      setDeleteConfirm(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete service", "error");
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
            <Layers className="w-6 h-6 text-gray-850" /> Services
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            Manage your design capabilities and deliverables
          </p>
        </div>

        {!showForm && (
          <button
            onClick={openAddForm}
            className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Service
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-55 border border-red-100 text-red-655 rounded-xl p-4 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error Loading Services</p>
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
                {editingId ? "Edit Service" : "Add Service"}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Service Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    disabled={saving}
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="Residential Interiors"
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 ${fieldErrors.title ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.title && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.title}</p>}
                </div>

                {/* Sort Order */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Order
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    disabled={saving}
                    value={form.sortOrder}
                    onChange={handleInputChange}
                    placeholder="1"
                    min={1}
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:outline-none transition-colors disabled:opacity-55 ${fieldErrors.sortOrder ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.sortOrder && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.sortOrder}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Description
                  </label>
                  <textarea
                    name="description"
                    disabled={saving}
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Describe this service category..."
                    rows={3}
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 resize-none font-sans font-light ${fieldErrors.description ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.description && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.description}</p>}
                </div>

                {/* Deliverables Items (Details) */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                      Deliverables List
                    </label>
                    <button
                      type="button"
                      onClick={addDetailField}
                      disabled={saving}
                      className="text-[10px] text-gray-700 hover:text-black uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {form.details.map((detail, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          disabled={saving}
                          value={detail}
                          onChange={(e) => handleDetailChange(index, e.target.value)}
                          placeholder={`Deliverable item ${index + 1} (e.g. Curation of bespoke lighting)`}
                          className="flex-1 bg-[#ffffff] border border-gray-200 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55"
                        />
                        {form.details.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetailField(index)}
                            disabled={saving}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Background Cover Image */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">
                    Service Card Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4.5">
                    <div className="w-32 aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Service preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className={`bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center cursor-pointer transition-colors ${
                        (saving || uploadingImage) ? "opacity-50 pointer-events-none" : ""
                      }`}>
                        {uploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          "Upload Service Image"
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={saving || uploadingImage}
                        />
                      </label>
                      <p className="text-[9px] text-gray-400 font-light">Recommended: landscape aspect ratio.</p>
                    </div>
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
                  disabled={saving || uploadingImage || !form.image}
                  className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffffff]" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {editingId ? "Save Changes" : "Add Service"}
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
                <span className="text-xs uppercase tracking-widest font-semibold">Loading Services...</span>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-[#ffffff] border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400">
                <Layers className="w-10 h-10 mb-3 text-gray-300 font-light" />
                <p className="font-serif text-lg text-gray-900 font-light">No Services Found</p>
                <p className="text-xs mt-1 max-w-xs">Create services to display them on the Services page.</p>
                <button
                  onClick={openAddForm}
                  className="mt-5 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Add Service
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (
                  <motion.div
                    key={s.id}
                    layout
                    className="bg-[#ffffff] border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between relative group hover:border-gray-300 transition-all duration-300"
                  >
                    <div>
                      {/* Cover Photo */}
                      <div className="relative aspect-video w-full bg-gray-50 border-b border-gray-100 overflow-hidden">
                        <img
                          src={s.image}
                          alt={s.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        
                        {/* Overlay actions */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditForm(s)}
                            className="p-2 bg-[#ffffff] hover:bg-gray-100 text-gray-800 hover:text-black rounded-lg shadow-md border border-gray-200 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => setDeleteConfirm(s.id)}
                            className="p-2 bg-[#ffffff] hover:bg-red-50 text-red-650 hover:text-red-700 rounded-lg shadow-md border border-gray-200 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Sort Order Tag */}
                        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-[#ffffff] text-[8px] font-bold px-2 py-0.5 rounded">
                          Order: {s.sortOrder}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h4 className="text-base text-gray-900 font-serif font-light truncate">
                          {s.title}
                        </h4>
                        <p className="text-xs font-sans font-light text-gray-500 leading-relaxed line-clamp-3">
                          {s.description}
                        </p>
                        
                        <div className="pt-2">
                          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold block mb-1">
                            Deliverables includes:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {s.details.map((d, dIdx) => (
                              <span
                                key={dIdx}
                                className="bg-gray-50 border border-gray-150 text-gray-600 text-[9px] px-2 py-0.5 rounded-full truncate max-w-[130px]"
                                title={d}
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Confirmation Overlay */}
                    <AnimatePresence>
                      {deleteConfirm === s.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#ffffff]/95 p-6 flex flex-col items-center justify-center text-center z-10"
                        >
                          <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                          <h4 className="text-sm font-semibold text-gray-900">Delete Service?</h4>
                          <p className="text-xs text-gray-500 mt-1 max-w-xs">This will permanently delete the service &quot;{s.title}&quot; category configuration.</p>
                          <div className="flex items-center gap-3 mt-5">
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              disabled={deleting}
                              className="border border-gray-200 text-gray-700 font-semibold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
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
