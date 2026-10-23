/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import type { CrmLeadPayload } from '../utils/conversion';

interface EnquirySuccessProps {
  lead: CrmLeadPayload;
  whatsAppUrl: string;
  onReset: () => void;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

export const EnquirySuccess: React.FC<EnquirySuccessProps> = ({
  lead,
  whatsAppUrl,
  onReset,
  onWhatsAppClick,
  onPhoneClick
}) => {
  return (
    <div id="enquiry-success" className="space-y-6" role="status">
      <div className="p-4 rounded-card bg-accent/10 border border-accent/20 flex items-start gap-4">
        <div className="p-2 rounded-card bg-accent text-white">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-display text-2xl font-bold text-ink">
            Thank you, {lead.identity.name}.
          </h4>
          <p className="text-xs sm:text-sm text-body/80 mt-1">
            A FamilyCare advisor will contact you to shape the next step.
          </p>
          <p className="text-xs sm:text-sm text-body/80 mt-1">
            Preferred route: {lead.qualification.preferred_next_step}.
          </p>
          <div className="mt-2 text-xs font-mono font-bold text-accent">
            Reference: {lead.leadId}
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="border border-hairline rounded-card p-5 bg-canvas space-y-3">
        <h5 className="font-semibold text-xs text-body uppercase tracking-wider">
          What happens next:
        </h5>
        <ul className="text-xs text-muted space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
            <span>An advisor will review your requested items for {lead.qualification.location}.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-deep mt-1.5 shrink-0" aria-hidden="true" />
            <span>We will contact you through your preferred route ({lead.qualification.preferred_next_step}).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
            <span>You will receive an itemized proposal to discuss with family decision-makers.</span>
          </li>
        </ul>
      </div>

      {/* Immediate Conversion Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsAppClick}
          className="py-3 px-4 rounded-full bg-accent hover:bg-accent-deep text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Open WhatsApp Right Now</span>
        </a>

        <a
          href="tel:+233597434114"
          onClick={onPhoneClick}
          className="py-3 px-4 rounded-full border border-deep bg-deep/5 hover:bg-deep/10 text-deep text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Phone className="w-4 h-4" />
          <span>Call an Advisor</span>
        </a>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="text-xs text-deep hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          Submit another consultation enquiry
        </button>
      </div>
    </div>
  );
};
