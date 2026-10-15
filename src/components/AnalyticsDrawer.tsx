/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Activity,
  Layers,
  Database,
  CheckCircle2,
  Download,
  Trash2,
  ExternalLink,
  Smartphone,
  Globe
} from 'lucide-react';
import { AnalyticsEvent, CrmLeadPayload, UtmParams } from '../utils/conversion';

interface AnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: AnalyticsEvent[];
  leads: CrmLeadPayload[];
  activeUtms: UtmParams;
  onClearEvents: () => void;
}

export const AnalyticsDrawer: React.FC<AnalyticsDrawerProps> = ({
  isOpen,
  onClose,
  events,
  leads,
  activeUtms,
  onClearEvents
}) => {
  const [activeTab, setActiveTab] = React.useState<'events' | 'crm' | 'utms'>('events');

  if (!isOpen) return null;

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ activeUtms, leads, events }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `familycare-attribution-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00A859] flex items-center justify-center text-white">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide">Live Attribution & CRM Pipeline</div>
              <div className="text-xs text-zinc-400">QA console (debug mode only)</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close Analytics Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'events'
                ? 'border-[#00A859] text-[#072A1A] bg-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Live Event Stream ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'crm'
                ? 'border-[#3A55A3] text-[#1E2B4F] bg-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            CRM Lead Payloads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('utms')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'utms'
                ? 'border-zinc-800 text-zinc-900 bg-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Active UTM Context
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Real-Time Conversion Actions
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClearEvents}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                  <button
                    onClick={exportJson}
                    className="text-xs text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Export
                  </button>
                </div>
              </div>

              {events.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 text-xs">
                  No actions logged yet. Click CTA buttons, WhatsApp links, or submit the consultation form to view real-time events.
                </div>
              ) : (
                <div className="space-y-2">
                  {events.slice(0, 30).map((evt) => {
                    const isSubmit = evt.event === 'form_submit';
                    const isWhatsApp = evt.event === 'whatsapp_click';
                    const isPhone = evt.event === 'phone_click';
                    return (
                      <div
                        key={evt.id}
                        className={`p-3 rounded-lg border text-xs transition-all ${
                          isSubmit
                            ? 'bg-emerald-50 border-emerald-200'
                            : isWhatsApp
                            ? 'bg-green-50/60 border-green-200'
                            : isPhone
                            ? 'bg-blue-50/60 border-blue-200'
                            : 'bg-zinc-50 border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSubmit
                                  ? 'bg-[#00A859]'
                                  : isWhatsApp
                                  ? 'bg-emerald-500'
                                  : 'bg-[#3A55A3]'
                              }`}
                            />
                            {evt.event}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-zinc-700 mt-1 font-medium">{evt.label}</div>
                        {evt.section && (
                          <div className="text-[11px] text-zinc-500 mt-0.5">Section: {evt.section}</div>
                        )}
                        {evt.metadata && (
                          <pre className="mt-1.5 p-1.5 bg-white/80 rounded text-[10px] text-zinc-600 font-mono overflow-x-auto border border-zinc-200/60">
                            {JSON.stringify(evt.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'crm' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Lead Qualification & CRM Hand-Off
                </span>
                <span className="text-xs text-zinc-400">
                  Total Captured: {leads.length}
                </span>
              </div>

              {leads.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 text-xs">
                  No lead forms submitted yet. Complete the Enquiry Form on the page to inspect the structured CRM lead payload.
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.leadId}
                      className="border border-[#00A859]/30 bg-emerald-50/30 rounded-xl p-4 text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between border-b border-emerald-200/50 pb-2 mb-2.5">
                        <span className="font-mono font-bold text-[#072A1A] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#00A859]" />
                          {lead.leadId}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(lead.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-zinc-700 mb-3">
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">Contact</div>
                          <div className="font-semibold text-zinc-900">{lead.identity.name}</div>
                          <div className="text-[11px] font-mono text-zinc-600">{lead.identity.normalized_phone}</div>
                          {lead.identity.email && (
                            <div className="text-[11px] text-zinc-500 truncate">{lead.identity.email}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">Location & Urgency</div>
                          <div className="font-medium text-zinc-900">{lead.qualification.location}</div>
                          <div className="text-[11px] text-emerald-800 font-medium">{lead.qualification.timing}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">Route: {lead.qualification.preferred_next_step}</div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold mb-1">Requirements Brief</div>
                        <div className="flex flex-wrap gap-1">
                          {lead.qualification.need_type.map((need, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-medium"
                            >
                              {need}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-zinc-200/80">
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold mb-1">Raw JSON Payload (CRM Dispatch)</div>
                        <pre className="p-2 bg-zinc-900 text-zinc-200 rounded text-[10px] font-mono overflow-x-auto max-h-40">
                          {JSON.stringify(lead, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'utms' && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-600 leading-relaxed">
                Source metadata is captured on landing and persisted across all user touchpoints (form submissions, WhatsApp messages, and direct calls) to satisfy Section 12 & 14 of the Sales-First Strategy.
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs font-mono space-y-2">
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">utm_source:</span>
                  <span className="font-semibold text-zinc-900">{activeUtms.utm_source}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">utm_medium:</span>
                  <span className="font-semibold text-zinc-900">{activeUtms.utm_medium}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">utm_campaign:</span>
                  <span className="font-semibold text-zinc-900">{activeUtms.utm_campaign}</span>
                </div>
                {activeUtms.utm_content && (
                  <div className="flex justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500">utm_content:</span>
                    <span className="font-semibold text-zinc-900">{activeUtms.utm_content}</span>
                  </div>
                )}
                {activeUtms.utm_term && (
                  <div className="flex justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500">utm_term:</span>
                    <span className="font-semibold text-zinc-900">{activeUtms.utm_term}</span>
                  </div>
                )}
                {activeUtms.gclid && (
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">gclid (Click ID):</span>
                    <span className="font-semibold text-emerald-700">{activeUtms.gclid}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                <strong>Offline Conversion Measurement Note:</strong> In accordance with Strategy Section 12.3, the commercial contract event occurs offline after consultation. Persisting these click identifiers allows FamilyCare to match signed contracts and revenue back to exact advertising campaigns.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 text-xs text-zinc-500 flex items-center justify-between">
          <span>FamilyCare Funnel: Lead &gt; Consult &gt; Contract</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-zinc-800 text-white rounded-lg text-xs font-medium hover:bg-zinc-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
