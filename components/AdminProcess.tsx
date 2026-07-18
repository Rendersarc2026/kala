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
  Layers,
  Settings,
} from "lucide-react";

interface ProcessStepData {
  id: string;
  title: string;
  description: string;
  details: string;
  sortOrder: number;
}

const emptyForm: Omit<ProcessStepData, "id"> & { sortOrder: number | string } = {
  title: "",
  description: "",
  details: "",
  sortOrder: 1,
};

export default function AdminProcess() {
  const [processSteps, setProcessSteps] = useState<ProcessStepData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ProcessStepData, "id"> & { sortOrder: number | string }>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProcessStepData, string>>>({});
  const [saving, setSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const fetchProcessSteps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/process");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load process steps");
      setProcessSteps(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load process steps");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProcessSteps();
  }, [fetchProcessSteps]);

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

  const openAddForm = () => {
    setForm({
      ...emptyForm,
      sortOrder: processSteps.length + 1,
    });
    setEditingId(null);
    setFieldErrors({});
    setShowForm(true);
  };

  const openEditForm = (step: ProcessStepData) => {
    setForm({
      title: step.title,
      description: step.description,
      details: step.details,
      sortOrder: step.sortOrder,
    });
    setEditingId(step.id);
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

    const errs: Partial<Record<keyof ProcessStepData, string>> = {};

    if (!form.title.trim()) errs.title = "Step title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.details.trim()) errs.details = "Details are required";

    const orderValue = typeof form.sortOrder === "string" ? parseInt(form.sortOrder) : form.sortOrder;
    if (isNaN(orderValue || 0) || (orderValue || 0) < 1) {
      errs.sortOrder = "Order must be 1 or greater";
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setSaving(false);
      return;
    }

    setFieldErrors({});

    try {
      const url = editingId
        ? `/api/admin/process/${editingId}`
        : "/api/admin/process";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sortOrder: typeof form.sortOrder === "string" ? (parseInt(form.sortOrder) || 1) : form.sortOrder,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save process step");

      if (editingId) {
        showToast("Process step updated successfully!");
      } else {
        showToast("Process step created successfully!");
      }
      await fetchProcessSteps();
      closeForm();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save process step", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/process/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete process step");

      await fetchProcessSteps();
      showToast("Process step deleted successfully!");
      setDeleteConfirm(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete process step", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-light tracking-wide font-serif text-gray-900 flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-850" /> Our Process
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            Manage the steps of your design process
          </p>
        </div>

        {!showForm && (
          <button
            onClick={openAddForm}
            className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Step
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-650 rounded-xl p-4 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error Loading Process Steps</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

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
                {editingId ? "Edit Process Step" : "Add Process Step"}
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

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Step Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    disabled={saving}
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="Consultation"
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 ${fieldErrors.title ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.title && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.title}</p>}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    disabled={saving}
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the step..."
                    rows={2}
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 resize-none font-sans font-light ${fieldErrors.description ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.description && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.description}</p>}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Detailed Explanation
                  </label>
                  <textarea
                    name="details"
                    disabled={saving}
                    value={form.details}
                    onChange={handleInputChange}
                    placeholder="A more comprehensive explanation..."
                    rows={4}
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 resize-none font-sans font-light ${fieldErrors.details ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.details && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.details}</p>}
                </div>

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

              </div>

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
                  disabled={saving}
                  className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffffff]" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{editingId ? "Save Changes" : "Add Step"}</span>
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
                <span className="text-xs uppercase tracking-widest font-semibold">Loading Steps...</span>
              </div>
            ) : processSteps.length === 0 ? (
              <div className="text-center py-16 bg-[#ffffff] border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400">
                <Settings className="w-10 h-10 mb-3 text-gray-300 font-light" />
                <p className="font-serif text-lg text-gray-900 font-light">No Process Steps Found</p>
                <p className="text-xs mt-1 max-w-xs">Create steps to define your process for clients.</p>
                <button
                  onClick={openAddForm}
                  className="mt-5 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Add Step
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processSteps.map((s, index) => (
                  <motion.div
                    key={s.id}
                    layout
                    className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative group hover:border-gray-300 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-sans text-xs tracking-[0.25em] uppercase text-gray-500 font-bold block">
                          Step {String(index + 1).padStart(2, '0')}
                        </span>
                        
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditForm(s)}
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(s.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="text-xl text-gray-900 font-serif font-light">
                        {s.title}
                      </h4>
                      <p className="text-sm font-sans font-light text-gray-500 leading-relaxed">
                        {s.description}
                      </p>
                      <p className="text-xs font-sans text-gray-400 leading-relaxed line-clamp-3">
                        {s.details}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                        Order: {s.sortOrder}
                      </span>
                    </div>

                    <AnimatePresence>
                      {deleteConfirm === s.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#ffffff]/95 p-6 flex flex-col items-center justify-center text-center z-10 rounded-2xl"
                        >
                          <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                          <h4 className="text-sm font-semibold text-gray-900">Delete Step?</h4>
                          <p className="text-xs text-gray-500 mt-1 max-w-xs">This will permanently delete "{s.title}".</p>
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
