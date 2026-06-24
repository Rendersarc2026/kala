"use client";

import { useState } from "react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

const contactDetails = [
 { icon: Mail, label: "Email", value: "hello@kalastudio.com", href: "mailto:hello@kalastudio.com" },
 { icon: Phone, label: "Phone", value: "+44 20 7946 0958", href: "tel:+442079460958" },
 { icon: MapPin, label: "Studio", value: "14 Whitfield Street, London", href: "https://maps.google.com" },
];

const projectTypes = [
 "Residential — New Build",
 "Residential — Renovation",
 "Interior Design",
 "Commercial / Hospitality",
 "Landscape & Outdoor",
 "Other",
];

export default function ContactPage() {
 const [submitted, setSubmitted] = useState(false);
 const [form, setForm] = useState({ name: "", email: "", projectType: "", budget: "", message: "" });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
 setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 setSubmitted(true);
 };

 return (
 <main className="min-h-screen bg-ivory text-charcoal">
 <Navbar />

 {/* Page header */}
 <section className="pt-40 pb-16 md:pt-52 md:pb-20 px-8 md:px-14 max-w-7xl mx-auto">
 <p className="label mb-5">Get In Touch</p>
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
 <h1 className="font-sans text-5xl md:text-7xl font-light text-charcoal leading-tight">
 Contact<br />Us
 </h1>
 <p className="text-sm text-charcoal-light font-sans font-light max-w-xs leading-relaxed">
 Whether you have a project in mind or simply want to learn more
 about our work, we&apos;d love to hear from you.
 </p>
 </div>
 </section>

 <div className="w-full h-[1px] bg-studio-border" />

 <section className="py-16 md:py-24 px-8 md:px-14 max-w-7xl mx-auto">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">

 {/* Left — contact info */}
 <div className="lg:col-span-4 flex flex-col gap-10">
 <div>
 <p className="label mb-6">Reach us directly</p>
 <div className="flex flex-col gap-7">
 {contactDetails.map((item) => {
 const Icon = item.icon;
 return (
 <a key={item.label} href={item.href}
 target={item.icon === MapPin ? "_blank" : undefined}
 rel="noopener noreferrer"
 className="group flex items-start gap-4">
 <div className="mt-0.5 p-2.5 bg-ivory-dark group-hover:bg-studio-border transition-colors duration-300">
 <Icon size={15} strokeWidth={1.5} className="text-charcoal-light group-hover:text-charcoal transition-colors duration-300" />
 </div>
 <div>
 <p className="label mb-1">{item.label}</p>
 <p className="text-sm text-charcoal font-sans font-light group-hover:text-terracotta transition-colors duration-300">
 {item.value}
 </p>
 </div>
 </a>
 );
 })}
 </div>
 </div>

 <div className="pt-8 border-t border-studio-border">
 <p className="label mb-4">Studio hours</p>
 <div className="flex flex-col gap-2 text-sm font-sans font-light">
 {[
 { day: "Monday – Friday", hours: "9:00 – 18:00" },
 { day: "Saturday", hours: "By appointment" },
 { day: "Sunday", hours: "Closed" },
 ].map(({ day, hours }) => (
 <div key={day} className="flex justify-between">
 <span className="text-charcoal-light">{day}</span>
 <span className="text-charcoal">{hours}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Right — form */}
 <div className="lg:col-span-7 lg:col-start-6">
 {submitted ? (
 <div className="flex flex-col items-start justify-center h-full gap-6 py-12">
 <div className="w-8 h-[1px] bg-terracotta" />
 <h2 className="font-sans text-3xl md:text-4xl font-light text-charcoal">
 Thank you.
 </h2>
 <p className="text-base text-charcoal-light font-sans font-light max-w-md leading-relaxed">
 {"We've received your message and will be in touch within two business days."}
 </p>
 <button
 onClick={() => setSubmitted(false)}
 className="cta-link group inline-flex items-center gap-3 mt-4"
 >
 <span className="relative text-[11px] uppercase tracking-editorial text-charcoal/60 group-hover:text-charcoal">
 Send another message
 <span className="underline-bar" />
 </span>
 <span className="text-charcoal/40 group-hover:text-charcoal transition-all duration-300">{"→"}</span>
 </button>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="flex flex-col gap-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="flex flex-col gap-2">
 <label className="label">Your name *</label>
 <input type="text" name="name" value={form.name} onChange={handleChange} required
 placeholder="Full name"
 className="bg-transparent border-b border-studio-border focus:border-charcoal outline-none py-3 text-sm text-charcoal placeholder-charcoal/25 transition-colors duration-300 font-sans" />
 </div>
 <div className="flex flex-col gap-2">
 <label className="label">Email address *</label>
 <input type="email" name="email" value={form.email} onChange={handleChange} required
 placeholder="your@email.com"
 className="bg-transparent border-b border-studio-border focus:border-charcoal outline-none py-3 text-sm text-charcoal placeholder-charcoal/25 transition-colors duration-300 font-sans" />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="flex flex-col gap-2">
 <label className="label">Project type</label>
 <select name="projectType" value={form.projectType} onChange={handleChange}
 className="bg-transparent border-b border-studio-border focus:border-charcoal outline-none py-3 text-sm text-charcoal-light transition-colors duration-300 appearance-none cursor-pointer font-sans">
 <option value="" className="bg-ivory">Select a type</option>
 {projectTypes.map((type) => (
 <option key={type} value={type} className="bg-ivory text-charcoal">{type}</option>
 ))}
 </select>
 </div>
 <div className="flex flex-col gap-2">
 <label className="label">Approximate budget</label>
 <input type="text" name="budget" value={form.budget} onChange={handleChange}
 placeholder="e.g. £150,000 – £250,000"
 className="bg-transparent border-b border-studio-border focus:border-charcoal outline-none py-3 text-sm text-charcoal placeholder-charcoal/25 transition-colors duration-300 font-sans" />
 </div>
 </div>

 <div className="flex flex-col gap-2">
 <label className="label">Tell us about your project *</label>
 <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
 placeholder="Describe your project, timeline, location, and any specific requirements…"
 className="bg-transparent border-b border-studio-border focus:border-charcoal outline-none py-3 text-sm text-charcoal placeholder-charcoal/25 transition-colors duration-300 resize-none font-sans" />
 </div>

 <div className="flex items-center justify-between pt-2">
 <p className="text-[11px] tracking-editorial text-charcoal/30">* Required fields</p>
 <button type="submit"
 className="group flex items-center gap-3 px-8 py-3.5 border border-charcoal text-[11px] uppercase tracking-editorial text-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-300 font-sans">
 Send message
 <span className="group-hover:translate-x-1 transition-transform duration-300">{"→"}</span>
 </button>
 </div>
 </form>
 )}
 </div>
 </div>
 </section>

 <Footer />
 </main>
 );
}
