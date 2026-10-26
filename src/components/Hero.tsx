/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
  const prefersReduced = useReducedMotion();

  // Staggered mount entrance for the hero copy: the first thing a visitor
  // sees, so the sequence draws the eye down the value prop. Static under
  // reduced motion.
  const entrance = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, transform: 'translateY(14px)' },
          animate: { opacity: 1, transform: 'translateY(0px)' },
          transition: { duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] as const }
        };

  return (
    <section className="relative overflow-hidden bg-forest">
      {/* Background photo carousel (full bleed) */}
      <HeroCarousel mode="background" />

      {/* Overlay shade: left-dark for text contrast, easing right so the
          imagery stays visible. Vertical on mobile, horizontal on desktop. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-forest/95 via-forest/80 to-forest/60 lg:bg-gradient-to-r lg:from-forest/95 lg:via-forest/85 lg:to-forest/35"
        aria-hidden="true"
      />

      {/* Copy overlay */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[92dvh] flex flex-col justify-center py-24 sm:py-28">
        <div className="max-w-3xl space-y-6">
          <motion.h1
            {...entrance(0)}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.08] pb-2 [text-shadow:0_2px_16px_rgba(7,42,26,0.45)]"
          >
            A farewell shaped around{' '}
            <em className="font-semibold italic">your wishes</em>.
          </motion.h1>

          <motion.p
            {...entrance(0.06)}
            className="text-lg sm:text-xl text-white font-medium leading-relaxed max-w-xl"
          >
            There is no set package. FamilyCare listens to what matters to you, then helps shape the arrangement around your requirements.
          </motion.p>

          {/* Channel context note */}
          <motion.div {...entrance(0.12)} className="space-y-0.5">
            <p className="text-base font-bold text-[#7FDDAB]">
              {heroCopy.heroBadge}
            </p>
            <p className="text-sm sm:text-base text-white/90 font-medium max-w-lg">
              {heroCopy.heroEmphasis}
            </p>
          </motion.div>

          {/* CTA cluster */}
          <motion.div
            {...entrance(0.18)}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-1"
          >
            <button
              onClick={onDiscussClick}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-accent hover:bg-accent-deep text-white font-semibold text-base transition-colors flex items-center justify-center gap-2 group cursor-pointer whitespace-nowrap active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              <span>Discuss a Plan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onWhatsAppClick}
              className="w-full sm:w-auto px-6 py-4 rounded-full border border-white/40 text-white hover:bg-white/10 font-semibold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp FamilyCare</span>
            </button>

            <button
              onClick={onPhoneClick}
              className="w-full sm:w-auto px-4 py-4 text-white hover:text-[#7FDDAB] font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              <Phone className="w-4 h-4" />
              <span>Call an Advisor</span>
            </button>
          </motion.div>

          {/* Trust micro-strip */}
          <motion.div
            {...entrance(0.24)}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-medium text-white/85"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              One dedicated advisor
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              Transparent, itemized proposal
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
