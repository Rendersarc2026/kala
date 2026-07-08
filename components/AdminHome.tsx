"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Save,
  Home,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminHome() {
  const [label, setLabel] = useState("");
  const [heading, setHeading] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

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

  const fetchHero = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load hero banner settings");
      if (json.data) {
        setLabel(json.data.label || "");
        setHeading(json.data.heading || "");
        setBackgroundImageUrl(json.data.backgroundImageUrl || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hero settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/hero/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setBackgroundImageUrl(json.url);
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.backgroundImageUrl;
        return copy;
      });
      showToast("Background image uploaded successfully!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to upload image", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const trimmedLabel = label.trim();
    const trimmedHeading = heading.trim();
    const trimmedUrl = backgroundImageUrl.trim();

    const errors: Record<string, string> = {};
    if (!trimmedLabel) {
      errors.label = "Eyebrow label text is required and cannot contain only whitespace.";
    }
    if (!trimmedHeading) {
      errors.heading = "Headline text is required and cannot contain only whitespace.";
    }
    if (!trimmedUrl) {
      errors.backgroundImageUrl = "Banner background image is required. Please upload an image.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: trimmedLabel,
          heading: trimmedHeading,
          backgroundImageUrl: trimmedUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save settings");

      showToast("Hero banner settings saved successfully!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save settings", "error");
    } finally {
      setSaving(false);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-light tracking-wide font-serif text-gray-900 flex items-center gap-3">
            <Home className="w-6 h-6 text-gray-800" /> Home Page Configuration
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            Manage the hero banner overlay texts and background images
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-650 rounded-xl p-4 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error Loading Banner Settings</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-550" />
          <span className="text-xs uppercase tracking-widest font-semibold">Loading Banner Settings...</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Eyebrow Label */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  Eyebrow Label Text
                </label>
                <input
                  type="text"
                  disabled={saving}
                  value={label}
                  onChange={(e) => { setLabel(e.target.value); clearFieldError("label"); }}
                  placeholder="From concept to completion."
                  className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                    fieldErrors.label ? "border-red-500 focus:border-red-500" : "border-gray-200"
                  }`}
                />
                {fieldErrors.label && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.label}</p>
                )}
              </div>

              {/* Banner Heading */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  Headline Text (Use &apos;|&apos; to split into two lines)
                </label>
                <input
                  type="text"
                  disabled={saving}
                  value={heading}
                  onChange={(e) => { setHeading(e.target.value); clearFieldError("heading"); }}
                  placeholder="WE TURN SPACE|INTO PLACE"
                  className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                    fieldErrors.heading ? "border-red-500 focus:border-red-500" : "border-gray-200"
                  }`}
                />
                {fieldErrors.heading && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.heading}</p>
                )}
                <span className="text-[10px] text-gray-400 block font-light mt-1">
                  The second line after the <strong>|</strong> separator renders with the accent highlight color.
                </span>
              </div>

              {/* Background Cover Image */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">
                  Banner Background Image
                </label>
                <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden bg-gray-50 border border-gray-200 group flex items-center justify-center mb-3">
                  {backgroundImageUrl ? (
                    <img
                      src={backgroundImageUrl}
                      alt="Banner background preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-gray-300">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">No Image Uploaded</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="bg-white hover:bg-gray-100 text-gray-800 rounded-lg px-4 py-2 text-[10px] uppercase tracking-widest font-semibold cursor-pointer shadow transition-colors">
                      {uploading ? "Uploading..." : "Change Image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={saving || uploading}
                      />
                    </label>
                    {backgroundImageUrl && (
                      <button
                        type="button"
                        onClick={() => setBackgroundImageUrl("")}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-[10px] uppercase tracking-widest font-semibold shadow transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                  {fieldErrors.backgroundImageUrl && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.backgroundImageUrl}</p>
                  )}
              </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving || uploading}
                className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffffff]" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Banner Settings
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
