/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CrmLeadPayload, UtmParams } from './conversion';

export const ATTRIBUTION_SESSION_KEY = 'fc_attribution_v1';

const DIRECT_UTMS: UtmParams = { utm_source: 'direct', utm_medium: 'organic' };

const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'msclkid', 'ttclid', 'fbclid'] as const;
type ClickIdKey = (typeof CLICK_ID_KEYS)[number];

const CLICK_ID_ATTRIBUTION: Record<ClickIdKey, { source: string; medium: string }> = {
  gclid: { source: 'google', medium: 'cpc' },
  gbraid: { source: 'google', medium: 'cpc' },
  wbraid: { source: 'google', medium: 'cpc' },
  msclkid: { source: 'microsoft', medium: 'cpc' },
  ttclid: { source: 'tiktok', medium: 'paid_social' },
  fbclid: { source: 'facebook', medium: 'paid_social' }
};

/**
 * Fills source and medium from a recognised click ID when the URL carried no
 * UTM source. Explicit UTM parameters always win.
 */
function applyClickIdAttribution(parsed: UtmParams): UtmParams {
  if (parsed.utm_source) {
    return parsed;
  }
  for (const key of CLICK_ID_KEYS) {
    if (parsed[key]) {
      return {
        ...parsed,
        utm_source: CLICK_ID_ATTRIBUTION[key].source,
        utm_medium: CLICK_ID_ATTRIBUTION[key].medium
      };
    }
  }
  return parsed;
}

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
    'gbraid',
    'wbraid',
    'fbclid',
    'msclkid',
    'ttclid'
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
    const parsed = applyClickIdAttribution(parseUtmParams(search));
    const hasAttribution = Object.keys(parsed).length > 0;
    if (hasAttribution) {
      target.setItem(ATTRIBUTION_SESSION_KEY, JSON.stringify(parsed));
      return parsed;
    }
    return { ...DIRECT_UTMS };
  } catch {
    const parsed = applyClickIdAttribution(parseUtmParams(search));
    return Object.keys(parsed).length > 0 ? parsed : { ...DIRECT_UTMS };
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
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  msclkid?: string;
  ttclid?: string;
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
    // GA4 event parameters are strings; join the multi-select so GTM does not
    // have to serialise an array. The CRM payload keeps the array.
    lead_needs: lead.qualification.need_type.join(', '),
    preferred_next_step: lead.qualification.preferred_next_step,
    decision_process: lead.qualification.decision_process
  };
}
