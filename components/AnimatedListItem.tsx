'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

interface AnimatedListItemProps {
  index: number;
  image: string;
  numeral: string;
  heading: string;
  description: string;
  hideBigNumeral?: boolean;
  isDark?: boolean;
  once?: boolean;
  children?: React.ReactNode;
}

export default function AnimatedListItem({
  index,
  image,
  numeral,
  heading,
  description,
  hideBigNumeral = false,
  isDark = true,
  once = true,
  children,
}: AnimatedListItemProps) {
  // Odd-indexed items (1-based "01", index 0) show image on the left, text on the right.
  // Even-indexed items (1-based "02", index 1) show text on the left, image on the right.
  const isEven = index % 2 === 1;

  // Theme styling configurations
  const headingColor = 'text-charcoal';
  const dashColor = 'bg-charcoal/20';
  const descColor = 'text-charcoal-muted';
  const borderColor = 'border-charcoal/10';
  const numeralColor = 'text-charcoal';

  // Horizontal offsets based on side
  const imageInitialX = isEven ? 80 : -80;
  const textInitialX = isEven ? -80 : 80;

  // Snappy editorial easing curve (fast start, smooth settle)
  const easeSnappy: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // Animation Timings (Faster, snappier durations and delays)
  const numeralVariants: Variants = {
    hidden: { 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: easeSnappy,
      }
    },
    visible: {
      opacity: 0.18,
      transition: {
        duration: 0.4,
        ease: easeSnappy,
        delay: 0,
      },
    },
  };

  const borderVariants: Variants = {
    hidden: { 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: easeSnappy,
      }
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: easeSnappy,
        delay: 0.06,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: imageInitialX,
      transition: {
        duration: 0.4,
        ease: easeSnappy,
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        ease: easeSnappy,
        delay: 0.12,
      },
    },
  };

  const textVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: textInitialX,
      transition: {
        duration: 0.4,
        ease: easeSnappy,
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        ease: easeSnappy,
        delay: 0.20, // starts 0.08s after the image
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.08 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center w-full overflow-hidden"
    >
      {/* Image Column */}
      <div
        className={`col-span-1 lg:col-span-6 relative ${
          isEven ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        {/* Giant background numeral */}
        {!hideBigNumeral && (
          <motion.div
            variants={numeralVariants}
            className={`absolute -top-10 -left-4 sm:-top-16 sm:-left-12 font-serif ${numeralColor} pointer-events-none select-none z-0 hidden sm:block leading-none`}
            style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
          >
            {numeral}
          </motion.div>
        )}

        {/* 1px offset border rectangle */}
        <motion.div
          variants={borderVariants}
          className={`absolute inset-0 border ${borderColor} -translate-x-4 -translate-y-4 md:-translate-x-5 md:-translate-y-5 z-0`}
        />

        {/* Actual Image container */}
        <motion.div
          variants={imageVariants}
          className="relative aspect-[4/3] w-full overflow-hidden bg-bone-dark z-10 shadow-sm"
        >
          <Image
            src={image}
            alt={heading}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
          />
        </motion.div>
      </div>

      {/* Text Column */}
      <motion.div
        variants={textVariants}
        className={`col-span-1 lg:col-span-6 space-y-4 sm:space-y-6 ${
          isEven ? 'lg:order-1 lg:pr-8' : 'lg:order-2 lg:pl-8'
        }`}
      >
        {/* Heading Row with Dash Accent */}
        <div className="flex items-center space-x-3">
          <h3 className={`font-sans text-xs sm:text-sm tracking-widest font-semibold uppercase ${headingColor}`}>
            {numeral} &nbsp; {heading}
          </h3>
          <span className={`h-[1px] w-8 sm:w-12 ${dashColor}`} />
        </div>

        {/* Description Paragraph */}
        <p className={`font-sans text-sm ${descColor} font-light leading-relaxed`}>
          {description}
        </p>

        {/* Optional children (e.g. deliverables, links, etc.) */}
        {children}
      </motion.div>
    </motion.div>
  );
}
