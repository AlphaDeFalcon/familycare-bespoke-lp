/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  Mail,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FinalCtaAndFooterProps {
  onDiscussClick: () => void;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

export const FinalCtaAndFooter: React.FC<FinalCtaAndFooterProps> = ({
  onDiscussClick,
  onWhatsAppClick,
  onPhoneClick
}) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      {/* Final Conversion Banner (Deep Cobalt/Slate #1E2B4F) */}
      <section className="bg-[#1E2B4F] text-white py-16 sm:py-20 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00A859_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A859]" />
            <span>Dedicated Consultation Route</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            LET’S TALK ABOUT WHAT YOUR FAMILY NEEDS.
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Tell us what matters to you, and a FamilyCare advisor can help shape the next step—with complete dignity, transparency, and peace of mind.
          </p>

          {/* 3 Primary Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onDiscussClick}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#00A859] hover:bg-[#072A1A] text-white font-semibold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Discuss a Bespoke Plan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onWhatsAppClick}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-zinc-100 text-[#072A1A] font-semibold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-[#00A859]" />
              <span>WhatsApp FamilyCare</span>
            </button>

            <button
              onClick={onPhoneClick}
              className="w-full sm:w-auto px-5 py-4 rounded-xl border border-white/30 hover:border-white text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>Call an Advisor</span>
            </button>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-[#121826] text-zinc-400 pt-16 pb-24 md:pb-16 border-t border-zinc-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Col 1 & 2: Brand Lockup & Mission */}
            <div className="lg:col-span-2 space-y-4">
              <BrandLogo variant="white" size="md" showTagline={true} />
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm pt-2">
                FamilyCare Funeral Trust is Ghana’s foremost provider of consultative, bespoke funeral arrangements. We protect family dignity and provide complete peace of mind through rigorous planning and heartfelt reverence.
              </p>
              <div className="pt-2 text-zinc-500 font-mono text-[11px]">
                Accredited Ghanaian Funeral Trust &amp; Logistics Service
              </div>
            </div>

            {/* Col 3: Navigation */}
            <div className="space-y-3">
              <div className="font-semibold text-white uppercase text-xs tracking-wider">
                Services &amp; Navigation
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#tailoring" className="hover:text-white transition-colors">Contract / Bespoke</a>
                </li>
                <li>
                  <a href="#truth" className="hover:text-white transition-colors">Our Product Truth</a>
                </li>
                <li>
                  <a href="#process" className="hover:text-white transition-colors">How It Works (4 Steps)</a>
                </li>
                <li>
                  <a href="#capabilities" className="hover:text-white transition-colors">Operational Capabilities</a>
                </li>
                <li>
                  <a href="#trust" className="hover:text-white transition-colors">Credentials &amp; Advisory Team</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a>
                </li>
              </ul>
            </div>

            {/* Col 4: Physical Branch Locations in Ghana */}
            <div className="space-y-3">
              <div className="font-semibold text-white uppercase text-xs tracking-wider">
                Physical Branches
              </div>
              <div className="space-y-3 text-xs">
                <div className="space-y-0.5">
                  <div className="text-zinc-200 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00A859]" />
                    <span>Accra Branch (Head Office)</span>
                  </div>
                  <div className="text-zinc-400 pl-5">
                    Liberation Road, Airport Residential Area, Accra
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-zinc-200 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#3A55A3]" />
                    <span>Kumasi Branch</span>
                  </div>
                  <div className="text-zinc-400 pl-5">
                    Ahodwo Roundabout, Kumasi, Ashanti Region
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-zinc-200 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Takoradi Liaison Office</span>
                  </div>
                  <div className="text-zinc-400 pl-5">
                    Beach Road Business District, Takoradi
                  </div>
                </div>
              </div>
            </div>

            {/* Col 5: Contact & Hours */}
            <div className="space-y-3">
              <div className="font-semibold text-white uppercase text-xs tracking-wider">
                Direct Contact
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#00A859]" />
                  <a href="tel:+233302789123" className="hover:text-white font-mono">
                    +233 (0)30 278 9123
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#00A859]" />
                  <span className="font-mono">WhatsApp 24/7 Available</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#3A55A3]" />
                  <span className="truncate">bespoke@familycarefuneraltrust.com</span>
                </li>
                <li className="flex items-start gap-2 pt-1 text-[11px] text-zinc-500">
                  <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <span>Branches open Mon–Sat 8:00 AM – 6:00 PM. Emergency and advisory lines active 24 hours.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar & Legal Credentials */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <div>
              © 2026 FamilyCare Funeral Trust Ghana. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setModalType('privacy')}
                className="hover:text-zinc-300 transition-colors"
              >
                Privacy Policy &amp; Data Consent
              </button>
              <span>•</span>
              <button
                onClick={() => setModalType('terms')}
                className="hover:text-zinc-300 transition-colors"
              >
                Terms of Bespoke Service
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Privacy / Terms Accessible Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 text-[#18181B] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="font-editorial text-xl font-bold">
                {modalType === 'privacy' ? 'Privacy Policy & Data Handling' : 'Terms of Bespoke Consultation'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-zinc-600 space-y-3 max-h-80 overflow-y-auto leading-relaxed">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    FamilyCare Funeral Trust collects personal information (such as your name, telephone/WhatsApp contact, and event requirements) strictly for the purpose of communicating with you regarding your funeral arrangement brief and preparing customized proposals.
                  </p>
                  <p>
                    We respect the emotional gravity and sensitivity of bereavement. We never sell, rent, or trade family contact data with third-party advertisers. All lead and attribution metadata is retained securely in our confidential CRM pipeline.
                  </p>
                  <p>
                    You have the right to request deletion of your consultation record at any time by contacting our data protection officer at privacy@familycarefuneraltrust.com.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    FamilyCare Contract / Bespoke service operates on a consultative basis with no fixed package. Submitting an enquiry or WhatsApp message does not constitute a legally binding commercial contract until a written, itemized proposal is approved and signed by both parties.
                  </p>
                  <p>
                    All services—including hearse transit, floral tributes, casket delivery, and cemetery protocol—are subject to formal confirmation of schedules, municipal cemetery availability, and mutual agreement on itemized costs.
                  </p>
                  <p>
                    FamilyCare complies with all public health guidelines and funeral regulatory frameworks in the Republic of Ghana.
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-200 text-right">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
