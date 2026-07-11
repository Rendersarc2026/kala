"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Our Process" },
  { href: "/why-choose-us", label: "Why Choose Us" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();
  const lastOpenedRef = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const hasTriggeredBottomRef = useRef<boolean>(false);

  const handleNav = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  // Close menu when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Track the timestamp when the menu is opened
  useEffect(() => {
    if (isMenuOpen) {
      lastOpenedRef.current = Date.now();
    }
  }, [isMenuOpen]);

  // Unified, high-performance scroll effect using requestAnimationFrame and passive listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // 1. Track scroll position for nav reveal
          setHasScrolled(currentScrollY > 60);

          // 2. Close menu overlay if open and user scrolls
          if (isMenuOpen) {
            const timeElapsed = Date.now() - lastOpenedRef.current;
            if (Math.abs(currentScrollY - lastScrollY.current) > 5 && timeElapsed > 250) {
              setIsMenuOpen(false);
            }
          }

          // 3. Automatically open menu when user scrolls to the bottom (home page only)
          if (pathname === "/") {
            const threshold = 50;
            const resetThreshold = 100;

            const totalHeight = document.documentElement.scrollHeight;
            const visibleHeight = window.innerHeight;
            const distanceToBottom = totalHeight - visibleHeight - currentScrollY;

            if (distanceToBottom <= threshold) {
              if (!hasTriggeredBottomRef.current) {
                setIsMenuOpen(true);
                hasTriggeredBottomRef.current = true;
              }
            } else if (distanceToBottom > resetThreshold) {
              hasTriggeredBottomRef.current = false;
            }
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    // Initialize state
    setHasScrolled(window.scrollY > 60);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, isMenuOpen]);

  // Determine active page label
  const getActiveLabel = () => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/contact")) return "Contact";
    const link = NAV_LINKS.find(
      (l) => l.href !== "/" && pathname.startsWith(l.href),
    );
    return link ? link.label : "Home";
  };

  // Determine if the current page has a hero overlay or is a dark page (like contact)
  const isHome = pathname === "/";
  const isProjectDetail = pathname.startsWith("/projects/");
  const isContact = pathname.startsWith("/contact");
  const isHeroOverlayPage = isHome || isProjectDetail || isContact;

  const topTextColor = isHeroOverlayPage ? "text-white" : "text-charcoal";

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* 1. TOP HEADER (Absolute at top, scrolls away naturally) */}
      <div className="absolute top-0 left-0 right-0 z-40 py-8 px-6 md:px-12 w-full bg-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-center flex items-center gap-2 md:gap-3 whitespace-nowrap"
          >
            <Image
              src="/logo.png"
              alt="KALA Logo"
              width={240}
              height={155}
              className="h-10 sm:h-12 md:h-16 w-auto object-contain transition-all duration-300"
              priority
            />
            <span className="font-serif text-[10px] sm:text-base md:text-xl tracking-[0.2em] sm:tracking-[0.25em] font-bold transition-colors duration-300 text-[#FFFFFF]">
              THE KALA INTERIORS
            </span>
          </Link>
        </div>
      </div>

      {/* 2. BOTTOM FLOATING NAV BAR (Fixed at viewport bottom) */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-6">
        <motion.div
          onClick={() => setIsMenuOpen(true)}
          initial={{ y: 50, opacity: 0 }}
          animate={
            isMenuOpen
              ? { y: 120, opacity: 0 }
              : isHome && !hasScrolled
                ? { y: 50, opacity: 0 }
                : { y: 0, opacity: 1 }
          }
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[310px] h-14 bg-charcoal border border-white/10 rounded-full shadow-2xl flex items-center relative px-6 pointer-events-auto cursor-pointer"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Active Page Name */}
          <span className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold text-bone select-none absolute left-1/2 -translate-x-1/2">
            {getActiveLabel()}
          </span>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
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
            {/* Backdrop Overlay (Solid BG with page background blur) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-transparent backdrop-blur-sm z-40 cursor-pointer pointer-events-auto"
              style={{
                WebkitBackdropFilter: "blur(4px)",
                backdropFilter: "blur(4px)",
              }}
            />

            {/* Menu Container */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              {/* Central Menu Card (Solid Background, No Glassmorphism) */}
              <div 
                className="bg-[#121212] border border-white/10 shadow-2xl w-full max-w-[420px] p-8 md:p-10 flex flex-col justify-between min-h-[480px] pointer-events-auto"
                style={{ 
                  transform: "translateZ(0)"
                }}
              >
                
                {/* Small Menu Title + Logo */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/40 block">
                    MENU
                  </span>
                  <Image
                    src="/logo.png"
                    alt="KALA Logo"
                    width={120}
                    height={78}
                    className="h-12 md:h-16 w-auto object-contain"
                    priority
                  />
                </div>

                {/* Vertically Stacked Links */}
                <div className="flex flex-col space-y-3.5 my-auto text-left">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <button
                        key={link.href}
                        onClick={() => handleNav(link.href)}
                        className={`font-serif text-3xl sm:text-4xl tracking-wide transition-colors duration-300 font-light hover:text-white text-left ${
                          isActive ? "text-white" : "text-white/50"
                        }`}
                      >
                        {link.label}
                      </button>
                    );
                  })}
                </div>

                {/* Action Button: Contact Us */}
                <button
                  onClick={() => handleNav("/contact")}
                  className="mt-6 w-full border border-white/10 bg-neutral-900/60 hover:bg-neutral-800 hover:border-white/20 text-white text-[9px] uppercase tracking-[0.25em] font-semibold py-3 px-4 flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
                >
                  <span>&rarr;</span>
                  <span>Contact Us</span>
                </button>

              </div>
            </motion.div>

            {/* Bottom Centered Close Button (Solid, No Glassmorphism) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-white/15 bg-charcoal text-white hover:bg-white hover:text-charcoal flex items-center justify-center transition-colors duration-300 cursor-pointer shadow-2xl"
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
