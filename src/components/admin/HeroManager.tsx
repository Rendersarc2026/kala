"use client";

import { useState } from "react";
import { saveHeroSlide, deleteHeroSlide } from "@/app/admin/actions";
import Image from "next/image";
import { Trash2, Edit2, Plus, X } from "lucide-react";

interface Slide {
  id: string;
  label: string;
  heading: string;
  buttonText: string;
  backgroundImageUrl: string;
  slideOrder: number;
}

export default function HeroManager({ initialSlides }: { initialSlides: Slide[] }) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<Partial<Slide> | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (slide: Slide) => {
    setCurrentSlide(slide);
    setIsEditing(true);
    setMessage(null);
  };

  const handleCreateNew = () => {
    setCurrentSlide({
      label: "",
      heading: "",
      buttonText: "EXPLORE PROJECTS",
      slideOrder: slides.length + 1,
      backgroundImageUrl: "",
    });
    setIsEditing(true);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    setIsLoading(true);
    try {
      const res = await deleteHeroSlide(id);
      if (res.success) {
        setSlides(slides.filter((s) => s.id !== id));
        setMessage({ type: "success", text: "Slide deleted successfully" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to delete slide" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentSlide) return;

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    if (currentSlide.id) {
      formData.append("id", currentSlide.id);
    }

    try {
      const res = await saveHeroSlide(formData);
      if (res.success) {
        setMessage({ type: "success", text: "Slide saved successfully" });
        // Refresh page or list
        window.location.reload();
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save slide" });
      }
    } catch {
      setMessage({ type: "error", text: "Error submitting form" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top action header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-wide">Hero Slideshow</h1>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">Manage landing slide visuals and text</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white text-black hover:bg-neutral-200 transition-colors duration-300 text-xs tracking-widest font-bold uppercase"
        >
          <Plus size={14} />
          <span>Add Slide</span>
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

      {/* Editor Drawer / Modal */}
      {isEditing && currentSlide && (
        <div className="bg-[#121212] border border-white/5 p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">
              {currentSlide.id ? "Edit Slide Info" : "Create New Slide"}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="existingImage" value={currentSlide.backgroundImageUrl || ""} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  required
                  defaultValue={currentSlide.label || ""}
                  className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
                  placeholder="e.g. STUDIO"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                  Slide Order (Sort)
                </label>
                <input
                  type="number"
                  name="slideOrder"
                  required
                  defaultValue={currentSlide.slideOrder || 1}
                  className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Heading
              </label>
              <input
                type="text"
                name="heading"
                required
                defaultValue={currentSlide.heading || ""}
                className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
                placeholder="e.g. MINIMALIST RESIDENCES"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Button Text
              </label>
              <input
                type="text"
                name="buttonText"
                required
                defaultValue={currentSlide.buttonText || ""}
                className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] tracking-widest text-white/50 uppercase font-medium">
                Slide Image
              </label>
              {currentSlide.backgroundImageUrl && (
                <div className="relative w-40 h-24 border border-white/5 mb-2 bg-neutral-900">
                  <Image
                    src={currentSlide.backgroundImageUrl}
                    alt="Current image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                required={!currentSlide.backgroundImageUrl}
                className="block w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:border file:border-white/10 file:bg-transparent file:text-white file:text-xs file:tracking-wider file:uppercase hover:file:bg-white/5 cursor-pointer file:cursor-pointer"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-500 text-xs tracking-widest font-bold uppercase transition-colors duration-300"
              >
                {isLoading ? "SAVING..." : "SAVE SLIDE"}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="bg-[#121212] border border-white/5 p-5 flex flex-col space-y-4 hover:border-white/10 transition-colors duration-300"
          >
            {/* Visual background preview */}
            <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
              <Image
                src={slide.backgroundImageUrl}
                alt={slide.heading}
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute top-4 left-4 px-2 py-0.5 bg-black/80 text-[10px] font-mono border border-white/10 text-white">
                SLIDE 0{slide.slideOrder}
              </div>
            </div>

            {/* Info details */}
            <div>
              <span className="text-[9px] tracking-[0.25em] font-semibold text-white/40 uppercase block mb-1">
                {slide.label}
              </span>
              <h3 className="text-base font-light tracking-wide text-white uppercase line-clamp-1">
                {slide.heading}
              </h3>
            </div>

            {/* Panel button controls */}
            <div className="flex space-x-2 mt-auto border-t border-white/5 pt-4">
              <button
                onClick={() => handleEdit(slide)}
                className="flex items-center space-x-1.5 px-3 py-2 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-[10px] tracking-widest uppercase font-bold text-white transition-all duration-300"
              >
                <Edit2 size={12} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
                className="flex items-center space-x-1.5 px-3 py-2 border border-red-900/30 hover:bg-red-950/20 text-[10px] tracking-widest uppercase font-bold text-red-400 transition-all duration-300 ml-auto"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
