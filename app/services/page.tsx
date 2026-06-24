'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { services } from '@/data/services';
import { ArrowUpRight } from 'lucide-react';

export default function Services() {
  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="w-full pt-28 pb-24 md:pb-36 bg-bone">
      {/* Intro Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 md:mb-32">
        <div className="mb-8">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold">
            Capabilities
          </span>
        </div>

        <div className="max-w-4xl">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal font-light leading-[1.15] tracking-wide">
            Our Services
          </h1>
          <p className="font-sans text-sm sm:text-base text-charcoal-muted max-w-2xl mt-6 font-light leading-relaxed">
            We provide full-service interior architecture and procurement. From conceptual sketches to site handovers, we align layout coordination and tactile finishes to create balanced, quiet environments.
          </p>
        </div>
      </section>

      {/* Alternating Service Rows */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-32 md:space-y-48">
        {services.map((service, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={service.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center`}
            >
              {/* Image Block */}
              <div
                className={`col-span-1 lg:col-span-6 relative aspect-[4/3] w-full overflow-hidden bg-bone-dark shadow-sm ${
                  isEven ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
              </div>

              {/* Text Block */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: easeLarge }}
                className={`col-span-1 lg:col-span-6 space-y-6 ${
                  isEven ? 'lg:order-2 lg:pl-8' : 'lg:order-1 lg:pr-8'
                }`}
              >
                <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal-light font-bold">
                  0{idx + 1} &bull; Service Detail
                </span>
                
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-charcoal font-light tracking-wide leading-tight">
                  {service.title}
                </h2>
                
                <p className="font-sans text-sm text-charcoal-muted font-light leading-relaxed">
                  {service.description}
                </p>

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
              </motion.div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
