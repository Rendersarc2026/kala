"use client";

import { useState } from "react";
import { saveAboutSection } from "@/app/admin/actions";
import Image from "next/image";

interface AboutData {
  label: string;
  heading: string;
  paragraph: string;
  image1Url: string;
  image2Url: string;
  buttonText: string;
}

export default function AboutManager({ initialData }: { initialData: AboutData | null }) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await saveAboutSection(formData);
      if (res.success) {
        setMessage({ type: "success", text: "About section updated successfully" });
        // Refresh page to load newly uploaded images
        window.location.reload();
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update About section" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultData = initialData || {
    label: "WHO WE ARE",
    heading: "",
    paragraph: "",
    image1Url: "",
    image2Url: "",
    buttonText: "READ MORE",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light uppercase tracking-wide">About Studio</h1>
        <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">Configure About block values and visuals</p>
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

      <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/5 p-6 md:p-8 space-y-6">
        <input type="hidden" name="existingImage1" value={defaultData.image1Url} />
        <input type="hidden" name="existingImage2" value={defaultData.image2Url} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
              Section Label
            </label>
            <input
              type="text"
              name="label"
              required
              defaultValue={defaultData.label}
              className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
              placeholder="e.g. WHO WE ARE"
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
              defaultValue={defaultData.buttonText}
              className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
            Section Heading
          </label>
          <input
            type="text"
            name="heading"
            required
            defaultValue={defaultData.heading}
            className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
            placeholder="e.g. WE DESIGN SPACES THAT INSPIRE EMOTION..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
            Paragraph Bio
          </label>
          <textarea
            name="paragraph"
            required
            rows={5}
            defaultValue={defaultData.paragraph}
            className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light leading-relaxed resize-none"
            placeholder="Write studio details..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-6">
          {/* Image 1 */}
          <div className="space-y-4">
            <label className="block text-[10px] tracking-widest text-white/50 uppercase font-medium">
              Image 1 (Main Background)
            </label>
            {defaultData.image1Url && (
              <div className="relative w-40 h-44 border border-white/5 bg-neutral-900">
                <Image
                  src={defaultData.image1Url}
                  alt="Current image 1"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="file"
              name="image1"
              accept="image/*"
              className="block w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:border file:border-white/10 file:bg-transparent file:text-white file:text-xs file:tracking-wider file:uppercase hover:file:bg-white/5 cursor-pointer file:cursor-pointer"
            />
          </div>

          {/* Image 2 */}
          <div className="space-y-4">
            <label className="block text-[10px] tracking-widest text-white/50 uppercase font-medium">
              Image 2 (Foreground Offset)
            </label>
            {defaultData.image2Url && (
              <div className="relative w-40 h-44 border border-white/5 bg-neutral-900">
                <Image
                  src={defaultData.image2Url}
                  alt="Current image 2"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="file"
              name="image2"
              accept="image/*"
              className="block w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:border file:border-white/10 file:bg-transparent file:text-white file:text-xs file:tracking-wider file:uppercase hover:file:bg-white/5 cursor-pointer file:cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-500 text-xs tracking-widest font-bold uppercase transition-colors duration-300"
          >
            {isLoading ? "SAVING CHANGES..." : "SAVE CHANGES"}
          </button>
        </div>
      </form>
    </div>
  );
}
