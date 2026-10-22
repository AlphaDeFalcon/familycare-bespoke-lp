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
import { cloudinary, capabilityImages } from '../utils/media';

/** Card photos are served at 2x the largest rendered width (4:3 crop). */
const PHOTO_TRANSFORMS = 'w_800,f_auto,q_auto';

export interface CapabilityItem {
  id: string;
  name: string;
  question: string;
  icon: React.ReactNode;
  needTypeMapping: string;
  /** Photo demonstrating the capability, rendered in a 4:3 frame. */
  photoUrl: string;
  photoAlt: string;
}

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'event-coord',
    name: 'Event Coordination',
    question: 'Can someone coordinate all the moving parts?',
    icon: <CalendarDays className="w-5 h-5" />,
    needTypeMapping: 'Full Bespoke Arrangement',
    photoUrl: cloudinary(capabilityImages.eventCoordination, PHOTO_TRANSFORMS),
    photoAlt: 'Rows of white chairs arranged beneath event tents for a ceremony'
  },
  {
    id: 'logistics-fleet',
    name: 'Logistics & Transport',
    question: 'Can the practical movement and timing be handled?',
    icon: <Truck className="w-5 h-5" />,
    needTypeMapping: 'Logistics & Transport',
    photoUrl: cloudinary(capabilityImages.logisticsTransport, PHOTO_TRANSFORMS),
    photoAlt: 'A white hearse van parked on a paved yard'
  },
  {
    id: 'caskets-craft',
    name: 'Caskets',
    question: 'Can I discuss an appropriate, dignified casket option?',
    icon: <Package className="w-5 h-5" />,
    needTypeMapping: 'Caskets',
    photoUrl: cloudinary(capabilityImages.caskets, PHOTO_TRANSFORMS),
    photoAlt: 'A white casket surrounded by white and green floral arrangements'
  },
  {
    id: 'hospitality-care',
    name: 'Catering & Hospitality',
    question: 'Can the family discuss guest reception and hospitality requirements?',
    icon: <Utensils className="w-5 h-5" />,
    needTypeMapping: 'Catering / Hospitality',
    photoUrl: cloudinary(capabilityImages.catering, PHOTO_TRANSFORMS),
    photoAlt: 'Catering staff serving guests from buffet chafing dishes'
  },
  {
    id: 'global-repatriation',
    name: 'Repatriation',
    question: 'Can FamilyCare guide and manage international or regional repatriation?',
    icon: <Plane className="w-5 h-5" />,
    needTypeMapping: 'Repatriation',
    photoUrl: cloudinary(capabilityImages.repatriation, PHOTO_TRANSFORMS),
    photoAlt: 'A hearse and procession accompanying a floral wreath along a road'
  },
  {
    id: 'cemetery-support',
    name: 'Cemetery Support',
    question: 'Can FamilyCare help coordinate cemetery and burial requirements?',
    icon: <Landmark className="w-5 h-5" />,
    needTypeMapping: 'Cemetery Support',
    photoUrl: cloudinary(capabilityImages.cemeterySupport, PHOTO_TRANSFORMS),
    photoAlt: 'A family gathered at a graveside among headstones'
  },
  {
    id: 'pall-bearing',
    name: 'Pallbearing',
    question: 'Is dignified pallbearing supported as part of the service?',
    icon: <Users2 className="w-5 h-5" />,
    needTypeMapping: 'Cultural Traditions',
    photoUrl: cloudinary(capabilityImages.pallbearing, PHOTO_TRANSFORMS),
    photoAlt: 'Pallbearers in black suits carrying a casket'
  }
];

interface CapabilityProofProps {
  onSelectCapability: (needType: string) => void;
}

export const CapabilityProof: React.FC<CapabilityProofProps> = ({ onSelectCapability }) => {
  return (
    <section id="capabilities" className="py-16 sm:py-24 bg-white border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14 lg:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
              One conversation. Multiple details coordinated through the FamilyCare process.
            </h2>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Rather than dealing with a dozen separate vendors during an emotional time, FamilyCare provides end-to-end coordination under one accountable roof.
            </p>
          </div>
        </Reveal>

        {/* 7 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {CAPABILITIES.map((cap, idx) => (
            <Reveal key={cap.id} delay={idx * 0.04}>
              <button
                type="button"
                onClick={() => onSelectCapability(cap.needTypeMapping)}
                className="text-left w-full h-full bg-white rounded-card border border-hairline overflow-hidden hover:border-accent/60 hover:bg-accent/5 transition-[border-color,background-color,transform] duration-200 active:scale-[0.97] flex flex-col cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {/* Photo demonstrating the capability (4:3) */}
                <span className="relative block aspect-[4/3] w-full bg-tint border-b border-hairline overflow-hidden">
                  <img
                    src={cap.photoUrl}
                    alt={cap.photoAlt}
                    width={800}
                    height={600}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </span>

                {/* Content */}
                <span className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
                  <span className="flex items-center gap-3">
                    <span className="p-2 rounded-card bg-accent text-white shrink-0">
                      {cap.icon}
                    </span>
                    <h3 className="font-display text-lg font-bold text-ink leading-tight">
                      {cap.name}
                    </h3>
                  </span>

                  <p className="text-xs text-muted leading-snug">
                    &ldquo;{cap.question}&rdquo;
                  </p>

                  <span className="mt-auto pt-1 text-xs font-semibold text-accent-deep group-hover:text-ink flex items-center gap-1.5 transition-colors">
                    <span>Discuss this with an advisor</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
