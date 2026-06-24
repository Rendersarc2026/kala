"use client";

import { motion } from "framer-motion";
import { Compass, Users, Clock } from "lucide-react";

const FEATURES = [
  {
    Icon: Compass,
    title: "Unique & Bespoke Design",
    desc: "Every project is crafted uniquely to your vision and lifestyle — no two spaces alike.",
  },
  {
    Icon: Users,
    title: "Expertly Skilled Team",
    desc: "We partner with highly skilled artisans, builders, and craftspeople on every project.",
  },
  {
    Icon: Clock,
    title: "Delivered On Time",
    desc: "Rigorous project management ensures milestones and handover deadlines are always met.",
  },
];

export default function FeaturesStrip() {
  return (
    <section className="bg-[var(--ivory-dark)] border-t border-b border-[var(--charcoal)]/8">
      <div className="max-w-7xl mx-auto px-8 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--charcoal)]/10">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="flex items-start gap-5 py-10 md:px-10 first:md:pl-0 last:md:pr-0"
            >
              {/* Icon box */}
              <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center border border-[var(--charcoal)]/15 text-[var(--terracotta)]">
                <Icon size={19} strokeWidth={1.3} />
              </div>

              <div>
                <h3 className="font-sans text-[15px] font-medium text-[var(--charcoal)] mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-sm font-light text-[var(--muted)] leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
