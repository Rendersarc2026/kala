"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white/50 border-t border-white/5 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left: Brand logo & Copyright */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <Link href="/" className="text-lg font-bold tracking-widest text-white">
            KALA.
          </Link>
          <p className="text-[10px] tracking-widest font-light">
            &copy; {currentYear} KALA STUDIO. ALL RIGHTS RESERVED.
          </p>
        </div>

        {/* Center: Social Icons */}
        <div className="flex space-x-6 text-xs tracking-widest">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            INSTAGRAM
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            PINTEREST
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            LINKEDIN
          </a>
        </div>

        {/* Right: Go to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center space-x-2 text-xs tracking-widest hover:text-white transition-colors duration-300 focus:outline-none"
          aria-label="Scroll to top"
        >
          <span>GO TO TOP</span>
          <ArrowUp size={14} className="stroke-[1.5]" />
        </button>

      </div>
    </footer>
  );
}
