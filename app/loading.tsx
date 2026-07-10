import React from "react";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-studio-gray text-charcoal"
      style={{
        animation: "fade-in 0.3s ease-out 0.25s both",
      }}
    >
      <div className="text-center space-y-5">
        {/* Editorial Loader */}
        <div className="relative w-10 h-10 mx-auto">
          {/* Track */}
          <div className="absolute inset-0 rounded-full border border-charcoal/10" />
          {/* Active indicator */}
          <div className="absolute inset-0 rounded-full border border-t-brass-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>

        {/* Minimalist Brand Accent */}
        <div className="space-y-1.5 select-none">
          <h2 className="font-serif text-sm tracking-[0.35em] uppercase text-charcoal font-light">
            KALA
          </h2>
          <p className="font-sans text-[8px] uppercase tracking-widest text-charcoal-muted">
            Loading Space
          </p>
        </div>
      </div>
    </div>
  );
}
