/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  conversionRole: string;
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What does Contract / Custom mean?',
    answer: 'It means there is no fixed package. FamilyCare starts with your family\'s wishes, then builds the arrangement around them: the scale of the service, cultural traditions, caskets, transport, catering, cemetery arrangements, and budget. You approve an itemized proposal before anything is confirmed.',
    conversionRole: 'Clarifies product proposition'
  },
  {
    id: 'faq-2',
    question: 'How does the process work?',
    answer: 'You share what you need by form, WhatsApp, or phone. An advisor helps you shape the service. You review and approve an itemized proposal with your family. Then FamilyCare coordinates the service from start to finish.',
    conversionRole: 'Reduces process uncertainty'
  },
  {
    id: 'faq-3',
    question: 'What can we customize?',
    answer: 'Almost every part of the arrangement: the scale and venue, cultural and religious traditions, caskets and urns, hearse and transport, pallbearing, catering and hospitality, repatriation, and cemetery coordination.',
    conversionRole: 'Demonstrates flexibility'
  },
  {
    id: 'faq-4',
    question: 'How much will it cost?',
    answer: 'Pricing depends on what the arrangement includes. After a short conversation, your advisor prepares an itemized quotation so you can see the cost of each element before you commit.',
    conversionRole: 'Sets clear commercial expectations'
  },
  {
    id: 'faq-5',
    question: 'What should we have ready before we talk?',
    answer: 'Nothing needs to be final. It helps to know the timing, the region where the funeral will take place, any religious or cultural traditions, and a rough budget if you have one.',
    conversionRole: 'Improves consultation readiness'
  },
  {
    id: 'faq-6',
    question: 'What happens after we send the form?',
    answer: 'An advisor reviews your enquiry, checks coverage for your region, and contacts you through your preferred route to arrange a consultation.',
    conversionRole: 'Reduces post-submission anxiety'
  },
  {
    id: 'faq-7',
    question: 'Can we plan over WhatsApp?',
    answer: 'Yes. Many families start on WhatsApp. You can ask questions, share your wishes, and send documents. An advisor will guide you from there.',
    conversionRole: 'Enables low-friction contact'
  },
  {
    id: 'faq-8',
    question: 'Do we need to visit a branch?',
    answer: 'No. Most arrangements can be completed by WhatsApp, phone, and email, including from abroad. If you prefer to meet in person, our branches are in Accra, Tema, Kumasi, and Koforidua.',
    conversionRole: 'Removes physical friction'
  },
  {
    id: 'faq-9',
    question: 'Can we plan ahead?',
    answer: 'Yes. Some families plan ahead so decisions are made calmly rather than under pressure. We document your wishes, traditions, and budget guidance, and nothing is committed until your family approves a proposal.',
    conversionRole: 'Opens the pre-planning audience'
  },
  {
    id: 'faq-10',
    question: 'Is there any obligation to proceed?',
    answer: 'No. The consultation and proposal are there for your family to consider. You decide whether to proceed.',
    conversionRole: 'Removes commitment anxiety'
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
  const prefersReduced = useReducedMotion();

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-b border-hairline scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center space-y-5 mb-12 sm:mb-16">
            <span className="block w-12 h-1 rounded-full bg-accent mx-auto" aria-hidden="true" />

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
              Questions families ask
            </h2>

            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Straight answers about the process, pricing, and planning ahead.
            </p>
          </div>
        </Reveal>

        {/* Accordion List */}
        <Reveal delay={0.05}>
          <div className="divide-y divide-hairline border-y border-hairline">
          {FAQS.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div key={faq.id}>
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full py-5 sm:py-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  <span
                    className={`font-display text-lg sm:text-xl font-bold transition-colors ${
                      isOpen ? 'text-accent-deep' : 'text-ink'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-[background-color,color,transform] duration-200 ${
                      isOpen
                        ? 'bg-accent text-white rotate-180'
                        : 'bg-accent/10 text-accent-deep'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <motion.div
                    id={`faq-answer-${faq.id}`}
                    initial={prefersReduced ? false : { opacity: 0, transform: 'translateY(-4px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="pb-6 text-xs sm:text-sm text-muted leading-relaxed max-w-3xl"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            );
          })}
          </div>
        </Reveal>

        {/* Bottom micro prompt */}
        <div className="mt-12 p-7 sm:p-8 rounded-card bg-forest text-white flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div>
            <div className="font-display text-xl sm:text-2xl font-bold">
              Have a question not answered here?
            </div>
            <div className="text-xs sm:text-sm text-[#A9C6B6] mt-1">
              An advisor can answer any question about logistics, traditions, or timing.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onWhatsAppClick}
              className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-deep text-white text-xs font-semibold transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask via WhatsApp</span>
            </button>
            <button
              onClick={onDiscussClick}
              className="px-5 py-2.5 rounded-full border border-white/40 text-white hover:bg-white/10 text-xs font-semibold transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              <span>Talk to an advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
