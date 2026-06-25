'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, CheckCircle, ArrowRight, Send } from 'lucide-react';

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

const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: easeLarge },
};

const stagger = {
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: easeLarge },
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    projectType: 'residential',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Please provide your name.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Please provide your email address.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email address.';
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Please describe your project brief.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      console.log('KALA Studio - Form Submission:', formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        projectType: 'residential',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className="w-full bg-white">
      <div className="w-full pt-28 pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <motion.section {...fadeUp} className="mb-16 md:mb-24 max-w-3xl">
            <div className="mb-6">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold">
                Dialogue
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal font-light leading-[1.12] tracking-wide mb-5">
              Let&apos;s Design Your Space
            </h1>
            <p className="font-sans text-sm sm:text-base text-charcoal-muted max-w-xl font-light leading-relaxed">
              Begin the dialogue about your residence, workplace, or hospitality project. Get in touch with our design studio.
            </p>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Form */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: easeLarge }}
              className="lg:col-span-7"
            >
              <div className="bg-white border border-charcoal/5 rounded-2xl p-8 md:p-12 shadow-sm">
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
                      <h3 className="font-serif text-2xl text-charcoal font-light mb-8 tracking-wide">
                        Enquiry Form
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label htmlFor="name" className="font-sans text-[9px] tracking-[0.25em] uppercase font-bold text-charcoal-light">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full bg-bone/40 border rounded-lg py-3 px-4 text-sm font-sans focus:outline-none transition-all duration-300 font-light text-charcoal ${
                              errors.name
                                ? 'border-red-400'
                                : focusedField === 'name'
                                  ? 'border-terracotta ring-1 ring-terracotta/15'
                                  : 'border-charcoal/10'
                            }`}
                            placeholder="Eleanor Vance"
                          />
                          {errors.name && (
                            <p className="font-sans text-[10px] text-red-500 font-light mt-1">{errors.name}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="email" className="font-sans text-[9px] tracking-[0.25em] uppercase font-bold text-charcoal-light">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full bg-bone/40 border rounded-lg py-3 px-4 text-sm font-sans focus:outline-none transition-all duration-300 font-light text-charcoal ${
                              errors.email
                                ? 'border-red-400'
                                : focusedField === 'email'
                                  ? 'border-terracotta ring-1 ring-terracotta/15'
                                  : 'border-charcoal/10'
                            }`}
                            placeholder="eleanor@example.com"
                          />
                          {errors.email && (
                            <p className="font-sans text-[10px] text-red-500 font-light mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="projectType" className="font-sans text-[9px] tracking-[0.25em] uppercase font-bold text-charcoal-light">
                          Project Category
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('projectType')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full bg-bone/40 border rounded-lg py-3 px-4 text-sm font-sans focus:outline-none transition-all duration-300 font-light text-charcoal ${
                            focusedField === 'projectType' ? 'border-terracotta ring-1 ring-terracotta/15' : 'border-charcoal/10'
                          }`}
                        >
                          <option value="residential">Residential Interiors</option>
                          <option value="commercial">Commercial Interiors</option>
                          <option value="hospitality">Hospitality Interiors</option>
                          <option value="office">Office Interiors</option>
                          <option value="kitchens">Modular Kitchens</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="message" className="font-sans text-[9px] tracking-[0.25em] uppercase font-bold text-charcoal-light">
                          Project Brief *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full bg-bone/40 border rounded-lg py-3 px-4 text-sm font-sans focus:outline-none transition-all duration-300 font-light text-charcoal resize-none ${
                            errors.message
                              ? 'border-red-400'
                              : focusedField === 'message'
                                ? 'border-terracotta/60 ring-1 ring-terracotta/8'
                                : 'border-charcoal/10'
                          }`}
                          placeholder="Describe your design goals, spatial conditions, and timeline estimates..."
                        />
                        {errors.message && (
                          <p className="font-sans text-[10px] text-red-500 font-light mt-1">{errors.message}</p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="group relative w-full flex items-center justify-center bg-charcoal text-bone hover:bg-terracotta py-4 transition-all duration-500 rounded-lg font-sans text-xs uppercase tracking-widest font-semibold disabled:opacity-50 overflow-hidden"
                      >
                        <motion.span
                          className="relative z-10 flex items-center"
                          animate={isSubmitting ? { opacity: 0 } : { opacity: 1 }}
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
                            <div className="h-5 w-5 border-2 border-bone border-t-transparent rounded-full animate-spin" />
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
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                      >
                        <CheckCircle className="h-16 w-16 text-terracotta stroke-[1px]" />
                      </motion.div>
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl text-charcoal font-light">Enquiry Received</h3>
                        <p className="font-sans text-sm text-charcoal-light max-w-sm leading-relaxed font-light mx-auto">
                          Thank you for reaching out. A studio representative will review your project brief and contact you within two business days.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSuccess(false)}
                        className="font-sans text-xs uppercase tracking-widest text-terracotta hover:text-terracotta-dark transition-colors font-semibold border-b border-terracotta/20 pb-1"
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
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: easeLarge }}
              className="lg:col-span-5 space-y-10 lg:pt-4"
            >
              <motion.div {...stagger} transition={{ ...stagger.transition, delay: 0.1 }}>
                <h3 className="font-serif text-xl text-charcoal font-light mb-6 tracking-wide">
                  Enquiries
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 group">
                    <div className="h-11 w-11 rounded-xl bg-charcoal/[0.03] border border-charcoal/8 flex items-center justify-center group-hover:bg-terracotta/8 group-hover:border-terracotta/20 transition-all duration-300">
                      <Phone className="h-4 w-4 text-terracotta/70 stroke-[1.5px]" />
                    </div>
                    <div>
                      <span className="font-sans text-[9px] tracking-[0.25em] text-charcoal-light uppercase block font-bold">Call Us</span>
                      <a href="tel:+15550199" className="font-sans text-sm text-charcoal font-light hover:text-terracotta transition-colors">
                        +1 (555) 0199
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="h-11 w-11 rounded-xl bg-charcoal/[0.03] border border-charcoal/8 flex items-center justify-center group-hover:bg-terracotta/8 group-hover:border-terracotta/20 transition-all duration-300">
                      <Mail className="h-4 w-4 text-terracotta/70 stroke-[1.5px]" />
                    </div>
                    <div>
                      <span className="font-sans text-[9px] tracking-[0.25em] text-charcoal-light uppercase block font-bold">Email Studio</span>
                      <a href="mailto:studio@kaladesign.com" className="font-sans text-sm text-charcoal font-light hover:text-terracotta transition-colors">
                        studio@kaladesign.com
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div {...stagger} transition={{ ...stagger.transition, delay: 0.2 }}>
                <h3 className="font-serif text-xl text-charcoal font-light mb-6 tracking-wide">
                  Studio Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-charcoal/5 pb-3">
                    <span className="font-sans text-xs text-charcoal-light font-light">Mon — Fri</span>
                    <span className="font-sans text-xs text-charcoal font-light">9:00 AM — 7:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-charcoal/5 pb-3">
                    <span className="font-sans text-xs text-charcoal-light font-light">Saturday</span>
                    <span className="font-sans text-xs text-charcoal font-light">10:00 AM — 5:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-charcoal-light font-light">Sunday</span>
                    <span className="font-sans text-xs text-charcoal/40 font-light">Closed</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Google Map */}
          <motion.section
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: easeLarge }}
            className="mt-20 md:mt-28"
          >
            <div className="mb-8">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold">
                Find Us
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-sm border border-charcoal/5">
              <iframe
                src="https://maps.google.com/maps?q=Thalassery+Kerala+India&t=k&z=14&output=embed"
                width="100%"
                height="520"
                style={{ border: 0, display: 'block' }}
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
