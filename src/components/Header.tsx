/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onDiscussClick: () => void;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onDiscussClick,
  onWhatsAppClick,
  onPhoneClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Our Approach', href: '#truth' },
    { label: 'Tailoring', href: '#tailoring' },
    { label: 'How It Works', href: '#process' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Trust & Proof', href: '#trust' },
    { label: 'FAQs', href: '#faq' }
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2D6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center focus:outline-hidden focus:ring-2 focus:ring-[#00A859] rounded-lg p-1"
            aria-label="FamilyCare Funeral Trust Home"
          >
            <BrandLogo variant="color" className="h-12 w-auto" />
          </a>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-xs xl:text-sm font-medium text-[#52525B] hover:text-[#18181B] transition-colors relative py-1 hover:border-b-2 hover:border-[#00A859]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Cluster (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Phone quick button */}
            <button
              onClick={onPhoneClick}
              className="p-2.5 rounded-full text-[#3A55A3] bg-[#F2EFE9] hover:bg-[#E7E2D6] border border-[#DDD7C6] transition-colors"
              aria-label="Call FamilyCare Advisor"
              title="Call FamilyCare Advisor (+233 30 278 9123)"
            >
              <Phone className="w-4 h-4" />
            </button>

            {/* WhatsApp quick button */}
            <button
              onClick={onWhatsAppClick}
              className="p-2.5 rounded-full text-[#00A859] bg-[#E8F8F0] hover:bg-[#D2F2E2] border border-[#BCE8D1] transition-colors"
              aria-label="WhatsApp FamilyCare Concierge"
              title="Chat with FamilyCare on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onDiscussClick}
              className="px-4 py-2.5 rounded-xl bg-[#00A859] hover:bg-[#072A1A] text-white font-semibold text-xs md:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
            >
              <span>Discuss a Bespoke Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onWhatsAppClick}
              className="p-2 rounded-lg text-[#00A859] bg-[#E8F8F0] border border-[#BCE8D1]"
              aria-label="WhatsApp FamilyCare"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#18181B] hover:bg-[#F2EFE9]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E7E2D6] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-3 py-2 text-sm font-medium text-[#18181B] hover:bg-[#F2EFE9] rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E7E2D6] space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDiscussClick();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#00A859] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Discuss a Bespoke Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onWhatsAppClick();
                }}
                className="py-2.5 px-3 rounded-lg border border-[#00A859] text-[#00A859] bg-[#E8F8F0] font-medium text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPhoneClick();
                }}
                className="py-2.5 px-3 rounded-lg border border-[#3A55A3] text-[#3A55A3] bg-[#EEF2FC] font-medium text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call Advisor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
