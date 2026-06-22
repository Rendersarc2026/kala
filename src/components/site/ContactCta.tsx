"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ContactCtaProps {
  data: {
    heading: string;
    subtext: string;
    buttonText: string;
    backgroundImageUrl: string;
  };
}

export default function ContactCta({ data }: ContactCtaProps) {
  return (
    <section id="contact" className="relative py-32 md:py-48 overflow-hidden bg-black text-white">
      {/* Background with angled clipping mask */}
      <div className="absolute inset-0 w-full h-full opacity-35 hover:opacity-40 transition-opacity duration-700">
        <Image
          src={data.backgroundImageUrl}
          alt="Studio visual details"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Label */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-8 h-[1px] bg-white/40" />
            <span className="text-xs tracking-widest font-semibold text-white/50 uppercase">
              LET&apos;S COLLABORATE
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-6xl font-light tracking-tight text-white mb-6 uppercase leading-tight">
            {data.heading}
          </h2>

          {/* Paragraph */}
          <p className="text-base text-white/60 font-light leading-relaxed mb-10 max-w-lg">
            {data.subtext}
          </p>

          {/* Action button */}
          <button className="px-10 py-4 border border-white text-xs tracking-widest text-white hover:bg-white hover:text-black transition-colors duration-500 font-medium">
            {data.buttonText}
          </button>
        </motion.div>
      </div>

      {/* Decorative vertical separator */}
      <div className="absolute right-0 bottom-0 top-0 w-[1px] bg-white/5 hidden lg:block" />
    </section>
  );
}
