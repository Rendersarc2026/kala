"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { projects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import ProjectCard from "@/components/ProjectCard";
import TestimonialSlider from "@/components/TestimonialSlider";
import InteractiveStage from "@/components/InteractiveStage";

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

  const [activeSlide, setActiveSlide] = React.useState(0);

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;
    // Calculation accounts for card width (approx 82vw) + gap (6 / 24px)
    const index = Math.round(scrollLeft / (clientWidth * 0.8));
    if (index >= 0 && index < featuredProjects.length) {
      setActiveSlide(index);
    }
  };

  // Easing curves
  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // Scroll animations for hero framing effect
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 600], [1, 0.94]);

  const borderRadius = useTransform(scrollY, [0, 600], [0, 32]); // from square to rounded-3xl
  const opacity = useTransform(scrollY, [0, 450], [1, 0]);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <div className="relative h-screen w-full bg-white overflow-hidden">
        <motion.section
          className="relative w-full h-full flex items-end justify-center overflow-hidden bg-charcoal"
        >
          <Image
            src="/interior/wallpaperflare.com_wallpaper (1).jpg"
            alt="Luxury living space design by KALA"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Hero Content */}
          <motion.div
            style={{ opacity }}
            className="relative z-20 w-full max-w-none px-6 md:px-12 pb-12 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 text-left pointer-events-auto"
          >
            {/* Left Column: Headline, Subheading, Avatars */}
            <div className="flex flex-col max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeLarge }}
                className="font-sans text-xs uppercase tracking-[0.4em] text-white/90 mb-4"
                style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)" }}
              >
                Kala Interior Architecture
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: easeLarge }}
                className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-light leading-[1.1] tracking-wide"
                style={{
                  textShadow:
                    "0 2px 10px rgba(0, 0, 0, 0.6), 0 4px 20px rgba(0, 0, 0, 0.4)",
                }}
              >
                Architectural purity. Sensory warmth.
              </motion.h1>
            </div>

            {/* Right Column: Paragraph, Buttons */}
            <div className="flex flex-col max-w-md">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: easeLarge }}
                className="font-sans text-sm sm:text-base text-white/90 font-light tracking-wide leading-relaxed mb-6"
                style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)" }}
              >
                We sculpt premium residential, commercial, and hospitality
                interiors that age gracefully.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: easeLarge }}
                className="flex flex-wrap gap-4 items-center"
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.25)]"
                >
                  <span>Explore Projects</span>
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    &rarr;
                  </span>
                </Link>
               
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* 2. ABOUT TEASER (Centered layout matching screenshot) */}
      <section className="py-24 md:py-36 bg-white overflow-hidden border-b border-charcoal/5">
        <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Subtitle with Diamond */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeLarge }}
            className="mb-6"
          >
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal-muted font-bold inline-flex items-center gap-2">
              <span className="text-[7px]">◆</span> About Kala Studio
            </span>
          </motion.div>

          {/* Centered Large Headline */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.2] font-light max-w-5xl tracking-tight">
            <motion.span
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="inline-flex flex-wrap justify-center"
              style={{ gap: "0.25em 0" }}
            >
              {"We sculpt tactile, honest spaces focused on tectonic integrity and sensory warmth. Trusted by clients who demand precision, beauty, and care."
                .split(" ")
                .map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.04,
                      ease: easeLarge,
                    }}
                    className="inline-block"
                    style={{ marginRight: "0.25em" }}
                  >
                    {word}
                  </motion.span>
                ))}
            </motion.span>
          </h2>

          {/* Centered CTA Button */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeLarge }}
            className="mt-10"
          >
            <Link
              href="/about"
              className="border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 px-7 py-3.5 font-sans text-[10px] uppercase tracking-[0.25em] font-bold flex items-center gap-2"
            >
              <span>↳</span>
              <span>Who We Are</span>
            </Link>
          </motion.div> */}
        </div>
      </section>

      {/* 3. FEATURED PROJECTS (Asymmetric Grid) */}
      <section className="py-24 md:py-32 bg-white border-t border-charcoal/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeLarge }}
            >
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light font-semibold block mb-3">
                ◆ Selected Works
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light tracking-wide">
                Featured Projects
              </h2>
            </motion.div>
          </div>

          {/* Symmetric Desktop Layout */}
          <div className="hidden md:grid grid-cols-2 gap-x-16 gap-y-24">
            {featuredProjects.map((project, idx) => {
              return (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.8,
                    delay: (idx % 2) * 0.1,
                    ease: easeLarge,
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              );
            })}
          </div>

          {/* Premium Mobile Horizontal Snap Slider */}
          <div className="md:hidden flex flex-col w-full">
            <div 
              onScroll={handleMobileScroll}
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 -mx-6 px-6 pb-2"
            >
              {featuredProjects.map((project) => (
                <div
                  key={project.slug}
                  className="flex-none w-[82vw] snap-center"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
            {/* Pagination Indicators */}
            <div className="flex justify-center items-center space-x-2 mt-4">
              {featuredProjects.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? "w-6 bg-brass" : "w-1.5 bg-bone-dark"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeLarge }}
            className="mt-20 md:mt-28 text-center"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center justify-center space-x-2 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white px-8 py-4 transition-all duration-300 font-sans text-[10px] uppercase tracking-widest font-bold"
            >
              <span>Explore all works</span>
              <ArrowUpRight className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 text-charcoal group-hover:text-white" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. PROCESS SECTION */}
      <InteractiveStage />

      {/* 6. TESTIMONIALS */}
      <section className="py-24 md:py-36 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeLarge }}
            className="mb-12"
          >
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold block mb-3">
              Client Valuations
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light tracking-wide">
              Project Testimonials
            </h2>
          </motion.div>

          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* 7. CLOSING CTA (Full-bleed) */}
      <section className="relative h-[65vh] w-full flex items-center justify-center overflow-hidden bg-charcoal">
        <Image
          src="/interior/wallpaperflare.com_wallpaper (2).jpg"
          alt="Minimalist design interior by KALA"
          fill
          className="object-cover opacity-60 object-center grayscale"
        />
        <div className="absolute inset-0 bg-charcoal/45 z-10" />

        <div className="relative z-20 text-center px-6 max-w-2xl flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeLarge }}
            className="font-serif text-3xl sm:text-5xl text-white font-light leading-tight tracking-wide mb-6"
          >
            Let&apos;s design your space.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeLarge }}
            className="font-sans text-xs sm:text-sm text-white/70 font-light mb-10 max-w-md leading-relaxed tracking-wider"
          >
            Whether a residential estate, bespoke office, or commercial gallery,
            let&apos;s shape a tactile, human environment together.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeLarge }}
          >
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center border border-white text-white hover:bg-white hover:text-charcoal px-8 py-4 transition-all duration-500 rounded-none font-sans text-xs uppercase tracking-widest font-semibold"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300 text-white group-hover:text-charcoal" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
