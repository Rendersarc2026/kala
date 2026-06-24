import React from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
}

const PROCESS_STEPS: Step[] = [
  {
    number: '01',
    title: 'Consultation',
    description: 'We align on your design vision, budget framework, and spatial preferences to map out the creative direction.',
  },
  {
    number: '02',
    title: 'Contracting',
    description: 'Formalizing spatial layouts, structural feasibility reports, architectural blueprints, and detailed timelines.',
  },
  {
    number: '03',
    title: '3D Visualization',
    description: 'Developing high-fidelity digital renderings so you can experience scale, volume, material transitions, and lighting.',
  },
  {
    number: '04',
    title: 'Material Selection',
    description: 'Visiting galleries to touch and curate premium stones, organic fabrics, raw wood samples, and custom metal fixtures.',
  },
  {
    number: '05',
    title: 'Execution',
    description: 'Orchestrating our on-site craftsmen, stonemasons, and carpenters under daily design-led supervision.',
  },
  {
    number: '06',
    title: 'Handover',
    description: 'Adding structural layers, curated styling details, and final cleanings before walking you into your ready-to-live home.',
  },
];

export default function ProcessStrip() {
  return (
    <div className="w-full relative py-12">
      {/* Horizontal timeline track for desktop */}
      <div className="hidden lg:block absolute top-[112px] left-0 right-0 h-[1px] bg-charcoal/10 z-0" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-6 relative z-10">
        {PROCESS_STEPS.map((step, idx) => (
          <div key={idx} className="group flex flex-col space-y-4">
            
            {/* Step Circle & Number */}
            <div className="flex items-center space-x-4 lg:flex-col lg:items-start lg:space-x-0 lg:space-y-6">
              <div className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center bg-bone group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-bone transition-all duration-500 ease-[0.16,1,0.3,1] z-10">
                <span className="font-serif text-sm font-light">
                  {step.number}
                </span>
              </div>
            </div>
            
            {/* Step details */}
            <div className="space-y-2 pt-2">
              <h4 className="font-serif text-lg text-charcoal group-hover:text-terracotta transition-colors duration-300">
                {step.title}
              </h4>
              <p className="font-sans text-xs text-charcoal-light leading-relaxed font-light">
                {step.description}
              </p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
