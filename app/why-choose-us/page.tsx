'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ShieldCheck,
  Scale,
  Leaf,
  Clock,
  UserCheck,
  ArrowUpRight,
  Check,
  X,
} from 'lucide-react';

const WHY_CHOOSE_US = [
  {
    icon: Compass,
    title: 'Quality Craftsmanship',
    image: '/interior/why-choose-us/customized-designs.jpg',
    description:
      'We reject cookie-cutter templates. Every layout, millwork detail, and fabric selection is custom-tailored to your habits.',
    extended:
      'Our team creates completely customized designs from scratch. We study your daily routines, natural light paths, and sensory preferences to design custom joinery and spatial flow unique to your project.',
  },
  {
    icon: ShieldCheck,
    title: 'Turnkey Solutions',
    image: '/interior/why-choose-us/turnkey-solutions.jpg',
    description:
      'From structural alterations to placing the final coffee-table book, we manage all design and coordination logistics.',
    extended:
      'We act as a single umbrella covering architecture, design, curation, procurement, and site execution. You bypass vendor coordination entirely while we ensure consistency across every phase.',
  },
  {
    icon: Scale,
    title: 'Transparent Pricing',
    image: '/interior/why-choose-us/transparent-pricing.jpg',
    description:
      'Detailed bills of quantities (BOQ) with itemized costs. No hidden fees, surprise markups, or structural cost overruns.',
    extended:
      'Our financial transparency is absolute. We provide itemized fixed-price lists down to the hardware and light fixtures. All estimates match final invoices with zero hidden percentages.',
  },
  {
    icon: Leaf,
    title: 'Quality Materials',
    image: '/interior/why-choose-us/quality-materials.jpg',
    description:
      'We source premium natural stone, sustainable timber, and luxury textiles that age beautifully and last generations.',
    extended:
      'We establish relationships directly with stone quarries and wood mills. Sourcing travertine from Italy, brushed oak, and pure organic linens guarantees tactile luxury that stands up to time.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    image: '/interior/why-choose-us/on-time-delivery.jpg',
    description:
      'Rigorous project scheduling, buffer management, and vendor coordination ensure we hand over keys on the promised day.',
    extended:
      'Using digital construction management and buffer schedules, we guarantee handovers. We sync procurement lead-times with site preparation to avoid costly delays.',
  },
  {
    icon: UserCheck,
    title: 'Dedicated Management',
    image: '/interior/why-choose-us/dedicated-management.jpg',
    description:
      'A single point of contact coordinates architects, engineers, and sub-contractors to maintain execution consistency.',
    extended:
      'Your project is overseen by a dedicated project director and designer. We conduct daily site quality-inspections and send you bi-weekly video updates and progress metrics.',
  },
];

const COMPARISON = [
  {
    feature: 'Design Process',
    kala: 'Bespoke interior architecture tailored entirely to lifestyle & ergonomics',
    others: 'Template-based layouts with off-the-shelf standard products',
  },
  {
    feature: 'Cost Clarity',
    kala: 'Fixed-price Bill of Quantities (BOQ) with guaranteed zero cost overrun',
    others: 'Vague lump-sum quotes leading to 15-30% surprise bills at handover',
  },
  {
    feature: 'Project Sourcing',
    kala: 'Direct relationships with Italian quarries & certified wood craftsmen',
    others: 'Standard retail markup items with generic local vendor materials',
  },
  {
    feature: 'Supervision',
    kala: 'Daily design-led inspections with 48-hour live client dashboards',
    others: 'Ad-hoc weekly site visits with poor builder coordination',
  },
  {
    feature: 'Timeline Guard',
    kala: 'Legally bound schedule guarantees with built-in buffer buffers',
    others: 'Frequent delay excuses caused by fragmented contractor handoffs',
  },
];

export default function WhyChooseUsPage() {
  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div className="w-full pt-28 pb-24 md:pb-36 bg-white">
      {/* Intro Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeLarge }}
          className="mb-8"
        >
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold">
            Our Differentiator
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: easeLarge }}
          className="max-w-4xl"
        >
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal font-light leading-[1.15] tracking-wide">
            Why Choose KALA
          </h1>
          <p className="font-sans text-sm sm:text-base text-charcoal-muted max-w-2xl mt-6 font-light leading-relaxed">
            We bridge the gap between creative architectural design and rigorous engineering execution. Our structured design-build model gives you complete transparency, sensory materiality, and timely project delivery without the stress.
          </p>
        </motion.div>
      </section>

      {/* Interactive Differentiators Showcase (Split-screen & Accordion layout instead of cards) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24 md:mb-36">
        {/* Mobile View (Accordion Style) */}
        <div className="block lg:hidden space-y-4">
          {WHY_CHOOSE_US.map((item, idx) => {
            const isOpen = activeIndex === idx;
            const numeral = `0${idx + 1}`;
            return (
              <div
                key={item.title}
                className="border-b border-charcoal/10 pb-4 animate-fade-in"
              >
                <button
                  onClick={() => setActiveIndex(idx)}
                  className="w-full flex items-center justify-between py-4 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-xs text-terracotta font-medium">
                      {numeral}
                    </span>
                    <h3 className="font-serif text-xl text-charcoal font-light">
                      {item.title}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-bone flex items-center justify-center text-charcoal transition-transform duration-300 ${isOpen ? 'rotate-180 bg-terracotta text-white' : ''}`}>
                    <span className="text-xs">{isOpen ? '−' : '+'}</span>
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0
                  }}
                  transition={{ duration: 0.4, ease: easeLarge }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-4 space-y-4">
                    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-bone">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="font-sans text-base text-charcoal leading-relaxed font-light">
                      {item.description}
                    </p>
                    <p className="font-sans text-xs text-charcoal-muted leading-relaxed font-light">
                      {item.extended}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Desktop View (Split-Screen Interactive Magazine-style Showcase) */}
        <div className="hidden lg:grid grid-cols-12 gap-16 items-start">
          {/* Left Column: Interactive List */}
          <div className="col-span-5 space-y-1">
            {WHY_CHOOSE_US.map((item, idx) => {
              const isActive = activeIndex === idx;
              const numeral = `0${idx + 1}`;
              return (
                <div
                  key={item.title}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  className="group py-6 border-b border-charcoal/10 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <span className={`font-serif text-sm tracking-widest transition-colors duration-300 ${isActive ? 'text-terracotta font-medium' : 'text-charcoal-light'}`}>
                      {numeral}
                    </span>
                    <h3 className={`font-serif text-2xl transition-all duration-300 ${isActive ? 'text-terracotta font-medium translate-x-2' : 'text-charcoal font-light group-hover:translate-x-1'}`}>
                      {item.title}
                    </h3>
                  </div>
                  
                  {/* Subtle reveal of short description for hovered/active item */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                      marginTop: isActive ? 12 : 0
                    }}
                    transition={{ duration: 0.35, ease: easeLarge }}
                    className="overflow-hidden pl-11"
                  >
                    <p className="font-sans text-lg text-charcoal-muted leading-relaxed font-light max-w-sm">
                      {item.description}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Preview Screen */}
          <div className="col-span-7 sticky top-32">
            <div className="border border-charcoal/5 rounded-2xl p-8 bg-neutral-50/50 shadow-sm space-y-6">
              {/* Animated Image Container */}
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-bone shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.45, ease: easeLarge }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={WHY_CHOOSE_US[activeIndex].image}
                      alt={WHY_CHOOSE_US[activeIndex].title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Text details for active differentiator */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-charcoal/5 text-terracotta shadow-sm">
                    {React.createElement(WHY_CHOOSE_US[activeIndex].icon, { className: "w-5 h-5" })}
                  </div>
                  <h4 className="font-serif text-lg text-charcoal font-medium">
                    {WHY_CHOOSE_US[activeIndex].title}
                  </h4>
                </div>
                
                <p className="font-sans text-xs text-charcoal-light leading-relaxed font-light">
                  {WHY_CHOOSE_US[activeIndex].extended}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Sourcing Spotlight (Middle Section) */}
      <section className="bg-neutral-50 border-t border-b border-charcoal/5 py-24 my-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeLarge }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light font-bold">
                Quality Craftsmanship
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-light leading-snug">
                An uncompromising stance on material purity and construction details.
              </h2>
              <p className="font-sans text-xs md:text-sm text-charcoal-muted leading-relaxed font-light">
                We believe a home is a tactile experience. That is why we refuse faux laminates, plastic mouldings, or rushed joints. Our architects work hand-in-hand with site engineers to execute tight margins, perfect marble vein alignments, and custom-routed wooden panels that speak of pure structural logic.
              </p>
              <div className="pt-4">
                <Link
                  href="/projects"
                  className="group inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-sans font-semibold text-charcoal hover:text-terracotta transition-colors duration-300"
                >
                  <span>Explore Our Projects</span>
                  <ArrowUpRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
                </Link>
              </div>
            </motion.div>

            <div className="lg:col-span-6 relative w-full aspect-[4/3] overflow-hidden bg-bone-dark shadow-sm rounded-xl">
              <Image
                src="/interior/why-choose-us/quality-materials.jpg"
                alt="Tactile materials close-up"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24 md:mb-36">
        <div className="max-w-3xl mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold block mb-3">
            Comparison
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-light tracking-wide">
            How we do things differently
          </h2>
        </div>

        <div className="border border-charcoal/10 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-charcoal text-white font-sans text-[10px] uppercase tracking-widest border-b border-charcoal/10">
                  <th className="py-5 px-6 font-semibold w-1/4">Feature</th>
                  <th className="py-5 px-6 font-semibold bg-terracotta w-2/5">KALA Designs</th>
                  <th className="py-5 px-6 font-semibold text-white/50 w-2/5">Standard Practice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 font-sans text-xs">
                {COMPARISON.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-6 px-6 font-semibold text-charcoal">{row.feature}</td>
                    <td className="py-6 px-6 bg-terracotta/5 text-charcoal font-medium">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                        <span>{row.kala}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-charcoal-muted font-light">
                      <div className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-charcoal-light/40 shrink-0 mt-0.5" />
                        <span>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-charcoal text-white p-12 md:p-20 relative overflow-hidden rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-terracotta/30 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/50 font-bold">
              Let&apos;s collaborate
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-light leading-snug">
              Ready to design with absolute transparency?
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/70 font-light leading-relaxed">
              Contact our designers today to review your spatial plans and receive an itemized initial budget estimate.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center border border-white text-white hover:bg-white hover:text-charcoal px-8 py-4 transition-all duration-500 rounded-none font-sans text-xs uppercase tracking-widest font-semibold"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300 text-white group-hover:text-charcoal" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
