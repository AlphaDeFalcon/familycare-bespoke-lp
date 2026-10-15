/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CalendarDays,
  Truck,
  Package,
  Utensils,
  Plane,
  Landmark,
  Users2,
  ArrowRight
} from 'lucide-react';
import { Reveal } from './Reveal';

export interface CapabilityItem {
  id: string;
  name: string;
  question: string;
  solution: string;
  icon: React.ReactNode;
  needTypeMapping: string;
}

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'event-coord',
    name: 'Event Coordination',
    question: 'Can someone coordinate all the moving parts?',
    solution: 'Your FamilyCare advisor acts as the single point of coordination across church, venue, traditional family representatives, sound, staging, and seating.',
    icon: <CalendarDays className="w-5 h-5 text-deep" />,
    needTypeMapping: 'Full Bespoke Arrangement'
  },
  {
    id: 'logistics-fleet',
    name: 'Logistics & Transport',
    question: 'Can the practical movement and timing be handled?',
    solution: 'Modern hearses, family vehicles, and escort services covering Greater Accra, Ashanti, Central, Western, and inter-regional transit.',
    icon: <Truck className="w-5 h-5 text-accent" />,
    needTypeMapping: 'Logistics & Transport'
  },
  {
    id: 'caskets-craft',
    name: 'Caskets',
    question: 'Can I discuss an appropriate, dignified casket option?',
    solution: 'A private curation of Ghanaian hardwood caskets, metallic vaults, and custom symbolic designs that honor your loved one.',
    icon: <Package className="w-5 h-5 text-deep" />,
    needTypeMapping: 'Caskets'
  },
  {
    id: 'hospitality-care',
    name: 'Catering & Hospitality',
    question: 'Can the family discuss guest reception and hospitality requirements?',
    solution: 'From intimate family dining areas to large-scale refreshment pavilions, we coordinate beverage services, protocol hosts, and catering standards.',
    icon: <Utensils className="w-5 h-5 text-accent" />,
    needTypeMapping: 'Catering / Hospitality'
  },
  {
    id: 'global-repatriation',
    name: 'Repatriation',
    question: 'Can FamilyCare guide and manage international or regional repatriation?',
    solution: 'Regulatory liaison, airline cargo protocol, port clearance, hygienic preparation, and smooth handover across borders.',
    icon: <Plane className="w-5 h-5 text-deep" />,
    needTypeMapping: 'Repatriation'
  },
  {
    id: 'cemetery-support',
    name: 'Cemetery Support',
    question: 'Can FamilyCare help coordinate cemetery and burial requirements?',
    solution: 'Direct coordination with private and municipal cemeteries, vault booking, and graveside layout.',
    icon: <Landmark className="w-5 h-5 text-accent" />,
    needTypeMapping: 'Cemetery Support'
  },
  {
    id: 'pall-bearing',
    name: 'Pallbearing',
    question: 'Is dignified pallbearing supported as part of the service?',
    solution: 'Trained ceremonial pallbearers executing dignified protocols throughout church and cemetery services.',
    icon: <Users2 className="w-5 h-5 text-accent" />,
    needTypeMapping: 'Cultural Traditions'
  }
];

interface CapabilityProofProps {
  onSelectCapability: (needType: string) => void;
}

export const CapabilityProof: React.FC<CapabilityProofProps> = ({ onSelectCapability }) => {
  return (
    <section id="capabilities" className="py-16 sm:py-24 bg-tint border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
              One conversation. Multiple details coordinated through the FamilyCare process.
            </h2>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Rather than dealing with a dozen separate vendors during an emotional time, FamilyCare provides end-to-end coordination under one accountable roof.
            </p>
          </div>
        </Reveal>

        {/* 7 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap, idx) => (
            <Reveal key={cap.id} delay={idx * 0.04}>
              <div
                className={`bg-white rounded-card border border-hairline hover:border-muted/40 transition-colors flex flex-col justify-between group h-full ${
                  idx === 6 ? 'md:col-span-2 lg:col-span-1 xl:col-span-1' : ''
                }`}
              >
              <div>
                {/* Icon + Title */}
                <div className="p-5 pb-0 flex items-center gap-3">
                  <div className="p-2.5 rounded-card bg-tint border border-hairline shrink-0">
                    {cap.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink leading-tight">
                    {cap.name}
                  </h3>
                </div>

                {/* Question & Solution Body */}
                <div className="p-5 space-y-3">
                  <div className="p-2.5 rounded-card bg-canvas border border-hairline text-xs font-semibold text-deep italic">
                    &ldquo;{cap.question}&rdquo;
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {cap.solution}
                  </p>
                </div>
              </div>

              {/* Action Link to Form */}
              <div className="p-5 pt-0 border-t border-hairline mt-3">
                <button
                  onClick={() => onSelectCapability(cap.needTypeMapping)}
                  className="w-full pt-3 text-xs font-semibold text-deep hover:text-accent flex items-center justify-between transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  <span>Discuss this with an advisor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
