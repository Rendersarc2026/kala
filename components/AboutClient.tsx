"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { TeamMember } from "@/lib/types";

const VALUES = [
  {
    number: "01",
    title: "Tectonic Purity",
    description: "We believe architecture should be honest. We prioritize structural logic and reject superficial ornamentation, allowing spaces to speak through form, scale, and volume.",
  },
  {
    number: "02",
    title: "Sensory Warmth",
    description: "Minimalism doesn't have to feel cold. We select tactile materials—honed travertine, brushed oak, and organic linens—to engage the senses and create a deep feeling of home.",
  },
  {
    number: "03",
    title: "Absolute Transparency",
    description: "Trust is built through clarity. From detailed itemized pricing lists to direct communications, we keep you informed and empowered at every milestone.",
  },
  {
    number: "04",
    title: "Uncompromising Craft",
    description: "We partner with master stonemasons, carpenters, and metalsmiths to ensure every door profile, joint, and surface finish meets gallery standards.",
  },
];

export default function AboutClient({
  initialTeamMembers,
}: {
  initialTeamMembers: TeamMember[];
}) {
  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const team = initialTeamMembers;

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full pt-28 pb-24 md:pb-36 bg-studio-gray">
      {/* Editorial Profile / Story */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeLarge }}
          className="mb-8"
        >
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold">
            Our Story
          </span>
        </motion.div>

        {/* Big Magazine-style Title */}
        <div className="max-w-5xl mb-16 md:mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: easeLarge }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal font-light leading-[1.15] tracking-wide"
          >
            Sculpting tactile architectures and honest interiors that grow more beautiful with age.
          </motion.h1>
        </div>

        {/* Grid: Profile content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24 md:mb-36">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeLarge }}
            className="lg:col-span-7 space-y-6 text-charcoal-muted font-sans text-sm md:text-base font-light leading-relaxed"
          >
            <p>
              Kala design and build is a Thalassery-based interior firm founded in 2017 by Rehiyan Raheem K. Our practice is driven by a passion for creating meaningful, elegant, and functional spaces that respond thoughtfully to their context and the aspirations of our clients.
            </p>
            <p>
              With extensive experience in architectural design and contracting, we offer comprehensive solutions from concept development to project execution. Our design approach balances aesthetics, practicality, and sustainability, ensuring each project is both timeless and purposeful.
            </p>
            
            {/* Pull Quote */}
            <div className="py-8 border-t border-b border-charcoal/10 my-8">
              <p className="font-serif text-xl md:text-2xl text-charcoal italic font-light leading-relaxed">
                &ldquo;We believe architecture is more than building structures—it is about shaping experiences and environments that enhance everyday living.&rdquo;
              </p>
              <cite className="block mt-4 font-sans text-xs uppercase tracking-wider font-semibold text-charcoal not-italic">
                &mdash; Rehiyan Raheem K, Founder
              </cite>
            </div>
            
            <p>
              At Kala design and build, we believe architecture is more than building structures—it is about shaping experiences and environments that enhance everyday living. Every project is treated as a unique collaboration, crafted with attention to detail, quality, and integrity.
            </p>
          </motion.div>

          {/* Full-bleed style image breaking column */}
          <div className="lg:col-span-5 lg:-mt-12 relative w-full aspect-[3/4] overflow-hidden bg-bone-dark shadow-sm">
            <Image
              src="https://vwyjryydpalialkrbtwk.supabase.co/storage/v1/object/public/kala%20images/interior/wallpaperflare.com_wallpaper%20(2).jpg"
              alt="Maison Serein rustic project"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 left-4 bg-white/95 px-4 py-2">
              <span className="font-sans text-[9px] tracking-wider text-[#121212] uppercase">
                Maison Serein Project, France
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-charcoal border-t border-b border-charcoal/5 py-24 my-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeLarge }}
              className="space-y-4"
            >
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light font-bold">
                Our Vision
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-light leading-snug">
                Shaping environments that enrich everyday life.
              </h2>
              <p className="font-sans text-xs md:text-sm text-charcoal-muted leading-relaxed font-light">
                To become a trusted architectural practice known for thoughtful design, quality craftsmanship, and innovative solutions—shaping built environments that enrich everyday life and stand the test of time.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: easeLarge }}
              className="space-y-4"
            >
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light font-bold">
                Our Mission
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-light leading-snug">
                Thoughtful design, functionality, and sustainability.
              </h2>
              <div className="font-sans text-xs md:text-sm text-charcoal-muted leading-relaxed font-light space-y-2">
                <p>• To create meaningful architecture that balances aesthetics, functionality, and sustainability.</p>
                <p>• To provide end-to-end design and contracting solutions with professionalism and integrity.</p>
                <p>• To collaborate closely with clients, understanding their needs and transforming ideas into built reality.</p>
                <p>• To continuously evolve through innovation, research, and responsible design practices.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24 md:mb-36 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeLarge }}
          className="max-w-3xl mb-16"
        >
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold block mb-3">
            Core Values
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-light tracking-wide">
            How we guide our thoughts and blueprints.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {VALUES.map((val, valIdx) => (
            <motion.div
              key={val.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (valIdx % 2) * 0.1, ease: easeLarge }}
              className="flex space-x-6"
            >
              <span className="font-serif text-4xl text-terracotta/30 font-light mt-1 select-none">
                {val.number}
              </span>
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-charcoal font-medium">
                  {val.title}
                </h3>
                <p className="font-sans text-xs text-charcoal-light leading-relaxed font-light">
                  {val.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet the Team Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeLarge }}
          className="mb-16"
        >
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light font-bold block mb-3">
            The Studio
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-light tracking-wide">
            Meet the Team
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, idx) => {
            const hasError = imageErrors[member.id];
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.05, ease: easeLarge }}
                className="group relative flex flex-col bg-white/5 border border-charcoal/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
              >
                {/* Photo with Overlay */}
                <div className="relative aspect-[3/5] w-full overflow-hidden bg-bone-dark">
                  {!hasError ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      onError={() => handleImageError(member.id)}
                    />
                  ) : (
                    // Stylized placeholder using member initials
                    <div className="w-full h-full flex flex-col items-center justify-center bg-bone-dark">
                      <span className="font-serif text-4xl text-charcoal/20 tracking-wider">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  )}

                  {/* Bio Hover Overlay */}
                  <div className="absolute inset-0 bg-[#121212]/90 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1] p-8 flex flex-col justify-end text-bone">
                    <p className="font-sans text-xs leading-relaxed font-light opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="px-4 pb-5 pt-4 space-y-1.5 text-center">
                  <h3 className="font-serif text-xl text-charcoal group-hover:text-terracotta transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="font-sans text-xs tracking-wider text-charcoal-light uppercase">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
