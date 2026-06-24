"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const INTERVAL_MS = 5000;

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
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideCount = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % slideCount) + slideCount) % slideCount);
      setProgressKey((k) => k + 1);
    },
    [slideCount],
  );

  /* Auto-advance every 5 s */
  useEffect(() => {
    if (slideCount <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slideCount);
      setProgressKey((k) => k + 1);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slideCount, progressKey]);

  useEffect(() => {
    if (current >= slideCount) setCurrent(0);
  }, [current, slideCount]);

  if (slideCount === 0) {
    return (
      <section
        id="hero"
        className="relative h-screen w-full flex items-center justify-center bg-ivory-dark"
      >
        <p className="font-sans text-4xl text-charcoal/25 font-light">
          no hero content
        </p>
      </section>
    );
  }

  const currentSlide = slides[current] ?? slides[0];

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-charcoal"
    >
      {/* Slideshow — Ken Burns crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={currentSlide.backgroundImageUrl}
            alt={currentSlide.heading}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Left / Right arrows */}
      {slideCount > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Previous slide"
            className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-20
                       text-white/50 hover:text-white transition-colors duration-200"
          >
            <ChevronLeft size={56} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            aria-label="Next slide"
            className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-20
                       text-white/50 hover:text-white transition-colors duration-200"
          >
            <ChevronRight size={56} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Dot + progress bar indicators */}
      {slideCount > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative h-[2px] overflow-hidden rounded-full transition-all duration-300"
              style={{ width: i === current ? 40 : 16 }}
            >
              {/* Track */}
              <span className="absolute inset-0 bg-white/30" />
              {/* Fill */}
              {i === current ? (
                <motion.span
                  key={progressKey}
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: INTERVAL_MS / 1000, ease: "linear" }}
                />
              ) : (
                <span
                  className={`absolute inset-0 ${i < current ? "bg-white" : "bg-white/0"}`}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
