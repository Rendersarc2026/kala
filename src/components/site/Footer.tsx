"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white border-t border-white/10 pt-16 md:pt-24 pb-10 md:pb-14">
      <div className="max-w-7xl mx-auto px-8 md:px-14">
        {/* Three-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16 md:mb-20">
          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="font-sans text-2xl font-light text-white hover:text-terracotta transition-colors duration-300"
            >
              KALA DESIGN STUDIO
            </Link>
            <p className="text-sm text-white/55 font-sans font-light leading-relaxed max-w-xs">
              A boutique architecture and interior design studio crafting
              timeless spaces through rigorous craft and restraint.
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-editorial text-white/45 font-sans font-medium">
              Navigate
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Featured Projects", href: "/projects" },
                { label: "Why Choose Us", href: "/about#why-choose-us" },
                { label: "About Us", href: "/about" },
                { label: "Our Process", href: "/process" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link text-sm text-white/55 hover:text-white font-sans transition-colors duration-300 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Contact + Social */}
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-editorial text-white/45 font-sans font-medium">
              Studio
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/55 font-sans font-light">
              <p>14 Whitfield Street</p>
              <p>London, W1T 2RG</p>
              <a
                href="mailto:hello@kalastudio.com"
                className="nav-link text-white hover:text-terracotta transition-colors duration-300 w-fit mt-1"
              >
                hello@kalastudio.com
              </a>
            </div>

            <div className="flex gap-5 mt-6">
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "Pinterest", href: "https://pinterest.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-[11px] uppercase tracking-editorial text-white/45 hover:text-white transition-colors duration-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-editorial text-white/35 font-sans">
            &copy; {year} KALA DESIGN STUDIO. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-[11px] uppercase tracking-editorial text-white/30 hover:text-white/60 transition-colors duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
