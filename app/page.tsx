'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Compass, ShieldCheck, Scale, Leaf, Clock, UserCheck } from 'lucide-react';

import { projects } from '@/data/projects';
import { testimonials } from '@/data/testimonials';
import ProjectCard from '@/components/ProjectCard';
import TestimonialSlider from '@/components/TestimonialSlider';
import ProcessStrip from '@/components/ProcessStrip';

const WHY_CHOOSE_US = [
  {
    icon: Compass,
    title: 'Customized Designs',
    description: 'We reject cookie-cutter templates. Every layout, millwork detail, and fabric selection is custom-tailored to your habits.',
  },
  {
    icon: ShieldCheck,
    title: 'Turnkey Solutions',
    description: 'From structural alterations to placing the final coffee-table book, we manage all design and coordination logistics.',
  },
  {
    icon: Scale,
    title: 'Transparent Pricing',
    description: 'Detailed bills of quantities (BOQ) with itemized costs. No hidden fees, surprise markups, or structural cost overruns.',
  },
  {
    icon: Leaf,
    title: 'Quality Materials',
    description: 'We source premium natural stone, sustainable timber, and luxury textiles that age beautifully and last generations.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'Rigorous project scheduling, buffer management, and vendor coordination ensure we hand over keys on the promised day.',
  },
  {
    icon: UserCheck,
    title: 'Dedicated Management',
    description: 'A single point of contact coordinates architects, engineers, and sub-contractors to maintain execution consistency.',
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
      <div className="relative h-screen w-full bg-bone overflow-hidden">
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
              Architectural purity.<br className="hidden sm:inline" />
              Sensory warmth.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: easeLarge }}
              className="font-sans text-sm sm:text-base text-white/70 max-w-md mt-8 font-light tracking-wide leading-relaxed"
            >
              We sculpt premium residential, commercial, and hospitality interiors that age gracefully.
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
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-10 w-[1px] bg-white/30"
            />
          </motion.div>
        </motion.section>
      </div>

      {/* 2. ABOUT TEASER (Centered layout matching screenshot) */}
      <section className="py-24 md:py-36 bg-bone overflow-hidden border-b border-charcoal/5">
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
            We sculpt tactile, honest spaces focused on tectonic integrity and sensory warmth. Trusted by clients who demand precision, beauty, and care.
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
      <section className="py-24 md:py-32 bg-bone-dark/20 border-t border-b border-charcoal/5 overflow-hidden">
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
              const desktopOffset = isEven ? 'md:translate-y-0' : 'md:translate-y-16';
              return (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: easeLarge }}
                  className={`${desktopOffset}`}
                >
                  <ProjectCard project={project} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 md:py-36 bg-bone overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold block mb-3">
              Studio Competencies
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light leading-tight tracking-wide">
              Meticulous in detail, transparent in execution.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {WHY_CHOOSE_US.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.05, ease: easeLarge }}
                  className="space-y-4 flex flex-col"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 border border-charcoal/5 bg-bone-dark/30">
                      <Icon className="h-5 w-5 text-terracotta stroke-[1px]" />
                    </div>
                    <h3 className="font-serif text-lg text-charcoal font-medium">
                      {item.title}
                    </h3>
                  </div>
                  <p className="font-sans text-xs text-charcoal-light leading-relaxed font-light pl-11">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PROCESS SECTION */}
      <section className="py-24 md:py-32 bg-bone-dark/10 border-t border-b border-charcoal/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light font-semibold block mb-3">
              Working Method
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light tracking-wide">
              The Path to Sanctuary
            </h2>
          </div>

          <ProcessStrip />
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 md:py-36 bg-bone overflow-hidden">
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
            Whether a residential estate, bespoke office, or commercial gallery, let&apos;s shape a tactile, human environment together.
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
