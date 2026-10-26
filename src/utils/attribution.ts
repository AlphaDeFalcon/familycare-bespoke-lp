/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CrmLeadPayload, UtmParams } from './conversion';

export interface CapturedAttribution extends UtmParams {}

export const ATTRIBUTION_SESSION_KEY = 'fc_attribution_v1';

const DIRECT_UTMS: UtmParams = { utm_source: 'direct', utm_medium: 'organic' };

export interface AttributionStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function defaultSessionStore(): AttributionStore {
  try {
    const storage = typeof window !== 'undefined' ? window.sessionStorage : undefined;
    if (!storage) {
      return { getItem: () => null, setItem: () => undefined };
    }
    return {
      getItem: (key: string) => storage.getItem(key),
      setItem: (key: string, value: string) => storage.setItem(key, value)
    };
  } catch {
    return { getItem: () => null, setItem: () => undefined };
  }
}

/**
 * Reads UTM parameters and click identifiers from a URL query string.
 * Empty values and unrelated parameters are omitted.
 */
export function parseUtmParams(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const result: UtmParams = {} as UtmParams;
  const keys: (keyof UtmParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid'
  ];
  for (const key of keys) {
    const value = params.get(key);
    if (value) {
      (result as unknown as Record<string, string>)[key] = value;
    }
  }
  return result;
}

/**
 * First-touch attribution capture.
 * A previously persisted attribution always wins over new URL params.
 * The direct/organic fallback is intentionally NOT persisted so a later
 * paid click in the same tab can still be captured.
 */
export function captureAttribution(search: string, store?: AttributionStore): UtmParams {
  const target = store ?? defaultSessionStore();
  try {
    const stored = target.getItem(ATTRIBUTION_SESSION_KEY);
    if (stored) {
      return JSON.parse(stored) as UtmParams;
    }
    const parsed = parseUtmParams(search);
    const hasAttribution = Object.keys(parsed).length > 0;
    if (hasAttribution) {
      target.setItem(ATTRIBUTION_SESSION_KEY, JSON.stringify(parsed));
      return parsed;
    }
    return { ...DIRECT_UTMS };
  } catch {
    const parsed = parseUtmParams(search);
    return Object.keys(parsed).length > 0 ? parsed : { ...DIRECT_UTMS };
  }
}

/**
 * Debug gate: the QA console renders only when ?debug=1 is present.
 */
export function isDebugMode(search: string): boolean {
  return new URLSearchParams(search).get('debug') === '1';
}

export type ChannelSource = 'google_search' | 'meta_instagram' | 'linkedin' | 'youtube' | 'direct';

export interface HeroCopy {
  name: string;
  heroBadge: string;
  heroEmphasis: string;
}

export const HERO_COPY: Record<ChannelSource, HeroCopy> = {
  google_search: {
    name: 'Google Search (High Intent)',
    heroBadge: 'Direct Consultation • Immediate & Planned Assistance',
    heroEmphasis: 'Custom funeral services in Ghana. Transparent planning, coordination, and a quote shaped around your requirements.'
  },
  meta_instagram: {
    name: 'Meta / Instagram (Visual & Coordination)',
    heroBadge: 'Dignified Ceremonial Care • Coordinated by FamilyCare',
    heroEmphasis: 'Experience the calm assurance of having every detail and tradition respectfully shaped.'
  },
  linkedin: {
    name: 'LinkedIn (Professional / Pre-Planning)',
    heroBadge: 'Structured Executive Planning • Trusted Family Protocol',
    heroEmphasis: 'A consultative, unhurried planning process built for family leaders and decision-makers.'
  },
  youtube: {
    name: 'YouTube (Process & Explanation)',
    heroBadge: 'The FamilyCare Method • Step-by-Step Coordination',
    heroEmphasis: 'Learn how our advisors carry your family through initial wishes to the final tribute.'
  },
  direct: {
    name: 'Direct / Organic Visit',
    heroBadge: 'FamilyCare Funeral Trust • Today\'s Wisdom, Tomorrow\'s Peace of Mind',
    heroEmphasis: 'There is no set package. We listen, then build the funeral around what matters to you.'
  }
};

/**
 * Maps a detected utm_source to a channel copy profile.
 */
export function resolveChannel(utms: UtmParams): ChannelSource {
  switch (utms.utm_source) {
    case 'google':
      return 'google_search';
    case 'meta':
    case 'facebook':
    case 'instagram':
      return 'meta_instagram';
    case 'linkedin':
      return 'linkedin';
    case 'youtube':
      return 'youtube';
    default:
      return 'direct';
  }
}

export interface DataLayerEvent {
  event: string;
  event_time?: string;
  page_location?: string;
  page_referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  section?: string;
  cta_name?: string;
  form_id?: string;
  lead_id?: string;
  lead_location?: string;
  lead_timing?: string;
  lead_needs?: string[];
  preferred_next_step?: string;
  decision_process?: string;
  [key: string]: unknown;
}

function buildEnvelope(event: DataLayerEvent, attribution?: UtmParams): DataLayerEvent {
  const envelope: DataLayerEvent = {
    event: event.event,
    event_time: new Date().toISOString(),
    page_location: undefined,
    page_referrer: undefined
  };
  try {
    if (typeof window !== 'undefined') {
      envelope.page_location = window.location.href;
    }
    if (typeof document !== 'undefined') {
      envelope.page_referrer = document.referrer;
    }
  } catch {
    // Browser globals unavailable (test environment); values stay undefined.
  }
  if (attribution) {
    for (const [key, value] of Object.entries(attribution)) {
      if (value) {
        envelope[key] = value;
      }
    }
  }
  return { ...envelope, ...event };
}

/**
 * Pushes a GTM-ready event to window.dataLayer. Never throws: if the
 * dataLayer is blocked (adblock, CSP) or absent, this is a silent no-op.
 */
export function pushDataLayer(
  event: DataLayerEvent,
  target?: unknown[],
  attribution?: UtmParams
): void {
  try {
    let layer = target;
    if (!layer) {
      if (typeof window === 'undefined') {
        return;
      }
      const w = window as unknown as { dataLayer?: unknown[] };
      if (!w.dataLayer) {
        w.dataLayer = [];
      }
      layer = w.dataLayer;
    }
    layer.push(buildEnvelope(event, attribution));
  } catch {
    // Blocked or unavailable; measurement must never break the page.
  }
}

/**
 * Maps a CRM lead payload to a dataLayer-safe field set.
 * Identity fields (name, phone, email) and consent status never leave
 * this function.
 */
export function toDataLayerLeadFields(lead: CrmLeadPayload): Record<string, unknown> {
  return {
    lead_id: lead.leadId,
    lead_location: lead.qualification.location,
    lead_timing: lead.qualification.timing,
    lead_needs: lead.qualification.need_type,
    preferred_next_step: lead.qualification.preferred_next_step,
    decision_process: lead.qualification.decision_process
  };
}
