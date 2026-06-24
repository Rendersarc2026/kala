import { prisma } from "@/lib/db";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Us & Team | KALA DESIGN STUDIO",
  description:
    "Meet the people behind KALA DESIGN STUDIO — architects, designers, and makers united by a passion for exceptional space-making.",
};

export const dynamic = "force-dynamic";

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

export default async function AboutPage() {
  const about = await prisma.aboutSection.findUnique({
    where: { id: "about" },
  });

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <Navbar />

      {/* Page header */}
      <section className="pt-40 pb-16 md:pt-52 md:pb-20 px-8 md:px-14 max-w-7xl mx-auto">
        <p className="label mb-5">The Studio</p>
        <h1 className="font-sans text-5xl md:text-7xl font-light text-charcoal leading-tight">
          About Us
          <br />
          &amp; Team
        </h1>
      </section>

      <div className="w-full h-[1px] bg-studio-border" />

      {/* Studio story — asymmetric grid */}
      {about && (
        <section className="py-20 md:py-32 px-8 md:px-14 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
            {/* Images */}
            <div className="lg:col-span-5 relative flex flex-col sm:flex-row gap-5 items-start">
              <div className="relative w-full sm:w-[58%] h-[380px] sm:h-[440px]">
                <Image
                  src={about.image1Url}
                  alt="Studio"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
              <div className="relative w-[70%] sm:w-[42%] h-[280px] sm:h-[300px] sm:mt-20 border-8 border-ivory">
                <Image
                  src={about.image2Url}
                  alt="Detail"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            </div>

            {/* Text */}
            <div className="lg:col-span-6 lg:col-start-7 pt-0 md:pt-6">
              <p className="label mb-5">{about.label}</p>
              <h2 className="font-sans text-3xl md:text-5xl font-light text-charcoal leading-tight mb-8">
                {about.heading}
              </h2>
              <p className="text-base text-charcoal-light font-sans font-light leading-relaxed mb-10">
                {about.paragraph}
              </p>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-studio-border">
                {[
                  { n: "12+", l: "Years" },
                  { n: "40+", l: "Projects" },
                  { n: "3", l: "Continents" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-sans text-4xl font-light text-charcoal">
                      {s.n}
                    </p>
                    <p className="label mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      <section className="py-20 md:py-32 bg-ivory-dark border-t border-studio-border">
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

      {/* CTA */}
      <section className="py-20 px-8 md:px-14 bg-ivory">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
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

      <Footer />
    </main>
  );
}
