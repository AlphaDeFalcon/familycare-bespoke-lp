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

interface Draft {
  name: string;
  location: string;
  needTypes: string[];
}

interface EnquiryAndWhatsAppProps {
  selectedDimensions: string[];
  attribution: UtmParams;
  onLeadCaptured: (lead: CrmLeadPayload) => void;
  onFormStart: (field: string) => void;
  onFormSubmit: (lead: CrmLeadPayload) => void;
  onWhatsAppClick: (section: string) => void;
  onPhoneClick: (section: string) => void;
}

export const EnquiryAndWhatsApp: React.FC<EnquiryAndWhatsAppProps> = ({
  selectedDimensions,
  attribution,
  onLeadCaptured,
  onFormStart,
  onFormSubmit,
  onWhatsAppClick,
  onPhoneClick
}) => {
  const [draft, setDraft] = useState<Draft>({
    name: '',
    location: '',
    needTypes: selectedDimensions
  });

  // Single source of truth for the pre-filled message: the same options
  // build both the URL and the live preview, so they can never drift.
  const messageOptions = {
    tailoringBrief: draft.needTypes,
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
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
              Start your consultation
            </h2>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              There is no obligation. We clarify options, check location coverage, and prepare a calm, transparent proposal tailored strictly to your wishes.
            </p>
          </div>
        </Reveal>

        {/* Dual-Path Container (Form Left, WhatsApp Concierge Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 Columns): Qualification Form or Success State */}
          <div className="order-1 lg:order-1 lg:col-span-7 bg-white rounded-card border border-hairline border-t-[3px] border-t-accent p-6 sm:p-9">
            <EnquiryForm
              initialNeedTypes={selectedDimensions}
              attribution={attribution}
              whatsAppUrl={whatsAppUrl}
              onDraftChange={setDraft}
              onFormStart={() => onFormStart('enquiry-form')}
              onSubmitSuccess={(lead) => {
                onLeadCaptured(lead);
                onFormSubmit(lead);
              }}
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
