"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AnimatedListItem from "@/components/AnimatedListItem";
import { motion } from "framer-motion";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string[];
  sortOrder: number;
}

interface ServicesClientProps {
  initialServices: ServiceItem[];
}

export default function ServicesClient({ initialServices }: ServicesClientProps) {
  const services = initialServices;
  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="w-full pt-28 pb-24 md:pb-36 bg-studio-gray">
      {/* Intro Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeLarge }}
          className="mb-8"
        >
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold">
            Capabilities
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: easeLarge }}
          className="max-w-4xl"
        >
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal font-light leading-[1.15] tracking-wide">
            Our Services
          </h1>
          <p className="font-sans text-sm sm:text-base text-charcoal-muted max-w-2xl mt-6 font-light leading-relaxed">
            We provide full-service interior architecture and procurement. From conceptual sketches to site handovers, we align layout coordination and tactile finishes to create balanced, quiet environments.
          </p>
        </motion.div>
      </section>

      {/* Alternating Service Rows */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-32 md:space-y-48">
        {services.map((service, idx) => {
          const numeral = `0${idx + 1}`;

          return (
            <AnimatedListItem
              key={service.id}
              index={idx}
              image={service.image}
              numeral={numeral}
              heading={service.title}
              description={service.description}
              hideBigNumeral={true}
            >
              {/* Deliverables List */}
              <div className="pt-4 border-t border-charcoal/5">
                <h4 className="font-sans text-[10px] tracking-wider uppercase font-bold text-charcoal-light mb-4">
                  Deliverables Include
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  {service.details.map((detail, dIdx) => (
                    <li
                      key={dIdx}
                      className="font-sans text-xs text-charcoal-muted font-light flex items-start space-x-2"
                    >
                      <span className="text-terracotta select-none mt-0.5">&bull;</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/contact"
                  className="group inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-sans font-semibold text-charcoal hover:text-terracotta transition-colors duration-300"
                >
                  <span>Request consultation</span>
                  <ArrowUpRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
                </Link>
              </div>
            </AnimatedListItem>
          );
        })}
      </section>
    </div>
  );
}
