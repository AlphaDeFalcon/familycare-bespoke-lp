import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateGhanaPhoneNumber,
  buildWhatsAppUrl,
  createCrmLeadPayload,
  CAMPAIGN_CHANNELS
} from './conversion.ts';

test('validateGhanaPhoneNumber accepts standard Ghana 10-digit formats', () => {
  const result1 = validateGhanaPhoneNumber('0244123456');
  assert.equal(result1.isValid, true);
  assert.equal(result1.normalized, '+233244123456');

  const result2 = validateGhanaPhoneNumber('050 987 6543');
  assert.equal(result2.isValid, true);
  assert.equal(result2.normalized, '+233509876543');
});

test('validateGhanaPhoneNumber accepts international Ghana formats', () => {
  const result = validateGhanaPhoneNumber('+233 20 555 4321');
  assert.equal(result.isValid, true);
  assert.equal(result.normalized, '+233205554321');
});

test('validateGhanaPhoneNumber rejects too short or invalid numbers', () => {
  const resultShort = validateGhanaPhoneNumber('123');
  assert.equal(resultShort.isValid, false);

  const resultInvalid = validateGhanaPhoneNumber('abc0244123456');
  assert.equal(resultInvalid.isValid, false);
});

test('buildWhatsAppUrl includes brief items and location', () => {
  const url = buildWhatsAppUrl({
    basePhone: '+233 30 278 9123',
    tailoringBrief: ['Scale', 'Cultural Traditions'],
    location: 'Kumasi / Ashanti',
    name: 'Kofi Mensah',
    channel: 'Google Search'
  });

  assert.match(url, /wa\.me\/233302789123/);
  assert.match(url, /Kofi%20Mensah/);
  assert.match(url, /Cultural%20Traditions/);
  assert.match(url, /Kumasi%20%2F%20Ashanti/);
});

test('createCrmLeadPayload requires name, valid phone, location, need_type, and timing', () => {
  const defaultUtm = CAMPAIGN_CHANNELS.google_search.defaultUtms;

  // Invalid: missing location
  const badResult = createCrmLeadPayload(
    {
      name: 'Ama Serwaa',
      phone_whatsapp: '0244001122',
      location: '',
      need_type: ['Scale & Venue'],
      timing: 'Immediate need (Within days)',
      preferred_next_step: 'Phone call from an advisor'
    },
    defaultUtm
  );
  assert.equal(badResult.payload, null);
  assert.match(badResult.error || '', /location/i);

  // Valid lead payload
  const goodResult = createCrmLeadPayload(
    {
      name: 'Ama Serwaa',
      phone_whatsapp: '0244001122',
      location: 'Accra / Greater Accra',
      need_type: ['Scale & Venue', 'Logistics & Transport'],
      timing: 'Immediate need (Within days)',
      preferred_next_step: 'Phone call from an advisor',
      email: 'ama@example.com'
    },
    defaultUtm
  );

  assert.notEqual(goodResult.payload, null);
  assert.equal(goodResult.payload?.identity.name, 'Ama Serwaa');
  assert.equal(goodResult.payload?.identity.normalized_phone, '+233244001122');
  assert.equal(goodResult.payload?.qualification.location, 'Accra / Greater Accra');
  assert.equal(goodResult.payload?.attribution.utm_campaign, 'ghana_contract_bespoke_search');
  assert.match(goodResult.payload?.leadId || '', /^FC-BESPOKE-/);
});
