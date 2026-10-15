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
import { Reveal } from './Reveal';

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
      icon: <MessageSquare className="w-5 h-5 text-deep" />,
      microCta: 'Start your enquiry'
    },
    {
      num: '02',
      title: 'We Shape the Service',
      shortCopy: 'A dedicated FamilyCare advisor works with you to define the arrangement.',
      detail: 'We review practical logistics, customary ceremonies, caskets, transport, and timing in a calm, unrushed consultation.',
      icon: <FileSpreadsheet className="w-5 h-5 text-accent" />,
      microCta: 'Speak with an advisor'
    },
    {
      num: '03',
      title: 'You Review & Approve',
      shortCopy: 'You review the proposed arrangement and decide how to proceed.',
      detail: 'Receive an itemized, transparent bespoke proposal. You adjust whatever you wish, with zero hidden fees or rigid requirements.',
      icon: <CheckCircle className="w-5 h-5 text-deep" />,
      microCta: 'Discuss your requirements'
    },
    {
      num: '04',
      title: 'We Carry It Through',
      shortCopy: 'FamilyCare carries out the approved service process.',
      detail: 'From escort fleet and pallbearing to church and graveside support, our team executes every detail with care.',
      icon: <Award className="w-5 h-5 text-accent" />,
      microCta: 'Request a Bespoke Plan'
    }
  ];

  return (
    <section id="process" className="py-16 sm:py-24 bg-tint border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
              A calm, structured path from first conversation to final tribute.
            </h2>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Planning a bespoke funeral does not have to be overwhelming. FamilyCare guides you through a clear four-step process where you retain complete control over every decision.
            </p>
          </div>
        </Reveal>

        {/* 4-Step Grid with Connected Line */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-14 left-16 right-16 h-0.5 bg-hairline z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <Reveal key={step.num} delay={index * 0.05}>
                <div
                  className="card-hover-lines bg-white rounded-card p-6 sm:p-7 border border-hairline hover:border-muted/40 hover:bg-accent/5 transition-colors flex flex-col justify-between h-full"
                >
                <div>
                  {/* Step Number + Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-deep">
                      {step.num}
                    </span>
                    <div className="p-2.5 rounded-card bg-canvas border border-hairline">
                      {step.icon}
                    </div>
                  </div>

                  {/* Title & Explanations */}
                  <h3 className="font-display text-xl font-bold text-ink mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm font-semibold text-ink mb-2 leading-snug">
                    {step.shortCopy}
                  </p>

                  <p className="text-xs text-muted leading-relaxed mb-6">
                    {step.detail}
                  </p>
                </div>

                {/* Micro CTA */}
                <div className="pt-4 border-t border-hairline">
                  <button
                    onClick={() => onStepClick(step.title)}
                    className="text-xs font-semibold text-accent hover:text-ink flex items-center gap-1.5 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    <span>{step.microCta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
