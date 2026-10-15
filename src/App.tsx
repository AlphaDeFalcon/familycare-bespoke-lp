/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import {
  CrmLeadPayload,
  UtmParams,
  AnalyticsEvent,
  buildWhatsAppUrl
} from './utils/conversion';
import {
  captureAttribution,
  isDebugMode,
  resolveChannel,
  pushDataLayer,
  toDataLayerLeadFields,
  HERO_COPY,
  ChannelSource,
  DataLayerEvent
} from './utils/attribution';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductTruthAndBriefBuilder } from './components/ProductTruthAndBriefBuilder';
import { HowItWorks } from './components/HowItWorks';
import { CapabilityProof } from './components/CapabilityProof';
import { TrustAndProof } from './components/TrustAndProof';
import { EnquiryAndWhatsApp } from './components/EnquiryAndWhatsApp';
import { FaqSection } from './components/FaqSection';
import { FinalCtaAndFooter } from './components/FinalCtaAndFooter';
import { MobileStickyBar } from './components/MobileStickyBar';

const DebugTools = lazy(() =>
  import('./components/DebugTools').then((module) => ({ default: module.DebugTools }))
);

export default function App() {
  // Debug gate + real first-touch attribution, resolved once at load
  const [debug] = useState(() => isDebugMode(window.location.search));
  const [attribution] = useState<UtmParams>(() => captureAttribution(window.location.search));
  const [debugChannelOverride, setDebugChannelOverride] = useState<ChannelSource | null>(null);

  const channelSource = resolveChannel(attribution);
  const heroCopy = HERO_COPY[debugChannelOverride ?? channelSource];

  // Selected tailoring dimensions from Bespoke Brief Builder
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([
    'Scale & Venue',
    'Cultural Traditions'
  ]);

  // Analytics & CRM event log stream (kept always so ?debug=1 shows history)
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [capturedLeads, setCapturedLeads] = useState<CrmLeadPayload[]>([]);
  const [isAnalyticsDrawerOpen, setIsAnalyticsDrawerOpen] = useState(false);

  // Log an analytics action: internal event log + GTM-ready dataLayer push
  const logEvent = useCallback(
    (eventData: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'channel'> & { section?: string }) => {
      const newEvent: AnalyticsEvent = {
        id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        channel: HERO_COPY[channelSource].name,
        ...eventData
      };
      setEvents((prev) => [newEvent, ...prev]);

      const dataLayerEvent: DataLayerEvent = {
        event: eventData.event,
        section: eventData.section,
        ...(eventData.metadata && typeof eventData.metadata === 'object'
          ? { ...(eventData.metadata as Record<string, unknown>) }
          : {})
      };
      pushDataLayer(dataLayerEvent, undefined, attribution);
    },
    [channelSource, attribution]
  );

  // Initial page view event (single path: logEvent also pushes dataLayer)
  useEffect(() => {
    logEvent({
      event: 'page_view',
      label: `Page viewed via ${HERO_COPY[channelSource].name}`,
      section: 'landing',
      metadata: { utms: attribution }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle changing the QA channel override (debug only)
  const handleSelectChannel = (channel: ChannelSource) => {
    setDebugChannelOverride(channel);
    logEvent({
      event: 'page_view',
      label: `QA channel override switched to: ${HERO_COPY[channel].name}`,
      section: 'QA Console',
      metadata: {}
    });
  };

  // Toggle dimension in brief builder
  const handleToggleDimension = (dimensionKey: string) => {
    const exists = selectedDimensions.includes(dimensionKey);
    const updated = exists
      ? selectedDimensions.filter((item) => item !== dimensionKey)
      : [...selectedDimensions, dimensionKey];
    setSelectedDimensions(updated);

    logEvent({
      event: 'brief_tailor_toggle',
      label: `${exists ? 'Removed' : 'Added'} brief dimension: ${dimensionKey}`,
      section: 'brief_builder',
      metadata: { currentSelection: updated }
    });
  };

  // Smooth scroll to form
  const scrollToForm = (section: string = 'Global Navigation / Hero') => {
    logEvent({
      event: 'cta_click',
      label: 'Clicked Discuss a Bespoke Plan CTA',
      section,
      metadata: { cta_name: 'Discuss a Bespoke Plan' }
    });
    const formEl = document.getElementById('enquiry-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open WhatsApp directly
  const handleWhatsAppAction = (sourceSection: string = 'Header') => {
    logEvent({
      event: 'whatsapp_click',
      label: `Tapped WhatsApp CTA from ${sourceSection}`,
      section: sourceSection,
      metadata: { cta_name: 'WhatsApp FamilyCare' }
    });
    const url = buildWhatsAppUrl({
      basePhone: '233302789123',
      tailoringBrief: selectedDimensions,
      channel: attribution.utm_source,
      name: undefined
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Direct phone click
  const handlePhoneAction = (sourceSection: string = 'Header') => {
    logEvent({
      event: 'phone_click',
      label: `Tapped Call Advisor CTA from ${sourceSection}`,
      section: sourceSection,
      metadata: { cta_name: 'Call an Advisor' }
    });
    window.location.href = 'tel:+233302789123';
  };

  // Handle capability card selection
  const handleSelectCapability = (needType: string) => {
    if (!selectedDimensions.includes(needType)) {
      setSelectedDimensions((prev) => [...prev, needType]);
    }
    logEvent({
      event: 'cta_click',
      label: `Selected capability to discuss: ${needType}`,
      section: 'capabilities',
      metadata: { cta_name: 'Discuss this with an advisor' }
    });
    scrollToForm('capabilities');
  };

  // Handle step click from How It Works
  const handleStepAction = (stepTitle: string) => {
    logEvent({
      event: 'cta_click',
      label: `Selected step: ${stepTitle}`,
      section: 'how_it_works',
      metadata: { cta_name: 'Discuss a Bespoke Plan' }
    });
    scrollToForm('how_it_works');
  };

  // On lead captured
  const handleLeadCaptured = (lead: CrmLeadPayload) => {
    setCapturedLeads((prev) => [lead, ...prev]);
  };

  // On form submit success
  const handleFormSubmit = (lead: CrmLeadPayload) => {
    logEvent({
      event: 'form_submit',
      label: `Bespoke Consultation Lead: ${lead.leadId}`,
      section: 'enquiry_form',
      metadata: { form_id: 'enquiry-form', ...toDataLayerLeadFields(lead) }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body relative">
      {/* 1. QA-only debug console (lazy-loaded, ?debug=1 only) */}
      {debug && (
        <Suspense fallback={null}>
          <DebugTools
            currentChannel={debugChannelOverride ?? channelSource}
            onSelectChannel={handleSelectChannel}
            activeUtms={attribution}
            isDrawerOpen={isAnalyticsDrawerOpen}
            onOpenDrawer={() => setIsAnalyticsDrawerOpen(true)}
            onCloseDrawer={() => setIsAnalyticsDrawerOpen(false)}
            events={events}
            leads={capturedLeads}
            onClearEvents={() => setEvents([])}
          />
        </Suspense>
      )}

      {/* 2. Section 01: Sticky Global Header */}
      <Header
        onDiscussClick={() => scrollToForm('header')}
        onWhatsAppClick={() => handleWhatsAppAction('header')}
        onPhoneClick={() => handlePhoneAction('header')}
      />

      <main className="flex-1">
        {/* 3. Section 02: Hero with Real Facility Photography */}
        <Hero
          heroCopy={heroCopy}
          onDiscussClick={() => scrollToForm('hero')}
          onWhatsAppClick={() => handleWhatsAppAction('hero')}
          onPhoneClick={() => handlePhoneAction('hero')}
        />

        {/* 4. Section 03 & 04: Product Truth + Bespoke Brief Builder (6 Dimensions) */}
        <ProductTruthAndBriefBuilder
          selectedDimensions={selectedDimensions}
          onToggleDimension={handleToggleDimension}
          onScrollToForm={() => scrollToForm('brief_builder')}
        />

        {/* 5. Section 05: How It Works (4-Step Story) */}
        <HowItWorks onStepClick={handleStepAction} />

        {/* 6. Section 06: Capability Proof (7 Concrete Modules) */}
        <CapabilityProof onSelectCapability={handleSelectCapability} />

        {/* 7. Section 07 & 08: Trust, Process Proof & Team */}
        <TrustAndProof onDiscussClick={() => scrollToForm('trust')} />

        {/* 8. Section 09 & 10: Dual-Path Conversion Core (Qualification Form + WhatsApp Concierge) */}
        <EnquiryAndWhatsApp
          selectedDimensions={selectedDimensions}
          attribution={attribution}
          onLeadCaptured={handleLeadCaptured}
          onFormStart={(field) =>
            logEvent({
              event: 'form_start',
              label: `User interacted with field: ${field}`,
              section: 'enquiry_form',
              metadata: { form_id: 'enquiry-form' }
            })
          }
          onFormSubmit={handleFormSubmit}
          onWhatsAppClick={(section) => handleWhatsAppAction(section)}
          onPhoneClick={(section) => handlePhoneAction(section)}
        />

        {/* 9. Section 11: Accessible FAQ Accordion */}
        <FaqSection
          onDiscussClick={() => scrollToForm('faq')}
          onWhatsAppClick={() => handleWhatsAppAction('faq')}
        />

        {/* 10. Section 12: Final Conversion Banner & Global Footer */}
        <FinalCtaAndFooter
          onDiscussClick={() => scrollToForm('final_cta')}
          onWhatsAppClick={() => handleWhatsAppAction('final_cta')}
          onPhoneClick={() => handlePhoneAction('final_cta')}
        />
      </main>

      {/* 11. Persistent Mobile Sticky Bar (Visible on mobile screens) */}
      <MobileStickyBar
        onDiscussClick={() => scrollToForm('mobile_sticky')}
        onWhatsAppClick={() => handleWhatsAppAction('mobile_sticky')}
        onPhoneClick={() => handlePhoneAction('mobile_sticky')}
      />
    </div>
  );
}
