"use client";

import { useState } from "react";
import { saveService, deleteService } from "@/app/admin/actions";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Service {
  id: string;
  iconName: string;
  title: string;
  description: string;
  sortOrder: number;
}

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pick a set of beautiful Lucide icons to offer in a dropdown
  const availableIcons = ["Compass", "Layers", "Layout", "Sparkles", "PenTool", "Eye", "Wind", "Box"];

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setIsEditing(true);
    setMessage(null);
  };

  const handleCreateNew = () => {
    setCurrentService({
      iconName: "Compass",
      title: "",
      description: "",
      sortOrder: services.length + 1,
    });
    setIsEditing(true);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setIsLoading(true);
    try {
      const res = await deleteService(id);
      if (res.success) {
        setServices(services.filter((s) => s.id !== id));
        setMessage({ type: "success", text: "Service card deleted successfully" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to delete service" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentService) return;

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    if (currentService.id) {
      formData.append("id", currentService.id);
    }

    try {
      const res = await saveService(formData);
      if (res.success) {
        setMessage({ type: "success", text: "Service saved successfully" });
        window.location.reload();
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save service" });
      }
    } catch {
      setMessage({ type: "error", text: "Error saving service card" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-wide">Studio Services</h1>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">Manage what we do specialty list</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white text-black hover:bg-neutral-200 transition-colors duration-300 text-xs tracking-widest font-bold uppercase"
        >
          <Plus size={14} />
          <span>Add Service</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 text-xs tracking-wider uppercase font-semibold border ${
            message.type === "success"
              ? "bg-green-950/30 border-green-800/40 text-green-300"
              : "bg-red-950/30 border-red-800/40 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {isEditing && currentService && (
        <div className="bg-[#121212] border border-white/5 p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">
              {currentService.id ? "Edit Service Card" : "Add Service Card"}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                  Select Visual Icon
                </label>
                <select
                  name="iconName"
                  required
                  defaultValue={currentService.iconName}
                  className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light uppercase tracking-wider"
                >
                  {availableIcons.map((ico) => (
                    <option key={ico} value={ico} className="bg-[#1c1c1c] py-2">
                      {ico}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  required
                  defaultValue={currentService.sortOrder}
                  className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Service Title
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={currentService.title || ""}
                className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
                placeholder="e.g. Interior Architecture"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                defaultValue={currentService.description || ""}
                className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light leading-relaxed resize-none"
                placeholder="Write service details..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-500 text-xs tracking-widest font-bold uppercase transition-colors duration-300"
              >
                {isLoading ? "SAVING SERVICE..." : "SAVE SERVICE"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-white/10 hover:border-white/20 text-xs tracking-widest font-medium uppercase transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[service.iconName] || LucideIcons.HelpCircle;
          return (
            <div
              key={service.id}
              className="bg-[#121212] border border-white/5 p-6 flex flex-col space-y-4 hover:border-white/10 transition-colors duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-white/[0.03] border border-white/5 text-white/80">
                  <Icon size={20} />
                </div>
                <div className="text-[10px] font-mono text-white/30">
                  ORDER {service.sortOrder}
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium tracking-wide text-white uppercase mb-2">
                  {service.title}
                </h3>
                <p className="text-xs text-white/40 font-light leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="flex space-x-2 mt-auto border-t border-white/5 pt-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex items-center space-x-1.5 px-3 py-2 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-[10px] tracking-widest uppercase font-bold text-white transition-all duration-300"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex items-center space-x-1.5 px-3 py-2 border border-red-900/30 hover:bg-red-950/20 text-[10px] tracking-widest uppercase font-bold text-red-400 transition-all duration-300 ml-auto"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
