/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  CAMPAIGN_CHANNELS,
  ChannelSource,
  UtmParams,
  AnalyticsEvent,
  CrmLeadPayload,
  buildWhatsAppUrl
} from './utils/conversion';
import { AttributionBar } from './components/AttributionBar';
import { AnalyticsDrawer } from './components/AnalyticsDrawer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HERO_COPY } from './utils/attribution';
import { ProductTruthAndBriefBuilder } from './components/ProductTruthAndBriefBuilder';
import { HowItWorks } from './components/HowItWorks';
import { CapabilityProof } from './components/CapabilityProof';
import { TrustAndProof } from './components/TrustAndProof';
import { EnquiryAndWhatsApp } from './components/EnquiryAndWhatsApp';
import { FaqSection } from './components/FaqSection';
import { FinalCtaAndFooter } from './components/FinalCtaAndFooter';
import { MobileStickyBar } from './components/MobileStickyBar';

export default function App() {
  // Current simulated campaign channel
  const [currentChannel, setCurrentChannel] = useState<ChannelSource>('google_search');
  const [activeUtms, setActiveUtms] = useState<UtmParams>(
    CAMPAIGN_CHANNELS.google_search.defaultUtms
  );

  // Selected tailoring dimensions from Bespoke Brief Builder
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([
    'Scale & Venue',
    'Cultural Traditions'
  ]);

  // Analytics & CRM event log stream
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [capturedLeads, setCapturedLeads] = useState<CrmLeadPayload[]>([]);
  const [isAnalyticsDrawerOpen, setIsAnalyticsDrawerOpen] = useState(false);

  // Log an analytics action
  const logEvent = useCallback(
    (eventData: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'channel'>) => {
      const newEvent: AnalyticsEvent = {
        id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        channel: CAMPAIGN_CHANNELS[currentChannel].name,
        ...eventData
      };
      setEvents((prev) => [newEvent, ...prev]);
    },
    [currentChannel]
  );

  // Initial page view event
  useEffect(() => {
    logEvent({
      event: 'page_view',
      label: `Page viewed via ${CAMPAIGN_CHANNELS[currentChannel].name}`,
      section: 'Landing Experience',
      metadata: { utms: activeUtms }
    });
  }, []);

  // Handle changing the simulated ad traffic channel
  const handleSelectChannel = (channel: ChannelSource) => {
    setCurrentChannel(channel);
    const newUtms = CAMPAIGN_CHANNELS[channel].defaultUtms;
    setActiveUtms(newUtms);

    logEvent({
      event: 'page_view',
      label: `Simulated incoming traffic channel switched to: ${CAMPAIGN_CHANNELS[channel].name}`,
      section: 'Attribution Simulator',
      metadata: { newUtms }
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
      section: 'Bespoke Brief Builder',
      metadata: { currentSelection: updated }
    });
  };

  // Smooth scroll to form
  const scrollToForm = () => {
    logEvent({
      event: 'cta_click',
      label: 'Clicked Discuss a Bespoke Plan CTA',
      section: 'Global Navigation / Hero'
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
      section: sourceSection
    });
    const url = buildWhatsAppUrl({
      basePhone: '233302789123',
      tailoringBrief: selectedDimensions,
      channel: CAMPAIGN_CHANNELS[currentChannel].name
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Direct phone click
  const handlePhoneAction = (sourceSection: string = 'Header') => {
    logEvent({
      event: 'phone_click',
      label: `Tapped Call Advisor CTA from ${sourceSection}`,
      section: sourceSection
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
      section: 'Capabilities Proof'
    });
    scrollToForm();
  };

  // Handle step click from How It Works
  const handleStepAction = (stepTitle: string) => {
    logEvent({
      event: 'cta_click',
      label: `Selected step: ${stepTitle}`,
      section: 'How It Works'
    });
    scrollToForm();
  };

  // On lead captured
  const handleLeadCaptured = (lead: CrmLeadPayload) => {
    setCapturedLeads((prev) => [lead, ...prev]);
  };

  const currentChannelConfig = CAMPAIGN_CHANNELS[currentChannel];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B] relative">
      {/* 1. Channel-Adaptive Top Bar & Attribution Simulator (QA Tool) */}
      <AttributionBar
        currentChannel={currentChannel}
        onSelectChannel={handleSelectChannel}
        activeUtms={activeUtms}
        onOpenAnalytics={() => setIsAnalyticsDrawerOpen(true)}
        eventCount={events.length}
      />

      {/* 2. Section 01: Sticky Global Header */}
      <Header
        onDiscussClick={scrollToForm}
        onWhatsAppClick={() => handleWhatsAppAction('Header')}
        onPhoneClick={() => handlePhoneAction('Header')}
      />

      <main className="flex-1">
        {/* 3. Section 02: Hero with Real Facility Photography */}
        <Hero
          heroCopy={HERO_COPY.direct}
          onDiscussClick={scrollToForm}
          onWhatsAppClick={() => handleWhatsAppAction('Hero Cluster')}
          onPhoneClick={() => handlePhoneAction('Hero Cluster')}
        />

        {/* 4. Section 03 & 04: Product Truth + Bespoke Brief Builder (6 Dimensions) */}
        <ProductTruthAndBriefBuilder
          selectedDimensions={selectedDimensions}
          onToggleDimension={handleToggleDimension}
          onScrollToForm={scrollToForm}
        />

        {/* 5. Section 05: How It Works (4-Step Story) */}
        <HowItWorks onStepClick={handleStepAction} />

        {/* 6. Section 06: Capability Proof (7 Concrete Modules) */}
        <CapabilityProof onSelectCapability={handleSelectCapability} />

        {/* 7. Section 07 & 08: Trust, Process Proof & Team */}
        <TrustAndProof
          onDiscussClick={scrollToForm}
        />

        {/* 8. Section 09 & 10: Dual-Path Conversion Core (Qualification Form + WhatsApp Concierge) */}
        <EnquiryAndWhatsApp
          selectedDimensions={selectedDimensions}
          attribution={activeUtms}
          channelName={currentChannelConfig.name}
          onLeadCaptured={handleLeadCaptured}
          onFormStart={(field) =>
            logEvent({
              event: 'form_start',
              label: `User interacted with field: ${field}`,
              section: 'Enquiry Form'
            })
          }
          onFormSubmit={(lead) =>
            logEvent({
              event: 'form_submit',
              label: `Bespoke Consultation Lead: ${lead.leadId}`,
              section: 'Enquiry Form',
              metadata: {
                leadId: lead.leadId,
                location: lead.qualification.location,
                timing: lead.qualification.timing,
                needs: lead.qualification.need_type
              }
            })
          }
          onWhatsAppClick={(section) => handleWhatsAppAction(section)}
          onPhoneClick={(section) => handlePhoneAction(section)}
        />

        {/* 9. Section 11: Accessible FAQ Accordion */}
        <FaqSection
          onDiscussClick={scrollToForm}
          onWhatsAppClick={() => handleWhatsAppAction('FAQ')}
        />

        {/* 10. Section 12: Final Conversion Banner & Global Footer */}
        <FinalCtaAndFooter
          onDiscussClick={scrollToForm}
          onWhatsAppClick={() => handleWhatsAppAction('Final Banner')}
          onPhoneClick={() => handlePhoneAction('Final Banner')}
        />
      </main>

      {/* 11. Persistent Mobile Sticky Bar (Visible on mobile screens) */}
      <MobileStickyBar
        onDiscussClick={scrollToForm}
        onWhatsAppClick={() => handleWhatsAppAction('Mobile Sticky Bar')}
        onPhoneClick={() => handlePhoneAction('Mobile Sticky Bar')}
      />

      {/* 12. Slide-out Live Analytics & CRM Payload Drawer */}
      <AnalyticsDrawer
        isOpen={isAnalyticsDrawerOpen}
        onClose={() => setIsAnalyticsDrawerOpen(false)}
        events={events}
        leads={capturedLeads}
        activeUtms={activeUtms}
        onClearEvents={() => setEvents([])}
      />
    </div>
  );
}
