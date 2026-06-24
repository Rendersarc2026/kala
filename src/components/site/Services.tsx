"use client";

import { motion } from "framer-motion";

interface ServiceData {
  id: string;
  iconName: string;
  title: string;
  description: string;
  sortOrder: number;
}

interface ServicesProps {
  services: ServiceData[];
}

const rowVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const numberVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.09 + 0.2, ease: "easeOut" as const },
  }),
};

export default function Services({ services }: ServicesProps) {
  const sortedServices = [...services].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return (
    <section id="services" className="py-28 md:py-40 bg-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 md:px-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
          <div className="overflow-hidden">
            <motion.p
              className="label mb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              What We Do
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                className="font-sans text-4xl md:text-6xl font-light text-charcoal leading-tight"
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                Studio Services
              </motion.h2>
            </div>
          </div>
          <motion.p
            className="text-sm text-charcoal-light font-sans font-light max-w-xs leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            A rigorous conceptual process applied to architecture, interiors,
            and experiential spaces.
          </motion.p>
        </div>

        {/* Services list */}
        <div className="border-t border-border">
          {sortedServices.map((service, i) => (
            <motion.div
              key={service.id}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative grid grid-cols-12 gap-4 md:gap-10 py-8 md:py-10
                         border-b border-border cursor-default"
            >
              {/* Hover fill — slides in from left */}
              <span
                className="pointer-events-none absolute inset-0 bg-ivory-dark
                           scale-x-0 origin-left group-hover:scale-x-100
                           transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                           -z-0 rounded-sm"
              />

              {/* Number */}
              <motion.span
                custom={i}
                variants={numberVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative col-span-2 md:col-span-1 font-sans text-[11px]
                           tracking-widest text-terracotta font-medium pt-1 z-10"
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>

              {/* Title */}
              <div className="relative col-span-10 md:col-span-3 z-10">
                <h3
                  className="font-sans text-xl md:text-2xl font-light text-charcoal
                               group-hover:text-terracotta transition-colors duration-400"
                >
                  {service.title}
                </h3>
                {/* Underline draw on hover */}
                <span
                  className="block h-px bg-terracotta mt-2
                             scale-x-0 origin-left group-hover:scale-x-100
                             transition-transform duration-500 delay-100
                             ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>

              {/* Description — desktop */}
              <p
                className="relative hidden md:block md:col-span-7 md:col-start-5 text-sm
                           text-charcoal-light font-sans font-light leading-relaxed z-10
                           translate-x-0 group-hover:translate-x-2
                           transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                {service.description}
              </p>

              {/* Description — mobile */}
              <p
                className="relative col-span-12 md:hidden text-sm text-charcoal-light
                            font-sans font-light leading-relaxed mt-1 z-10"
              >
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
