import ProcessTimeline from "@/components/site/ProcessTimeline";
import Image from "next/image";

export const metadata = {
  title: "Our Process | KALA DESIGN STUDIO",
  description:
    "A clear, structured approach from initial discovery to final handover.",
};

export default function ProcessPage() {
  return (
    <>
      <section className="pt-40 pb-16 md:pt-52 md:pb-20 px-8 md:px-14 max-w-7xl mx-auto">
        <p className="label mb-5">How We Work</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h1 className="font-sans text-5xl md:text-7xl font-light text-charcoal leading-tight">
            Our
            <br />
            Process
          </h1>
          <p className="text-sm text-charcoal-light font-sans font-light max-w-xs leading-relaxed">
            A clear, structured approach that keeps you informed, involved, and
            confident at every stage.
          </p>
        </div>
      </section>

      {/* Full-width hero image */}
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden">
        <Image
          src="/interior/wallpaperflare.com_wallpaper (1).jpg"
          alt="Our design process"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* subtle dark gradient overlay at bottom so it blends into ivory */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ivory/60" />
      </div>

      <div className="w-full h-[1px] bg-studio-border" />

      <section className="py-16 md:py-28 px-8 md:px-14 max-w-7xl mx-auto">
        <ProcessTimeline />
      </section>
    </>
  );
}
