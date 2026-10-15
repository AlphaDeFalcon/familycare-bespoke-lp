/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MessageSquare,
  FileSpreadsheet,
  CheckCircle,
  Award,
  ArrowRight
} from 'lucide-react';

interface HowItWorksProps {
  onStepClick: (stepTitle: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStepClick }) => {
  const steps = [
    {
      num: '01',
      title: 'Share Your Needs',
      shortCopy: 'Tell us what you are planning and what matters to your family.',
      detail: 'Reach out via web enquiry, WhatsApp, or phone. We note your desired scale, location, and cultural or personal wishes.',
      icon: <MessageSquare className="w-5 h-5 text-[#3A55A3]" />,
      microCta: 'Start your enquiry'
    },
    {
      num: '02',
      title: 'We Shape the Service',
      shortCopy: 'A dedicated FamilyCare advisor works with you to define the arrangement.',
      detail: 'We review practical logistics, customary ceremonies, caskets, transport, and timing in a calm, unrushed consultation.',
      icon: <FileSpreadsheet className="w-5 h-5 text-[#00A859]" />,
      microCta: 'Speak with an advisor'
    },
    {
      num: '03',
      title: 'You Review & Approve',
      shortCopy: 'You review the proposed arrangement and decide how to proceed.',
      detail: 'Receive an itemized, transparent bespoke proposal. You adjust whatever you wish—with zero hidden fees or rigid requirements.',
      icon: <CheckCircle className="w-5 h-5 text-[#3A55A3]" />,
      microCta: 'Discuss your requirements'
    },
    {
      num: '04',
      title: 'We Carry It Through',
      shortCopy: 'FamilyCare carries out the approved service process.',
      detail: 'From escort fleet and pallbearing to church and graveside support, our team executes every single detail with precision and grace.',
      icon: <Award className="w-5 h-5 text-[#00A859]" />,
      microCta: 'Request a Bespoke Plan'
    }
  ];

  return (
    <section id="process" className="py-16 sm:py-24 bg-[#F2EFE9] border-b border-[#E7E2D6] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A55A3]/10 text-[#3A55A3] text-xs font-semibold uppercase tracking-wider">
            <span>The Consultative Pathway</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B] tracking-tight">
            A calm, structured path from first conversation to final tribute.
          </h2>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            Planning a bespoke funeral does not have to be overwhelming. FamilyCare guides you through a clear four-step process where you retain complete control over every decision.
          </p>
        </div>

        {/* 4-Step Grid with Connected Line */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-14 left-16 right-16 h-0.5 bg-[#DDD7C6] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDD7C6] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Step Number + Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#3A55A3]">
                      {step.num}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D6]">
                      {step.icon}
                    </div>
                  </div>

                  {/* Title & Explanations */}
                  <h3 className="font-editorial text-xl font-bold text-[#18181B] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm font-semibold text-[#072A1A] mb-2 leading-snug">
                    {step.shortCopy}
                  </p>

                  <p className="text-xs text-[#52525B] leading-relaxed mb-6">
                    {step.detail}
                  </p>
                </div>

                {/* Micro CTA */}
                <div className="pt-4 border-t border-[#F2EFE9]">
                  <button
                    onClick={() => onStepClick(step.title)}
                    className="text-xs font-semibold text-[#00A859] hover:text-[#072A1A] flex items-center gap-1.5 transition-colors cursor-pointer group"
                  >
                    <span>{step.microCta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
