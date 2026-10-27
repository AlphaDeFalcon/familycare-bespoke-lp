/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageCircle, Phone, ArrowUpRight } from 'lucide-react';

interface MobileStickyBarProps {
  onDiscussClick: () => void;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  onDiscussClick,
  onWhatsAppClick,
  onPhoneClick
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-md border-t border-hairline px-3 py-2.5 md:hidden pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2">
        {/* Quick Call */}
        <button
          onClick={onPhoneClick}
          className="flex-1 py-3.5 px-2 rounded-full bg-white border border-deep/40 text-deep font-semibold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Call Advisor"
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>Call</span>
        </button>

        {/* Quick WhatsApp */}
        <button
          onClick={onWhatsAppClick}
          className="flex-1 py-3.5 px-2 rounded-full bg-accent/10 border border-accent text-accent font-semibold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="WhatsApp Advisor"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>WhatsApp</span>
        </button>

        {/* Primary Discuss Plan */}
        <button
          onClick={onDiscussClick}
          className="flex-[1.6] py-3.5 px-2 rounded-full bg-accent hover:bg-accent-deep text-white font-bold text-xs flex items-center justify-center gap-1 whitespace-nowrap active:scale-[0.98] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span>Discuss a Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
