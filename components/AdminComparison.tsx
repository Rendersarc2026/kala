"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Loader2, Save, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ComparisonItemData {
  id: string;
  feature: string;
  kala: string;
  others: string;
  sortOrder: number;
}

const emptyForm: Omit<ComparisonItemData, "id"> & { sortOrder: number | string } = {
  feature: "",
  kala: "",
  others: "",
  sortOrder: 1,
};

export default function AdminComparison() {
  const [items, setItems] = useState<ComparisonItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ComparisonItemData, string>>>({});

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/comparison");
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load comparison items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
      sortOrder: items.length + 1,
    });
    setEditingId(null);
    setFieldErrors({});
    setShowForm(true);
  };

  const openEditForm = (item: ComparisonItemData) => {
    setForm({
      feature: item.feature,
      kala: item.kala,
      others: item.others,
      sortOrder: item.sortOrder,
    });
    setEditingId(item.id);
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

    const errs: Partial<Record<keyof ComparisonItemData, string>> = {};

    if (!form.feature.trim()) errs.feature = "Feature name is required";
    if (!form.kala.trim()) errs.kala = "Kala value is required";
    if (!form.others.trim()) errs.others = "Others value is required";

    const orderValue = typeof form.sortOrder === "string" ? parseInt(form.sortOrder) : form.sortOrder;
    if (isNaN(orderValue) || orderValue < 1) {
      errs.sortOrder = "Order must be a positive number";
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setSaving(false);
      return;
    }

    try {
      const url = editingId ? `/api/admin/comparison/${editingId}` : "/api/admin/comparison";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sortOrder: orderValue,
        }),
      });

      if (res.ok) {
        await fetchItems();
        closeForm();
      } else {
        const data = await res.json();
        if (data.details) {
          const apiErrs: any = {};
          Object.keys(data.details).forEach((k) => {
            apiErrs[k] = data.details[k][0];
          });
          setFieldErrors(apiErrs);
        } else {
          alert(data.error || "Something went wrong.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/comparison/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchItems();
        setDeleting(null);
      } else {
        alert("Failed to delete item.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-2xl text-gray-900 flex items-center gap-3">
            Comparison Table
          </h2>
          <p className="font-sans text-sm text-gray-500 mt-2 tracking-wide uppercase">
            Manage the "How we do things differently" table
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Row
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#ffffff] border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-serif text-xl text-gray-900">
                {editingId ? "Edit Row" : "Create New Row"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Feature Name
                  </label>
                  <input
                    type="text"
                    name="feature"
                    disabled={saving}
                    value={form.feature}
                    onChange={handleInputChange}
                    placeholder="e.g. Design Process"
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 ${fieldErrors.feature ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.feature && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.feature}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Kala Designs
                  </label>
                  <textarea
                    name="kala"
                    disabled={saving}
                    value={form.kala}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Bespoke interior architecture..."
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 resize-y ${fieldErrors.kala ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.kala && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.kala}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Standard Practice (Others)
                  </label>
                  <textarea
                    name="others"
                    disabled={saving}
                    value={form.others}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Template-based layouts..."
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 resize-y ${fieldErrors.others ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.others && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.others}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Order
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    disabled={saving}
                    min="1"
                    value={form.sortOrder}
                    onChange={handleInputChange}
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:outline-none transition-colors disabled:opacity-55 ${fieldErrors.sortOrder ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.sortOrder && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.sortOrder}</p>}
                </div>

              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
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
                  <span>{editingId ? "Save Changes" : "Add Row"}</span>
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
          >
            {loading ? (
              <div className="w-full flex justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
              </div>
            ) : items.length === 0 ? (
              <div className="bg-[#ffffff] border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
                <p className="text-gray-400 font-sans text-sm">
                  No comparison rows found. Create your first one to get started.
                </p>
                <button
                  onClick={openAddForm}
                  className="mt-6 border border-gray-200 text-gray-700 font-semibold text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all inline-block cursor-pointer"
                >
                  Add Row
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((s) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative bg-[#ffffff] border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row ${deleting === s.id ? "z-50" : ""}`}
                  >
                    <div className="md:w-20 bg-gray-50 flex items-center justify-center p-4 border-r border-gray-100 rounded-t-xl md:rounded-tr-none md:rounded-l-xl">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex flex-col items-center gap-1">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        #{s.sortOrder}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-1">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
                          Feature
                        </span>
                        <h3 className="font-serif text-lg text-gray-900 leading-tight">
                          {s.feature}
                        </h3>
                      </div>
                      
                      <div className="md:col-span-1 border-l border-gray-100 pl-4">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-terracotta font-bold block mb-1">
                          Kala Designs
                        </span>
                        <p className="font-sans text-sm text-gray-700 leading-relaxed font-medium">
                          {s.kala}
                        </p>
                      </div>

                      <div className="md:col-span-1 border-l border-gray-100 pl-4">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
                          Standard Practice
                        </span>
                        <p className="font-sans text-sm text-gray-500 leading-relaxed">
                          {s.others}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-end md:justify-center gap-2 p-4 border-t md:border-t-0 md:border-l border-gray-50">
                      <button
                        onClick={() => openEditForm(s)}
                        disabled={deleting === s.id}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <div className="relative">
                        <button
                          onClick={() => setDeleting(s.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {deleting === s.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#ffffff]/95 p-6 flex flex-col items-center justify-center text-center z-20 rounded-xl"
                        >
                          <p className="text-sm text-gray-900 font-semibold mb-3">Delete this comparison row?</p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setDeleting(null)}
                              disabled={isDeleting}
                              className="border border-gray-200 text-gray-700 font-semibold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              disabled={isDeleting}
                              className="bg-red-600 text-white font-semibold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-red-700 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-w-[120px]"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffffff]" />
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
