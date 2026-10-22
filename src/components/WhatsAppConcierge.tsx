/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

interface WhatsAppConciergeProps {
  whatsAppUrl: string;
  whatsAppMessage: string;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

export const WhatsAppConcierge: React.FC<WhatsAppConciergeProps> = ({
  whatsAppUrl,
  whatsAppMessage,
  onWhatsAppClick,
  onPhoneClick
}) => {
  return (
    <div className="bg-forest rounded-card overflow-hidden shadow-[0_12px_32px_rgba(11,61,38,0.18)]">
      {/* WhatsApp: primary conversation path */}
      <div className="p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-card bg-accent/15 text-[#7FDDAB]">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h4 className="font-display text-xl font-bold text-white">
            WhatsApp FamilyCare
          </h4>
        </div>

        <p className="text-xs text-[#A9C6B6] leading-relaxed">
          Prefer a direct chat? Start a private conversation with a FamilyCare advisor right now. Your tailoring brief and enquiry intent are pre-formatted automatically.
        </p>

        {/* Live Message Preview Bubble */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-[#7FDDAB] uppercase tracking-wider">
            Live pre-filled message preview
          </div>
          <div className="p-3.5 rounded-card bg-tint border border-white/20 text-xs text-ink leading-relaxed">
            &ldquo;{whatsAppMessage}&rdquo;
          </div>
        </div>

        {/* WhatsApp Action Button */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsAppClick}
          className="w-full py-3.5 px-4 rounded-full bg-accent hover:bg-accent-deep text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
        >
          <MessageCircle className="w-5 h-5" />
          <span>WhatsApp FamilyCare Now</span>
        </a>
      </div>

      {/* Phone: secondary contact path, separated by one hairline */}
      <div className="p-6 border-t border-white/10">
        <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-card bg-white/10 text-[#7FDDAB]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-white">
                Direct Telephone Line
              </h4>
              <div className="text-xs text-[#A9C6B6]">24/7 care line, every day</div>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="font-mono text-base font-bold text-white">
              +233 59 743 4114
            </div>
            <a
              href="tel:+233597434114"
              onClick={onPhoneClick}
              className="text-xs font-sans text-[#7FDDAB] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            >
              Tap to Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
