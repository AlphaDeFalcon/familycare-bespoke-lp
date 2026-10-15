/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  Compass,
  UtensilsCrossed,
  Package,
  Truck,
  Scale,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react';
import { Reveal } from './Reveal';

export interface TailoringDimension {
  id: string;
  key: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
}

export const TAILORING_DIMENSIONS: TailoringDimension[] = [
  {
    id: 'scale',
    key: 'Scale & Venue',
    title: 'Scale & Venue',
    shortDesc: 'Intimate gatherings to large public tributes',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'traditions',
    key: 'Cultural Traditions',
    title: 'Customary & Cultural Traditions',
    shortDesc: 'Cultural, regional, and religious customs respected',
    icon: <Compass className="w-5 h-5" />
  },
  {
    id: 'catering',
    key: 'Catering / Hospitality',
    title: 'Catering & Hospitality Care',
    shortDesc: 'Guest care and refreshment coordination',
    icon: <UtensilsCrossed className="w-5 h-5" />
  },
  {
    id: 'caskets',
    key: 'Caskets',
    title: 'Curated Caskets & Urns',
    shortDesc: 'A dignified, curated casket selection',
    icon: <Package className="w-5 h-5" />
  },
  {
    id: 'logistics',
    key: 'Logistics & Transport',
    title: 'Logistics & Escorted Transport',
    shortDesc: 'Hearse fleet and end-to-end timing',
    icon: <Truck className="w-5 h-5" />
  },
  {
    id: 'budget',
    key: 'Budget Guidance',
    title: 'Transparent Budget Alignment',
    shortDesc: 'No rigid tiers, no hidden costs',
    icon: <Scale className="w-5 h-5" />
  }
];

interface ProductTruthAndBriefBuilderProps {
  selectedDimensions: string[];
  onToggleDimension: (dimensionKey: string) => void;
  onScrollToForm: () => void;
}

export const ProductTruthAndBriefBuilder: React.FC<ProductTruthAndBriefBuilderProps> = ({
  selectedDimensions,
  onToggleDimension,
  onScrollToForm
}) => {
  return (
    <section id="tailoring" className="py-16 sm:py-24 bg-white border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 03: The Product Truth */}
        <Reveal>
          <div id="truth" className="max-w-3xl mx-auto text-center space-y-5 mb-14 lg:mb-16 scroll-mt-24">
            <span className="block w-12 h-1 rounded-full bg-accent mx-auto" aria-hidden="true" />

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.15] pb-1">
              No set package. Built around what matters to{' '}
              <em className="font-semibold italic">you</em>.
            </h2>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted leading-relaxed">
              Fixed funeral packages force families to pay for inclusions they do not want, or compromise on traditions that are sacred to them. FamilyCare&rsquo;s Contract / Bespoke service begins with an open conversation: we listen first, then shape the tribute with precision, empathy, and transparency.
            </p>
          </div>
        </Reveal>

        {/* Short explainer before the selectable options */}
        <Reveal>
          <p className="text-center text-sm sm:text-base text-body font-medium max-w-2xl mx-auto mb-8 lg:mb-10">
            Tap every area that applies to your family. Your selections build the brief your advisor works from.
          </p>
        </Reveal>

        {/* Section 04: The 6 Tailoring Dimensions as Colorful Selectable Pills */}
        <div className="flex flex-wrap justify-center gap-4">
          {TAILORING_DIMENSIONS.map((dim, index) => {
            const isSelected = selectedDimensions.includes(dim.key);

            return (
              <Reveal key={dim.id} delay={index * 0.05}>
                <button
                  type="button"
                  onClick={() => onToggleDimension(dim.key)}
                  aria-pressed={isSelected}
                  className={`px-6 py-3.5 rounded-full border-2 text-left transition-[border-color,background-color,color,transform] duration-200 active:scale-[0.97] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'bg-accent text-white border-transparent'
                      : 'bg-white text-body border-hairline hover:border-accent/60 hover:bg-accent/5'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`shrink-0 ${isSelected ? 'text-white' : 'text-accent-deep'}`}>{dim.icon}</span>
                    <span className="font-semibold text-sm">{dim.title}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                  </span>
                  <span
                    className={`block text-[11px] leading-snug mt-1 pl-[30px] ${
                      isSelected ? 'text-white/80' : 'text-muted'
                    }`}
                  >
                    {dim.shortDesc}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* Live Bespoke Brief Summary Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-card bg-deep text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-wider text-[#7FDDAB]">
              Your Bespoke Brief Summary
            </span>
            <h4 className="font-display text-2xl font-bold">
              {selectedDimensions.length === 0
                ? 'Select the areas your family would like tailored'
                : `${selectedDimensions.length} Dimension${selectedDimensions.length > 1 ? 's' : ''} Selected for Your Consultation`}
            </h4>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              {selectedDimensions.length === 0 ? (
                <span className="text-xs text-white/70">
                  Tap an option above to add it to your brief.
                </span>
              ) : (
                selectedDimensions.map((dimKey) => (
                  <span
                    key={dimKey}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 text-white text-xs font-medium border border-white/20"
                  >
                    ✓ {dimKey}
                    <button
                      type="button"
                      onClick={() => onToggleDimension(dimKey)}
                      aria-label={`Remove ${dimKey} from your brief`}
                      className="-mr-1 p-0.5 rounded-full hover:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <button
            onClick={onScrollToForm}
            className="shrink-0 px-6 py-3.5 rounded-full bg-accent hover:bg-accent-deep text-white font-semibold text-sm transition-colors flex items-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep"
          >
            <span>Proceed with These Selections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
