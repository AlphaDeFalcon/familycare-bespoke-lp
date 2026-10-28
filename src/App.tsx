/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import {
  CrmLeadPayload,
  UtmParams,
  buildWhatsAppUrl
} from './utils/conversion';
import {
  captureAttribution,
  pushDataLayer,
  toDataLayerLeadFields,
  DataLayerEvent
} from './utils/attribution';
import { Header } from './components/Header';
import { HowItWorks } from './components/HowItWorks';
import { TrustAndProof } from './components/TrustAndProof';
import { EnquiryAndWhatsApp } from './components/EnquiryAndWhatsApp';
import { FinalCtaAndFooter } from './components/FinalCtaAndFooter';
import { MobileStickyBar } from './components/MobileStickyBar';

type ConversionEvent =
  | 'cta_click'
  | 'whatsapp_click'
  | 'phone_click'
  | 'form_start'
  | 'form_submit';

interface ConversionEventPayload {
  event: ConversionEvent;
  section?: string;
  metadata?: Record<string, unknown>;
}

export default function App() {
  // Real first-touch attribution, resolved once at load
  const [attribution] = useState<UtmParams>(() => captureAttribution(window.location.search));

  // Push an analytics event to the GTM dataLayer with attribution attached
  const logEvent = useCallback(
    ({ event, section, metadata }: ConversionEventPayload) => {
      const dataLayerEvent: DataLayerEvent = {
        event,
        section,
        ...(metadata ?? {})
      };
      pushDataLayer(dataLayerEvent, undefined, attribution);
    },
    [attribution]
  );

  // Smooth scroll to form without logging: for handlers that already log
  // their own CTA event, so a single tap emits exactly one cta_click.
  const scrollToFormElement = () => {
    const formEl = document.getElementById('enquiry-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Smooth scroll to form (logs the primary CTA click)
  const scrollToForm = (section: string = 'Global Navigation') => {
    logEvent({
      event: 'cta_click',
      section,
      metadata: { cta_name: 'Discuss a Plan' }
    });
    scrollToFormElement();
  };

  // Log-only variants used by anchor-based CTAs (WhatsApp concierge and the
  // success state): the anchor's own href performs the single navigation, so
  // the click handler must not open a second tab.
  const logWhatsAppClick = (sourceSection: string) => {
    logEvent({
      event: 'whatsapp_click',
      section: sourceSection,
      metadata: { cta_name: 'WhatsApp FamilyCare' }
    });
  };

  const logPhoneClick = (sourceSection: string) => {
    logEvent({
      event: 'phone_click',
      section: sourceSection,
      metadata: { cta_name: 'Call an Advisor' }
    });
  };

  // Open WhatsApp directly
  const handleWhatsAppAction = (sourceSection: string = 'Header') => {
    logWhatsAppClick(sourceSection);
    const url = buildWhatsAppUrl({
      basePhone: '233597434114',
      channel: attribution.utm_source
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Direct phone click
  const handlePhoneAction = (sourceSection: string = 'Header') => {
    logPhoneClick(sourceSection);
    window.location.href = 'tel:+233597434114';
  };

  // Handle step click from How It Works
  const handleStepAction = () => {
    logEvent({
      event: 'cta_click',
      section: 'how_it_works',
      metadata: { cta_name: 'Discuss a Plan' }
    });
    scrollToFormElement();
  };

  // On form submit success
  const handleFormSubmit = (lead: CrmLeadPayload) => {
    logEvent({
      event: 'form_submit',
      section: 'enquiry_form',
      metadata: { form_id: 'enquiry-form', ...toDataLayerLeadFields(lead) }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body relative">
      {/* Sticky global header */}
      <Header
        onDiscussClick={() => scrollToForm('header')}
        onWhatsAppClick={() => handleWhatsAppAction('header')}
        onPhoneClick={() => handlePhoneAction('header')}
      />

      <main className="flex-1">
        {/* Page-level heading for screen readers and search engines */}
        <h1 className="sr-only">FamilyCare custom arrangements in Ghana</h1>

        {/* How It Works (4-step story) */}
        <HowItWorks onStepClick={handleStepAction} />

        {/* Dual-path conversion core: qualification form + WhatsApp concierge */}
        <EnquiryAndWhatsApp
          attribution={attribution}
          onFormStart={() =>
            logEvent({
              event: 'form_start',
              section: 'enquiry_form',
              metadata: { form_id: 'enquiry-form' }
            })
          }
          onFormSubmit={handleFormSubmit}
          onWhatsAppClick={logWhatsAppClick}
          onPhoneClick={logPhoneClick}
        />

        {/* Permissioned customer reviews */}
        <TrustAndProof />

        {/* Global footer */}
        <FinalCtaAndFooter
          onWhatsAppClick={() => handleWhatsAppAction('footer')}
          onPhoneClick={() => logPhoneClick('footer')}
        />
      </main>

      {/* Persistent mobile sticky bar */}
      <MobileStickyBar
        onDiscussClick={() => scrollToForm('mobile_sticky')}
        onWhatsAppClick={() => handleWhatsAppAction('mobile_sticky')}
        onPhoneClick={() => handlePhoneAction('mobile_sticky')}
      />
    </div>
  );
}
