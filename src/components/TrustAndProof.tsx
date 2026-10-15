/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileCheck2,
  Scale,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { cloudinary, facilityBuildingImage, staffSklarbi, staffAtiaviGlime, staffEmmanuelOdame, staffHelen } from '../utils/media';
import { Reveal } from './Reveal';
import { Testimonials } from './Testimonials';

interface TrustAndProofProps {
  onDiscussClick: () => void;
}

export const TrustAndProof: React.FC<TrustAndProofProps> = ({ onDiscussClick }) => {
  const teamPhotos = [
    { src: staffSklarbi, alt: 'A FamilyCare advisor' },
    { src: staffAtiaviGlime, alt: 'A FamilyCare advisor' },
    { src: staffEmmanuelOdame, alt: 'A FamilyCare advisor' },
    { src: staffHelen, alt: 'A FamilyCare advisor' }
  ];

  return (
    <section id="trust" className="py-16 sm:py-24 bg-tint border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* Section Header */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
              Know who you are entrusting with the details.
            </h2>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              In Ghana, trust is earned through transparent accounting and compassionate human advisors, never through ambiguous sales claims.
            </p>
          </div>
        </Reveal>

        {/* Process Proof Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <Reveal delay={0}>
            <div className="bg-white rounded-card p-6 sm:p-7 border border-hairline space-y-4 h-full">
              <div className="w-12 h-12 rounded-card bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">
                An itemized proposal
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Every component, from hearse and casket to ceremony and reception, is detailed in writing and approved by you before any commitment.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="bg-white rounded-card p-6 sm:p-7 border border-hairline space-y-4 h-full">
              <div className="w-12 h-12 rounded-card bg-deep/10 border border-deep/20 flex items-center justify-center text-deep">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">
                Transparent budget discussion
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Budget is part of the brief from the start. You decide where resources are focused, and every item is documented in your proposal.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-white rounded-card p-6 sm:p-7 border border-hairline space-y-4 h-full">
              <div className="w-12 h-12 rounded-card bg-tint border border-hairline flex items-center justify-center text-ink">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">
                One dedicated advisor
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                A FamilyCare advisor stays with your family from the first conversation through the final tribute.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Facility Photo + Team Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <Reveal>
            <figure className="space-y-3">
              <img
                src={cloudinary(facilityBuildingImage, 'w_1200,f_auto,q_auto')}
                alt="A FamilyCare facility"
                className="w-full rounded-card border border-hairline"
                loading="lazy"
              />
              <figcaption className="text-xs text-muted">
                A FamilyCare facility.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                A team that listens first
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Every arrangement is handled by FamilyCare advisors who work with your family from first conversation to final tribute.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {teamPhotos.map((photo, idx) => (
                <img
                  key={idx}
                  src={cloudinary(photo.src, 'w_600,f_auto,q_auto')}
                  alt={photo.alt}
                  className="w-full aspect-[3/4] object-cover rounded-card border border-hairline"
                  loading="lazy"
                />
              ))}
            </div>

            <button
              onClick={onDiscussClick}
              className="px-6 py-3 rounded-full bg-accent hover:bg-ink text-white font-semibold text-sm transition-colors flex items-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span>Discuss a Bespoke Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          </Reveal>
        </div>

        {/* Permissioned customer reviews (renders once reviews are added) */}
        <Testimonials />
      </div>
    </section>
  );
};
