"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Loader2, Save, GripVertical, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface WhyChooseUsItemData {
  id: string;
  title: string;
  image: string;
  description: string;
  extended: string;
  sortOrder: number;
}

const emptyForm: Omit<WhyChooseUsItemData, "id"> & { sortOrder: number | string } = {
  title: "",
  image: "",
  description: "",
  extended: "",
  sortOrder: 1,
};

export default function AdminWhyChooseUs() {
  const [items, setItems] = useState<WhyChooseUsItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof WhyChooseUsItemData, string>>>({});

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/why-choose-us");
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load why-choose-us items:", err);
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

  const openEditForm = (item: WhyChooseUsItemData) => {
    setForm({
      title: item.title,
      image: item.image,
      description: item.description,
      extended: item.extended,
      sortOrder: item.sortOrder,
    });
    setEditingId(item.id);
    setFieldErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setFieldErrors({});
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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const errs: Partial<Record<keyof WhyChooseUsItemData, string>> = {};

    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.image.trim()) errs.image = "Image is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.extended.trim()) errs.extended = "Extended details are required";

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
      const url = editingId ? `/api/admin/why-choose-us/${editingId}` : "/api/admin/why-choose-us";
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
      const res = await fetch(`/api/admin/why-choose-us/${id}`, { method: "DELETE" });
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 flex items-center gap-3">
            Why Choose Us
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-2 tracking-wide uppercase">
            Manage the differentiators section
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-5 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
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
                {editingId ? "Edit Item" : "Create New Item"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    disabled={saving}
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Quality Craftsmanship"
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 ${fieldErrors.title ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.title && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.title}</p>}
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

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">
                    Card Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4.5">
                    <div className="w-32 aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Preview"
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
                          "Upload Image"
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
                  {fieldErrors.image && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.image}</p>}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    disabled={saving}
                    rows={2}
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Brief description for the list view..."
                    className={`w-full bg-[#ffffff] border rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 resize-y min-h-[60px] ${fieldErrors.description ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.description && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.description}</p>}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    Extended Details
                  </label>
                  <textarea
                    name="extended"
                    disabled={saving}
                    rows={4}
                    value={form.extended}
                    onChange={handleInputChange}
                    placeholder="Detailed explanation..."
                    className={`w-full bg-[#ffffff] border rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55 resize-y min-h-[100px] ${fieldErrors.extended ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}`}
                  />
                  {fieldErrors.extended && <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.extended}</p>}
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
                  <span>{editingId ? "Save Changes" : "Add Item"}</span>
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
                  No items found. Create your first one to get started.
                </p>
                <button
                  onClick={openAddForm}
                  className="mt-6 border border-gray-200 text-gray-700 font-semibold text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all inline-block cursor-pointer"
                >
                  Add Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((s) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative bg-[#ffffff] border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group flex flex-col ${deleting === s.id ? "z-50" : ""}`}
                  >
                    <div className="relative w-full h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
                      {s.image && (
                        <Image
                          src={s.image}
                          alt={s.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute top-3 left-3 bg-[#ffffff]/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-gray-700 shadow-sm flex items-center gap-1.5">
                        <GripVertical className="w-3 h-3 text-gray-400" />
                        Order: {s.sortOrder}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col">
                      <div className="mb-3">
                        <h3 className="font-serif text-lg text-gray-900 leading-tight">
                          {s.title}
                        </h3>
                      </div>
                      
                      <p className="font-sans text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                        {s.description}
                      </p>

                      <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-gray-50">
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
                    </div>

                    <AnimatePresence>
                      {deleting === s.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#ffffff]/95 p-6 flex flex-col items-center justify-center text-center z-20 rounded-2xl"
                        >
                          <p className="text-sm text-gray-900 font-semibold mb-3">Delete this item?</p>
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
