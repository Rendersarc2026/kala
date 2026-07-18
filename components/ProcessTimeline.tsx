"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  details: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

function TimelineNode({
  idx,
  scrollYProgress,
  totalSteps,
}: {
  idx: number;
  scrollYProgress: MotionValue<number>;
  totalSteps: number;
}) {
  const p_idx = totalSteps > 1 ? idx / (totalSteps - 1) : 0.5;

  const scale = useTransform(
    scrollYProgress,
    [Math.max(0, p_idx - 0.06), p_idx],
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
  totalSteps,
}: {
  idx: number;
  scrollYProgress: MotionValue<number>;
  children: React.ReactNode;
  className: string;
  totalSteps: number;
}) {
  const p_idx = totalSteps > 1 ? idx / (totalSteps - 1) : 0.5;
  const isEven = idx % 2 === 0;

  const targetX = isEven ? -25 : 25;

  const x = useTransform(
    scrollYProgress,
    [Math.max(0, p_idx - 0.12), p_idx],
    [0, targetX]
  );

  const scale = useTransform(
    scrollYProgress,
    [Math.max(0, p_idx - 0.12), p_idx],
    [1, 1.08]
  );

  return (
    <motion.div style={{ x, scale }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const easeSmooth: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="w-full pt-28 pb-24 md:pb-36 bg-studio-gray">
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
        <div className="absolute hidden lg:block lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-1 bg-bone/10 rounded-full z-0" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute hidden lg:block lg:left-1/2 lg:-translate-x-1/2 top-0 w-1 bg-bone rounded-full z-10 origin-top"
        />

        <div className="relative z-20 space-y-24 md:space-y-36">
          {steps.length === 0 ? (
            <div className="flex justify-center py-20 opacity-50">
              <span className="font-sans text-xs tracking-[0.25em] uppercase text-charcoal font-bold">
                No Process Steps Found
              </span>
            </div>
          ) : (
            steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={step.id || idx} className="relative w-full">
                  {/* 1. MOBILE & TABLET LAYOUT (block lg:hidden) */}
                  <div className="block lg:hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8, ease: easeSmooth }}
                      className="relative flex flex-col items-start pl-0"
                    >
                      <span className="font-sans text-sm tracking-[0.25em] uppercase text-terracotta font-bold block mb-2">
                        Step {String(idx + 1).padStart(2, "0")}
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
                      <TimelineNode
                        idx={idx}
                        scrollYProgress={scrollYProgress}
                        totalSteps={steps.length}
                      />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8, ease: easeSmooth }}
                      className={`relative flex flex-row items-start gap-16 ${
                        isEven ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {/* Content */}
                      <TimelineContent
                        idx={idx}
                        scrollYProgress={scrollYProgress}
                        totalSteps={steps.length}
                        className={`w-[calc(50%-3rem)] ${
                          isEven ? "text-left mr-auto" : "text-right ml-auto"
                        }`}
                      >
                        <span className="font-sans text-sm tracking-[0.25em] uppercase text-terracotta font-bold block mb-2">
                          Step {String(idx + 1).padStart(2, "0")}
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
            })
          )}
        </div>
      </section>
    </div>
  );
}
