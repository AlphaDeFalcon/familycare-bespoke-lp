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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#DDD7C6] px-3 py-2.5 md:hidden shadow-lg safe-area-bottom">
      <div className="flex items-center gap-2">
        {/* Quick Call */}
        <button
          onClick={onPhoneClick}
          className="flex-1 py-2.5 px-2 rounded-xl bg-white border border-[#3A55A3]/40 text-[#3A55A3] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-transform"
          aria-label="Call Advisor"
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>Call</span>
        </button>

        {/* Quick WhatsApp */}
        <button
          onClick={onWhatsAppClick}
          className="flex-1 py-2.5 px-2 rounded-xl bg-[#E8F8F0] border border-[#00A859] text-[#00A859] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-transform"
          aria-label="WhatsApp Advisor"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>WhatsApp</span>
        </button>

        {/* Primary Discuss Plan */}
        <button
          onClick={onDiscussClick}
          className="flex-1.5 py-2.5 px-3 rounded-xl bg-[#00A859] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-98 transition-transform"
          aria-label="Discuss a Bespoke Plan"
        >
          <span>Discuss Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
