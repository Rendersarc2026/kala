"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface SlideData {
  id: string;
  label: string;
  heading: string;
  buttonText: string;
  backgroundImageUrl: string;
  slideOrder: number;
}

interface HeroProps {
  slides: SlideData[];
}

export default function Hero({ slides }: HeroProps) {
  const [current, setCurrent] = useState(0);

  // Auto play slideshow every 6s
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) {
    return (
      <section id="hero" className="relative h-screen w-full flex items-center justify-center bg-black">
        <p className="text-white/50 tracking-widest text-sm">NO HERO CONTENT</p>
      </section>
    );
  }

  const currentSlide = slides[current];

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={currentSlide.backgroundImageUrl}
            alt={currentSlide.heading}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Text Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
              exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
            }}
            className="max-w-4xl"
          >
            {/* Top Label */}
            <motion.div
              variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
              }}
              className="flex items-center space-x-4 mb-6"
            >
              <div className="w-8 h-[1px] bg-white/60" />
              <p className="text-xs tracking-widest font-semibold text-white/80 uppercase">
                {currentSlide.label}
              </p>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              }}
              className="text-4xl md:text-7xl font-light tracking-tight text-white mb-8 leading-[1.1] md:leading-[1.05]"
            >
              {currentSlide.heading}
            </motion.h1>

            {/* Button */}
            <motion.div
              variants={{
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
              }}
            >
              <a
                href="#showcase"
                className="inline-block px-8 py-3.5 border border-white text-xs tracking-widest text-white hover:bg-white hover:text-black transition-colors duration-500 font-medium"
              >
                {currentSlide.buttonText}
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Vertical Slider Navigation / Indicators */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-6">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(idx)}
            className="group flex items-center focus:outline-none"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span
              className={`text-xs font-mono tracking-widest transition-all duration-300 ${
                current === idx
                  ? "text-white scale-110 font-bold"
                  : "text-white/40 group-hover:text-white/70"
              }`}
            >
              {`0${idx + 1}`}
            </span>
            <span
              className={`ml-2 w-1.5 h-1.5 rounded-full border border-white transition-all duration-300 ${
                current === idx ? "bg-white scale-125" : "bg-transparent group-hover:bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Visual Bottom Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <span className="text-[10px] tracking-[0.25em] text-white/40 mb-2">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-[1px] h-8 bg-white/30"
        />
      </div>
    </section>
  );
}
