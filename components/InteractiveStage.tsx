"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  motion, 
  useReducedMotion, 
  useScroll, 
  useMotionValueEvent,
  useMotionValue,
  animate
} from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";

// Load fonts via next/font/google
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

interface PanelItem {
  id: string;
  label: string;
  href: string;
  image: string;
}

const PANELS_DATA: PanelItem[] = [
  {
    id: "process",
    label: "Explore / Our Process",
    href: "/process",
    image: "/interior/wallpaperflare.com_wallpaper (3).jpg",
  },
  {
    id: "about",
    label: "Who / We Are",
    href: "/about",
    image: "/interior/piqsels.com-id-frfbp.jpg",
  },
  {
    id: "why-choose-us",
    label: "Why / Choose Us",
    href: "/why-choose-us",
    image: "/interior/wallpaperflare.com_wallpaper (1).jpg",
  },
  {
    id: "services",
    label: "Our / Services",
    href: "/services",
    image: "/interior/wallpaperflare.com_wallpaper (4).jpg",
  },
];

// Mount entrance label variants
const panelLabelVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

interface InteractivePanelProps {
  panel: PanelItem;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  scrollYProgress: any;
  shouldReduceMotion: boolean;
  isMobile: boolean;
}

function InteractivePanel({
  panel,
  index,
  hoveredIndex,
  setHoveredIndex,
  scrollYProgress,
  shouldReduceMotion,
  isMobile,
}: InteractivePanelProps) {
  // Motion values for scroll-linked and hover transitions
  const overlayY = useMotionValue("0%");
  const labelColor = useMotionValue("#D2B58D");
  const asteriskOpacity = useMotionValue(0);

  const [isIntroActive, setIsIntroActive] = useState(true);
  const isHovered = hoveredIndex === index;

  const hasTriggeredIntro = useRef(false);

  // Set static visual state immediately on mobile (full-bleed images, white text, no hover/intro)
  useEffect(() => {
    if (isMobile) {
      overlayY.set("-100%");
      labelColor.set("#F6F1EA");
      asteriskOpacity.set(0);
      setIsIntroActive(false);
    }
  }, [isMobile, overlayY, labelColor, asteriskOpacity]);

  // Monitor scroll progress to trigger a one-time automatic preview animation
  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    if (isMobile) return; // Disable scroll-linked animation on mobile

    // Play the preview reveal once the section enters viewport (12% or more)
    if (latest >= 0.12 && !hasTriggeredIntro.current) {
      hasTriggeredIntro.current = true;
      setIsIntroActive(true);

      // Slides white overlay UP to reveal (-100%), holds, and slides DOWN to cover (0%)
      animate(overlayY, ["0%", "-100%", "-100%", "0%"], {
        times: [0, 0.4, 0.6, 1.0],
        duration: shouldReduceMotion ? 0 : 2.2, // 2.2 seconds overall slow, premium flow
        ease: ["easeOut", "linear", "easeIn"],
      }).then(() => {
        setIsIntroActive(false);
      });

      // Label color transitions in sync
      animate(labelColor, ["#D2B58D", "#D2B58D", "#D2B58D", "#D2B58D"], {
        times: [0, 0.4, 0.6, 1.0],
        duration: shouldReduceMotion ? 0 : 2.2,
        ease: ["easeOut", "linear", "easeIn"],
      });
    }
  });

  // Handle overlay Y slide when hovered/unhovered (only after scroll intro is complete)
  const hasActivatedHoverRef = useRef(false);
  useEffect(() => {
    if (isMobile) return; // Disable hover effects on mobile
    if (!isIntroActive) {
      if (!hasActivatedHoverRef.current) {
        overlayY.set("0%");
        hasActivatedHoverRef.current = true;
        return;
      }

      if (isHovered) {
        animate(overlayY, "-100%", {
          duration: shouldReduceMotion ? 0 : 1.4,
          ease: [0.16, 1, 0.3, 1],
        });
      } else {
        overlayY.set("100%");
        animate(overlayY, "0%", {
          duration: shouldReduceMotion ? 0 : 1.4,
          ease: [0.16, 1, 0.3, 1],
        });
      }
    } else {
      hasActivatedHoverRef.current = false;
    }
  }, [isHovered, isIntroActive, overlayY, shouldReduceMotion, isMobile]);

  // Handle label color fades when hovered/unhovered
  const hasActivatedColorRef = useRef(false);
  useEffect(() => {
    if (isMobile) return; // Disable color transitions on mobile
    if (!isIntroActive) {
      if (!hasActivatedColorRef.current) {
        labelColor.set("#D2B58D");
        hasActivatedColorRef.current = true;
        return;
      }

      if (isHovered) {
        animate(labelColor, "#D2B58D", {
          duration: shouldReduceMotion ? 0 : 0.8,
        });
      } else {
        animate(labelColor, "#D2B58D", {
          duration: shouldReduceMotion ? 0 : 0.8,
          delay: shouldReduceMotion ? 0 : 0.6,
        });
      }
    } else {
      hasActivatedColorRef.current = false;
    }
  }, [isHovered, isIntroActive, labelColor, shouldReduceMotion, isMobile]);

  // Handle asterisk opacity fades
  useEffect(() => {
    if (isMobile) return; // Disable asterisk on mobile
    if (!isIntroActive && isHovered) {
      animate(asteriskOpacity, 1, {
        duration: shouldReduceMotion ? 0 : 0.8,
        delay: shouldReduceMotion ? 0 : 0.5,
      });
    } else {
      animate(asteriskOpacity, 0, {
        duration: shouldReduceMotion ? 0 : 0.4,
      });
    }
  }, [isHovered, isIntroActive, asteriskOpacity, shouldReduceMotion, isMobile]);

  return (
    <Link
      href={panel.href}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="relative flex-1 w-full md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-sand last:border-b-0 md:last:border-r-0 focus-visible:ring-2 focus-visible:ring-brass-accent focus-visible:outline-none select-none cursor-pointer group flex flex-col items-center justify-center text-center p-6 md:p-8"
    >
      {/* IMAGE (revealed when white overlay slides away) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={panel.image}
          alt={panel.label}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
          priority
        />
        <div className="absolute inset-0 bg-ink/35 z-10" />
      </div>

      {/* WHITE OVERLAY (slides to reveal/cover the image on desktop only) */}
      <motion.div
        style={{ y: overlayY }}
        className="absolute inset-0 bg-studio-gray z-10 pointer-events-none hidden md:block"
      />

      {/* HOVER OVERLAY: Accent asterisk */}
      <motion.div 
        style={{ opacity: asteriskOpacity }}
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-lg text-brass-accent pointer-events-none z-20 hidden md:block"
      >
        *
      </motion.div>

      {/* LABEL: Staggered entrance and dynamic color */}
      <motion.div
        variants={panelLabelVariants}
        className="relative z-20 font-space-grotesk text-xs md:text-sm font-bold tracking-[0.15em] uppercase leading-relaxed text-center"
      >
        {/* Mobile Label: Always pure white to contrast against the dark background image */}
        <div className="block md:hidden text-white">
          {panel.label.split(" / ").map((line, idx) => (
            <span key={idx} className="block">{line}</span>
          ))}
        </div>

        {/* Desktop Label: Dynamic animated color */}
        <motion.div 
          style={{ color: labelColor }}
          className="hidden md:block"
        >
          {panel.label.split(" / ").map((line, idx) => (
            <span key={idx} className="block">{line}</span>
          ))}
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default function InteractiveStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShouldReduceMotion(true);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll tracking container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  // Panel labels stagger reveal variants
  const panelContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  return (
    <div 
      ref={containerRef}
      className={`${spaceGrotesk.variable} ${inter.variable} w-full h-screen bg-studio-gray overflow-hidden`}
    >
      <motion.div
        variants={panelContainerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col md:flex-row w-full h-full bg-studio-gray overflow-hidden"
      >
        {PANELS_DATA.map((panel, index) => (
          <InteractivePanel
            key={panel.id}
            panel={panel}
            index={index}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            scrollYProgress={scrollYProgress}
            shouldReduceMotion={shouldReduceMotion}
            isMobile={isMobile}
          />
        ))}
      </motion.div>
    </div>
  );
}
