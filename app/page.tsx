"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Compass,
  ShieldCheck,
  Scale,
  Leaf,
  Clock,
  UserCheck,
} from "lucide-react";

import { projects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import ProjectCard from "@/components/ProjectCard";
import TestimonialSlider from "@/components/TestimonialSlider";

const WHY_CHOOSE_US = [
  {
    icon: Compass,
    title: "Customized Designs",
    description:
      "We reject cookie-cutter templates. Every layout, millwork detail, and fabric selection is custom-tailored to your habits.",
  },
  {
    icon: ShieldCheck,
    title: "Turnkey Solutions",
    description:
      "From structural alterations to placing the final coffee-table book, we manage all design and coordination logistics.",
  },
  {
    icon: Scale,
    title: "Transparent Pricing",
    description:
      "Detailed bills of quantities (BOQ) with itemized costs. No hidden fees, surprise markups, or structural cost overruns.",
  },
  {
    icon: Leaf,
    title: "Quality Materials",
    description:
      "We source premium natural stone, sustainable timber, and luxury textiles that age beautifully and last generations.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "Rigorous project scheduling, buffer management, and vendor coordination ensure we hand over keys on the promised day.",
  },
  {
    icon: UserCheck,
    title: "Dedicated Management",
    description:
      "A single point of contact coordinates architects, engineers, and sub-contractors to maintain execution consistency.",
  },
];

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

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
          <div className="mb-6">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal-muted font-bold inline-flex items-center gap-2">
              <span className="text-[7px]">◆</span> About Kala Studio
            </span>
          </div>

          {/* Centered Large Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeLarge }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.2] font-light max-w-5xl tracking-tight"
          >
            We sculpt tactile, honest spaces focused on tectonic integrity and
            sensory warmth. Trusted by clients who demand precision, beauty, and
            care.
          </motion.h2>

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
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 md:mb-24 space-y-4 md:space-y-0">
            <div>
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light font-semibold block mb-3">
                ◆ Selected Works
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light tracking-wide">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center justify-center space-x-2 bg-charcoal text-white hover:bg-neutral-800 px-6 py-3.5 transition-all duration-300 font-sans text-[10px] uppercase tracking-widest font-bold"
            >
              <span>Explore all works</span>
              <ArrowUpRight className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 text-white" />
            </Link>
          </div>

          {/* Asymmetric Desktop Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 md:gap-y-36">
            {featuredProjects.map((project, idx) => {
              // Apply shifting layout classes on desktop for the editorial look
              const isEven = idx % 2 === 0;
              const desktopOffset = isEven
                ? "md:translate-y-0"
                : "md:translate-y-16";
              return (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{
                    duration: 0.8,
                    delay: (idx % 2) * 0.1,
                    ease: easeLarge,
                  }}
                  className={`${desktopOffset}`}
                >
                  <ProjectCard project={project} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. STUDIO COMPETENCIES — Scroll-driven horizontal carousel */}
      <CarouselSection items={WHY_CHOOSE_US} />

      {/* 5. PROCESS SECTION */}
      <section 
        className="relative bg-white border-t border-b border-charcoal/5 overflow-hidden w-full"
        style={{ height: "100vh", minHeight: "100vh" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 p-6 md:p-12 z-0">
          <div className="relative w-full h-full overflow-hidden rounded-3xl bg-bone">
            <motion.div
              initial={{ scale: 1.08, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.95 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 1.6, ease: easeLarge }}
              className="relative w-full h-full"
            >
              <Image
                src="/interior/wallpaperflare.com_wallpaper.jpg"
                alt="The Path to Sanctuary"
                fill
                className="object-cover object-center"
              />
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-12 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: easeLarge }}
            className="pointer-events-auto"
          >
            <Link
              href="/process"
              className="group relative inline-flex items-center justify-center bg-charcoal text-white hover:bg-terracotta hover:scale-105 px-14 py-6 rounded-full transition-all duration-500 font-sans text-sm uppercase tracking-[0.25em] font-semibold overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            >
              <span className="relative z-10 flex items-center gap-4">
                Explore Our Process
                <ArrowUpRight className="h-5 w-5 transform transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 md:py-36 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-12">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold block mb-3">
              Client Valuations
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light tracking-wide">
              Project Testimonials
            </h2>
          </div>

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
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-light leading-tight tracking-wide mb-6">
            Let&apos;s design your space.
          </h2>
          <p className="font-sans text-xs sm:text-sm text-white/70 font-light mb-10 max-w-md leading-relaxed tracking-wider">
            Whether a residential estate, bespoke office, or commercial gallery,
            let&apos;s shape a tactile, human environment together.
          </p>
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center bg-white text-charcoal hover:bg-terracotta hover:text-white px-8 py-4 transition-all duration-500 rounded-none shadow-md font-sans text-xs uppercase tracking-widest font-semibold"
          >
            <span>Begin Dialogue</span>
            <ArrowUpRight className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function CarouselSection({
  items,
}: {
  items: typeof WHY_CHOOSE_US;
  easeLarge?: [number, number, number, number];
}) {
  return (
    <section className="bg-white py-20 md:py-32 border-t border-charcoal/5">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="max-w-3xl mb-12 md:mb-20">
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light leading-tight tracking-wide">
            Why choose us
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between p-8 sm:p-10 bg-white border border-charcoal/5 hover:border-charcoal/15 transition-all duration-500 rounded-3xl cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] group overflow-hidden min-h-[280px]"
              >
                {/* Giant background numbers */}
                <div className="absolute right-6 bottom-4 font-serif text-[8rem] text-charcoal/[0.02] font-light leading-none select-none pointer-events-none group-hover:text-charcoal/[0.04] group-hover:-translate-y-1 transition-all duration-500">
                  0{idx + 1}
                </div>

                <div className="flex flex-col gap-6 z-10">
                  {/* Icon */}
                  <div className="p-4 w-fit border border-charcoal/10 bg-charcoal/[0.02] group-hover:scale-110 group-hover:border-terracotta group-hover:bg-terracotta transition-all duration-500 rounded-2xl flex-shrink-0">
                    <Icon className="h-6 w-6 text-charcoal/40 group-hover:text-white transition-colors duration-300 stroke-[1.2px]" />
                  </div>
                  {/* Title */}
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal/90 font-light group-hover:text-charcoal transition-colors duration-300">
                    {item.title}
                  </h3>
                  {/* Description */}
                  <p className="font-sans text-xs sm:text-sm text-charcoal/50 leading-relaxed font-light group-hover:text-charcoal/80 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
