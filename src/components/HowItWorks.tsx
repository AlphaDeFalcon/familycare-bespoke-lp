/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

interface HowItWorksProps {
  onStepClick: (stepTitle: string) => void;
}

interface Step {
  num: string;
  title: string;
  shortCopy: string;
  microCta: string;
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Share Your Needs',
    shortCopy: 'Tell us what you are planning and what matters to your family.',
    microCta: 'Start your enquiry'
  },
  {
    num: '02',
    title: 'We Shape the Service',
    shortCopy: 'A dedicated FamilyCare advisor works with you to define the arrangement.',
    microCta: 'Speak with an advisor'
  },
  {
    num: '03',
    title: 'You Review & Approve',
    shortCopy: 'You review the proposed arrangement and decide how to proceed.',
    microCta: 'Discuss your requirements'
  },
  {
    num: '04',
    title: 'We Carry It Through',
    shortCopy: 'FamilyCare carries out the approved service process.',
    microCta: 'Request a Bespoke Plan'
  }
];

/** Brand-color fills for the station circles, in process order. */
const NODE_FILLS = ['bg-accent', 'bg-deep', 'bg-accent-deep', 'bg-forest'];

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStepClick }) => {
  const renderStepCta = (step: Step, isFinal: boolean) =>
    isFinal ? (
      <button
        onClick={() => onStepClick(step.title)}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-deep text-white px-5 py-2.5 text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <span>{step.microCta}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    ) : (
      <button
        onClick={() => onStepClick(step.title)}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-deep hover:text-ink transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
      >
        <span>{step.microCta}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    );

  const renderNode = (num: string, fillClass: string) => (
    <div
      className={`flex w-10 h-10 items-center justify-center rounded-full ${fillClass} font-display text-xl font-bold text-white shrink-0`}
    >
      {num}
    </div>
  );

  return (
    <section id="process" className="py-16 sm:py-24 bg-tint border-b border-hairline scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
              A calm, structured path from first conversation to final tribute.
            </h2>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Planning a bespoke funeral does not have to be overwhelming. FamilyCare guides you through a clear four-step process where you retain complete control over every decision.
            </p>
          </div>
        </Reveal>

        {/* Desktop: four numbered stations on one line */}
        <Reveal>
          <div className="hidden md:block">
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {/* Gradient connector line behind the station nodes */}
              <div
                className="hidden lg:block absolute top-5 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-deep to-forest"
                aria-hidden="true"
              />

              {STEPS.map((step, index) => (
                <div key={step.num} className="relative text-center">
                  {renderNode(step.num, NODE_FILLS[index])}
                  <h3 className="mt-4 font-display text-xl font-bold text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-snug">{step.shortCopy}</p>
                  {renderStepCta(step, index === STEPS.length - 1)}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Mobile: simple vertical spine */}
        <Reveal>
          <div className="md:hidden relative">
            <div
              className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent via-deep to-forest"
              aria-hidden="true"
            />
            <div className="space-y-10">
              {STEPS.map((step, index) => (
                <div key={step.num} className="relative pl-16">
                  <div className="absolute left-0 top-0">{renderNode(step.num, NODE_FILLS[index])}</div>
                  <h3 className="font-display text-xl font-bold text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-snug">{step.shortCopy}</p>
                  {renderStepCta(step, index === STEPS.length - 1)}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
