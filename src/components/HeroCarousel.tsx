/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { cloudinary, facilityBuildingImage, processionImage, ceremonyImage } from '../utils/media';

interface HeroSlide {
  id: string;
  src: string;
  altText: string;
  caption: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'facility',
    src: facilityBuildingImage,
    altText: 'A FamilyCare facility building with a calm forecourt',
    caption: 'A FamilyCare facility.'
  },
  {
    id: 'procession',
    src: processionImage,
    altText: 'A coordinated funeral procession',
    caption: 'A coordinated procession.'
  },
  {
    id: 'ceremony',
    src: ceremonyImage,
    altText: 'A ceremony interior prepared with floral arrangements',
    caption: 'A ceremony prepared with care.'
  }
];

const SLIDE_INTERVAL_MS = 6000;

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReduced = useReducedMotion();

  const goTo = useCallback((index: number) => {
    setCurrentIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const previous = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Gentle autoplay; collapses to a static slide under reduced motion
  useEffect(() => {
    if (prefersReduced || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [prefersReduced, isPaused]);

  const activeSlide = HERO_SLIDES[currentIndex];

  return (
    <figure
      className="space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative aspect-[3/2] rounded-card border border-hairline overflow-hidden bg-tint">
        {HERO_SLIDES.map((slide, index) => (
          <img
            key={slide.id}
            src={cloudinary(slide.src, 'w_1600,f_auto,q_auto')}
            alt={slide.altText}
            width={1600}
            height={1067}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
            aria-hidden={index !== currentIndex}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Previous / Next controls */}
        {!prefersReduced && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 text-ink hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 text-ink hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Slide indicators */}
        {!prefersReduced && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show photo ${index + 1}: ${slide.caption}`}
                aria-current={index === currentIndex}
                className={`w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  index === currentIndex ? 'bg-accent' : 'bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <figcaption className="text-xs text-muted">
        {activeSlide.caption}
      </figcaption>
    </figure>
  );
};
