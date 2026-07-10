"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Search,
  Inbox,
  Mail,
  RefreshCw,
} from "lucide-react";

interface EnquiryData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  projectType: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  hospitality: "Hospitality",
  office: "Office",
  kitchens: "Modular Kitchens",
  other: "Other",
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<EnquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Selected enquiry for details modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

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

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/enquiries");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load enquiries");
      setEnquiries(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setStatusUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update status");

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? json.data : e))
      );

      // If modal is showing the updated enquiry, refresh it too
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(json.data);
      }

      showToast(`Enquiry marked as ${newStatus.toLowerCase()}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update status", "error");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Auto-mark as read when modal opens
  const openDetailsModal = (enquiry: EnquiryData) => {
    setSelectedEnquiry(enquiry);
    if (enquiry.status === "NEW") {
      handleUpdateStatus(enquiry.id, "READ");
    }
  };

  // Delete enquiry
  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete enquiry");

      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      showToast("Enquiry deleted successfully!");
      setDeleteConfirm(null);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete enquiry", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Stats computation
  const stats = useMemo(() => {
    const total = enquiries.length;
    const unread = enquiries.filter((e) => e.status === "NEW").length;
    const contacted = enquiries.filter((e) => e.status === "CONTACTED").length;

    return { total, unread, contacted };
  }, [enquiries]);

  // Filtering logic
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" ? true : item.projectType === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [enquiries, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6 relative font-sans text-gray-800">
      {/* Toast Manager */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[100]"
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-xs font-light shadow-sm backdrop-blur-md transition-all ${
                toast.type === "success"
                  ? "bg-[#ffffff] border-gray-200 text-gray-900"
                  : "bg-red-50/90 border-red-100 text-red-800"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-3.5 h-3.5 text-gray-900 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-red-550 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Inline Minimalist Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-light tracking-wide font-serif text-gray-900">
            Enquiries
          </h1>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-light tracking-wider">
            <span>{stats.total} total</span>
            <span>•</span>
            <span className={stats.unread > 0 ? "text-black font-normal" : ""}>
              {stats.unread} unread
            </span>
            <span>•</span>
            <span>{stats.contacted} contacted</span>
          </div>
        </div>

        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="text-gray-400 hover:text-gray-900 font-light text-[10px] uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter and Search Bar (Borderless Minimalist style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-0 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-gray-150 focus:border-gray-900 py-1.5 pl-6 pr-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-4 text-xs font-light text-gray-500">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-0 focus:outline-none cursor-pointer py-1"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="READ">Read</option>
            <option value="CONTACTED">Contacted</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent border-0 focus:outline-none cursor-pointer py-1"
          >
            <option value="ALL">All Categories</option>
            {Object.entries(PROJECT_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          {(searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setCategoryFilter("ALL");
              }}
              className="text-[10px] font-medium uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50/50 border border-red-100 text-red-700 rounded-lg p-3.5 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table Content */}
      <div className="w-full pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[11px] uppercase tracking-widest font-medium">Loading...</span>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center p-6 text-gray-400">
            <Inbox className="w-8 h-8 mb-2 text-gray-300 font-light" />
            <p className="font-serif text-base text-gray-900 font-light">No enquiries found</p>
            <p className="text-[11px] mt-0.5 max-w-xs font-light">
              {enquiries.length === 0 ? "Inbox is empty." : "No matching results."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 text-[10px] uppercase tracking-widest font-medium">
                  <th className="py-3 pr-4 pl-1">Client</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Brief Message</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pl-4 pr-1 text-right w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnquiries.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => openDetailsModal(item)}
                    className="hover:bg-gray-50/50 text-gray-700 transition-colors cursor-pointer group"
                  >
                    {/* Client Name */}
                    <td className="py-4 pr-4 pl-1">
                      <div className="flex items-center gap-2 max-w-[150px] sm:max-w-[200px]">
                        {item.status === "NEW" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" title="New" />
                        )}
                        <span
                          title={item.name}
                          className={`text-gray-900 truncate ${
                            item.status === "NEW" ? "font-semibold" : "font-light"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td
                      className="py-4 px-4 select-text text-gray-500 font-light truncate max-w-[130px] sm:max-w-[180px]"
                      title={item.email}
                    >
                      {item.email}
                    </td>

                    {/* Mobile */}
                    <td className="py-4 px-4 select-text text-gray-500 font-light whitespace-nowrap">
                      {item.phone || <span className="text-gray-300 italic">—</span>}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap text-gray-500 font-light">
                      {PROJECT_TYPE_LABELS[item.projectType] || item.projectType}
                    </td>

                    {/* Message Snippet */}
                    <td
                      className="py-4 px-4 max-w-[180px] sm:max-w-[250px] truncate text-gray-500 font-light select-text"
                      title={item.message}
                    >
                      {item.message}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-gray-450 whitespace-nowrap font-light">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                        item.status === "NEW" ? "text-blue-600" :
                        item.status === "CONTACTED" ? "text-emerald-600" : "text-gray-400"
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions (Hidden until hover) */}
                    <td className="py-4 pl-4 pr-1 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="text-gray-300 hover:text-red-650 p-1 rounded transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Slideout Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed top-16 lg:top-0 bottom-0 left-0 right-0 z-[70] flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setSelectedEnquiry(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#ffffff] shadow-xl flex flex-col justify-between z-10 border-l border-gray-150"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-950 p-1.5 hover:bg-gray-50 rounded-full transition-colors cursor-pointer z-20"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="px-6 pt-10 pb-5 border-b border-gray-150 pr-12">
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-0.5">
                    Enquiry Details
                  </span>
                  <h2 className="text-xl font-light font-serif text-gray-900 select-text break-words">
                    {selectedEnquiry.name}
                  </h2>
                  <div className="flex flex-col gap-0.5 mt-1.5 text-xs text-gray-450 font-light">
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="hover:text-gray-900 select-text underline underline-offset-2 break-all"
                    >
                      {selectedEnquiry.email}
                    </a>
                    {selectedEnquiry.phone && (
                      <a
                        href={`tel:${selectedEnquiry.phone.replace(/[^0-9+]/g, "")}`}
                        className="hover:text-gray-900 select-text underline underline-offset-2 break-all"
                      >
                        {selectedEnquiry.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 text-xs text-gray-650 font-light">
                <div className="flex gap-10 border-b border-gray-100 pb-5">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">
                      Category
                    </span>
                    <span className="text-gray-900 font-normal block mt-1">
                      {PROJECT_TYPE_LABELS[selectedEnquiry.projectType] || selectedEnquiry.projectType}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">
                      Date Received
                    </span>
                    <span className="text-gray-900 font-normal block mt-1">
                      {new Date(selectedEnquiry.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">
                    Project Brief
                  </span>
                  <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-4 text-xs text-gray-800 font-light leading-relaxed whitespace-pre-wrap select-text max-h-96 overflow-y-auto break-words">
                    {selectedEnquiry.message}
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="px-6 py-5 border-t border-gray-100 bg-[#fafafa] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(selectedEnquiry.id)}
                  className="text-red-500 hover:text-red-700 font-semibold text-[10px] uppercase tracking-widest py-2 transition-colors cursor-pointer"
                >
                  Delete
                </button>

                <div className="flex items-center gap-3">
                  {selectedEnquiry.status !== "CONTACTED" ? (
                    <button
                      type="button"
                      disabled={statusUpdatingId === selectedEnquiry.id}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, "CONTACTED")}
                      className="bg-black text-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-4 py-2 rounded hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {statusUpdatingId === selectedEnquiry.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Mark Contacted"
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={statusUpdatingId === selectedEnquiry.id}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, "READ")}
                      className="border border-gray-250 text-gray-700 bg-[#ffffff] font-semibold text-[10px] uppercase tracking-widest px-4 py-2 rounded hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {statusUpdatingId === selectedEnquiry.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Mark Read"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setDeleteConfirm(null)}
            />

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#ffffff] border border-gray-250 rounded-lg p-6 max-w-xs w-full text-center shadow-lg z-10"
            >
              <h3 className="font-serif text-base text-gray-900 font-light mb-2">Delete Enquiry?</h3>
              <p className="text-[11px] text-gray-450 font-sans leading-relaxed mb-5">
                This will permanently delete this client enquiry. This action is irreversible.
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="border border-gray-200 text-gray-700 font-semibold text-[9px] uppercase tracking-widest px-3 py-2 rounded hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="bg-red-600 text-white font-semibold text-[9px] uppercase tracking-widest px-3 py-2 rounded hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
