"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const [contactInfo, setContactInfo] = useState({
    phone: "+1 (555) 0199",
    email: "studio@kaladesign.com",
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/contact");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setContactInfo({
              phone: json.data.phone || "+1 (555) 0199",
              email: json.data.email || "studio@kaladesign.com",
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch contact details in footer:", err);
      }
    };
    fetchContact();
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-charcoal text-bone pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 pb-20 border-b border-bone/10">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="font-serif text-3xl tracking-[0.25em] font-light text-bone">
              KALA
            </Link>
            <p className="font-sans text-sm text-bone/60 max-w-sm leading-relaxed font-light">
              An award-winning interior design studio sculpting architectural spaces, tactile residences, and immersive hospitality environments.
            </p>
          </div>

          {/* Directory Links */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-bone/40">Studio</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/projects" className="font-sans text-sm text-bone/70 hover:text-terracotta transition-colors font-light">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/services" className="font-sans text-sm text-bone/70 hover:text-terracotta transition-colors font-light">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/why-choose-us" className="font-sans text-sm text-bone/70 hover:text-terracotta transition-colors font-light">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-sans text-sm text-bone/70 hover:text-terracotta transition-colors font-light">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-sans text-sm text-bone/70 hover:text-terracotta transition-colors font-light">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-bone/40">Enquiries</h4>
            <ul className="space-y-3 text-sm text-bone/75 font-light">
              <li>
                <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-terracotta transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-terracotta transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <p className="leading-relaxed">
                  85 Mercer Street, 4th Floor<br />
                  Soho, New York, NY 10012
                </p>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between text-xs text-bone/40 space-y-4 md:space-y-0 font-light">
          <p>&copy; {currentYear} KALA Studio. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
              Facebook
            </a>
            <a href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
