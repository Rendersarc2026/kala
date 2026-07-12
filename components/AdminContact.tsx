"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Save,
  MapPin,
} from "lucide-react";

interface ContactData {
  phone: string;
  email: string;
  hoursMonFri: string;
  hoursSat: string;
  hoursSun: string;
  mapEmbedUrl: string;
}

export default function AdminContact() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hoursMonFri, setHoursMonFri] = useState("");
  const [hoursSat, setHoursSat] = useState("");
  const [hoursSun, setHoursSun] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");

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

  const fetchContact = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/contact");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load contact settings");
      if (json.data) {
        setPhone(json.data.phone || "");
        setEmail(json.data.email || "");
        setHoursMonFri(json.data.hoursMonFri || "");
        setHoursSat(json.data.hoursSat || "");
        setHoursSun(json.data.hoursSun || "");
        setMapEmbedUrl(json.data.mapEmbedUrl || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contact settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedMap = mapEmbedUrl.trim();

    const errors: Record<string, string> = {};
    if (!trimmedPhone) {
      errors.phone = "Phone number is required and cannot contain only whitespace.";
    } else if (!/^[0-9+\s()-]+$/.test(trimmedPhone)) {
      errors.phone = "Please enter a valid phone number.";
    }
    if (!trimmedEmail) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!trimmedMap) {
      errors.mapEmbedUrl = "Google Maps embed link is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: trimmedPhone,
          email: trimmedEmail,
          hoursMonFri,
          hoursSat,
          hoursSun,
          mapEmbedUrl: trimmedMap,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update contact settings");

      showToast("Contact settings saved successfully!");
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
                  : "bg-red-55/90 border-red-100 text-red-800"
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
            <MapPin className="w-6 h-6 text-gray-800" /> Contact Information
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            Manage studio contact details, hours, and maps
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-650 rounded-xl p-4 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error Loading Contact Details</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-550" />
          <span className="text-xs uppercase tracking-widest font-semibold">Loading Contact Settings...</span>
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
              
              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  Phone Number
                </label>
                <input
                  type="text"
                  disabled={saving}
                  value={phone}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(/[^0-9+\s()-]/g, "");
                    setPhone(filtered);
                    clearFieldError("phone");
                  }}
                  placeholder="+1 (555) 0199"
                  className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                    fieldErrors.phone ? "border-red-500 focus:border-red-500" : "border-gray-200"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled={saving}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                  placeholder="studio@kaladesign.com"
                  className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                    fieldErrors.email ? "border-red-500 focus:border-red-500" : "border-gray-200"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                )}
              </div>



              {/* Map Embed URL */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  Google Maps Embed Link (src attribute URL)
                </label>
                <input
                  type="text"
                  disabled={saving}
                  value={mapEmbedUrl}
                  onChange={(e) => { setMapEmbedUrl(e.target.value); clearFieldError("mapEmbedUrl"); }}
                  placeholder="https://maps.google.com/maps?q=..."
                  className={`w-full bg-[#ffffff] border rounded-lg py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-55 ${
                    fieldErrors.mapEmbedUrl ? "border-red-500 focus:border-red-500" : "border-gray-200"
                  }`}
                />
                {fieldErrors.mapEmbedUrl && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.mapEmbedUrl}</p>
                )}
                <span className="text-[10px] text-gray-400 block font-light mt-1">
                  Paste the <strong>src</strong> attribute value from the Google Maps iframe sharing code.
                </span>
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
                Save Contact Info
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
