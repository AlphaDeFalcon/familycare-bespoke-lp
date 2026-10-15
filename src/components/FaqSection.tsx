/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Phone, ArrowRight } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  conversionRole: string;
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is Contract / Bespoke?',
    answer: 'Unlike conventional fixed funeral packages that force families into rigid inclusions or hidden costs, FamilyCare Contract / Bespoke has no set package. Our team listens first to your specific requirements, then builds the funeral arrangement around what truly matters to you—including scale, cultural traditions, caskets, executive logistics, and transparent budget alignment.',
    conversionRole: 'Clarifies product proposition'
  },
  {
    id: 'faq-2',
    question: 'How does the process work?',
    answer: 'We guide you along a clear, consultative 4-step journey: (1) Share Your Needs via phone, WhatsApp, or form; (2) We Shape the Service in an unhurried advisor consultation; (3) You Review & Approve a transparent, itemized proposal with zero pressure; and (4) We Carry It Through, executing every detail with utmost dignity and professional decorum.',
    conversionRole: 'Reduces process uncertainty'
  },
  {
    id: 'faq-3',
    question: 'What can be tailored?',
    answer: 'Every essential operational dimension can be tailored to your family’s wishes: gathering scale (from private family remembrances to large public ceremonies), cultural traditions (Akan, Ewe, Ga, Christian, Islamic), curated caskets and urns, executive hearse fleet logistics across Ghana, professional ceremonial pallbearing, guest catering and hospitality, and cemetery coordination.',
    conversionRole: 'Demonstrates flexibility'
  },
  {
    id: 'faq-4',
    question: 'How do I get a price?',
    answer: 'Because every bespoke arrangement is uniquely shaped around your family’s desires, pricing is determined after an advisor understands your brief. We prepare a fully itemized, transparent quotation outlining every service element clearly. There are never surprise add-ons or hidden fees.',
    conversionRole: 'Sets clear commercial expectations'
  },
  {
    id: 'faq-5',
    question: 'What information should I have ready?',
    answer: 'You do not need everything finalized to speak with us. It is helpful to know: (a) approximate timing (immediate need or future pre-planning), (b) intended location or region in Ghana, (c) preferred religious or cultural traditions, and (d) any budget guidance you feel comfortable sharing.',
    conversionRole: 'Improves consultation readiness'
  },
  {
    id: 'faq-6',
    question: 'What happens after I submit the form?',
    answer: 'A dedicated FamilyCare senior advisor reviews your submissions, checks regional logistics, and connects with you through your selected preferred route (WhatsApp conversation, phone call, or in-person consultation) to begin defining your family’s custom plan.',
    conversionRole: 'Reduces post-submission anxiety'
  },
  {
    id: 'faq-7',
    question: 'Can I use WhatsApp to start planning?',
    answer: 'Yes, absolutely. WhatsApp is a primary conversational route at FamilyCare used by thousands of Ghanaian families. You can message our duty desk at any time to ask questions, share preliminary wishes, and receive immediate advisor guidance.',
    conversionRole: 'Enables low-friction contact'
  },
  {
    id: 'faq-8',
    question: 'Do I need to visit a branch in person?',
    answer: 'An in-person visit is not required. Many families—especially those in the diaspora or busy professionals—complete their entire arrangement via WhatsApp, phone, and secure email proposals. However, if you prefer meeting face-to-face, our private consultation suites in Accra (Airport Residential Area) and Kumasi (Ahodwo) are always open to you.',
    conversionRole: 'Removes physical friction'
  }
];

interface FaqSectionProps {
  onDiscussClick: () => void;
  onWhatsAppClick: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onDiscussClick,
  onWhatsAppClick
}) => {
  // First item open by default as specified in wireframe page 12
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E7E2D6] scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A55A3]/10 text-[#3A55A3] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions &amp; Guidance</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B] tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            Clear, honest answers about how FamilyCare shapes bespoke arrangements, pricing, and timing.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#DDD7C6] overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden focus:bg-[#FAF8F5]"
                >
                  <span className="font-editorial text-lg sm:text-xl font-bold text-[#18181B]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#00A859] text-white rotate-180'
                        : 'bg-[#F2EFE9] text-[#52525B]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#52525B] leading-relaxed border-t border-[#F2EFE9] pt-4"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom micro prompt */}
        <div className="mt-10 p-6 rounded-2xl bg-[#F2EFE9] border border-[#DDD7C6] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-semibold text-xs sm:text-sm text-[#18181B]">
              Have a question not answered here?
            </div>
            <div className="text-xs text-[#52525B]">
              Our advisors can clarify any logistical or cultural detail immediately.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onWhatsAppClick}
              className="px-3.5 py-2 rounded-xl bg-[#00A859] text-white text-xs font-semibold hover:bg-[#072A1A] transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask via WhatsApp</span>
            </button>
            <button
              onClick={onDiscussClick}
              className="px-3.5 py-2 rounded-xl border border-[#3A55A3] text-[#3A55A3] bg-white text-xs font-semibold hover:bg-[#FAF8F5] transition-colors"
            >
              <span>Consult an Advisor</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
