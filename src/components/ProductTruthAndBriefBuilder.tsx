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
  Sparkles,
  HelpCircle
} from 'lucide-react';

export interface TailoringDimension {
  id: string;
  key: string;
  title: string;
  shortDesc: string;
  detail: string;
  icon: React.ReactNode;
  tag: string;
  guardrail: string;
  image: string;
}

export const TAILORING_DIMENSIONS: TailoringDimension[] = [
  {
    id: 'scale',
    key: 'Scale & Venue',
    title: 'Scale & Venue',
    shortDesc: 'From intimate family gatherings to large public celebrations of life.',
    detail: 'Whether you are planning a private, quiet remembrance or accommodating an extensive community of well-wishers, we adapt the seating, sound, venue protocol, and staging to your scale.',
    icon: <Users className="w-5 h-5 text-[#3A55A3]" />,
    tag: 'Gathering Dimension',
    guardrail: 'Coordinated according to family-specified venue and guest expectations.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'traditions',
    key: 'Cultural Traditions',
    title: 'Customary & Cultural Traditions',
    shortDesc: 'Deep respect and coordination for cultural, regional, and religious customs.',
    detail: 'From Akan customary protocols, Ewe traditional tributes, Ga rites, to Islamic prayers and Christian church requiems, your personal advisor respects and protects every heritage practice.',
    icon: <Compass className="w-5 h-5 text-[#00A859]" />,
    tag: 'Heritage Dimension',
    guardrail: 'Guided by family elders and customary leaders.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'catering',
    key: 'Catering / Hospitality',
    title: 'Catering & Hospitality Care',
    shortDesc: 'Thoughtful guest care and refreshment coordination where required.',
    detail: 'From discreet family refreshment pavilions to coordinated hospitality logistics for large numbers of sympathizers, ensuring dignity and attentive care without burdening the bereaved.',
    icon: <UtensilsCrossed className="w-5 h-5 text-[#3A55A3]" />,
    tag: 'Hospitality Dimension',
    guardrail: 'Custom culinary and refreshment coordination.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'caskets',
    key: 'Caskets',
    title: 'Curated Caskets & Urns',
    shortDesc: 'Curated selection of dignified caskets tailored to your family’s brief.',
    detail: 'Review premium hardwood craftsmanship, artistic commemorative caskets, modern metallic vaults, or ecological selections with full transparency and personal guidance.',
    icon: <Package className="w-5 h-5 text-[#00A859]" />,
    tag: 'Craft Dimension',
    guardrail: 'Selected during advisor consultation to match wishes and aesthetic.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'logistics',
    key: 'Logistics & Transport',
    title: 'Logistics & Escorted Transport',
    shortDesc: 'Hearse fleet, domestic movement, and end-to-end timing management.',
    detail: 'Precision timing, dignified hearse processions, long-distance domestic transfers across all regions of Ghana, and coordinated transit between church, family home, and cemetery.',
    icon: <Truck className="w-5 h-5 text-[#3A55A3]" />,
    tag: 'Movement Dimension',
    guardrail: 'Operated by trained protocol drivers and timing coordinators.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'budget',
    key: 'Budget Guidance',
    title: 'Transparent Budget Alignment',
    shortDesc: 'Structured transparently around your family’s priorities—no rigid tiers or hidden shocks.',
    detail: 'You dictate where resources are focused. We provide itemized, completely clear proposals before any commitment is made, ensuring financial peace of mind.',
    icon: <Scale className="w-5 h-5 text-[#00A859]" />,
    tag: 'Financial Dimension',
    guardrail: 'Every bespoke item is documented transparently in your formal proposal.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80'
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
    <section id="tailoring" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E7E2D6] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 03: The Product Truth */}
        <div id="truth" className="max-w-3xl mx-auto text-center space-y-4 mb-16 scroll-mt-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A859]/10 text-[#072A1A] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00A859]" />
            <span>The FamilyCare Difference</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B] tracking-tight">
            No set package. Built around what matters to you.
          </h2>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            Fixed funeral packages force families to pay for inclusions they do not want, or compromise on traditions that are sacred to them. FamilyCare’s Contract / Bespoke service begins with an open conversation: we listen first, then shape the tribute with precision, empathy, and institutional transparency.
          </p>

          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#3A55A3] bg-[#EEF2FC] px-4 py-2 rounded-xl border border-[#3A55A3]/20">
              <HelpCircle className="w-4 h-4" />
              <span>Click any card below to build your family’s bespoke brief</span>
            </div>
          </div>
        </div>

        {/* Section 04: The 6 Tailoring Dimensions Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TAILORING_DIMENSIONS.map((dim) => {
            const isSelected = selectedDimensions.includes(dim.key);

            return (
              <div
                key={dim.id}
                onClick={() => onToggleDimension(dim.key)}
                className={`relative rounded-2xl p-6 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between cursor-pointer group bg-white shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#00A859] ring-2 ring-[#00A859]/20 bg-emerald-50/20'
                    : 'border-[#E7E2D6] hover:border-[#3A55A3]/40'
                }`}
              >
                <div>
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-[#F2EFE9] border border-[#DDD7C6]">
                      {dim.icon}
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#3A55A3] bg-[#3A55A3]/10 px-2.5 py-1 rounded-full">
                      {dim.tag}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#18181B] group-hover:text-[#00A859] transition-colors mb-2">
                    {dim.title}
                  </h3>

                  <p className="text-sm font-medium text-[#18181B] mb-2.5">
                    {dim.shortDesc}
                  </p>

                  <p className="text-xs text-[#52525B] leading-relaxed mb-4">
                    {dim.detail}
                  </p>
                </div>

                {/* Bottom Action Pill & Guardrail Note */}
                <div className="pt-4 border-t border-[#E7E2D6] space-y-3">
                  <div className="text-[11px] text-[#52525B] italic">
                    Note: {dim.guardrail}
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00A859] text-white shadow-xs'
                        : 'bg-[#F2EFE9] text-[#18181B] hover:bg-[#E7E2D6]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Included in Your Brief</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#00A859]" />
                        <span>Add to My Brief</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Bespoke Brief Summary Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#1E2B4F] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A859]" />
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Your Bespoke Brief Summary
              </span>
            </div>
            <h4 className="font-editorial text-2xl font-bold">
              {selectedDimensions.length === 0
                ? 'Select the areas your family would like tailored'
                : `${selectedDimensions.length} Dimension${selectedDimensions.length > 1 ? 's' : ''} Selected for Your Consultation`}
            </h4>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              {selectedDimensions.length === 0 ? (
                <span className="text-xs text-zinc-300">
                  Click any card above (Scale, Traditions, Logistics, Caskets, Hospitality, Budget) to customize your enquiry.
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
            className="shrink-0 px-6 py-3.5 rounded-xl bg-[#00A859] hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
          >
            <span>Proceed with These Selections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
