"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Star,
  StarOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Image as ImageIcon,
  FolderKanban,
  LayoutGrid,
  List,
} from "lucide-react";

interface ProjectData {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  area: string;
  year: string;
  client: string;
  description: string;
  narrative: string;
  heroImage: string;
  images: string[];
  featured: boolean;
  sortOrder: number;
}

const emptyForm: Omit<ProjectData, "id"> = {
  slug: "",
  title: "",
  category: "residential",
  location: "",
  area: "",
  year: "",
  client: "",
  description: "",
  narrative: "",
  heroImage: "",
  images: [],
  featured: false,
  sortOrder: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ProjectData, "id">>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const json = await res.json();
      setProjects(json.data);
      setVisibleCount(6);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (loading || projects.length <= visibleCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          // Simulate a small delay for premium visual feedback loader
          setTimeout(() => {
            setVisibleCount((prev) => prev + 6);
            setLoadingMore(false);
          }, 600);
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loading, projects.length, visibleCount, loadingMore]);

  const resetForm = () => {
    setForm(emptyForm);
    setFieldErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (project: ProjectData) => {
    setForm({
      slug: project.slug,
      title: project.title,
      category: project.category,
      location: project.location,
      area: project.area,
      year: project.year,
      client: project.client,
      description: project.description,
      narrative: project.narrative,
      heroImage: project.heroImage,
      images: project.images,
      featured: project.featured,
      sortOrder: project.sortOrder,
    });
    setFieldErrors({});
    setEditingId(project.id);
    setShowForm(true);
  };

  const validateField = (field: string, value: any) => {
    let errorMsg = "";

    switch (field) {
      case "slug":
        if (!value) {
          errorMsg = "Slug is required";
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          errorMsg = "Slug must be lowercase alphanumeric with hyphens (e.g., my-project-slug)";
        } else if (value.length > 100) {
          errorMsg = "Slug must be 100 characters or less";
        }
        break;
      case "title":
        if (!value.trim()) {
          errorMsg = "Title is required";
        } else if (value.length > 200) {
          errorMsg = "Title must be 200 characters or less";
        }
        break;
      case "location":
        if (!value.trim()) {
          errorMsg = "Location is required";
        } else if (value.length > 200) {
          errorMsg = "Location must be 200 characters or less";
        }
        break;
      case "area":
        if (!value.trim()) {
          errorMsg = "Area is required";
        } else if (value.length > 100) {
          errorMsg = "Area must be 100 characters or less";
        }
        break;
      case "year":
        if (!value.trim()) {
          errorMsg = "Year is required";
        } else if (!/^[0-9]+$/.test(value)) {
          errorMsg = "Year must contain numbers only";
        } else if (value.length > 20) {
          errorMsg = "Year must be 20 characters or less";
        }
        break;
      case "client":
        if (!value.trim()) {
          errorMsg = "Client is required";
        } else if (value.length > 200) {
          errorMsg = "Client must be 200 characters or less";
        }
        break;
      case "sortOrder":
        if (value === undefined || value === null || isNaN(Number(value))) {
          errorMsg = "Sort order is required";
        } else if (Number(value) < 0) {
          errorMsg = "Sort order must be 0 or greater";
        }
        break;
      case "description":
        if (!value.trim()) {
          errorMsg = "Description is required";
        } else if (value.length > 500) {
          errorMsg = "Description must be 500 characters or less";
        }
        break;
      case "narrative":
        if (!value.trim()) {
          errorMsg = "Narrative is required";
        }
        break;
      case "heroImage":
        if (!value.trim()) {
          errorMsg = "Hero image URL is required";
        } else if (value.length > 500) {
          errorMsg = "Hero image URL must be 500 characters or less";
        }
        break;
      case "images":
        if (value.length === 0) {
          errorMsg = "At least one gallery image URL is required";
        }
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: errorMsg,
    }));
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.slug) {
      errs.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(form.slug)) {
      errs.slug = "Slug must be lowercase alphanumeric with hyphens (e.g., my-project-slug)";
    } else if (form.slug.length > 100) {
      errs.slug = "Slug must be 100 characters or less";
    }

    if (!form.title.trim()) {
      errs.title = "Title is required";
    } else if (form.title.length > 200) {
      errs.title = "Title must be 200 characters or less";
    }

    if (!form.location.trim()) {
      errs.location = "Location is required";
    } else if (form.location.length > 200) {
      errs.location = "Location must be 200 characters or less";
    }

    if (!form.area.trim()) {
      errs.area = "Area is required";
    } else if (form.area.length > 100) {
      errs.area = "Area must be 100 characters or less";
    }

    if (!form.year.trim()) {
      errs.year = "Year is required";
    } else if (!/^[0-9]+$/.test(form.year)) {
      errs.year = "Year must contain numbers only";
    } else if (form.year.length > 20) {
      errs.year = "Year must be 20 characters or less";
    }

    if (!form.client.trim()) {
      errs.client = "Client is required";
    } else if (form.client.length > 200) {
      errs.client = "Client must be 200 characters or less";
    }

    if (form.sortOrder === undefined || form.sortOrder === null || isNaN(form.sortOrder)) {
      errs.sortOrder = "Sort order is required";
    } else if (form.sortOrder < 0) {
      errs.sortOrder = "Sort order must be 0 or greater";
    }

    if (!form.description.trim()) {
      errs.description = "Description is required";
    } else if (form.description.length > 500) {
      errs.description = "Description must be 500 characters or less";
    }

    if (!form.narrative.trim()) {
      errs.narrative = "Narrative is required";
    }

    if (!form.heroImage.trim()) {
      errs.heroImage = "Hero image URL is required";
    } else if (form.heroImage.length > 500) {
      errs.heroImage = "Hero image URL must be 500 characters or less";
    }

    if (form.images.length === 0) {
      errs.images = "At least one gallery image URL is required";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const blockInvalidNumberKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Delete",
    ];
    if (allowedKeys.includes(e.key)) {
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleNumberPaste = (e: React.ClipboardEvent<HTMLInputElement>, field: string) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanText = pastedText.replace(/[^0-9]/g, "");
    if (field === "sortOrder") {
      const parsedVal = cleanText === "" ? 0 : parseInt(cleanText, 10);
      updateFormField(field, parsedVal);
    } else {
      updateFormField(field, cleanText);
    }
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.replace(/[^0-9]/g, "");
    const parsedVal = cleanVal === "" ? 0 : parseInt(cleanVal, 10);
    updateFormField("sortOrder", parsedVal);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.replace(/[^0-9]/g, "");
    updateFormField("year", cleanVal);
  };

  const getInputClass = (field: string) => {
    const base = "w-full bg-[#ffffff] border rounded-lg py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-55";
    const padding = field === "heroImage" || field === "images" ? "pl-10 pr-4" : "px-4";
    const border = fieldErrors[field]
      ? "border-red-500/50 focus:border-red-500"
      : "border-gray-200 focus:border-gray-400";
    return `${base} ${padding} ${border}`;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "heroImage" | "images") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingField(field);
    setError(null);

    try {
      if (field === "heroImage") {
        const file = files[0];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");

        updateFormField("heroImage", json.url);
      } else {
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          const json = await res.json();
          if (!res.ok) throw new Error(json.error || `Upload failed for ${file.name}`);
          uploadedUrls.push(json.url);
        }
        const updatedImages = [...form.images, ...uploadedUrls];
        updateFormField("images", updatedImages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      setError("Please fix the validation errors in the form before submitting.");
      return;
    }

    if (form.featured) {
      const wasFeatured = editingId ? projects.find((p) => p.id === editingId)?.featured : false;
      if (!wasFeatured) {
        const currentFeaturedCount = projects.filter((p) => p.featured).length;
        if (currentFeaturedCount >= 4) {
          setError("You can only have up to 4 featured projects. Please unfeature another project first.");
          return;
        }
      }
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.details) {
          const formattedErrors: Record<string, string> = {};
          Object.entries(json.details).forEach(([key, val]) => {
            if (Array.isArray(val) && val.length > 0) {
              formattedErrors[key] = val[0];
            }
          });
          setFieldErrors(formattedErrors);
        } else if (json.error && json.error.toLowerCase().includes("slug")) {
          setFieldErrors((prev) => ({ ...prev, slug: json.error }));
        }
        setError(json.error || "Failed to save project");
        setSaving(false);
        return;
      }

      setSuccess(editingId ? "Project updated successfully!" : "Project created successfully!");
      resetForm();
      fetchProjects();
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Failed to delete project");
        setDeleting(false);
        return;
      }

      setSuccess("Project deleted successfully!");
      setDeleteConfirm(null);
      fetchProjects();
    } catch {
      setError("Connection error.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleFeatured = async (project: ProjectData) => {
    if (togglingFeaturedId) return;
    
    if (!project.featured) {
      const currentFeaturedCount = projects.filter((p) => p.featured).length;
      if (currentFeaturedCount >= 4) {
        setError("You can only have up to 4 featured projects. Please unfeature another project first.");
        return;
      }
    }

    setTogglingFeaturedId(project.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Failed to toggle featured");
        return;
      }

      fetchProjects();
    } catch {
      setError("Connection error.");
    } finally {
      setTogglingFeaturedId(null);
    }
  };

  const updateFormField = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const formatImages = (images: string[]) => images.join(", ");

  const parseImages = (raw: string): string[] =>
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const labelClass = "text-[10px] uppercase tracking-widest text-gray-500 font-semibold";
  const btnClass = "bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed";

  const visibleProjects = projects.slice(0, visibleCount);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-gray-200 mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-wide font-serif text-gray-900 flex items-center gap-3">
            <FolderKanban className="w-6 h-6 text-gray-750" /> Projects
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            Manage your portfolio projects
          </p>
        </div>
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
          {projects.length > 0 && (
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-1 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-all cursor-pointer flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold ${
                  viewMode === "list"
                    ? "bg-[#ffffff] text-[#000000] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-all cursor-pointer flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold ${
                  viewMode === "grid"
                    ? "bg-[#ffffff] text-[#000000] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          )}
          <button onClick={() => { resetForm(); setShowForm(true); }} className={btnClass}>
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-5">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Dialog */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => {
              if (!saving && uploadingField === null) {
                resetForm();
              }
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-[#ffffff] border border-gray-200 rounded-xl p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light text-gray-900">
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>
              <button 
                onClick={resetForm} 
                disabled={saving || uploadingField !== null}
                className="text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className={labelClass}>Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateFormField("slug", e.target.value)}
                  placeholder="my-project-slug"
                  className={getInputClass("slug")}
                  required
                  disabled={saving || uploadingField !== null}
                />
                {fieldErrors.slug && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.slug}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateFormField("title", e.target.value)}
                  placeholder="Project Title"
                  className={getInputClass("title")}
                  required
                  disabled={saving || uploadingField !== null}
                />
                {fieldErrors.title && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.title}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateFormField("category", e.target.value)}
                  className={getInputClass("category")}
                  disabled={saving || uploadingField !== null}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="hospitality">Hospitality</option>
                </select>
                {fieldErrors.category && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.category}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateFormField("location", e.target.value)}
                  placeholder="Manhattan, New York"
                  className={getInputClass("location")}
                  required
                  disabled={saving || uploadingField !== null}
                />
                {fieldErrors.location && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.location}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Area</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => updateFormField("area", e.target.value)}
                  placeholder="3,800 sq.ft"
                  className={getInputClass("area")}
                  required
                  disabled={saving || uploadingField !== null}
                />
                {fieldErrors.area && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.area}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Year</label>
                <input
                  type="text"
                  value={form.year}
                  onChange={handleYearChange}
                  onKeyDown={blockInvalidNumberKeys}
                  onPaste={(e) => handleNumberPaste(e, "year")}
                  placeholder="2025"
                  className={getInputClass("year")}
                  required
                  disabled={saving || uploadingField !== null}
                />
                {fieldErrors.year && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.year}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Client</label>
                <input
                  type="text"
                  value={form.client}
                  onChange={(e) => updateFormField("client", e.target.value)}
                  placeholder="Client Name"
                  className={getInputClass("client")}
                  required
                  disabled={saving || uploadingField !== null}
                />
                {fieldErrors.client && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.client}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Sort Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={handleSortOrderChange}
                  onKeyDown={blockInvalidNumberKeys}
                  onPaste={(e) => handleNumberPaste(e, "sortOrder")}
                  className={getInputClass("sortOrder")}
                  disabled={saving || uploadingField !== null}
                />
                {fieldErrors.sortOrder && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{fieldErrors.sortOrder}</p>
                )}
              </div>
              <div className="space-y-1.5 flex items-end pb-2.5">
                <label className={`flex items-center gap-2 cursor-pointer ${saving || uploadingField !== null ? "opacity-55 pointer-events-none" : ""}`}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => updateFormField("featured", e.target.checked)}
                    className="w-4 h-4 accent-black"
                    disabled={saving || uploadingField !== null}
                  />
                  <span className="text-xs text-gray-700 font-medium">Featured Project</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                placeholder="Short project description"
                className={`${getInputClass("description")} resize-none h-20`}
                required
                disabled={saving || uploadingField !== null}
              />
              {fieldErrors.description && (
                <p className="text-red-600 text-[10px] mt-1 font-medium">{fieldErrors.description}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Narrative</label>
              <textarea
                value={form.narrative}
                onChange={(e) => updateFormField("narrative", e.target.value)}
                placeholder="Full project narrative"
                className={`${getInputClass("narrative")} resize-none h-32`}
                required
                disabled={saving || uploadingField !== null}
              />
              {fieldErrors.narrative && (
                <p className="text-red-600 text-[10px] mt-1 font-medium">{fieldErrors.narrative}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Hero Image URL</label>
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-300">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={form.heroImage}
                    readOnly
                    placeholder="No hero image uploaded yet. Click Upload to select an image."
                    className={`${getInputClass("heroImage")} cursor-not-allowed text-gray-500 font-light select-all`}
                    required
                    disabled={saving || uploadingField !== null}
                  />
                </div>
                <label className={`bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
                  saving || uploadingField !== null ? "opacity-50 pointer-events-none" : ""
                }`}>
                  {uploadingField === "heroImage" ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin text-black" />
                  ) : (
                    "Upload"
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, "heroImage")}
                    disabled={saving || uploadingField !== null}
                    className="hidden"
                  />
                </label>
              </div>
              {form.heroImage && (
                <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-gray-200 mt-2 bg-gray-50">
                  <img src={form.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => updateFormField("heroImage", "")}
                    disabled={saving || uploadingField !== null}
                    className="absolute top-1 right-1 bg-black/75 hover:bg-black/90 text-[#ffffff] rounded-full p-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {fieldErrors.heroImage && (
                <p className="text-red-600 text-[10px] mt-1 font-medium">{fieldErrors.heroImage}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Gallery Images</label>
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-300">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formatImages(form.images)}
                    readOnly
                    placeholder="No gallery images uploaded yet. Click Upload Files to select images."
                    className={`${getInputClass("images")} cursor-not-allowed text-gray-500 font-light select-all`}
                    required
                    disabled={saving || uploadingField !== null}
                  />
                </div>
                <label className={`bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
                  saving || uploadingField !== null ? "opacity-50 pointer-events-none" : ""
                }`}>
                  {uploadingField === "images" ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin text-black" />
                  ) : (
                    "Upload Files"
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleUpload(e, "images")}
                    disabled={saving || uploadingField !== null}
                    className="hidden"
                  />
                </label>
              </div>

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mt-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = form.images.filter((_, i) => i !== idx);
                          updateFormField("images", updated);
                        }}
                        disabled={saving || uploadingField !== null}
                        className="absolute top-1 right-1 bg-black/75 hover:bg-black/90 text-[#ffffff] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {fieldErrors.images && (
                <p className="text-red-600 text-[10px] mt-1 font-medium">{fieldErrors.images}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving || uploadingField !== null}
                className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 px-4 py-2.5 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className={btnClass}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-[#ffffff]" /> : <Save className="w-4 h-4" />}
                {editingId ? "Update Project" : "Create Project"}
              </button>
            </div>
          </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh] w-full">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-[#ffffff] border border-dashed border-gray-200 rounded-xl shadow-sm">
          <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-400 font-light">No projects yet. Add your first project.</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#ffffff] border border-gray-200 rounded-xl p-5 flex items-center gap-5 hover:border-gray-300 transition-colors shadow-sm"
            >
              {/* Thumbnail */}
              <div className="w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                {project.heroImage && (
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{project.title}</h3>
                  {project.featured && (
                    <Star className="w-3.5 h-3.5 text-[#000000] fill-[#000000] shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {project.category} &middot; {project.location} &middot; {project.year}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleFeatured(project)}
                  disabled={togglingFeaturedId !== null || deleting}
                  className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title={project.featured ? "Unfeature" : "Feature"}
                >
                  {togglingFeaturedId === project.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : project.featured ? (
                    <Star className="w-4 h-4 fill-[#000000] text-[#000000]" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(project)}
                  disabled={togglingFeaturedId !== null || deleting}
                  className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {deleteConfirm === project.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting}
                      className="px-3 py-1.5 text-[10px] uppercase tracking-widest bg-red-50 border border-red-100 text-red-650 rounded-lg hover:bg-red-100 transition-all cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>...</span>
                        </>
                      ) : (
                        "Confirm"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      disabled={deleting}
                      className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-750 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(project.id)}
                    disabled={togglingFeaturedId !== null || deleting}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-655 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#ffffff] border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all flex flex-col group animate-fadeIn shadow-sm"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-gray-50 border-b border-gray-100 overflow-hidden">
                {project.heroImage ? (
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 left-3 bg-[#000000] text-[#ffffff] rounded-full p-1.5 shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-[#ffffff] text-[#ffffff]" />
                  </div>
                )}
              </div>

              {/* Info Body */}
              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1 truncate" title={project.title}>
                    {project.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">
                    {project.category} &middot; {project.location}
                  </p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mt-1 font-semibold">
                    Year: {project.year}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(project)}
                      disabled={togglingFeaturedId !== null || deleting}
                      className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title={project.featured ? "Unfeature" : "Feature"}
                    >
                      {togglingFeaturedId === project.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                      ) : project.featured ? (
                        <Star className="w-4 h-4 fill-[#000000] text-[#000000]" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(project)}
                      disabled={togglingFeaturedId !== null || deleting}
                      className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {deleteConfirm === project.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        disabled={deleting}
                        className="px-2.5 py-1.5 text-[9px] uppercase tracking-widest bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>...</span>
                          </>
                        ) : (
                          "Confirm"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(null)}
                        disabled={deleting}
                        className="px-2 py-1.5 text-[9px] uppercase tracking-widest text-gray-750 hover:text-gray-755 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(project.id)}
                      disabled={togglingFeaturedId !== null || deleting}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-650 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      {projects.length > visibleCount && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8 mt-4">
          {loadingMore && (
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-semibold">
              <Loader2 className="w-4 h-4 animate-spin text-black" /> Loading more projects...
            </div>
          )}
        </div>
      )}
    </div>
  );
}


