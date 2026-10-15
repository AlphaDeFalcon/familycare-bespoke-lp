/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  UserCheck,
  Upload,
  Camera,
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import { CampaignChannelConfig } from '../utils/conversion';

/**
 * ============================================================================
 * HERO CAROUSEL SLIDES - 5 DEDICATED SLOTS
 * ============================================================================
 * Developer Note: Replace the `imageUrl` values below with your custom photography URLs.
 * You can also click "Upload / Swap Preview Photos" directly in the app to preview local files!
 */
export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  caption: string;
  badge: string;
  imageUrl: string;
  altText: string;
}

export const INITIAL_HERO_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: 'Private Family Consultation',
    subtitle: 'Unrushed, calm discussions with an experienced advisor',
    caption: 'One dedicated advisor to listen, shape options, and respect your family’s decisions.',
    badge: 'Step 01 & 02 • Consultative Planning',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
    altText: 'FamilyCare personal advisor conducting an unhurried consultation with family decision-makers'
  },
  {
    id: 2,
    title: 'Dignified Cultural & Traditional Honours',
    subtitle: 'Faithful adherence to Ghanaian heritage and ancestral protocols',
    caption: 'Coordinating customary rites, church services, and celebrations of life with profound reverence.',
    badge: 'Traditions & Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    altText: 'Respectful celebration of life ceremony honoring Ghanaian family traditions and legacy'
  },
  {
    id: 3,
    title: 'Executive Fleet & Seamless Logistics',
    subtitle: 'Impeccable procession, timing, and respectful movement',
    caption: 'State-of-the-art hearse fleet and coordinated escort ensuring smooth transit across Ghana.',
    badge: 'Executive Transport',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    altText: 'Executive ceremonial vehicle fleet coordinated with disciplined timing and respect'
  },
  {
    id: 4,
    title: 'Bespoke Venue & Hospitality Coordination',
    subtitle: 'Curated seating, dignified floral arrangements, and guest reception',
    caption: 'Harmonious environment prepared with quiet elegance for both intimate and grand gatherings.',
    badge: 'Venue & Reception',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    altText: 'Elegantly arranged floral tribute and peaceful ceremonial seating reception'
  },
  {
    id: 5,
    title: 'Serene Memorial & Cemetery Support',
    subtitle: 'Committed presence through final interment and resting rites',
    caption: 'End-to-end liaison with cemetery authorities, vault preparation, and graveside dignity.',
    badge: 'Final Resting Rites',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    altText: 'Peaceful cemetery and memorial garden support managed with discretion and care'
  }
];

interface HeroProps {
  channelConfig: CampaignChannelConfig;
  onDiscussClick: () => void;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

export const HeroCarousel: React.FC<HeroProps> = ({
  channelConfig,
  onDiscussClick,
  onWhatsAppClick,
  onPhoneClick
}) => {
  const [slides, setSlides] = useState<CarouselSlide[]>(INITIAL_HERO_CAROUSEL_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // 6-second auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCustomImageUpload = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        setSlides((prev) =>
          prev.map((s, idx) => (idx === slotIndex ? { ...s, imageUrl: resultUrl } : s))
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefaultImages = () => {
    setSlides(INITIAL_HERO_CAROUSEL_SLIDES);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative pt-6 sm:pt-10 pb-16 lg:pb-24 overflow-hidden border-b border-[#E7E2D6] bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-[#F2EFE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column (7 Columns on Desktop): Core Commercial Message & Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Main H1 - High-Contrast Editorial Heading */}
            <div className="space-y-3">
              <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-[#18181B] font-bold tracking-tight leading-[1.12]">
                A farewell shaped around your wishes.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-[#52525B] leading-relaxed max-w-2xl font-normal">
                There is no set package. FamilyCare listens to what matters to you, then helps shape the arrangement around your family’s traditions, scale, and requirements.
              </p>
            </div>

            {/* Dynamic Campaign Channel Context Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#DDD7C6] shadow-xs flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00A859] mt-1.5 shrink-0" />
              <div className="text-xs sm:text-sm text-[#18181B]">
                <span className="font-semibold text-[#072A1A] block">
                  {channelConfig.heroBadge}
                </span>
                <span className="text-[#52525B]">
                  {channelConfig.heroEmphasis}
                </span>
              </div>
            </div>

            {/* Primary CTA Cluster (Approved Hierarchy) */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {/* Primary Action Button */}
              <button
                onClick={onDiscussClick}
                className="px-6 py-4 rounded-xl bg-[#00A859] hover:bg-[#072A1A] text-white font-semibold text-base transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2.5 group cursor-pointer"
                aria-label="Discuss a Bespoke Plan with FamilyCare"
              >
                <span>Discuss a Bespoke Plan</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary WhatsApp Button */}
              <button
                onClick={onWhatsAppClick}
                className="px-5 py-4 rounded-xl bg-white hover:bg-[#E8F8F0] border border-[#00A859] text-[#00A859] font-semibold text-base transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                aria-label="WhatsApp FamilyCare"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp FamilyCare</span>
              </button>

              {/* Tertiary Call Link */}
              <button
                onClick={onPhoneClick}
                className="px-4 py-3 text-sm font-semibold text-[#3A55A3] hover:text-[#1E2B4F] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                aria-label="Call an advisor directly"
              >
                <Phone className="w-4 h-4" />
                <span>Call an Advisor</span>
              </button>
            </div>

            {/* Hero Trust Micro-Strip */}
            <div className="pt-2 border-t border-[#E7E2D6] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#52525B] font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00A859]" />
                <span>Verified Licensing &amp; Registration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#3A55A3]" />
                <span>Physical Branches Across Ghana</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#00A859]" />
                <span>Dedicated Personal Advisor</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 Columns on Desktop): 5-Slot Media Carousel */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Visual Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border-2 border-[#DDD7C6] shadow-xl aspect-4/3 sm:aspect-5/4 lg:aspect-4/5 group">
              {/* Active Image */}
              <img
                key={currentSlide.id}
                src={currentSlide.imageUrl}
                alt={currentSlide.altText}
                className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                loading="eager"
              />

              {/* Gradient Overlay for Editorial Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

              {/* Slide Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-[11px] font-semibold tracking-wide">
                  {currentSlide.badge}
                </span>
              </div>

              {/* Slide Counter */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 font-mono text-[11px]">
                  0{currentSlide.id} / 0{slides.length}
                </span>
              </div>

              {/* Slide Content Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-1.5">
                <h3 className="font-editorial text-xl sm:text-2xl font-bold leading-tight">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2 leading-relaxed">
                  {currentSlide.caption}
                </p>

                {/* Progress Indicators */}
                <div className="pt-2 flex items-center gap-1.5">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentIndex === idx ? 'w-8 bg-[#00A859]' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                    />
                  ))}
                </div>
              </div>

              {/* Carousel Navigation Arrows */}
              <div className="absolute inset-y-0 left-2 flex items-center z-20">
                <button
                  onClick={goToPrev}
                  className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/20 opacity-80 hover:opacity-100"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-2 flex items-center z-20">
                <button
                  onClick={goToNext}
                  className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/20 opacity-80 hover:opacity-100"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Developer / User Photo Swap Utility Toolbar */}
            <div className="mt-3 flex items-center justify-between text-xs text-[#52525B]">
              <span className="font-medium">
                Photo {currentIndex + 1} of 5: {currentSlide.title}
              </span>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DDD7C6] hover:bg-[#F2EFE9] text-[#18181B] font-medium transition-colors shadow-2xs"
                title="Preview your own 5 custom photos directly in this carousel"
              >
                <Camera className="w-3.5 h-3.5 text-[#00A859]" />
                <span>Upload / Swap Preview Photos</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Upload & Swap Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-zinc-900">
                  Custom Carousel Photo Manager
                </h3>
                <p className="text-xs text-zinc-500">
                  Upload custom photos to preview your bespoke imagery live in the 5 slots.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
                aria-label="Close photo manager"
              >
                ✕
              </button>
            </div>

            {/* 5 Slots list */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="p-3 border rounded-xl flex items-center gap-4 bg-zinc-50 hover:bg-zinc-100/80 transition-colors"
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-16 h-12 rounded-lg object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-zinc-900">
                      Slot {idx + 1}: {slide.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">{slide.subtitle}</div>
                  </div>
                  <div>
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#00A859] hover:bg-[#072A1A] text-white text-xs font-medium flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Swap</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleCustomImageUpload(idx, e)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t text-xs">
              <button
                onClick={resetToDefaultImages}
                className="text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
              </button>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800"
              >
                Done Previewing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
