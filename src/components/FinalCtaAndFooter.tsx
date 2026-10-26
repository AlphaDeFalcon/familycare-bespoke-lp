/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  MessageCircle,
  ArrowRight,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Reveal } from './Reveal';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (modalType) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      const modal = modalRef.current;
      if (modal) {
        const focusable = modal.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    } else {
      lastFocusedRef.current?.focus();
      lastFocusedRef.current = null;
    }
  }, [modalType]);

  useEffect(() => {
    if (!modalType) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalType(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalType]);

  return (
    <>
      {/* Final Conversion Banner — commented out per request */}
      {/*
      <section className="bg-forest text-white py-16 sm:py-20 relative overflow-hidden">
        <Reveal>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onDiscussClick}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-accent hover:bg-accent-deep text-white font-semibold text-base transition-colors flex items-center justify-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              <span>Discuss a Plan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onWhatsAppClick}
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-white hover:bg-zinc-100 text-ink font-semibold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              <MessageCircle className="w-5 h-5 text-accent" />
              <span>WhatsApp FamilyCare</span>
            </button>

            <button
              onClick={onPhoneClick}
              className="w-full sm:w-auto px-5 py-4 rounded-full border border-white/30 hover:border-white text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              <Phone className="w-4 h-4 text-[#7FDDAB]" />
              <span>Call an Advisor</span>
            </button>
          </div>
          </div>
        </Reveal>
      </section>
      */}

      {/* Global Footer */}
      <footer className="bg-forest text-zinc-400 pt-16 pb-24 md:pb-16 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.8fr)] items-start gap-10 md:gap-20">
            {/* Brand Lockup & Mission */}
            <div className="space-y-4 max-w-xl">
              <BrandLogo variant="white" className="h-30 w-auto" />
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm pt-2">
                FamilyCare Funeral Trust provides consultative, custom funeral arrangements. We protect family dignity and provide peace of mind through careful planning and clear communication.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://www.facebook.com/FamilyCareFuneralTrust"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FamilyCare Funeral Trust on Facebook"
                  className="p-2 rounded-full border border-white/15 text-zinc-300 hover:text-white hover:border-white/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/familycareft_"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FamilyCare Funeral Trust on Instagram"
                  className="p-2 rounded-full border border-white/15 text-zinc-300 hover:text-white hover:border-white/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/familycaretrust"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FamilyCare Funeral Trust on LinkedIn"
                  className="p-2 rounded-full border border-white/15 text-zinc-300 hover:text-white hover:border-white/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com/familycareft"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FamilyCare Funeral Trust on X (Twitter)"
                  className="p-2 rounded-full border border-white/15 text-zinc-300 hover:text-white hover:border-white/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Services & Navigation — commented out per request */}
            {/*
            <div className="space-y-3">
              <div className="font-semibold text-white uppercase text-xs tracking-wider">
                Services &amp; Navigation
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#tailoring" className="hover:text-white transition-colors">Contract / Custom</a>
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
                  <a href="#trust" className="hover:text-white transition-colors">Trust &amp; Proof</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a>
                </li>
              </ul>
            </div>
            */}

            {/* Branches — commented out per request */}
            {/*
            <div className="space-y-3">
              <div className="font-semibold text-white uppercase text-xs tracking-wider">
                Branches
              </div>
              <ul className="space-y-2 text-xs">
                {BRANCHES.map((branch) => (
                  <BranchAccordionItem
                    key={branch.id}
                    branch={branch}
                    isOpen={openBranches.includes(branch.id)}
                    onToggle={() =>
                      setOpenBranches((prev) =>
                        prev.includes(branch.id)
                          ? prev.filter((id) => id !== branch.id)
                          : [...prev, branch.id]
                      )
                    }
                  />
                ))}
              </ul>
            </div>
            */}

            {/* Direct Contact */}
            <div className="space-y-3">
              <div className="font-semibold text-white uppercase text-xs tracking-wider">
                Direct Contact
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#7FDDAB] shrink-0" />
                  <a href="tel:+233597434114" className="hover:text-white font-mono">
                    +233 59 743 4114
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#7FDDAB] shrink-0" />
                  <button
                    onClick={onWhatsAppClick}
                    className="hover:text-white font-mono"
                  >
                    WhatsApp FamilyCare
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#7FDDAB] shrink-0" />
                  <a href="mailto:info@familycaretrust.com" className="hover:text-white truncate">
                    info@familycaretrust.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar & Legal */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
            <div>
              © 2026 FamilyCare Funeral Trust Ghana. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setModalType('privacy')}
                className="hover:text-zinc-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
              >
                Privacy Policy &amp; Data Consent
              </button>
              <span>•</span>
              <button
                onClick={() => setModalType('terms')}
                className="hover:text-zinc-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy / Terms Accessible Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={modalType === 'privacy' ? 'Privacy Policy & Data Handling' : 'Terms of Consultation'}
            className="bg-white rounded-card max-w-xl w-full p-6 text-body space-y-4"
          >
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="font-display text-xl font-bold">
                {modalType === 'privacy' ? 'Privacy Policy & Data Handling' : 'Terms of Consultation'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-muted hover:text-body p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                    You have the right to request deletion of your consultation record at any time by contacting FamilyCare directly.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    FamilyCare Contract / Custom service operates on a consultative basis with no fixed package. Submitting an enquiry or WhatsApp message does not constitute a legally binding commercial contract until a written, itemized proposal is approved and signed by both parties.
                  </p>
                  <p>
                    All services, including hearse transit, floral tributes, casket delivery, and cemetery protocol, are subject to formal confirmation of schedules, municipal cemetery availability, and mutual agreement on itemized costs.
                  </p>
                  <p>
                    FamilyCare complies with all public health guidelines and funeral regulatory frameworks in the Republic of Ghana.
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-hairline text-right">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-ink text-white rounded-full text-xs font-semibold hover:bg-body focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
