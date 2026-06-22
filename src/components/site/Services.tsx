"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

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

// Dynamically render icon component based on name
function ServiceIcon({ name }: { name: string }) {
  // Safe lookup: fallback to HelpCircle if not found
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name] || LucideIcons.HelpCircle;
  return <IconComponent size={32} className="stroke-[1.2] text-white/80" />;
}

export default function Services({ services }: ServicesProps) {
  // Sort services by sortOrder
  const sortedServices = [...services].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="services" className="py-24 md:py-36 bg-[#0f0f0f] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-8 h-[1px] bg-white/40" />
              <span className="text-xs tracking-widest font-semibold text-white/50 uppercase">
                WHAT WE DO
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase">
              STUDIO SERVICES & DESIGN FOCUS
            </h2>
          </div>
          <p className="text-white/40 text-xs tracking-widest max-w-xs font-light leading-relaxed">
            WE BRING A RIGOROUS CONCEPTUAL PROCESS TO ARCHITECTURE, INTERIORS, AND EXPERIENTIAL SPACES.
          </p>
        </div>

        {/* 4-Column Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {sortedServices.map((service) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="group p-8 bg-black/40 border border-white/5 hover:border-white/15 transition-all duration-500 flex flex-col h-full rounded-none"
            >
              {/* Icon Container */}
              <div className="mb-8 p-3 w-fit bg-white/[0.03] group-hover:bg-white/[0.08] transition-colors duration-500 rounded-none">
                <ServiceIcon name={service.iconName} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-normal tracking-wide text-white mb-4 uppercase">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/50 font-light leading-relaxed mt-auto">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
