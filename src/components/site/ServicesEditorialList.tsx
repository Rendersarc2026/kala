"use client";

import { motion } from "framer-motion";

interface ServiceData {
  id: string;
  iconName: string;
  title: string;
  description: string;
  sortOrder: number;
}

interface ServicesEditorialListProps {
  services: ServiceData[];
}

const NUMS = ["01", "02", "03", "04", "05", "06", "07", "08"];

const FALLBACK_SERVICES = [
  "Residential Architecture",
  "Interior Design",
  "Commercial Spaces",
  "Landscape & Outdoor",
  "Project Management",
  "Design Consultancy",
];

export default function ServicesEditorialList({
  services,
}: ServicesEditorialListProps) {
  const sorted = [...services].sort((a, b) => a.sortOrder - b.sortOrder);
  const items =
    sorted.length > 0 ? sorted.map((s) => s.title) : FALLBACK_SERVICES;

  return (
    <section
      id="services-list"
      className="py-24 md:py-36 bg-[var(--ivory-dark)]"
    >
      <div className="max-w-5xl mx-auto px-8 md:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--muted)] font-medium mb-5">
            Our Expertise
          </p>
          <h2 className="font-sans text-4xl md:text-5xl font-light text-[var(--charcoal)]">
            What We Offer
          </h2>
        </motion.div>

        {/* Editorial list */}
        <div>
          {items.map((title, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className="group flex items-center justify-between py-5 md:py-6 cursor-default hover:pl-4 transition-all duration-300">
                <div className="flex items-center gap-8 md:gap-14">
                  <span className="tabular-nums text-[11px] text-[var(--muted)] font-medium w-5">
                    {NUMS[i] ?? String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-sans text-xl md:text-3xl font-light text-[var(--charcoal)] group-hover:text-[var(--terracotta)] transition-colors duration-300">
                    {title}
                  </h3>
                </div>
                <span className="text-[var(--muted)] group-hover:text-[var(--charcoal)] group-hover:translate-x-1 transition-all duration-300 text-base">
                  →
                </span>
              </div>
              {i < items.length - 1 && (
                <div className="h-px bg-[var(--charcoal)]/10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
