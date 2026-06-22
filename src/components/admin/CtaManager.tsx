"use client";

import { useState } from "react";
import { saveCtaSection } from "@/app/admin/actions";
import Image from "next/image";

interface CtaData {
  heading: string;
  subtext: string;
  buttonText: string;
  backgroundImageUrl: string;
}

export default function CtaManager({ initialData }: { initialData: CtaData | null }) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await saveCtaSection(formData);
      if (res.success) {
        setMessage({ type: "success", text: "CTA section updated successfully" });
        window.location.reload();
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update CTA section" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultData = initialData || {
    heading: "",
    subtext: "",
    buttonText: "CONTACT US",
    backgroundImageUrl: "",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light uppercase tracking-wide">CTA Banner</h1>
        <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">Configure call to action header and visuals</p>
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
        <input type="hidden" name="existingImage" value={defaultData.backgroundImageUrl} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Banner Heading
          </label>
          <input
            type="text"
            name="heading"
            required
            defaultValue={defaultData.heading}
            className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light"
            placeholder="e.g. READY TO BRING YOUR VISION TO LIFE?"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] tracking-widest text-white/50 uppercase font-medium">
            Subtext
          </label>
          <textarea
            name="subtext"
            required
            rows={4}
            defaultValue={defaultData.subtext}
            className="w-full bg-[#1c1c1c] border border-white/5 px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 font-light leading-relaxed resize-none"
            placeholder="Write subtext..."
          />
        </div>

        <div className="space-y-4 border-t border-white/5 pt-6">
          <label className="block text-[10px] tracking-widest text-white/50 uppercase font-medium">
            Background Image
          </label>
          {defaultData.backgroundImageUrl && (
            <div className="relative w-72 h-40 border border-white/5 bg-neutral-900">
              <Image
                src={defaultData.backgroundImageUrl}
                alt="Current background preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="block w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:border file:border-white/10 file:bg-transparent file:text-white file:text-xs file:tracking-wider file:uppercase hover:file:bg-white/5 cursor-pointer file:cursor-pointer"
          />
        </div>

        <div className="pt-6 border-t border-white/5">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-500 text-xs tracking-widest font-bold uppercase transition-colors duration-300"
          >
            {isLoading ? "SAVING CTA CHANGES..." : "SAVE CTA CHANGES"}
          </button>
        </div>
      </form>
    </div>
  );
}
