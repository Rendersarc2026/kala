"use client";

import { motion } from "framer-motion";

export default function EditorialStatement() {
  return (
    <section className="py-28 md:py-44 bg-[var(--ivory)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 md:px-14 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.25em] text-[var(--muted)] font-medium mb-10"
        >
          Our Philosophy
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-sans font-light text-[var(--charcoal)] leading-[1.1] max-w-5xl mx-auto"
          style={{ fontSize: "clamp(2.2rem, 4.5vw, 5rem)" }}
        >
          The <span className="text-[var(--terracotta)]">✦</span> Art of
          Timeless Space — A{" "}
          <em className="not-italic" style={{ fontStyle: "italic" }}>
            Contemporary
          </em>{" "}
          Studio Designing Homes For The Modern Human{" "}
          <span className="text-[var(--terracotta)]">✦</span>
        </motion.h2>
      </div>
    </section>
  );
}
