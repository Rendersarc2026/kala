'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/types';

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 10000);
    return () => clearInterval(timer);
  }, [activeIndex, testimonials.length]);

  const activeTestimonial = testimonials[activeIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-6">
      {/* Editorial layout container */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[350px]">
        {/* Quote details */}
        <div className="lg:col-span-8 space-y-6">
          <Quote className="h-10 w-10 text-terracotta/40 stroke-[1px]" />
          
          <div className="relative overflow-hidden min-h-[160px] flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <blockquote className="font-serif text-xl md:text-2xl italic text-charcoal leading-relaxed font-light">
                  &ldquo;{activeTestimonial.quote}&rdquo;
                </blockquote>
                
                <div className="mt-8 flex flex-col space-y-1">
                  <cite className="font-sans text-sm font-semibold text-charcoal not-italic">
                    {activeTestimonial.clientName}
                  </cite>
                  <span className="font-sans text-xs text-charcoal-light uppercase tracking-wider">
                    {activeTestimonial.location} &bull; {activeTestimonial.projectType}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Optional Image */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="relative w-40 h-40 md:w-52 md:h-52 overflow-hidden bg-bone-dark grayscale hover:grayscale-0 transition-all duration-700">
            {activeTestimonial.image ? (
              <Image
                src={activeTestimonial.image}
                alt={activeTestimonial.clientName}
                fill
                sizes="(max-width: 768px) 160px, 208px"
                className="object-cover"
                onError={(e) => {
                  // Fallback to stylized placeholder if image load fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              // Stylized visual placeholder with client initials if image doesn't exist
              <div className="w-full h-full flex items-center justify-center bg-bone-dark border border-charcoal/5">
                <span className="font-serif text-3xl text-charcoal-light tracking-wider uppercase">
                  {activeTestimonial.clientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            <div className="absolute inset-0 border border-charcoal/5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-12 flex justify-between items-center border-t border-charcoal/5 pt-6">
        {/* Pagination Dots */}
        <div className="flex space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > activeIndex ? 1 : -1);
                setActiveIndex(idx);
              }}
              className={`h-[3px] transition-all duration-500 ease-out ${
                idx === activeIndex ? 'w-8 bg-terracotta' : 'w-3 bg-charcoal/15 hover:bg-charcoal/30'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex space-x-6">
          <button
            onClick={handlePrev}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest font-sans text-charcoal hover:text-terracotta transition-colors duration-300 font-medium"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </button>
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest font-sans text-charcoal hover:text-terracotta transition-colors duration-300 font-medium"
            aria-label="Next testimonial"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
