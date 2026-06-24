import Image from "next/image";
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
  title: "About Us | KALA DESIGN STUDIO",
  description:
    "Learn about KALA DESIGN STUDIO — our company profile, story, vision, mission, and core values.",
};

export default function AboutPage() {
  return (
    <>
      {/* Company Profile */}
      <section className="pt-40 pb-20 md:pt-52 md:pb-28 px-8 md:px-14 max-w-7xl mx-auto">
        <p className="label mb-5">Company Profile</p>
        <h1 className="font-sans text-5xl md:text-7xl font-light text-charcoal leading-tight mb-10">
          KALA DESIGN STUDIO
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <p className="text-base text-charcoal-light font-sans font-light leading-relaxed">
            KALA DESIGN STUDIO is a boutique architecture and interior design
            practice based in London, founded on the belief that exceptional
            spaces emerge from a deep understanding of how people live, work,
            and connect. We work across residential, commercial, and
            hospitality sectors, delivering projects that balance timeless
            aesthetics with modern functionality.
          </p>
          <p className="text-base text-charcoal-light font-sans font-light leading-relaxed">
            Our team brings together diverse expertise — from architecture and
            interior design to material curation and project management —
            allowing us to take projects from concept through to completion
            with precision and care.
          </p>
        </div>
      </section>

      <div className="w-full h-[1px] bg-studio-border" />

      {/* Company Story */}
      <section className="py-20 md:py-32 px-8 md:px-14 max-w-7xl mx-auto">
        <p className="label mb-5">Our Story</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-sans text-3xl md:text-5xl font-light text-charcoal leading-tight mb-8">
              Built on a passion
              <br />
              for thoughtful design
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-base text-charcoal-light font-sans font-light leading-relaxed mb-6">
              KALA DESIGN STUDIO began with a simple conviction: that
              architecture and interiors should serve the people who inhabit
              them, not the other way around. What started as a small
              practice has grown into a collaborative studio working on
              projects across the UK and beyond.
            </p>
            <p className="text-base text-charcoal-light font-sans font-light leading-relaxed mb-6">
              Every project we undertake is shaped by the same philosophy —
              rigorous thinking, material honesty, and an unwavering
              commitment to craft. We believe the best spaces are quiet,
              confident, and deeply considered.
            </p>
            <p className="text-base text-charcoal-light font-sans font-light leading-relaxed">
              Today, our portfolio spans private residences, boutique
              commercial spaces, and hospitality environments, each one a
              testament to the power of collaborative, client-led design.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] bg-studio-border" />

      {/* Vision & Mission */}
      <section className="py-20 md:py-32 px-8 md:px-14 max-w-7xl mx-auto bg-ivory-dark">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          <div>
            <p className="label mb-5">Vision</p>
            <h2 className="font-sans text-3xl md:text-4xl font-light text-charcoal leading-tight mb-8">
              To create spaces that
              <br />
              inspire and endure
            </h2>
            <p className="text-base text-charcoal-light font-sans font-light leading-relaxed">
              We envision a world where architecture and interior design
              enrich everyday life. Our work strives to set a standard for
              thoughtful, sustainable, and humane spaces that age gracefully
              and remain relevant for generations.
            </p>
          </div>
          <div>
            <p className="label mb-5">Mission</p>
            <h2 className="font-sans text-3xl md:text-4xl font-light text-charcoal leading-tight mb-8">
              Design with purpose,
              <br />
              deliver with integrity
            </h2>
            <p className="text-base text-charcoal-light font-sans font-light leading-relaxed">
              Our mission is to partner with clients to realise their vision
              through a process that is collaborative, transparent, and
              rigorously creative. We are committed to design excellence,
              responsible material choices, and projects that respect both
              budget and timeline.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] bg-studio-border" />

      {/* Core Values */}
      <section className="py-20 md:py-32 px-8 md:px-14 max-w-7xl mx-auto">
        <p className="label mb-5">Core Values</p>
        <h2 className="font-sans text-4xl md:text-5xl font-light text-charcoal leading-tight mb-16">
          What guides everything we do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {values.map((value) => (
            <div key={value.title} className="group">
              <div className="w-10 h-px bg-terracotta mb-6" />
              <h3 className="font-sans text-xl font-light text-charcoal mb-4">
                {value.title}
              </h3>
              <p className="text-sm text-charcoal-light font-sans font-light leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-32 bg-ivory-dark border-t border-studio-border" id="team">
        <div className="px-8 md:px-14 max-w-7xl mx-auto">
          <p className="label mb-5">The People</p>
          <h2 className="font-sans text-4xl md:text-5xl font-light text-charcoal mb-16 md:mb-20">
            Meet the Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {team.map((member) => (
              <div key={member.name} className="group">
                <div className="relative h-[380px] overflow-hidden mb-5">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <h3 className="font-sans text-xl font-light text-charcoal mb-1">
                  {member.name}
                </h3>
                <p className="label mb-3">{member.role}</p>
                <p className="text-sm text-charcoal-light font-sans font-light leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] bg-studio-border" />

      {/* Why Choose Us */}
      <section className="py-20 md:py-32 bg-ivory border-t border-studio-border" id="why-choose-us">
        <div className="px-8 md:px-14 max-w-7xl mx-auto">
          <p className="label mb-5">Our Difference</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20">
            <h2 className="font-sans text-4xl md:text-5xl font-light text-charcoal leading-tight">
              Why Choose
              <br />
              KALA DESIGN STUDIO
            </h2>
            <p className="text-sm text-charcoal-light font-sans font-light max-w-xs leading-relaxed">
              Design should be rigorous, beautiful, and deeply human. Here is what
              working with us actually means.
            </p>
          </div>

          <div className="border-t border-studio-border">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <div
                  key={reason.title}
                  className="group grid grid-cols-12 gap-4 md:gap-10 py-10 md:py-12 border-b border-studio-border hover:bg-ivory-dark transition-colors duration-500 -mx-3 px-3"
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-ivory-dark border-t border-studio-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8 px-8 md:px-14">
          <h2 className="font-sans text-3xl md:text-5xl font-light text-charcoal leading-tight">
            Start a conversation
          </h2>
          <Link
            href="/contact"
            className="cta-link group inline-flex items-center gap-4"
          >
            <span className="relative text-[11px] uppercase tracking-editorial text-charcoal/70 group-hover:text-charcoal">
              Contact the studio
              <span className="underline-bar" />
            </span>
            <span className="text-charcoal/40 group-hover:text-charcoal group-hover:translate-x-1.5 transition-all duration-300">
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

const team = [
  {
    name: "Elena Vassiliou",
    role: "Founding Principal & Lead Architect",
    bio: "Elena founded KALA DESIGN STUDIO after a decade at leading firms in London and Tokyo. Her work is defined by an acute sensitivity to light, material, and the rhythms of daily life.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop&crop=face",
  },
  {
    name: "Marcus Okafor",
    role: "Director of Interiors",
    bio: "Marcus brings a rigorous editorial sensibility to every interior. He has shaped some of the studio's most celebrated residential and hospitality projects.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop&crop=face",
  },
  {
    name: "Yuki Tanaka",
    role: "Senior Designer",
    bio: "Yuki's background spans architecture and landscape, giving her a unique ability to connect interiors with the outside world.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80&fit=crop&crop=face",
  },
  {
    name: "Omar Haddad",
    role: "Project Architect",
    bio: "Omar oversees the technical delivery of complex projects. His precision ensures the design vision survives intact through to construction.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&fit=crop&crop=face",
  },
  {
    name: "Priya Nair",
    role: "Material & Specification Lead",
    bio: "Priya manages the studio's material library, curating an ever-evolving palette of finishes, textiles, and surfaces from global suppliers.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80&fit=crop&crop=face",
  },
  {
    name: "Theo Brennan",
    role: "Visualisation & Design Technology",
    bio: "Theo leads the studio's 3D visualisation and computational workflows, bridging creative vision with digital precision.",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80&fit=crop&crop=face",
  },
];

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

const values = [
  {
    title: "Design Excellence",
    description:
      "We hold every line, material, and detail to the highest standard. Good design is not a luxury — it is a discipline we practise daily.",
  },
  {
    title: "Collaboration",
    description:
      "The best results come from genuine partnership. We listen carefully, challenge constructively, and work alongside our clients and contractors as one team.",
  },
  {
    title: "Sustainability",
    description:
      "We approach sustainability with honesty and pragmatism. Through thoughtful material selection, durable construction, and timeless aesthetics, we build responsibly.",
  },
  {
    title: "Integrity",
    description:
      "We do what we say we will do. Clear communication, ethical practice, and respect for every person and resource involved in a project are non-negotiable.",
  },
];
