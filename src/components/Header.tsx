/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Phone,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onDiscussClick: () => void;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onDiscussClick,
  onWhatsAppClick,
  onPhoneClick
}) => {
  return (
    <header className="sticky top-0 z-30 bg-canvas/95 backdrop-blur-md border-b border-hairline transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Brand Logo */}
          <a
            href="https://familycaretrust.com/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg p-1"
            aria-label="FamilyCare Funeral Trust Home"
          >
            <BrandLogo variant="color" className="h-12 w-auto" />
          </a>

          {/* Labeled CTA cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onPhoneClick}
              className="p-2.5 rounded-full text-deep bg-tint hover:bg-hairline border border-hairline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="Call FamilyCare Advisor"
              title="Call FamilyCare Advisor"
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={onWhatsAppClick}
              className="p-2.5 rounded-full text-accent bg-accent/10 hover:bg-accent/15 border border-accent/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="WhatsApp FamilyCare Concierge"
              title="Chat with FamilyCare on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              onClick={onDiscussClick}
              className="px-2 sm:px-5 py-2.5 rounded-full bg-accent hover:bg-accent-deep text-white font-semibold text-[10px] sm:text-xs md:text-sm transition-colors flex items-center gap-1 sm:gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span className="hidden sm:inline">Discuss a Plan</span>
              <span className="sm:hidden">Talk to Us</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
