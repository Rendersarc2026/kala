"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    phase: "Consultation",
    title: "Consultation & Supervision",
    duration: "1-2 weeks",
    description:
      "We begin with a thorough consultation to understand your needs, lifestyle, and aspirations. Our team listens carefully, visits the site, and oversees every stage to ensure the vision is translated with precision.",
    deliverables: [
      "Site visit",
      "Client brief",
      "Project scope",
      "Design direction",
    ],
  },
  {
    number: "02",
    phase: "Contracting",
    title: "Contracting",
    duration: "1-2 weeks",
    description:
      "We formalise the project scope, timelines, and deliverables into a clear contract. Transparent pricing and defined milestones ensure you are fully informed before work begins.",
    deliverables: [
      "Project agreement",
      "Cost breakdown",
      "Timeline schedule",
      "Milestone plan",
    ],
  },
  {
    number: "03",
    phase: "Visualisation",
    title: "3D Visualization",
    duration: "2-4 weeks",
    description:
      "Our design team produces detailed 3D renders that bring your space to life before a single element is ordered. You see the full picture — materials, lighting, layout — and we refine until it is exactly right.",
    deliverables: [
      "3D renders",
      "Mood boards",
      "Spatial layouts",
      "Lighting concept",
    ],
  },
  {
    number: "04",
    phase: "Materials",
    title: "Material Selection",
    duration: "1-3 weeks",
    description:
      "We curate a considered palette of finishes, textures, and furnishings that align with the approved design. Every selection is reviewed for quality, durability, and aesthetic coherence.",
    deliverables: [
      "Material palette",
      "Finish schedule",
      "Furniture selection",
      "Sample approvals",
    ],
  },
  {
    number: "05",
    phase: "Execution",
    title: "Execution",
    duration: "Project dependent",
    description:
      "With approvals in place, our skilled team brings the design to life on-site. We coordinate all trades, monitor quality at every step, and keep you informed throughout the build.",
    deliverables: [
      "Site coordination",
      "Trade management",
      "Quality inspections",
      "Progress updates",
    ],
  },
  {
    number: "06",
    phase: "Handover",
    title: "Handover",
    duration: "1 week",
    description:
      "We conduct a final walkthrough, address any snags, and hand over a space that meets the highest standards. Your home is ready — refined, resolved, and entirely yours.",
    deliverables: [
      "Final inspection",
      "Snag resolution",
      "Project documentation",
      "Client handover",
    ],
  },
];

function TimelineCard({
  step,
  align = "left",
}: {
  step: (typeof steps)[number];
  align?: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group py-8 md:py-10 w-full ${align === "right" ? "md:text-right" : ""}`}
    >
      {/* Large step number */}
      <p className="font-sans text-6xl md:text-7xl font-light leading-none mb-6 text-black">
        {step.number}
      </p>

      <p className="label mb-3 !text-black">{step.phase}</p>

      <h3 className="font-sans text-2xl md:text-3xl font-light leading-snug mb-5 text-black">
        {step.title}
      </h3>

      <p
        className={`text-sm font-light leading-relaxed text-black max-w-sm ${align === "right" ? "md:ml-auto" : ""}`}
      >
        {step.description}
      </p>
    </motion.div>
  );
}

export default function ProcessTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { rootMargin: "-35% 0px -35% 0px" },
      );
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const progress = (activeIndex / (steps.length - 1)) * 100;

  return (
    <div className="relative">
      {/* Base line */}
      <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

      {/* Animated fill line */}
      <motion.div
        className="absolute left-5 md:left-1/2 top-0 w-px bg-charcoal md:-translate-x-px origin-top"
        animate={{ height: `${progress}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      {steps.map((step, index) => {
        const isEven = index % 2 === 0;
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;

        return (
          <article
            key={step.number}
            ref={(el) => {
              stepRefs.current[index] = el;
            }}
            className="relative grid grid-cols-[40px_1fr] md:grid-cols-[1fr_40px_1fr] gap-x-8 md:gap-x-12"
          >
            {/* Left column (desktop) */}
            <div className="hidden md:flex md:justify-start">
              {isEven && (
                <TimelineCard step={step} align="left" />
              )}
            </div>

            {/* Dot column */}
            <div className="relative z-10 flex flex-col items-center pt-10">
              <motion.div
                animate={{
                  width: isActive ? 44 : isPast ? 12 : 14,
                  height: isActive ? 44 : isPast ? 12 : 14,
                  backgroundColor: isActive
                    ? "var(--charcoal)"
                    : isPast
                      ? "var(--charcoal)"
                      : "var(--ivory)",
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-full shadow-[0_0_0_6px_var(--ivory)] ${
                  !isActive && !isPast ? "border border-charcoal/25" : ""
                }`}
              />
            </div>

            {/* Right column (desktop) / only column (mobile) */}
            <div className="min-w-0">
              {/* Mobile: always show */}
              <div className="md:hidden">
                <TimelineCard step={step} align="left" />
              </div>
              {/* Desktop: only odd steps on right */}
              {!isEven && (
                <div className="hidden md:flex md:justify-end">
                  <TimelineCard step={step} align="right" />
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
