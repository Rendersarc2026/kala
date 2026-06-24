import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import {
  CheckCircle,
  Zap,
  Shield,
  Clock,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Why Choose Us | KALA DESIGN STUDIO",
  description:
    "Discover what sets KALA DESIGN STUDIO apart — philosophy, process, and a commitment to exceptional design outcomes.",
};

const reasons = [
  {
    icon: CheckCircle,
    title: "Uncompromising Quality",
    description:
      "We hold ourselves to the highest standards at every stage. From concept to completion, each decision is made with intention. Our work speaks through the longevity and coherence of every space.",
    stat: "100%",
    statLabel: "Client satisfaction",
  },
  {
    icon: Zap,
    title: "Decisive Process",
    description:
      "We move with clarity. Our structured approach eliminates unnecessary iterations while preserving room for discovery. Clients experience a clear journey from brief to delivery.",
    stat: "40+",
    statLabel: "Projects delivered",
  },
  {
    icon: Shield,
    title: "Trusted Partnership",
    description:
      "We treat every client relationship as a long-term partnership. Transparency, honest communication, and respect for your investment are non-negotiables in how we operate.",
    stat: "12+",
    statLabel: "Years in practice",
  },
  {
    icon: Clock,
    title: "Respect for Time & Budget",
    description:
      "Architectural projects need not be chaotic. Our project management keeps timelines realistic and budgets disciplined. We plan rigorously so that execution runs smoothly.",
    stat: "95%",
    statLabel: "On-time delivery",
  },
  {
    icon: HeartHandshake,
    title: "Deeply Collaborative",
    description:
      "Great design doesn't happen in isolation. Your insights and vision are essential ingredients. Our process draws them out through meaningful dialogue at every stage.",
    stat: "3",
    statLabel: "Continents of work",
  },
  {
    icon: TrendingUp,
    title: "Measurable Impact",
    description:
      "Our spaces are designed to function and appreciate over time. Thoughtful design elevates property value, enhances wellbeing, and creates lasting impressions for years to come.",
    stat: "30%",
    statLabel: "Avg. property value increase",
  },
];

export default function WhyChooseUsPage() {
  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <Navbar />

      {/* Page header */}
      <section className="pt-40 pb-16 md:pt-52 md:pb-20 px-8 md:px-14 max-w-7xl mx-auto">
        <p className="label mb-5">Our Difference</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h1 className="font-sans text-5xl md:text-7xl font-light text-charcoal leading-tight">
            Why Choose
            <br />
            KALA DESIGN STUDIO
          </h1>
          <p className="text-sm text-charcoal-light font-sans font-light max-w-xs leading-relaxed">
            Design should be rigorous, beautiful, and deeply human. Here is what
            working with us actually means.
          </p>
        </div>
      </section>

      <div className="w-full h-[1px] bg-studio-border" />

      {/* Reasons */}
      <section className="py-16 md:py-24 px-8 md:px-14 max-w-7xl mx-auto">
        <div className="border-t border-studio-border">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="group grid grid-cols-12 gap-4 md:gap-10 py-10 md:py-12 border-b border-studio-border
 hover:bg-ivory-dark transition-colors duration-500 -mx-3 px-3"
              >
                <div className="col-span-12 md:col-span-2 flex md:flex-col items-center md:items-start gap-3 md:gap-0.5">
                  <span className="font-sans text-3xl font-light text-charcoal/80">
                    {reason.stat}
                  </span>
                  <span className="label">{reason.statLabel}</span>
                </div>
                <div className="col-span-12 md:col-span-3 flex items-start gap-4">
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-terracotta mt-1 flex-shrink-0"
                  />
                  <h3 className="font-sans text-xl md:text-2xl font-light text-charcoal group-hover:text-terracotta transition-colors duration-300">
                    {reason.title}
                  </h3>
                </div>
                <p className="col-span-12 md:col-span-6 text-sm text-charcoal-light font-sans font-light leading-relaxed">
                  {reason.description}
                </p>
                <div className="hidden md:flex md:col-span-1 justify-end items-start pt-1">
                  <span className="text-[11px] tracking-editorial text-charcoal/20 font-sans">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-8 md:px-14 bg-ivory-dark border-t border-studio-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <h2 className="font-sans text-3xl md:text-5xl font-light text-charcoal leading-tight">
            Let&apos;s build something
            <br />
            exceptional together
          </h2>
          <Link
            href="/contact"
            className="cta-link group inline-flex items-center gap-4"
          >
            <span className="relative text-[11px] uppercase tracking-editorial text-charcoal/70 group-hover:text-charcoal">
              Get in touch
              <span className="underline-bar" />
            </span>
            <span className="text-charcoal/40 group-hover:text-charcoal group-hover:translate-x-1.5 transition-all duration-300">
              →
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
