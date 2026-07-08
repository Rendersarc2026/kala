"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Save,
  Info,
} from "lucide-react";
export default function AdminAbout() {
  const [label, setLabel] = useState("");
  const [heading, setHeading] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const fetchAbout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/about");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load about teaser settings");
      if (json.data) {
        setLabel(json.data.label || "");
        setHeading(json.data.heading || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load about settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const trimmedLabel = label.trim();
    const trimmedHeading = heading.trim();

    const errors: Record<string, string> = {};
    if (!trimmedLabel) {
      errors.label = "About teaser subtitle is required and cannot contain only whitespace.";
    }
    if (!trimmedHeading) {
      errors.heading = "About teaser text is required and cannot contain only whitespace.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: trimmedLabel,
          heading: trimmedHeading,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save settings");

      showToast("About teaser settings saved successfully!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 relative">
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

      {/* Section 1: About Teaser Configurator */}
      <div className="space-y-6">
        <div className="pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-light tracking-wide font-serif text-gray-900 flex items-center gap-3">
            <Info className="w-6 h-6 text-gray-800" /> About Page Configuration
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            Manage the homepage about teaser and team members roster
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-650 rounded-xl p-4 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error Loading About Teaser Settings</p>
              <p className="text-xs opacity-90 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-gray-550" />
            <span className="text-xs uppercase tracking-widest font-semibold">Loading About Settings...</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto"
          >
            <h2 className="text-base uppercase tracking-widest text-gray-500 font-semibold mb-6 border-b border-gray-100 pb-3">
              Home Page About Teaser
            </h2>
            
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                
                {/* About Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    About Teaser Subtitle (Label)
                  </label>
                  <input
                    type="text"
                    disabled={saving}
                    value={label}
                    onChange={(e) => { setLabel(e.target.value); clearFieldError("label"); }}
                    placeholder="About Kala Studio"
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                      fieldErrors.label ? "border-red-500 focus:border-red-500" : "border-gray-200"
                    }`}
                  />
                  {fieldErrors.label && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.label}</p>
                  )}
                </div>

                {/* About Text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                    About Teaser Text (Heading)
                  </label>
                  <textarea
                    disabled={saving}
                    value={heading}
                    onChange={(e) => { setHeading(e.target.value); clearFieldError("heading"); }}
                    placeholder="We sculpt tactile, honest spaces..."
                    rows={4}
                    className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 resize-none font-sans font-light ${
                      fieldErrors.heading ? "border-red-500 focus:border-red-500" : "border-gray-200"
                    }`}
                  />
                  {fieldErrors.heading && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.heading}</p>
                  )}
                </div>

              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
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
                  Save Teaser Settings
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
