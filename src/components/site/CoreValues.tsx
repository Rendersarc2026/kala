"use client";

import { motion } from "framer-motion";

const values = [
 {
 title: "Clarity of Vision",
 description:
 "Every project begins with a clear understanding of purpose. We define the intent before the form, ensuring each design decision carries meaning.",
 },
 {
 title: "Craft & Detail",
 description:
 "We believe beauty lives in the details. Our team obsesses over materiality, proportion, and finish to deliver spaces that reward close inspection.",
 },
 {
 title: "Sustainable Practice",
 description:
 "Conscious design for a responsible future. We integrate sustainable materials and passive strategies into every project without compromise on aesthetics.",
 },
 {
 title: "Client Collaboration",
 description:
 "The best outcomes emerge from deep listening. We work in close partnership with clients, treating every brief as a unique opportunity to create.",
 },
 {
 title: "Timeless Quality",
 description:
 "We design beyond trends. Our work is rooted in enduring principles of space, light, and material that remain relevant across generations.",
 },
 {
 title: "Innovative Thinking",
 description:
 "Tradition and innovation coexist in our studio. We constantly challenge conventions to find fresh solutions that are both original and contextually sensitive.",
 },
];

export default function CoreValues() {
 return (
 <section id="core-values" className="py-28 md:py-40 bg-charcoal text-white">
 <div className="max-w-7xl mx-auto px-8 md:px-14">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: 24 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.8 }}
 className="mb-16 md:mb-24"
 >
 <p className="mb-5 text-[11px] uppercase tracking-editorial text-white/45 font-sans font-medium">What Drives Us</p>
 <h2 className="font-sans text-4xl md:text-6xl font-light text-white">
 Core Values
 </h2>
 </motion.div>

 {/* 3-column grid */}
 <motion.div
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true, margin: "-60px" }}
 variants={{
 hidden: {},
 visible: { transition: { staggerChildren: 0.1 } },
 }}
 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 md:gap-y-18"
 >
 {values.map((value, i) => (
 <motion.div
 key={value.title}
 variants={{
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
 }}
 className="group"
 >
 {/* Ghost number */}
 <span className="block font-sans text-[80px] leading-none text-white/[0.06] mb-2 select-none">
 {String(i + 1).padStart(2, "0")}
 </span>
 {/* Thin divider */}
 <div className="w-8 h-[1px] bg-terracotta mb-5" />
 <h3 className="font-sans text-xl font-light text-white mb-3 group-hover:text-terracotta transition-colors duration-300">
 {value.title}
 </h3>
 <p className="text-sm text-white/55 font-sans font-light leading-relaxed">
 {value.description}
 </p>
 </motion.div>
 ))}
 </motion.div>
 </div>
 </section>
 );
}
