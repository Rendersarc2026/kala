"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "KALA DESIGN STUDIO transformed our family home into something we never imagined possible. Their attention to light, proportion, and material is extraordinary. Every room feels both liveable and deeply beautiful.",
    author: "Sarah & James Thornton",
    role: "Thornton Residence - London",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&q=80&fit=crop&crop=face",
  },
  {
    id: 2,
    quote:
      "Working with KALA DESIGN STUDIO on our flagship store was a revelation. They understood our brand better than we did. The result is a space that stops people in their tracks and keeps them coming back.",
    author: "Mira Chen",
    role: "Creative Director - Maison Lumiere",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80&fit=crop&crop=face",
  },
  {
    id: 3,
    quote:
      "From the first sketch to the final handover, the process was collaborative, thoughtful, and always exciting. KALA DESIGN STUDIO's team can translate intangible feelings into physical space.",
    author: "David Osei",
    role: "Founder - Osei Hospitality Group",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80&fit=crop&crop=face",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <section id="testimonials" className="py-28 md:py-40 bg-ivory">
      <div className="max-w-7xl mx-auto px-8 md:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mb-14 md:mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="label mb-5">Client Voices</p>
            <h2 className="font-sans text-4xl md:text-6xl font-light text-charcoal">
              What They Say
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center border border-studio-border text-charcoal/55 transition-colors duration-300 hover:border-charcoal/30 hover:text-charcoal"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center border border-studio-border text-charcoal/55 transition-colors duration-300 hover:border-charcoal/30 hover:text-charcoal"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        <div className="relative overflow-hidden border-y border-studio-border">
          <AnimatePresence mode="wait">
            <motion.article
              key={active.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="grid min-h-[420px] grid-cols-1 gap-10 py-12 md:grid-cols-12 md:gap-12 md:py-16"
            >
              <div className="md:col-span-2">
                <span className="font-sans text-[11px] tracking-editorial text-charcoal/25">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>

              <div className="md:col-span-8">
                <p className="mb-10 font-sans text-2xl font-light leading-[1.5] text-charcoal md:text-4xl md:leading-[1.35]">
                  &ldquo;{active.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={active.image}
                    alt={active.author}
                    className="h-12 w-12 rounded-full object-cover grayscale"
                  />
                  <div>
                    <p className="font-sans text-[11px] font-medium uppercase tracking-editorial text-charcoal">
                      {active.author}
                    </p>
                    <p className="mt-1 font-sans text-[11px] text-charcoal-light">
                      {active.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden md:col-span-2 md:flex md:justify-end">
                <div className="h-full w-px bg-studio-border" />
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show testimonial ${index + 1}`}
                className={`h-[2px] transition-all duration-300 ${
                  index === activeIndex
                    ? "w-10 bg-terracotta"
                    : "w-5 bg-charcoal/20 hover:bg-charcoal/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="cta-link group hidden items-center gap-4 md:inline-flex"
          >
            <span className="relative text-[11px] uppercase tracking-editorial text-charcoal/60 group-hover:text-charcoal">
              Next story
              <span className="underline-bar" />
            </span>
            <span className="text-charcoal/35 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-charcoal">
              -&gt;
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
