"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Automatically open menu when user scrolls to the bottom
  useEffect(() => {
    let hasTriggered = false;

    const handleScroll = () => {
      const threshold = 15; // px from bottom
      const resetThreshold = 80; // px away from bottom to reset the trigger
      
      const totalHeight = document.documentElement.scrollHeight;
      const visibleHeight = window.innerHeight;
      const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      
      const distanceToBottom = totalHeight - visibleHeight - scrollPosition;

      if (distanceToBottom <= threshold) {
        if (!hasTriggered) {
          setIsMenuOpen(true);
          hasTriggered = true;
        }
      } else if (distanceToBottom > resetThreshold) {
        hasTriggered = false;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine active page label
  const getActiveLabel = () => {
    if (pathname === "/") return "Home";
    const link = NAV_LINKS.find(
      (l) => l.href !== "/" && pathname.startsWith(l.href),
    );
    return link ? link.label : "Home";
  };

  // Determine if the current page has a hero overlay
  const isHome = pathname === "/";
  const isProjectDetail = pathname.startsWith("/projects/");
  const isHeroOverlayPage = isHome || isProjectDetail;

  const topTextColor = isHeroOverlayPage ? "text-white" : "text-charcoal";
  const topMutedColor = isHeroOverlayPage
    ? "text-white/50"
    : "text-charcoal/50";

  return (
    <>
      {/* 1. TOP HEADER (Absolute at top, scrolls away naturally) */}
      <div className="absolute top-0 left-0 right-0 z-40 py-8 px-6 md:px-12 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Top Left: Location Info */}

          {/* Top Center: Logo */}
          <Link
            href="/"
            className={`font-serif text-xl tracking-[0.25em] font-bold ${topTextColor} md:absolute md:left-1/2 md:-translate-x-1/2`}
          >
            KALA DESIGNS
          </Link>
        </div>
      </div>

      {/* 2. BOTTOM FLOATING NAV BAR (Fixed at viewport bottom) */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isMenuOpen ? { y: 120, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[310px] h-14 bg-charcoal/95 border border-white/10 rounded-full shadow-2xl backdrop-blur-md flex items-center relative px-6 pointer-events-auto"
        >
          {/* Active Page Name */}
          <span className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold text-bone select-none absolute left-1/2 -translate-x-1/2">
            {getActiveLabel()}
          </span>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-6 h-6 flex flex-col justify-center items-center relative focus:outline-none ml-auto"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-bone" />
            ) : (
              <div className="flex flex-col space-y-1.5 w-5">
                <span className="w-full h-[1.5px] bg-bone block" />
                <span className="w-full h-[1.5px] bg-bone block" />
              </div>
            )}
          </button>
        </motion.div>
      </div>

      {/* 3. CENTERED GLASSMORPHISM CARD NAVIGATION OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Transparent Backdrop Click-to-Close Overlay (No dim, no blur) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-transparent z-40 cursor-pointer pointer-events-auto"
            />

            {/* Menu Container */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              {/* Central Menu Card (Translucent Dark Background with Glassmorphism) */}
              <div className="bg-[#121212]/75 border border-white/10 shadow-2xl backdrop-blur-xl w-full max-w-[420px] p-8 md:p-10 flex flex-col justify-between min-h-[480px] pointer-events-auto">
                
                {/* Small Menu Title */}
                <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/40 block mb-6 text-left">
                  MENU
                </span>

                {/* Vertically Stacked Links */}
                <div className="flex flex-col space-y-3.5 my-auto text-left">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`font-serif text-3xl sm:text-4xl tracking-wide transition-colors duration-300 font-light hover:text-white ${
                          isActive ? "text-white" : "text-white/50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Two Columns of Extra Information */}
                <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6 mt-6 text-left font-sans text-[10px] tracking-wider">
                  <div className="space-y-1">
                    <Link
                      href="/about"
                      className="block text-white/50 hover:text-white transition-colors uppercase"
                    >
                      News
                    </Link>
                    <Link
                      href="/contact"
                      className="block text-white/50 hover:text-white transition-colors uppercase"
                    >
                      Showroom
                    </Link>
                  </div>
                  <div className="space-y-1 text-white/40 leading-normal">
                    <p className="text-white/60 font-medium">+1 (555) 0199</p>
                    <p className="lowercase">studio@kaladesign.com</p>
                  </div>
                </div>

                {/* Action Button: Get a Consultation */}
                <Link
                  href="/contact"
                  className="mt-6 w-full border border-white/10 bg-neutral-900/60 hover:bg-neutral-800 hover:border-white/20 text-white text-[9px] uppercase tracking-[0.25em] font-semibold py-3 px-4 flex items-center justify-center gap-2.5 transition-all duration-300"
                >
                  <span>&rarr;</span>
                  <span>Get a Consultation</span>
                </Link>

              </div>
            </motion.div>

            {/* Bottom Centered Close Button (with matching Glassmorphism) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-white/15 bg-charcoal/80 backdrop-blur-md text-white hover:bg-white hover:text-charcoal flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
