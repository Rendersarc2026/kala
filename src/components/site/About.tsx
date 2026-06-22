"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AboutProps {
  data: {
    label: string;
    heading: string;
    paragraph: string;
    image1Url: string;
    image2Url: string;
    buttonText: string;
  };
}

export default function About({ data }: AboutProps) {
  return (
    <section id="about" className="py-24 md:py-36 bg-white text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Offset Images */}
        <div className="lg:col-span-6 relative flex flex-col md:flex-row gap-6 items-center md:items-start justify-center">
          {/* Main Background Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative w-full md:w-[320px] h-[400px] md:h-[450px]"
          >
            <Image
              src={data.image1Url}
              alt="Studio environment"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </motion.div>

          {/* Overlapping Forefront Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-3/4 md:w-[240px] h-[300px] md:h-[350px] md:mt-24 md:-ml-12 border-8 border-white shadow-2xl z-10"
          >
            <Image
              src={data.image2Url}
              alt="Design details"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 75vw, 240px"
            />
          </motion.div>
        </div>

        {/* Right Column: Editorial Text */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
            }}
          >
            {/* Label */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center space-x-4 mb-6"
            >
              <div className="w-8 h-[1px] bg-black/40" />
              <span className="text-xs tracking-widest font-semibold text-black/60 uppercase">
                {data.label}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-3xl md:text-5xl font-light tracking-tight text-black mb-8 leading-tight uppercase"
            >
              {data.heading}
            </motion.h2>

            {/* Paragraph */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-base text-black/70 font-light leading-relaxed mb-10 max-w-xl"
            >
              {data.paragraph}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <a
                href="#services"
                className="inline-block px-8 py-3.5 border border-black text-xs tracking-widest text-black hover:bg-black hover:text-white transition-colors duration-500 font-medium"
              >
                {data.buttonText}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
