"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { projects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import ProjectCard from "@/components/ProjectCard";
import TestimonialSlider from "@/components/TestimonialSlider";

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

  const processSectionRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  // Mouse coordinates for Process section hover arrow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor follow lag (premium editorial feel)
  const springConfig = { damping: 30, stiffness: 250, mass: 0.6 };
  const arrowX = useSpring(mouseX, springConfig);
  const arrowY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (processSectionRef.current) {
      const rect = processSectionRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
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
      {/* 1. HERO SECTION (Shrink on scroll animation) */}
      <div className="relative h-screen w-full bg-white overflow-hidden">
        <motion.section
          style={{ scale, borderRadius }}
          className="relative w-full h-full flex items-center justify-center overflow-hidden bg-charcoal origin-top"
        >
          <Image
            src="/interior/wallpaperflare.com_wallpaper (1).jpg"
            alt="Luxury living space design by KALA"
            fill
            priority
            className="object-cover opacity-75 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-charcoal/30 z-10" />

          {/* Hero Content */}
          <motion.div
            style={{ opacity }}
            className="relative z-20 text-center max-w-4xl px-6 flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeLarge }}
              className="font-sans text-xs uppercase tracking-[0.4em] text-white/60 mb-6"
            >
              Kala Interior Architecture
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: easeLarge }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-light leading-[1.1] tracking-wide"
            >
              Architectural purity.
              <br className="hidden sm:inline" />
              Sensory warmth.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: easeLarge }}
              className="font-sans text-sm sm:text-base text-white/70 max-w-md mt-8 font-light tracking-wide leading-relaxed"
            >
              We sculpt premium residential, commercial, and hospitality
              interiors that age gracefully.
            </motion.p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            style={{ opacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2"
          >
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/50 font-light">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-10 w-[1px] bg-white/30"
            />
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
              {"We sculpt tactile, honest spaces focused on tectonic integrity and sensory warmth. Trusted by clients who demand precision, beauty, and care.".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: easeLarge }}
                  className="inline-block"
                  style={{ marginRight: "0.25em" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          </h2>

          {/* Centered CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeLarge }}
            className="mt-10"
          >
            <Link
              href="/about"
              className="bg-charcoal text-white hover:bg-neutral-800 transition-colors duration-300 px-7 py-3.5 font-sans text-[10px] uppercase tracking-[0.25em] font-bold flex items-center gap-2"
            >
              <span>↳</span>
              <span>Who We Are</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURED PROJECTS (Asymmetric Grid) */}
      <section className="py-24 md:py-32 bg-white border-t border-b border-charcoal/5 overflow-hidden">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 md:gap-y-24">
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
                  className=""
                >
                  <ProjectCard project={project} />
                </motion.div>
              );
            })}
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
              className="group inline-flex items-center justify-center space-x-2 bg-charcoal text-white hover:bg-neutral-800 px-8 py-4 transition-all duration-300 font-sans text-[10px] uppercase tracking-widest font-bold"
            >
              <span>Explore all works</span>
              <ArrowUpRight className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 text-white" />
            </Link>
          </motion.div>
        </div>
      </section>



      {/* 5. PROCESS SECTION */}
      <Link href="/process" className="block relative w-full group cursor-pointer">
        <section 
          ref={processSectionRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative bg-white border-t border-b border-charcoal/5 overflow-hidden w-full cursor-none"
          style={{ height: "100vh", minHeight: "100vh" }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full overflow-hidden bg-bone">
              <div className="relative w-full h-full">
                <Image
                  src="/interior/wallpaperflare.com_wallpaper (3).jpg"
                  alt="The Path to Sanctuary"
                  fill
                  className="object-cover object-center"
                />
                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-charcoal/30 z-10 transition-colors duration-500 group-hover:bg-charcoal/45" />
              </div>
            </div>
          </div>

          {/* Centered Heading */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: easeLarge }}
              className="flex flex-col items-center text-center"
            >
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/60 font-semibold block mb-3.5">
                ◆ Workspace Method
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-light tracking-wide leading-tight max-w-4xl drop-shadow-md">
                Explore Our Process
              </h2>
            </motion.div>
          </div>

          {/* Big Arrow Hover Overlay following cursor (Restored) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                style={{
                  x: arrowX,
                  y: arrowY,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                className="absolute left-0 top-0 z-20 pointer-events-none"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  <svg
                    width="180"
                    height="100"
                    viewBox="0 0 180 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Shaft Lines */}
                    <path d="M 20, 42 L 112, 42" />
                    <path d="M 20, 50 L 120, 50" />
                    <path d="M 20, 58 L 112, 58" />

                    {/* Arrowhead Chevrons */}
                    <path d="M 90, 20 L 120, 50 L 90, 80" />
                    <path d="M 100, 20 L 130, 50 L 100, 80" />
                    <path d="M 110, 20 L 140, 50 L 110, 80" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </Link>

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
              className="group relative inline-flex items-center justify-center bg-white text-charcoal hover:bg-terracotta hover:text-white px-8 py-4 transition-all duration-500 rounded-none shadow-md font-sans text-xs uppercase tracking-widest font-semibold"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


