/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  HeartHandshake,
  UserCheck,
  MapPin,
  Clock,
  ArrowRight,
  Quote,
  CheckCircle2
} from 'lucide-react';

interface TrustAndProofProps {
  onAdvisorClick: (advisorName: string) => void;
  onConsultationClick: () => void;
}

export const TrustAndProof: React.FC<TrustAndProofProps> = ({
  onAdvisorClick,
  onConsultationClick
}) => {
  const advisors = [
    {
      name: 'Kwame Mensah',
      role: 'Senior Bespoke Arrangement Advisor',
      bio: 'Over 14 years guiding Ghanaian families through both intimate tributes and high-profile state-level funerals with calm authority.',
      location: 'Accra Branch (Airport Residential)',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Nana Aba Osei',
      role: 'Operations & Repatriation Lead',
      bio: 'Specialist in cross-border logistics, embassy liaison, and inter-regional funeral escort across Ashanti, Western, and Central regions.',
      location: 'Kumasi & Greater Accra',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Akwasi Boateng',
      role: 'Fleet & Protocol Director',
      bio: 'Leads our executive motorcade, trained ceremonial pallbearers, and timing marshals to guarantee flawless ceremonial decorum.',
      location: 'National Operations (Ghana)',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <section id="trust" className="py-16 sm:py-24 bg-[#F2EFE9] border-b border-[#E7E2D6] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section 07 Header: Trust & Institutional Presence */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A55A3]/10 text-[#3A55A3] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Institutional Standards</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B] tracking-tight">
            Know who you are entrusting with your family’s most important details.
          </h2>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            In Ghana, trust is earned through physical presence, verified licensure, transparent accounting, and compassionate human advisors—never through ambiguous sales claims.
          </p>
        </div>

        {/* 3 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDD7C6] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8F0] border border-[#BCE8D1] flex items-center justify-center text-[#00A859]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#18181B]">
              Registered Ghanaian Entity
            </h3>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Fully incorporated and compliant under Ghanaian commercial regulations. All protocols adhere to national public health guidelines and funeral trust governance.
            </p>
            <div className="text-[11px] font-mono text-[#00A859] font-medium pt-2 border-t border-[#F2EFE9]">
              Cert. of Incorporation • Verified Standing
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDD7C6] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2FC] border border-[#CAD6F6] flex items-center justify-center text-[#3A55A3]">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#18181B]">
              Walk-in Branches &amp; Facilities
            </h3>
            <p className="text-xs text-[#52525B] leading-relaxed">
              We welcome families to meet us in person at our dedicated offices in Accra (Airport Residential Area) and Kumasi (Ahodwo). Modern, comfortable consultation suites.
            </p>
            <div className="text-[11px] font-mono text-[#3A55A3] font-medium pt-2 border-t border-[#F2EFE9]">
              Open Mon–Sat 8am–6pm • 24/7 Phone Line
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDD7C6] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#DDD7C6] flex items-center justify-center text-[#18181B]">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#18181B]">
              Itemized Proposal Standards
            </h3>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Zero unrequested add-ons. You receive an itemized, clear proposal where every single component (hearse, casket, protocol, reception) is explicitly detailed and approved.
            </p>
            <div className="text-[11px] font-mono text-[#18181B] font-medium pt-2 border-t border-[#F2EFE9]">
              Written Scope • Transparent Pricing
            </div>
          </div>
        </div>

        {/* Meet Your Advisory Team */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18181B]">
              Experienced Personal Advisors
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B]">
              You will not be passed around between call center agents. A senior advisor is assigned to your family from first call to final burial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advisors.map((advisor) => (
              <div
                key={advisor.name}
                className="bg-white rounded-2xl overflow-hidden border border-[#DDD7C6] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 overflow-hidden bg-zinc-800 relative">
                    <img
                      src={advisor.image}
                      alt={advisor.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="font-editorial text-lg font-bold">{advisor.name}</div>
                      <div className="text-xs text-emerald-300 font-medium">{advisor.role}</div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-[#52525B] leading-relaxed">
                      {advisor.bio}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#3A55A3] font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{advisor.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#F2EFE9] mt-2">
                  <button
                    onClick={() => onAdvisorClick(advisor.name)}
                    className="w-full pt-3 text-xs font-semibold text-[#00A859] hover:text-[#072A1A] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Request Consultation with {advisor.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 08: Structured Real-World Case Story Module (5 Steps) */}
        <div className="bg-white rounded-3xl border-2 border-[#DDD7C6] p-6 sm:p-10 lg:p-12 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E2D6] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A859]/10 text-[#072A1A] text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Real Coordination Narrative</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18181B]">
                The Osei-Tutu Family Tribute (Accra, Kumasi &amp; London)
              </h3>
              <p className="text-xs sm:text-sm text-[#52525B]">
                How FamilyCare coordinated a multi-region, diaspora-inclusive celebration of life.
              </p>
            </div>
            <div className="shrink-0 text-xs font-mono text-[#3A55A3] bg-[#EEF2FC] px-3 py-1.5 rounded-lg border border-[#3A55A3]/20 self-start">
              Bespoke Contract Reference: FC-CASE-2026-GH
            </div>
          </div>

          {/* 5-Part Narrative Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* 1. Situation */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D6] space-y-2">
              <span className="font-mono text-xs font-bold text-[#3A55A3]">01 | The Situation</span>
              <h4 className="font-semibold text-xs text-[#18181B]">Complex Geography</h4>
              <p className="text-[11px] text-[#52525B] leading-relaxed">
                The sudden passing of an elder patriarch whose immediate siblings were in Kumasi, adult children in Accra and the UK, with expectations of a high-attendance customary gathering.
              </p>
            </div>

            {/* 2. Needs */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D6] space-y-2">
              <span className="font-mono text-xs font-bold text-[#00A859]">02 | What Family Needed</span>
              <h4 className="font-semibold text-xs text-[#18181B]">Dignified Balance</h4>
              <p className="text-[11px] text-[#52525B] leading-relaxed">
                Adherence to traditional customs without chaotic logistics, a synchronized church requiem in Accra, private road transit to Kumasi, and high-definition streaming for family in London.
              </p>
            </div>

            {/* 3. Coordinated */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D6] space-y-2">
              <span className="font-mono text-xs font-bold text-[#3A55A3]">03 | What We Coordinated</span>
              <h4 className="font-semibold text-xs text-[#18181B]">End-to-End Orchestration</h4>
              <p className="text-[11px] text-[#52525B] leading-relaxed">
                Custom mahogany casket, executive hearse motorcade with police escort, 8 ceremonial pallbearers, shaded family pavilion, and continuous advisor presence across both cities.
              </p>
            </div>

            {/* 4. Process */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D6] space-y-2">
              <span className="font-mono text-xs font-bold text-[#00A859]">04 | How Process Worked</span>
              <h4 className="font-semibold text-xs text-[#18181B]">Single Plan of Record</h4>
              <p className="text-[11px] text-[#52525B] leading-relaxed">
                A 45-minute virtual consultation with family heads in Accra and UK produced an itemized proposal within 24 hours. Daily timeline updates via WhatsApp kept all elders aligned.
              </p>
            </div>

            {/* 5. Reflection */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <span className="font-mono text-xs font-bold text-[#072A1A]">05 | Family Reflection</span>
              <div className="flex text-amber-500 text-xs">★★★★★</div>
              <p className="text-[11px] text-[#18181B] italic leading-relaxed">
                "FamilyCare lifted every logistical worry from our shoulders. Everything was handled with quiet respect and flawless precision."
              </p>
              <div className="text-[10px] font-semibold text-[#072A1A]">
                — Dr. K. Osei-Tutu (Family Representative)
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E7E2D6]">
            <div className="text-xs text-[#52525B]">
              Every family’s requirements are distinct. Your bespoke proposal will be shaped strictly around your brief.
            </div>
            <button
              onClick={onConsultationClick}
              className="px-5 py-2.5 rounded-xl bg-[#3A55A3] hover:bg-[#1E2B4F] text-white text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Begin a Similar Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
