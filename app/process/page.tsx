'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Consultation',
    description:
      'We align on your design vision, budget framework, and spatial preferences to map out the creative direction.',
    details:
      'An initial 90-minute deep-dive at your space or our studio. We discuss lifestyle requirements, aesthetic preferences, functional needs, and investment parameters. This forms the creative brief that guides the entire project.',
  },
  {
    number: '02',
    title: 'Contracting',
    description:
      'Formalizing spatial layouts, structural feasibility reports, architectural blueprints, and detailed timelines.',
    details:
      'Our architects produce measured drawings and structural assessments. We present 2–3 conceptual layouts, establish the final floor plan, and lock in a detailed project schedule with milestone dates.',
  },
  {
    number: '03',
    title: '3D Visualization',
    description:
      'Developing high-fidelity digital renderings so you can experience scale, volume, material transitions, and lighting.',
    details:
      'Photorealistic 3D walkthroughs let you experience every angle before construction begins. We refine lighting scenarios, material finishes, and furniture placement until every detail feels right.',
  },
  {
    number: '04',
    title: 'Material Selection',
    description:
      'Visiting galleries to touch and curate premium stones, organic fabrics, raw wood samples, and custom metal fixtures.',
    details:
      'Curated sourcing sessions at our material library and partner showrooms. We select natural stone slabs, timber species, upholstery textiles, paint finishes, hardware, and sanitary ware together.',
  },
  {
    number: '05',
    title: 'Execution',
    description:
      'Orchestrating our on-site craftsmen, stonemasons, and carpenters under daily design-led supervision.',
    details:
      'Our project manager coordinates daily with site supervisors. We maintain a live dashboard tracking procurement, labour progress, quality checks, and budget variance — updated every 48 hours.',
  },
  {
    number: '06',
    title: 'Handover',
    description:
      'Adding structural layers, curated styling details, and final cleanings before walking you into your ready-to-live home.',
    details:
      'The final walkthrough covers every integrated system, lighting zone, and joinery detail. We style the space with curated accessories, art placement, and soft furnishings before handing you the keys.',
  },
];

export default function ProcessPage() {
  const timelineRef = useRef<HTMLDivElement>(null);

  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const easeSmooth: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="w-full pt-28 pb-24 md:pb-36 bg-bone">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeLarge }}
          className="text-center"
        >
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold block mb-4">
            ◆ Working Method
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-charcoal font-light leading-[1.15] tracking-wide mb-6">
            The Path to Sanctuary
          </h1>
          <p className="font-sans text-sm md:text-base text-charcoal-light font-light max-w-2xl mx-auto leading-relaxed">
            From the first conversation to the final walkthrough, our six-phase
            design process ensures clarity, craftsmanship, and care at every
            step.
          </p>
        </motion.div>
      </section>

      {/* Vertical Timeline */}
      <section ref={timelineRef} className="relative max-w-5xl mx-auto px-6">
        {/* Vertical Progress Line */}
        <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-charcoal/10 rounded-full z-0" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 w-1 bg-gradient-to-b from-terracotta to-charcoal rounded-full z-10 origin-top"
        />

        <div className="relative z-20 space-y-24 md:space-y-36">
          {PROCESS_STEPS.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: easeSmooth }}
                className={`relative flex flex-col md:flex-row items-start gap-8 md:gap-16 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 z-30">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                      delay: 0.2,
                    }}
                    className="w-5 h-5 rounded-full border-2 border-terracotta bg-bone flex items-center justify-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-terracotta" />
                  </motion.div>
                </div>

                {/* Content */}
                <div
                  className={`pl-16 md:pl-0 md:w-[calc(50%-3rem)] ${
                    isEven ? 'md:text-left md:mr-auto' : 'md:text-right md:ml-auto'
                  }`}
                >
                  <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-terracotta font-semibold block mb-2">
                    Step {step.number}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-light tracking-wide mb-3">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-charcoal-light font-light leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <p className="font-sans text-[11px] text-charcoal/60 font-light leading-relaxed">
                    {step.details}
                  </p>
                </div>

                {/* Spacer for the other side on desktop */}
                <div className="hidden md:block md:w-[calc(50%-3rem)]" />
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
