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
  ArrowRight
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
    <header className="sticky top-0 z-30 bg-canvas/95 backdrop-blur-md border-b border-hairline transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg p-1"
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
                className="text-xs xl:text-sm font-medium text-muted hover:text-body transition-colors relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm hover:border-b-2 hover:border-accent"
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
              className="p-2.5 rounded-full text-deep bg-tint hover:bg-hairline border border-hairline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="Call FamilyCare Advisor"
              title="Call FamilyCare Advisor (+233 59 743 4114)"
            >
              <Phone className="w-4 h-4" />
            </button>

            {/* WhatsApp quick button */}
            <button
              onClick={onWhatsAppClick}
              className="p-2.5 rounded-full text-accent bg-accent/10 hover:bg-accent/15 border border-accent/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="WhatsApp FamilyCare Concierge"
              title="Chat with FamilyCare on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onDiscussClick}
              className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-deep text-white font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span>Discuss a Bespoke Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile / Tablet Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onWhatsAppClick}
              className="p-3 rounded-lg text-accent bg-accent/10 border border-accent/20 sm:hidden"
              aria-label="WhatsApp FamilyCare"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-lg text-body hover:bg-tint"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Drawer: absolutely positioned overlay so opening or
          closing it never changes document flow. A flow drawer collapses
          after a link click and shifts the page mid-scroll, landing the
          smooth scroll past the section. */}
      {mobileMenuOpen && (
        <div
          data-nav-drawer
          className="lg:hidden absolute top-full left-0 right-0 border-t border-hairline bg-canvas shadow-lg px-4 pt-3 pb-6 space-y-3 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-3 py-2 text-sm font-medium text-body hover:bg-tint rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-hairline space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDiscussClick();
              }}
              className="w-full py-3 px-4 rounded-full bg-accent hover:bg-accent-deep text-white font-semibold text-sm flex items-center justify-center gap-2"
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
                className="py-2.5 px-3 rounded-full border border-accent text-accent bg-accent/10 font-medium text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPhoneClick();
                }}
                className="py-2.5 px-3 rounded-full border border-accent text-accent bg-accent/10 font-medium text-xs flex items-center justify-center gap-1.5"
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
