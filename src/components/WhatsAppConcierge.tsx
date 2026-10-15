/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

interface Draft {
  name: string;
  location: string;
  needTypes: string[];
}

interface WhatsAppConciergeProps {
  whatsAppUrl: string;
  draft: Draft;
  sourceLabel: string;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

export const WhatsAppConcierge: React.FC<WhatsAppConciergeProps> = ({
  whatsAppUrl,
  draft,
  sourceLabel,
  onWhatsAppClick,
  onPhoneClick
}) => {
  return (
    <div className="space-y-6">
      {/* Primary WhatsApp Concierge Card */}
      <div className="bg-white rounded-card border border-accent/30 p-6 sm:p-7">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-card bg-accent/10 text-accent">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="font-display text-xl font-bold text-ink">
              WhatsApp FamilyCare
            </h4>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Prefer a direct chat? Start a private conversation with a FamilyCare advisor right now. Your tailoring brief and enquiry intent are pre-formatted automatically.
          </p>

          {/* Live Message Preview Bubble */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              Live pre-filled message preview
            </div>
            <div className="p-3.5 rounded-card bg-accent/5 border border-accent/20 text-xs text-ink leading-relaxed">
              &ldquo;Hello FamilyCare, I would like to discuss a Contract / Bespoke funeral arrangement
              {draft.name ? ` for ${draft.name}` : ''}. I would like help understanding the next steps and shaping a tribute around our family&rsquo;s wishes.
              {draft.location ? ` Location: ${draft.location}.` : ''}
              {draft.needTypes.length > 0 ? ` Key areas: ${draft.needTypes.join(', ')}.` : ''}
              {sourceLabel ? ` (Ref: ${sourceLabel})` : ''}&rdquo;
            </div>
          </div>

          {/* WhatsApp Action Button */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="w-full py-3.5 px-4 rounded-full bg-accent hover:bg-ink text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp FamilyCare Now</span>
          </a>
        </div>
      </div>

      {/* Direct Telephone Consultation Card */}
      <div className="bg-white rounded-card border border-hairline p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-card bg-deep/10 text-deep">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display text-lg font-bold text-ink">
              Direct Telephone Line
            </h4>
            <div className="text-xs text-muted">
              Speak with a duty advisor
            </div>
          </div>
        </div>

        <div className="p-3 rounded-card bg-canvas border border-hairline space-y-1">
          <div className="text-xs text-muted">National Consultation Desk:</div>
          <div className="font-mono text-base font-bold text-body flex items-center justify-between">
            <span>+233 (0)30 278 9123</span>
            <a
              href="tel:+233302789123"
              onClick={onPhoneClick}
              className="text-xs font-sans text-deep hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            >
              Tap to Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
