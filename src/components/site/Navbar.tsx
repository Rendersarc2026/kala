"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Projects", href: "/projects" },
  { name: "Why Choose Us", href: "/about#why-choose-us" },
  { name: "About & Team", href: "/about" },
  { name: "Our Process", href: "/process" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isHomePage = pathname === "/";
  const useLightText = isHomePage && !isScrolled;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          useLightText
            ? "bg-transparent py-7"
            : isScrolled
              ? "bg-ivory/85 backdrop-blur-xl py-4"
              : "bg-ivory/80 backdrop-blur-sm py-7"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-14 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className={`font-sans text-2xl font-bold tracking-wide transition-colors duration-300 ${
              useLightText ? "text-white" : "text-charcoal"
            }`}
          >
            KALA DESIGNS
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`nav-link text-[11px] uppercase tracking-editorial font-bold transition-colors duration-300 ${
                    isActive
                      ? useLightText
                        ? "text-white active"
                        : "text-terracotta active"
                      : useLightText
                        ? "text-white/75 hover:text-white"
                        : "text-charcoal/65 hover:text-charcoal"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className={`md:hidden p-1 focus:outline-none transition-colors duration-300 ${
              useLightText ? "text-white" : "text-charcoal"
            }`}
          >
            {isOpen ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-ivory flex flex-col"
          >
            {/* Close button */}
            <div className="flex justify-between items-center px-8 py-7">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="font-sans text-2xl font-light text-charcoal"
              >
                KALA DESIGN STUDIO
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="text-charcoal/60 focus:outline-none"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col flex-1 justify-center px-8 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block font-sans text-4xl md:text-5xl font-light py-3 transition-colors duration-300 ${
                      pathname === link.href ||
                      pathname.startsWith(link.href + "/")
                        ? "text-terracotta"
                        : "text-charcoal/80 hover:text-terracotta"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer row */}
            <div className="px-8 pb-10 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-editorial text-charcoal/30">
                © {new Date().getFullYear()} KALA DESIGN STUDIO
              </p>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="text-[11px] uppercase tracking-editorial text-charcoal/25 hover:text-charcoal/50 transition-colors"
              >
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
