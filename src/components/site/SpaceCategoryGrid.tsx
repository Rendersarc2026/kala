"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const SPACES = [
  {
    label: "Living Room",
    href: "/projects",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80&fit=crop",
  },
  {
    label: "Dining Room",
    href: "/projects",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=80&fit=crop",
  },
  {
    label: "Kitchen",
    href: "/projects",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80&fit=crop",
  },
  {
    label: "Bedroom",
    href: "/projects",
    image:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&q=80&fit=crop",
  },
  {
    label: "Workplace",
    href: "/projects",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80&fit=crop",
  },
  {
    label: "Hospitality",
    href: "/projects",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=80&fit=crop",
  },
];

export default function SpaceCategoryGrid() {
  return (
    <section id="spaces" className="py-24 md:py-36 bg-[var(--ivory-dark)]">
      <div className="max-w-7xl mx-auto px-8 md:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-14 md:mb-20"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--muted)] font-medium mb-4">
              Explore
            </p>
            <h2 className="font-sans text-4xl md:text-5xl font-light text-[var(--charcoal)]">
              By Space Type
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors duration-300"
          >
            All Spaces →
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
        >
          {SPACES.map(({ label, href, image }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              <Link
                href={href}
                className="group block relative aspect-[4/3] overflow-hidden bg-[var(--ivory)]"
              >
                <Image
                  src={image}
                  alt={label}
                  fill
                  sizes="(max-width:768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-5 pb-5">
                  <p className="font-sans text-[15px] font-light text-white tracking-wide">
                    {label}
                  </p>
                  <span className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 text-sm">
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
