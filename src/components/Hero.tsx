/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { HeroCarousel } from './HeroCarousel';

interface HeroCopy {
  heroBadge: string;
  heroEmphasis: string;
}

interface HeroProps {
  heroCopy: HeroCopy;
  onDiscussClick: () => void;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  heroCopy,
  onDiscussClick,
  onWhatsAppClick,
  onPhoneClick
}) => {
  return (
    <section className="bg-canvas pt-10 sm:pt-14 lg:pt-20 pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.05]">
              A farewell shaped around your wishes.
            </h1>

            <p className="text-base sm:text-lg text-muted leading-relaxed max-w-xl">
              There is no set package. FamilyCare listens to what matters to you, then helps shape the arrangement around your requirements.
            </p>

            {/* Channel context note */}
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-ink">
                {heroCopy.heroBadge}
              </p>
              <p className="text-xs sm:text-sm text-muted max-w-lg">
                {heroCopy.heroEmphasis}
              </p>
            </div>

            {/* CTA cluster */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-1">
              <button
                onClick={onDiscussClick}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-accent hover:bg-ink text-white font-semibold text-base transition-colors flex items-center justify-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <span>Discuss a Bespoke Plan</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onWhatsAppClick}
                className="w-full sm:w-auto px-6 py-4 rounded-full border border-accent text-accent hover:bg-accent/5 font-semibold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp FamilyCare</span>
              </button>

              <button
                onClick={onPhoneClick}
                className="w-full sm:w-auto px-4 py-4 text-deep hover:text-ink font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full focus-visible:ring-offset-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call an Advisor</span>
              </button>
            </div>

            {/* Trust micro-strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                One dedicated advisor
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                Transparent, itemized proposal
              </span>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="lg:col-span-5">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};
