/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  buildWhatsAppUrl,
  buildWhatsAppMessage,
  type CrmLeadPayload,
  type UtmParams
} from '../utils/conversion';
import { EnquiryForm } from './EnquiryForm';
import { WhatsAppConcierge } from './WhatsAppConcierge';
import { Reveal } from './Reveal';
import { needTypeLabel, DEFAULT_NEED_TYPE } from '../utils/enquiryOptions';

interface Draft {
  name: string;
  location: string;
  needTypes: string[];
}

interface EnquiryAndWhatsAppProps {
  attribution: UtmParams;
  onFormStart: () => void;
  onFormSubmit: (lead: CrmLeadPayload) => void;
  onWhatsAppClick: (section: string) => void;
  onPhoneClick: (section: string) => void;
}

export const EnquiryAndWhatsApp: React.FC<EnquiryAndWhatsAppProps> = ({
  attribution,
  onFormStart,
  onFormSubmit,
  onWhatsAppClick,
  onPhoneClick
}) => {
  // Mirrors the form's initial selection so the concierge preview matches
  // what the visitor sees before they touch any field.
  const [draft, setDraft] = useState<Draft>({
    name: '',
    location: '',
    needTypes: [DEFAULT_NEED_TYPE]
  });

  // Single source of truth for the pre-filled message: the same options
  // build both the URL and the live preview, so they can never drift.
  const messageOptions = {
    // The WhatsApp message is visitor-facing, so it uses display labels.
    // The CRM payload keeps the stable values from form state.
    tailoringBrief: draft.needTypes.map(needTypeLabel),
    location: draft.location || undefined,
    channel: attribution.utm_source,
    name: draft.name || undefined
  };

  const whatsAppUrl = buildWhatsAppUrl({
    basePhone: '233597434114',
    ...messageOptions
  });

  const whatsAppMessage = buildWhatsAppMessage(messageOptions);

  return (
    <section id="enquiry-form" className="py-16 sm:py-24 bg-canvas border-b border-hairline scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="max-w-6xl mx-auto text-center space-y-3 mb-12">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
              Discuss a Plan
            </h2>

            <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted leading-relaxed">
              No set package. Tell us what matters, and a FamilyCare advisor will shape the arrangement with you, then prepare a clear, itemized proposal. No obligation.
            </p>
          </div>
        </Reveal>

        {/* Dual-Path Container (Form Left, WhatsApp Concierge Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 Columns): Qualification Form or Success State */}
          <div className="order-1 lg:order-1 lg:col-span-7 bg-white rounded-card border border-hairline border-t-[3px] border-t-accent p-6 sm:p-9">
            <EnquiryForm
              attribution={attribution}
              whatsAppUrl={whatsAppUrl}
              onDraftChange={setDraft}
              onFormStart={onFormStart}
              onSubmitSuccess={onFormSubmit}
              onWhatsAppClick={() => onWhatsAppClick('enquiry_form')}
              onPhoneClick={() => onPhoneClick('enquiry_form')}
            />
          </div>

          {/* Right Column (5 Columns): Direct WhatsApp Concierge. Sticky on
              desktop so the conversation path stays beside the form; follows
              the form on mobile. */}
          <div className="order-2 lg:order-2 lg:col-span-5 lg:sticky lg:top-24">
            <WhatsAppConcierge
              whatsAppUrl={whatsAppUrl}
              whatsAppMessage={whatsAppMessage}
              onWhatsAppClick={() => onWhatsAppClick('enquiry_form')}
              onPhoneClick={() => onPhoneClick('enquiry_form')}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
