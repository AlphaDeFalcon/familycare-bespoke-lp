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
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export interface CapabilityItem {
  id: string;
  name: string;
  question: string;
  solution: string;
  icon: React.ReactNode;
  imageUrl: string;
  needTypeMapping: string;
}

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'event-coord',
    name: 'Event Coordination',
    question: 'Can someone coordinate all the moving parts?',
    solution: 'Your FamilyCare advisor acts as the single point of coordination across church, venue, traditional family representatives, sound, staging, and seating.',
    icon: <CalendarDays className="w-5 h-5 text-[#3A55A3]" />,
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    needTypeMapping: 'Full Bespoke Arrangement'
  },
  {
    id: 'logistics-fleet',
    name: 'Logistics & Transport',
    question: 'Can the practical movement and timing be handled seamlessly?',
    solution: 'Fleet of pristine executive hearses, family limousines, and dedicated escort services covering Greater Accra, Ashanti, Central, Western, and inter-regional transit.',
    icon: <Truck className="w-5 h-5 text-[#00A859]" />,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    needTypeMapping: 'Logistics & Transport'
  },
  {
    id: 'caskets-craft',
    name: 'Caskets Gallery',
    question: 'Can I discuss an appropriate, dignified casket option?',
    solution: 'A private curation of master-crafted Ghanaian hardwood caskets, imported bronze and steel vaults, or custom symbolic designs that honor your loved one.',
    icon: <Package className="w-5 h-5 text-[#3A55A3]" />,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    needTypeMapping: 'Caskets'
  },
  {
    id: 'hospitality-care',
    name: 'Catering & Hospitality',
    question: 'Can the family discuss guest reception and hospitality requirements?',
    solution: 'From intimate family dining areas to large-scale shaded refreshment pavilions, we coordinate beverage services, protocol hosts, and quality catering standards.',
    icon: <Utensils className="w-5 h-5 text-[#00A859]" />,
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
    needTypeMapping: 'Catering / Hospitality'
  },
  {
    id: 'global-repatriation',
    name: 'Global Repatriation',
    question: 'Can FamilyCare guide and manage international or regional repatriation?',
    solution: 'Complete regulatory liaison with Ghanaian embassies, airline cargo protocol, port clearance, hygienic preparation, and smooth handover across borders.',
    icon: <Plane className="w-5 h-5 text-[#3A55A3]" />,
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
    needTypeMapping: 'Repatriation'
  },
  {
    id: 'cemetery-support',
    name: 'Cemetery Support',
    question: 'Can FamilyCare help coordinate cemetery and burial requirements?',
    solution: 'Direct coordination with private and municipal cemeteries (e.g. Gethsemane Memorial, Osu, Lashibi, Military Cemetery), vault booking, and graveside layout.',
    icon: <Landmark className="w-5 h-5 text-[#00A859]" />,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    needTypeMapping: 'Cemetery Support'
  },
  {
    id: 'pall-bearing',
    name: 'Professional Pallbearing',
    question: 'Is dignified, synchronized pallbearing supported as part of the service?',
    solution: 'Impeccably uniformed, professionally trained ceremonial pallbearers executing disciplined, dignified protocols throughout church and cemetery services.',
    icon: <Users2 className="w-5 h-5 text-[#00A859]" />,
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    needTypeMapping: 'Cultural Traditions'
  }
];

interface CapabilityProofProps {
  onSelectCapability: (needType: string) => void;
}

export const CapabilityProof: React.FC<CapabilityProofProps> = ({ onSelectCapability }) => {
  return (
    <section id="capabilities" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E7E2D6] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A859]/10 text-[#072A1A] text-xs font-semibold uppercase tracking-wider">
            <span>Integrated Operational Proof</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B] tracking-tight">
            One conversation. Multiple details coordinated through the FamilyCare process.
          </h2>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            Rather than dealing with a dozen separate vendors during an emotional time, FamilyCare provides end-to-end operational mastery under one accountable roof.
          </p>
        </div>

        {/* 7 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap, idx) => (
            <div
              key={cap.id}
              className={`bg-white rounded-2xl overflow-hidden border border-[#DDD7C6] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group ${
                idx === 6 ? 'md:col-span-2 lg:col-span-1 xl:col-span-1' : ''
              }`}
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-44 overflow-hidden bg-zinc-800">
                  <img
                    src={cap.imageUrl}
                    alt={cap.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating icon badge */}
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-xs shadow-xs">
                    {cap.icon}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-mono text-emerald-300 font-semibold uppercase">
                      Capability 0{idx + 1}
                    </span>
                    <h3 className="font-editorial text-lg font-bold leading-tight">
                      {cap.name}
                    </h3>
                  </div>
                </div>

                {/* Question & Solution Body */}
                <div className="p-5 space-y-3">
                  <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D6] text-xs font-semibold text-[#1E2B4F] italic">
                    "{cap.question}"
                  </div>
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    {cap.solution}
                  </p>
                </div>
              </div>

              {/* Action Link to Form */}
              <div className="p-5 pt-0 border-t border-[#F2EFE9] mt-3">
                <button
                  onClick={() => onSelectCapability(cap.needTypeMapping)}
                  className="w-full pt-3 text-xs font-semibold text-[#3A55A3] hover:text-[#00A859] flex items-center justify-between transition-colors cursor-pointer group-hover:translate-x-0.5"
                >
                  <span>Discuss this with an advisor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
