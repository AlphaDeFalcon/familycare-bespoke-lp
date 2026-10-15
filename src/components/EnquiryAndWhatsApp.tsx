/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  buildWhatsAppUrl,
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
  channelName: string;
  onLeadCaptured: (lead: CrmLeadPayload) => void;
  onFormStart: (field: string) => void;
  onFormSubmit: (lead: CrmLeadPayload) => void;
  onWhatsAppClick: (section: string) => void;
  onPhoneClick: (section: string) => void;
}

export const EnquiryAndWhatsApp: React.FC<EnquiryAndWhatsAppProps> = ({
  selectedDimensions,
  attribution,
  channelName,
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

  const whatsAppUrl = buildWhatsAppUrl({
    basePhone: '233302789123',
    tailoringBrief: draft.needTypes,
    location: draft.location || undefined,
    channel: channelName,
    name: draft.name || undefined
  });

  return (
    <section id="enquiry-form" className="py-16 sm:py-24 bg-canvas border-b border-hairline scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
              Tell us what you need. A FamilyCare advisor will help you understand the next step.
            </h2>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              There is no obligation. We clarify options, check location coverage, and prepare a calm, transparent proposal tailored strictly to your wishes.
            </p>
          </div>
        </Reveal>

        {/* Dual-Path Container (Form Left, WhatsApp Concierge Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 Columns): Qualification Form or Success State */}
          <div className="lg:col-span-7 bg-white rounded-card border border-hairline p-6 sm:p-9">
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

          {/* Right Column (5 Columns): Direct WhatsApp Concierge */}
          <div className="lg:col-span-5">
            <WhatsAppConcierge
              whatsAppUrl={whatsAppUrl}
              draft={draft}
              sourceLabel={channelName}
              onWhatsAppClick={() => onWhatsAppClick('enquiry_form')}
              onPhoneClick={() => onPhoneClick('enquiry_form')}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
