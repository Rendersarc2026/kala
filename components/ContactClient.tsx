"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, CheckCircle, Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface ContactData {
  phone: string;
  email: string;
  hoursMonFri: string;
  hoursSat: string;
  hoursSun: string;
  mapEmbedUrl: string;
}

const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: easeLarge },
};

const stagger = {
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: easeLarge },
};

export default function ContactClient({
  initialContact,
}: {
  initialContact: ContactData;
}) {
  const contact = initialContact;
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    projectType: "residential",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Please provide your name.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Please provide your email address.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please provide a valid email address.";
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Please describe your project brief.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        projectType: "residential",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="w-full bg-charcoal text-bone">
      <div className="w-full pt-28 pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <motion.section {...fadeUp} className="mb-16 md:mb-24 max-w-3xl">
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-bone font-light leading-[1.12] tracking-wide mb-5">
              Let&apos;s Design Your Space
            </h1>
            <p className="font-sans text-sm sm:text-base text-bone/70 max-w-xl font-light leading-relaxed">
              Contact Us about your residence, workplace, or hospitality
              project. Get in touch with our design studio.
            </p>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Form */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: easeLarge }}
              className="lg:col-span-7"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-sm">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <h3 className="font-serif text-2xl text-bone font-light mb-8 tracking-wide">
                        Enquiry Form
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="name"
                            className="font-sans text-[9px] tracking-[0.25em] uppercase font-bold text-bone/50"
                          >
                            Your Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full bg-white/5 border rounded-lg py-3 px-4 text-sm font-sans focus:outline-none transition-all duration-300 font-light text-bone ${
                              errors.name
                                ? "border-red-400"
                                : focusedField === "name"
                                  ? "border-terracotta-light ring-1 ring-terracotta-light/15"
                                  : "border-white/10"
                            }`}
                            placeholder="Eleanor Vance"
                          />
                          {errors.name && (
                            <p className="font-sans text-[10px] text-red-400 font-light mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="email"
                            className="font-sans text-[9px] tracking-[0.25em] uppercase font-bold text-bone/50"
                          >
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full bg-white/5 border rounded-lg py-3 px-4 text-sm font-sans focus:outline-none transition-all duration-300 font-light text-bone ${
                              errors.email
                                ? "border-red-400"
                                : focusedField === "email"
                                  ? "border-terracotta-light ring-1 ring-terracotta-light/15"
                                  : "border-white/10"
                            }`}
                            placeholder="eleanor@example.com"
                          />
                          {errors.email && (
                            <p className="font-sans text-[10px] text-red-400 font-light mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="projectType"
                          className="font-sans text-[9px] tracking-[0.25em] uppercase font-bold text-bone/50"
                        >
                          Project Category
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("projectType")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full bg-white/5 border rounded-lg py-3 px-4 text-sm font-sans focus:outline-none transition-all duration-300 font-light text-bone ${
                            focusedField === "projectType"
                              ? "border-terracotta-light ring-1 ring-terracotta-light/15"
                              : "border-white/10"
                          }`}
                        >
                          <option value="residential" className="bg-charcoal text-bone">
                            Residential Interiors
                          </option>
                          <option value="commercial" className="bg-charcoal text-bone">
                            Commercial Interiors
                          </option>
                          <option value="hospitality" className="bg-charcoal text-bone">
                            Hospitality Interiors
                          </option>
                          <option value="office" className="bg-charcoal text-bone">
                            Office Interiors
                          </option>
                          <option value="kitchens" className="bg-charcoal text-bone">
                            Modular Kitchens
                          </option>
                          <option value="other" className="bg-charcoal text-bone">
                            Other Inquiry
                          </option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="message"
                          className="font-sans text-[9px] tracking-[0.25em] uppercase font-bold text-bone/50"
                        >
                          Project Brief *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full bg-white/5 border rounded-lg py-3 px-4 text-sm font-sans focus:outline-none transition-all duration-300 font-light text-bone resize-none ${
                            errors.message
                              ? "border-red-400"
                              : focusedField === "message"
                                ? "border-terracotta-light/60 ring-1 ring-terracotta-light/8"
                                : "border-white/10"
                          }`}
                          placeholder="Describe your design goals, spatial conditions, and timeline estimates..."
                        />
                        {errors.message && (
                          <p className="font-sans text-[10px] text-red-400 font-light mt-1">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="group relative w-full flex items-center justify-center bg-bone text-[#121212] hover:bg-terracotta hover:text-white py-4 transition-all duration-500 rounded-lg font-sans text-xs uppercase tracking-widest font-semibold disabled:opacity-50 overflow-hidden"
                      >
                        <motion.span
                          className="relative z-10 flex items-center"
                          animate={
                            isSubmitting ? { opacity: 0 } : { opacity: 1 }
                          }
                        >
                          Send Enquiry
                          <Send className="h-3.5 w-3.5 ml-2.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </motion.span>
                        {isSubmitting && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="h-5 w-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                          </motion.div>
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: easeLarge }}
                      className="py-16 text-center space-y-6 flex flex-col items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        <CheckCircle className="h-16 w-16 text-terracotta-light stroke-[1px]" />
                      </motion.div>
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl text-bone font-light">
                          Enquiry Received
                        </h3>
                        <p className="font-sans text-sm text-bone/70 max-w-sm leading-relaxed font-light mx-auto">
                          Thank you for reaching out. A studio representative
                          will review your project brief and contact you within
                          two business days.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSuccess(false)}
                        className="font-sans text-xs uppercase tracking-widest text-terracotta-light hover:text-white transition-colors font-semibold border-b border-terracotta-light/20 pb-1"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right Column: Contact Details */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: easeLarge }}
              className="lg:col-span-5 space-y-10 lg:pt-4"
            >
              <motion.div
                {...stagger}
                transition={{ ...stagger.transition, delay: 0.1 }}
              >
                <h3 className="font-serif text-xl text-bone font-light mb-6 tracking-wide">
                  Enquiries
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 group">
                    <div className="h-11 w-11 rounded-xl bg-white/[0.03] border border-white/8 flex items-center justify-center group-hover:bg-terracotta-light/10 group-hover:border-terracotta-light/30 transition-all duration-300">
                      <Phone className="h-4 w-4 text-terracotta-light stroke-[1.5px]" />
                    </div>
                    <div>
                      <span className="font-sans text-[9px] tracking-[0.25em] text-bone/50 uppercase block font-bold">
                        Call Us
                      </span>
                      <a
                        href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                        className="font-sans text-sm text-bone font-light hover:text-terracotta-light transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="h-11 w-11 rounded-xl bg-white/[0.03] border border-white/8 flex items-center justify-center group-hover:bg-terracotta-light/10 group-hover:border-terracotta-light/30 transition-all duration-300">
                      <Mail className="h-4 w-4 text-terracotta-light stroke-[1.5px]" />
                    </div>
                    <div>
                      <span className="font-sans text-[9px] tracking-[0.25em] text-bone/50 uppercase block font-bold">
                        Email Studio
                      </span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="font-sans text-sm text-bone font-light hover:text-terracotta-light transition-colors"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...stagger}
                transition={{ ...stagger.transition, delay: 0.2 }}
              >
                <h3 className="font-serif text-xl text-bone font-light mb-6 tracking-wide">
                  Studio Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-sans text-xs text-bone/60 font-light">
                      Mon — Fri
                    </span>
                    <span className="font-sans text-xs text-bone font-light">
                      {contact.hoursMonFri}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-sans text-xs text-bone/60 font-light">
                      Saturday
                    </span>
                    <span className="font-sans text-xs text-bone font-light">
                      {contact.hoursSat}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-bone/60 font-light">
                      Sunday
                    </span>
                    <span className="font-sans text-xs text-bone/30 font-light">
                      {contact.hoursSun}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Google Map */}
          <motion.section
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: easeLarge }}
            className="mt-20 md:mt-28"
          >
            <div className="mb-8">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta-light font-semibold">
                Find Us
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-sm border border-white/10">
              <iframe
                src={contact.mapEmbedUrl}
                width="100%"
                height="520"
                style={{
                  border: 0,
                  display: "block",
                  filter: "grayscale(20%) contrast(1.1) brightness(0.85)",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KALA Studio Location"
              />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
