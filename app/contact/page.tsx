'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

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
    // Clear errors as user types
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
    
    // Simulate submission
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

  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="w-full pt-28 pb-24 md:pb-36 bg-bone">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <section className="mb-16 md:mb-24">
          <div className="mb-8">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-terracotta font-semibold">
              Dialogue
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal font-light leading-[1.15] tracking-wide mb-6">
            Let&apos;s Design Your Space
          </h1>
          <p className="font-sans text-sm sm:text-base text-charcoal-muted max-w-xl font-light leading-relaxed">
            Begin the dialogue about your residence, workplace, or hospitality project. Get in touch with our design studio.
          </p>
        </section>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-bone-dark/20 border border-charcoal/5 p-8 md:p-12 shadow-sm">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <h3 className="font-serif text-2xl text-charcoal font-light mb-6">
                    Enquiry Form
                  </h3>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="font-sans text-[10px] tracking-wider uppercase font-bold text-charcoal-light">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-bone border-b ${
                        errors.name ? 'border-red-500' : 'border-charcoal/20 focus:border-terracotta'
                      } py-3 px-1 text-sm font-sans focus:outline-none transition-colors font-light text-charcoal`}
                      placeholder="e.g. Eleanor Vance"
                    />
                    {errors.name && (
                      <p className="font-sans text-[10px] text-red-500 font-light mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="font-sans text-[10px] tracking-wider uppercase font-bold text-charcoal-light">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-bone border-b ${
                        errors.email ? 'border-red-500' : 'border-charcoal/20 focus:border-terracotta'
                      } py-3 px-1 text-sm font-sans focus:outline-none transition-colors font-light text-charcoal`}
                      placeholder="e.g. eleanor@example.com"
                    />
                    {errors.email && (
                      <p className="font-sans text-[10px] text-red-500 font-light mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Project Type Select */}
                  <div className="space-y-2">
                    <label htmlFor="projectType" className="font-sans text-[10px] tracking-wider uppercase font-bold text-charcoal-light">
                      Project Category
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full bg-bone border-b border-charcoal/20 focus:border-terracotta py-3 px-1 text-sm font-sans focus:outline-none transition-colors font-light text-charcoal"
                    >
                      <option value="residential">Residential Interiors</option>
                      <option value="commercial">Commercial Interiors</option>
                      <option value="hospitality">Hospitality Interiors</option>
                      <option value="office">Office Interiors</option>
                      <option value="kitchens">Modular Kitchens</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="font-sans text-[10px] tracking-wider uppercase font-bold text-charcoal-light">
                      Project Brief *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full bg-bone border ${
                        errors.message ? 'border-red-500' : 'border-charcoal/25 focus:border-terracotta/50'
                      } p-4 text-sm font-sans focus:outline-none transition-colors font-light text-charcoal resize-none`}
                      placeholder="Describe your design goals, spatial conditions, and timeline estimates..."
                    />
                    {errors.message && (
                      <p className="font-sans text-[10px] text-red-500 font-light mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex items-center justify-center bg-charcoal text-bone hover:bg-terracotta hover:text-white py-4 transition-all duration-500 rounded-none font-sans text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Sending Request...' : 'Send Enquiry'}</span>
                    {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1 duration-300" />}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: easeLarge }}
                  className="py-16 text-center space-y-6 flex flex-col items-center justify-center"
                >
                  <CheckCircle className="h-16 w-16 text-terracotta stroke-[1px] animate-pulse" />
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl text-charcoal font-light">
                      Enquiry Received
                    </h3>
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

          {/* Right Column: Contact Details */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* Phone & Email */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-charcoal font-light border-b border-charcoal/10 pb-4">
                Enquiries
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Phone className="h-5 w-5 text-terracotta/80 stroke-[1.5px]" />
                  <div>
                    <span className="font-sans text-[10px] tracking-wider text-charcoal-light uppercase block font-bold">Call Us</span>
                    <a href="tel:+15550199" className="font-sans text-sm text-charcoal font-light hover:text-terracotta transition-colors">
                      +1 (555) 0199
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-terracotta/80 stroke-[1.5px]" />
                  <div>
                    <span className="font-sans text-[10px] tracking-wider text-charcoal-light uppercase block font-bold">Email Studio</span>
                    <a href="mailto:studio@kaladesign.com" className="font-sans text-sm text-charcoal font-light hover:text-terracotta transition-colors">
                      studio@kaladesign.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Address */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-charcoal font-light border-b border-charcoal/10 pb-4">
                Studio Location
              </h3>
              
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-terracotta/80 stroke-[1.5px] mt-1" />
                <div className="space-y-2">
                  <span className="font-sans text-[10px] tracking-wider text-charcoal-light uppercase block font-bold">Address</span>
                  <p className="font-sans text-sm text-charcoal font-light leading-relaxed">
                    85 Mercer Street, 4th Floor<br />
                    Soho, New York, NY 10012
                  </p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block font-sans text-xs text-terracotta hover:underline font-light pt-1"
                  >
                    Get Directions &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Chat & Socials */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-charcoal font-light border-b border-charcoal/10 pb-4">
                Quick Connections
              </h3>
              
              <div className="space-y-4">
                <p className="font-sans text-xs text-charcoal-light leading-relaxed font-light">
                  For immediate coordination or queries, chat directly via WhatsApp or connect on social media for studio updates.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/15550199"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 border border-charcoal/20 hover:border-terracotta hover:text-terracotta py-2.5 px-4 font-sans text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 bg-bone"
                  >
                    <span>WhatsApp Chat</span>
                  </a>
                  
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 border border-charcoal/20 hover:border-terracotta hover:text-terracotta py-2.5 px-4 font-sans text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 bg-bone"
                  >
                    <InstagramIcon className="h-3 w-3" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 border border-charcoal/20 hover:border-terracotta hover:text-terracotta py-2.5 px-4 font-sans text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 bg-bone"
                  >
                    <CardFacebookIcon className="h-3 w-3" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Clean helper icon to prevent compile errors for Facebook
function CardFacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
