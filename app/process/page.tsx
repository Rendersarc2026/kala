'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

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

function TimelineNode({ 
  idx, 
  scrollYProgress 
}: { 
  idx: number; 
  scrollYProgress: MotionValue<number>; 
}) {
  const totalSteps = 6;
  const p_idx = 0.08 + idx * (0.9 - 0.08) / (totalSteps - 1);
  
  // Dynamic scale: scales up when scroll reaches it
  const scale = useTransform(
    scrollYProgress,
    [p_idx - 0.06, p_idx],
    [1, 3.5]
  );

  return (
    <motion.div
      style={{ scale }}
      className="w-4 h-4 rounded-full bg-charcoal border-2 border-charcoal z-30 transition-shadow duration-300 shadow-sm"
    />
  );
}

function TimelineContent({
  idx,
  scrollYProgress,
  children,
  className,
}: {
  idx: number;
  scrollYProgress: MotionValue<number>;
  children: React.ReactNode;
  className: string;
}) {
  const totalSteps = 6;
  const p_idx = 0.08 + idx * (0.9 - 0.08) / (totalSteps - 1);
  const isEven = idx % 2 === 0;

  // Move towards the edge of the screen slightly:
  // - Even steps move to the left (-25px)
  // - Odd steps move to the right (25px)
  const targetX = isEven ? -25 : 25;

  // Shifts outward and stays shifted on scroll down
  const x = useTransform(
    scrollYProgress,
    [p_idx - 0.12, p_idx],
    [0, targetX]
  );

  // Scales up and stays scaled up on scroll down
  const scale = useTransform(
    scrollYProgress,
    [p_idx - 0.12, p_idx],
    [1, 1.08]
  );

  return (
    <motion.div style={{ x, scale }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ProcessPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const easeSmooth: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  const { scrollYProgress } = useScroll();
  const lineHeight = useTransform(scrollYProgress, [0.08, 0.9], ['0%', '100%']);

  return (
    <div className="w-full pt-28 pb-24 md:pb-36 bg-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeLarge }}
          className="text-center"
        >
          <h1 className="font-serif text-4xl md:text-6xl text-charcoal font-light leading-[1.15] tracking-wide mb-6">
            Our Process
          </h1>
        </motion.div>
      </section>

      {/* Vertical Timeline */}
      <section ref={timelineRef} className="relative max-w-5xl mx-auto px-6">
        {/* Vertical Progress Line (only visible on desktop center) */}
        <div className="absolute hidden lg:block lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-1 bg-charcoal/10 rounded-full z-0" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute hidden lg:block lg:left-1/2 lg:-translate-x-1/2 top-0 w-1 bg-charcoal rounded-full z-10 origin-top"
        />

        <div className="relative z-20 space-y-24 md:space-y-36">
          {PROCESS_STEPS.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className="relative w-full">
                
                {/* 1. MOBILE & TABLET LAYOUT (block lg:hidden) */}
                <div className="block lg:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: easeSmooth }}
                    className="relative flex flex-col items-start pl-0"
                  >
                    <span className="font-sans text-sm tracking-[0.25em] uppercase text-terracotta font-bold block mb-2">
                      Step {step.number}
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-wide mb-4">
                      {step.title}
                    </h3>
                    <p className="font-sans text-base text-charcoal-light font-light leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <p className="font-sans text-sm text-charcoal/60 font-light leading-relaxed">
                      {step.details}
                    </p>
                  </motion.div>
                </div>

                {/* 2. DESKTOP TIMELINE LAYOUT (hidden lg:block) */}
                <div className="hidden lg:block">
                  {/* Timeline Node - centered horizontally and vertically */}
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-30">
                    <TimelineNode idx={idx} scrollYProgress={scrollYProgress} />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: easeSmooth }}
                    className={`relative flex flex-row items-start gap-16 ${
                      isEven ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <TimelineContent
                      idx={idx}
                      scrollYProgress={scrollYProgress}
                      className={`w-[calc(50%-3rem)] ${
                        isEven ? 'text-left mr-auto' : 'text-right ml-auto'
                      }`}
                    >
                      <span className="font-sans text-sm tracking-[0.25em] uppercase text-terracotta font-bold block mb-2">
                        Step {step.number}
                      </span>
                      <h3 className="font-serif text-5xl text-charcoal font-light tracking-wide mb-4">
                        {step.title}
                      </h3>
                      <p className="font-sans text-lg text-charcoal-light font-light leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <p className="font-sans text-base text-charcoal/60 font-light leading-relaxed">
                        {step.details}
                      </p>
                    </TimelineContent>

                    {/* Spacer for the other side */}
                    <div className="w-[calc(50%-3rem)]" />
                  </motion.div>
                </div>

              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
