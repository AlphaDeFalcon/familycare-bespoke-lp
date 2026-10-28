/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseUtmParams,
  captureAttribution,
  pushDataLayer,
  toDataLayerLeadFields
} from './attribution.ts';
import type { CrmLeadPayload } from './conversion.ts';

function makeStore(initial: Record<string, string> | null = null): {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  written: string[];
} {
  const data = new Map<string, string>();
  if (initial) {
    for (const [k, v] of Object.entries(initial)) {
      data.set(k, v);
    }
  }
  const store = {
    written: [] as string[],
    getItem(k: string): string | null {
      return data.has(k) ? data.get(k)! : null;
    },
    setItem(k: string, v: string): void {
      store.written.push(k);
      data.set(k, v);
    }
  };
  return store;
}

test('parseUtmParams reads the full UTM set plus click IDs', () => {
  const parsed = parseUtmParams(
    '?utm_source=google&utm_medium=cpc&utm_campaign=ghana_test&utm_content=ad_1&utm_term=bespoke%20funeral&gclid=abc123&gbraid=gb123&wbraid=wb123&fbclid=xyz789&msclkid=ms123&ttclid=tt123'
  );
  assert.deepEqual(parsed, {
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'ghana_test',
    utm_content: 'ad_1',
    utm_term: 'bespoke funeral',
    gclid: 'abc123',
    gbraid: 'gb123',
    wbraid: 'wb123',
    fbclid: 'xyz789',
    msclkid: 'ms123',
    ttclid: 'tt123'
  });
});

test('parseUtmParams omits empty values and ignores unknown params', () => {
  const parsed = parseUtmParams('?utm_source=meta&fbclid=xyz&foo=bar&utm_medium=');
  assert.deepEqual(parsed, { utm_source: 'meta', fbclid: 'xyz' });
});

test('parseUtmParams returns empty object for no params', () => {
  assert.deepEqual(parseUtmParams(''), {});
  assert.deepEqual(parseUtmParams('?'), {});
});

test('captureAttribution returns persisted first-touch and never overwrites it', () => {
  const store = makeStore({
    fc_attribution_v1: JSON.stringify({ utm_source: 'direct', utm_medium: 'organic' })
  });
  const result = captureAttribution('?utm_source=google&utm_campaign=new_click', store);
  assert.deepEqual(result, { utm_source: 'direct', utm_medium: 'organic' });
  assert.deepEqual(store.written, []);
});

test('captureAttribution persists real params when nothing is stored', () => {
  const store = makeStore();
  const result = captureAttribution('?utm_source=google&utm_medium=cpc&gclid=g123', store);
  assert.deepEqual(result, { utm_source: 'google', utm_medium: 'cpc', gclid: 'g123' });
  assert.deepEqual(store.written, ['fc_attribution_v1']);
});

test('captureAttribution infers source and medium from click IDs', () => {
  const cases: Array<[string, Record<string, string>]> = [
    ['?gclid=G123', { gclid: 'G123', utm_source: 'google', utm_medium: 'cpc' }],
    ['?gbraid=GB123', { gbraid: 'GB123', utm_source: 'google', utm_medium: 'cpc' }],
    ['?wbraid=WB123', { wbraid: 'WB123', utm_source: 'google', utm_medium: 'cpc' }],
    ['?msclkid=MS123', { msclkid: 'MS123', utm_source: 'microsoft', utm_medium: 'cpc' }],
    ['?ttclid=TT123', { ttclid: 'TT123', utm_source: 'tiktok', utm_medium: 'paid_social' }],
    ['?fbclid=FB123', { fbclid: 'FB123', utm_source: 'facebook', utm_medium: 'paid_social' }]
  ];

  for (const [search, expected] of cases) {
    const store = makeStore();
    assert.deepEqual(captureAttribution(search, store), expected);
    assert.deepEqual(store.written, ['fc_attribution_v1']);
  }
});

test('captureAttribution keeps an explicit UTM source over click-ID inference', () => {
  const store = makeStore();
  const result = captureAttribution('?utm_source=meta&utm_medium=cpc&msclkid=MS123', store);
  assert.deepEqual(result, {
    utm_source: 'meta',
    utm_medium: 'cpc',
    msclkid: 'MS123'
  });
});

test('captureAttribution falls back to direct and persists nothing without params', () => {
  const store = makeStore();
  const result = captureAttribution('', store);
  assert.deepEqual(result, { utm_source: 'direct', utm_medium: 'organic' });
  assert.deepEqual(store.written, []);
});

test('captureAttribution degrades without throwing when storage is unavailable', () => {
  const store = {
    getItem() {
      throw new Error('storage blocked');
    },
    setItem() {
      throw new Error('storage blocked');
    }
  };
  const result = captureAttribution('?utm_source=linkedin', store);
  assert.deepEqual(result, { utm_source: 'linkedin' });
});

test('pushDataLayer initializes the target and appends the envelope', () => {
  const events: unknown[] = [];
  pushDataLayer(
    {
      event: 'cta_click',
      section: 'hero',
      cta_name: 'Discuss a Plan',
      utm_source: 'google'
    },
    events,
    {
      utm_source: 'google',
      utm_medium: 'cpc',
      gbraid: 'gb123',
      msclkid: 'ms123',
      ttclid: 'tt123'
    }
  );
  assert.equal(events.length, 1);
  const ev = events[0] as Record<string, unknown>;
  assert.equal(ev.event, 'cta_click');
  assert.equal(typeof ev.event_time, 'string');
  assert.ok(!Number.isNaN(Date.parse(ev.event_time as string)));
  assert.ok('page_location' in ev);
  assert.ok('page_referrer' in ev);
  assert.equal(ev.section, 'hero');
  assert.equal(ev.cta_name, 'Discuss a Plan');
  assert.equal(ev.utm_source, 'google');
  assert.equal(ev.gbraid, 'gb123');
  assert.equal(ev.msclkid, 'ms123');
  assert.equal(ev.ttclid, 'tt123');
});

test('toDataLayerLeadFields strips identity and consent fields', () => {
  const lead = {
    leadId: 'FC-BESPOKE-123456-7890',
    timestamp: '2026-10-15T12:00:00.000Z',
    identity: {
      name: 'Kofi Mensah',
      phone_whatsapp: '0244123456',
      normalized_phone: '+233244123456',
      email: 'kofi@example.com'
    },
    qualification: {
      location: 'Kumasi',
      need_type: ['Scale & Venue'],
      timing: 'Near term',
      preferred_next_step: 'WhatsApp conversation',
      decision_process: 'Siblings / family members need to approve'
    },
    consent: {
      permission_status: 'granted' as const,
      consented_at: '2026-10-15T12:00:00.000Z'
    },
    commercial: {
      product: 'Contract / Custom Funeral Services' as const,
      journeyStage: 'Qualified Opportunity' as const,
      status: 'New Enquiry Captured' as const
    },
    attribution: { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'ghana_test' }
  } as CrmLeadPayload;
  const fields = toDataLayerLeadFields(lead);
  assert.equal(fields.lead_id, 'FC-BESPOKE-123456-7890');
  assert.equal(fields.lead_location, 'Kumasi');
  assert.equal(fields.lead_timing, 'Near term');
  assert.equal(fields.lead_needs, 'Scale & Venue');
  assert.equal(fields.preferred_next_step, 'WhatsApp conversation');
  assert.equal(fields.decision_process, 'Siblings / family members need to approve');
  assert.ok(!('budget_indicator' in fields));
  const serialized = JSON.stringify(fields);
  assert.ok(!serialized.includes('Kofi'));
  assert.ok(!serialized.includes('0244'));
  assert.ok(!serialized.includes('kofi@'));
  assert.ok(!serialized.includes('identity'));
  assert.ok(!serialized.includes('consent'));
  assert.ok(!serialized.includes('granted'));
  assert.ok(!serialized.includes('budget'));
});
