"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

import type { Project, Testimonial } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";
import TestimonialSlider from "@/components/TestimonialSlider";
import InteractiveStage from "@/components/InteractiveStage";

interface HeroData {
  label: string;
  heading: string;
  backgroundImageUrl: string;
}

interface AboutData {
  label: string;
  heading: string;
}

export default function HomeClient({
  initialProjects,
  initialHero,
  initialAbout,
  initialTestimonials,
}: {
  initialProjects: Project[];
  initialHero: HeroData;
  initialAbout: AboutData;
  initialTestimonials: Testimonial[];
}) {
  const featuredProjects = initialProjects.filter((p) => p.featured).slice(0, 4);
  const heroContent = initialHero;
  const aboutContent = initialAbout;
  const testimonialsList = initialTestimonials;

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

  // Scroll parallax for hero background image
  const yBg = useTransform(scrollY, [0, 800], ["0%", "15%"]);
  const scaleBg = useTransform(scrollY, [0, 800], [1.05, 1.15]);

  return (
    <div className={`${spaceGrotesk.variable} ${inter.variable} w-full`}>
      {/* 1. HERO SECTION */}
      <div className="relative h-screen w-full bg-[#FFFFFF] overflow-hidden">
        <motion.section
          style={{ scale, borderRadius }}
          className="relative w-full h-full flex items-end justify-center overflow-hidden bg-[#FFFFFF]"
        >
          {/* Parallax Background Image */}
          {heroContent.backgroundImageUrl && (
            <motion.div
              style={{ y: yBg, scale: scaleBg }}
              className="absolute inset-0 z-0 pointer-events-none"
            >
              <Image
                src={heroContent.backgroundImageUrl}
                alt="Luxury living space design by KALA"
                fill
                sizes="100vw"
                priority
                className="object-cover object-center"
              />
              {/* Smooth dark vertical gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,23,20,0.85)] via-[rgba(28,23,20,0.35)] to-transparent z-10" />
            </motion.div>
          )}

          {/* Hero Content */}
          <motion.div
            style={{ opacity }}
            className="relative z-20 w-full px-10 md:px-16 lg:px-36 pb-10 md:pb-16 lg:pb-36 flex flex-col items-center md:items-start justify-end text-center md:text-left pointer-events-auto"
          >
            {/* Left Column: Eyebrow + Staggered Headline */}
            <div className="flex flex-col items-center md:items-start max-w-2xl w-full">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: easeLarge }}
                className="font-sans text-[10px] uppercase tracking-[0.35em] text-paper/70 font-semibold mb-6 flex items-center justify-center md:justify-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brass-accent" /> {heroContent.label}
              </motion.span>

              <h1 className="font-space-grotesk text-4xl md:text-8xl font-light text-paper leading-[0.95] tracking-tight uppercase">
                {(() => {
                  const parts = heroContent.heading.split("|");
                  const line1 = parts[0] || "";
                  const line2 = parts[1] || "";
                  return (
                    <>
                      {line1 && (
                        <span className="block overflow-hidden py-1">
                          <motion.span 
                            key={`h1-${line1}`}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.1, ease: easeLarge }}
                            className="block whitespace-nowrap"
                          >
                            {line1}
                          </motion.span>
                        </span>
                      )}
                      {line2 && (
                        <span className="block overflow-hidden py-1">
                          <motion.span 
                            key={`h2-${line2}`}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.1, delay: 0.1, ease: easeLarge }}
                            className="block text-brass-accent whitespace-nowrap"
                          >
                            {line2}
                          </motion.span>
                        </span>
                      )}
                    </>
                  );
                })()}
              </h1>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* 2. ABOUT TEASER (Centered layout matching screenshot) */}
      <section className="py-24 md:py-36 bg-studio-gray overflow-hidden border-b border-charcoal/5 about-teaser-white">
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
              <span className="text-[7px]">◆</span> {aboutContent.label}
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
              {aboutContent.heading
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
        </div>
      </section>

      {/* 3. FEATURED PROJECTS (Asymmetric Grid) */}
      <section className="py-24 md:py-32 bg-studio-gray border-t border-charcoal/5 overflow-hidden">
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
              className="group inline-flex items-center justify-center space-x-2 border border-charcoal text-charcoal hover:bg-charcoal hover:text-[#121212] px-8 py-4 transition-all duration-300 font-sans text-[10px] uppercase tracking-widest font-bold"
            >
              <span>Explore all works</span>
              <ArrowUpRight className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 text-charcoal group-hover:text-[#121212]" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. PROCESS SECTION */}
      <InteractiveStage />

      {/* 6. TESTIMONIALS */}
      <section className="py-24 md:py-36 bg-studio-gray overflow-hidden testimonial-white">
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

          <TestimonialSlider testimonials={testimonialsList} />
        </div>
      </section>

      {/* 7. CLOSING CTA (Full-bleed) */}
      <section className="relative h-[65vh] w-full flex items-center justify-center overflow-hidden bg-charcoal">
        <Image
          src="https://vwyjryydpalialkrbtwk.supabase.co/storage/v1/object/public/kala%20images/interior/wallpaperflare.com_wallpaper%20(2).jpg"
          alt="Minimalist design interior by KALA"
          fill
          sizes="100vw"
          className="object-cover opacity-60 object-center grayscale"
        />
        <div className="absolute inset-0 bg-[#121212]/45 z-10" />

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
              className="group relative inline-flex items-center justify-center border border-white text-white hover:bg-white hover:text-[#121212] px-8 py-4 transition-all duration-500 rounded-none font-sans text-xs uppercase tracking-widest font-semibold"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300 text-white group-hover:text-[#121212]" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
