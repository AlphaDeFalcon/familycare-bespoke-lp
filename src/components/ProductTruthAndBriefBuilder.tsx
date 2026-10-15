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
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Reveal } from './Reveal';

export interface TailoringDimension {
  id: string;
  key: string;
  title: string;
  shortDesc: string;
  detail: string;
  icon: React.ReactNode;
  tag: string;
  guardrail: string;
}

export const TAILORING_DIMENSIONS: TailoringDimension[] = [
  {
    id: 'scale',
    key: 'Scale & Venue',
    title: 'Scale & Venue',
    shortDesc: 'From intimate family gatherings to large public celebrations of life.',
    detail: 'Whether you are planning a private, quiet remembrance or accommodating an extensive community of well-wishers, we adapt the seating, sound, venue protocol, and staging to your scale.',
    icon: <Users className="w-5 h-5 text-deep" />,
    tag: 'Gathering',
    guardrail: 'Coordinated according to family-specified venue and guest expectations.'
  },
  {
    id: 'traditions',
    key: 'Cultural Traditions',
    title: 'Customary & Cultural Traditions',
    shortDesc: 'Deep respect and coordination for cultural, regional, and religious customs.',
    detail: 'From Akan customary protocols, Ewe traditional tributes, Ga rites, to Islamic prayers and Christian church requiems, your personal advisor respects and protects every heritage practice.',
    icon: <Compass className="w-5 h-5 text-accent" />,
    tag: 'Heritage',
    guardrail: 'Guided by family elders and customary leaders.'
  },
  {
    id: 'catering',
    key: 'Catering / Hospitality',
    title: 'Catering & Hospitality Care',
    shortDesc: 'Thoughtful guest care and refreshment coordination where required.',
    detail: 'From discreet family refreshment pavilions to coordinated hospitality logistics for large numbers of sympathizers, ensuring dignity and attentive care without burdening the bereaved.',
    icon: <UtensilsCrossed className="w-5 h-5 text-deep" />,
    tag: 'Hospitality',
    guardrail: 'Custom culinary and refreshment coordination.'
  },
  {
    id: 'caskets',
    key: 'Caskets',
    title: 'Curated Caskets & Urns',
    shortDesc: 'Curated selection of dignified caskets tailored to your family\'s brief.',
    detail: 'Review premium hardwood craftsmanship, artistic commemorative caskets, modern metallic vaults, or ecological selections with full transparency and personal guidance.',
    icon: <Package className="w-5 h-5 text-accent" />,
    tag: 'Craft',
    guardrail: 'Selected during advisor consultation to match wishes and aesthetic.'
  },
  {
    id: 'logistics',
    key: 'Logistics & Transport',
    title: 'Logistics & Escorted Transport',
    shortDesc: 'Hearse fleet, domestic movement, and end-to-end timing management.',
    detail: 'Precision timing, dignified hearse processions, long-distance domestic transfers across all regions of Ghana, and coordinated transit between church, family home, and cemetery.',
    icon: <Truck className="w-5 h-5 text-deep" />,
    tag: 'Movement',
    guardrail: 'Operated by trained protocol drivers and timing coordinators.'
  },
  {
    id: 'budget',
    key: 'Budget Guidance',
    title: 'Transparent Budget Alignment',
    shortDesc: 'Structured transparently around your family\'s priorities, with no rigid tiers or hidden shocks.',
    detail: 'You dictate where resources are focused. We provide itemized, completely clear proposals before any commitment is made, ensuring financial peace of mind.',
    icon: <Scale className="w-5 h-5 text-accent" />,
    tag: 'Financial',
    guardrail: 'Every bespoke item is documented transparently in your formal proposal.'
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
    <section id="tailoring" className="py-16 sm:py-24 bg-canvas border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 03: The Product Truth */}
        <Reveal>
          <div id="truth" className="max-w-3xl mx-auto text-center space-y-4 mb-16 scroll-mt-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-ink text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>The FamilyCare Difference</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
            No set package. Built around what matters to you.
          </h2>

          <p className="text-base sm:text-lg text-muted leading-relaxed">
            Fixed funeral packages force families to pay for inclusions they do not want, or compromise on traditions that are sacred to them. FamilyCare&rsquo;s Contract / Bespoke service begins with an open conversation: we listen first, then shape the tribute with precision, empathy, and transparency. Whether you are planning ahead or facing an immediate need, it begins the same way: a conversation.
          </p>
        </div>
        </Reveal>

        {/* Section 04: The 6 Tailoring Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TAILORING_DIMENSIONS.map((dim, index) => {
            const isSelected = selectedDimensions.includes(dim.key);

            return (
              <Reveal key={dim.id} delay={index * 0.05}>
                <button
                  type="button"
                  onClick={() => onToggleDimension(dim.key)}
                  aria-pressed={isSelected}
                  className={`card-hover-lines text-left relative rounded-card p-6 sm:p-7 border transition-colors duration-200 flex flex-col justify-between cursor-pointer group bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 w-full h-full ${
                    isSelected
                      ? 'border-accent ring-2 ring-accent/20 bg-accent/5'
                      : 'border-hairline hover:border-deep/40 hover:bg-accent/5'
                  }`}
                >
                <div>
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-card bg-tint border border-hairline">
                      {dim.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-deep bg-deep/10 px-2.5 py-1 rounded-full">
                      {dim.tag}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-ink group-hover:text-accent transition-colors mb-2">
                    {dim.title}
                  </h3>

                  <p className="text-sm font-medium text-body mb-2.5">
                    {dim.shortDesc}
                  </p>

                  <p className="text-xs text-muted leading-relaxed mb-4">
                    {dim.detail}
                  </p>
                </div>

                {/* Bottom Action Pill & Guardrail Note */}
                <div className="pt-4 border-t border-hairline space-y-3">
                  <div className="text-[11px] text-muted italic">
                    Note: {dim.guardrail}
                  </div>

                  <span
                    className={`w-full py-2.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isSelected
                        ? 'bg-accent text-white'
                        : 'bg-tint text-body group-hover:bg-hairline'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Included in Your Brief</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-accent" />
                        <span>Add to My Brief</span>
                      </>
                    )}
                  </span>
                </div>
              </button>
              </Reveal>
            );
          })}
        </div>

        {/* Live Bespoke Brief Summary Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-card bg-deep text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Your Bespoke Brief Summary
              </span>
            </div>
            <h4 className="font-display text-2xl font-bold">
              {selectedDimensions.length === 0
                ? 'Select the areas your family would like tailored'
                : `${selectedDimensions.length} Dimension${selectedDimensions.length > 1 ? 's' : ''} Selected for Your Consultation`}
            </h4>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              {selectedDimensions.length === 0 ? (
                <span className="text-xs text-zinc-300">
                  Click any card above to customize your enquiry.
                </span>
              ) : (
                selectedDimensions.map((dimKey) => (
                  <span
                    key={dimKey}
                    className="px-2.5 py-1 rounded-md bg-white/15 text-white text-xs font-medium border border-white/20"
                  >
                    ✓ {dimKey}
                  </span>
                ))
              )}
            </div>
          </div>

          <button
            onClick={onScrollToForm}
            className="shrink-0 px-6 py-3.5 rounded-full bg-accent hover:bg-ink text-white font-semibold text-sm transition-colors flex items-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep"
          >
            <span>Proceed with These Selections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
