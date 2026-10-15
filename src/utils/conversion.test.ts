import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateGhanaPhoneNumber,
  buildWhatsAppUrl,
  buildWhatsAppMessage,
  createCrmLeadPayload,
  getEnquiryFieldError,
  postLeadPayload,
  submitEnquiry
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
  const defaultUtm = {
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'ghana_contract_bespoke_search'
  };

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

test('getEnquiryFieldError validates each enquiry field', () => {
  assert.match(getEnquiryFieldError('name', 'a') || '', /name/i);
  assert.match(getEnquiryFieldError('phone_whatsapp', '123') || '', /phone|number/i);
  assert.match(getEnquiryFieldError('location', '') || '', /location/i);
  assert.match(getEnquiryFieldError('timing', '') || '', /when|timing/i);
  assert.match(getEnquiryFieldError('need_type', []) || '', /requirement/i);
  assert.match(getEnquiryFieldError('preferred_next_step', '') || '', /next/i);
  assert.match(getEnquiryFieldError('email', 'not-an-email') || '', /email/i);
  assert.equal(getEnquiryFieldError('email', ''), null);
  assert.equal(getEnquiryFieldError('name', 'Ama Serwaa'), null);
});

test('buildWhatsAppUrl caps the tailoring brief at 3 items and stays under length limits', () => {
  const nineTypes = [
    'Scale & Venue', 'Cultural Traditions', 'Caskets', 'Logistics & Transport',
    'Catering / Hospitality', 'Repatriation', 'Cemetery Support', 'Budget Guidance',
    'Full Bespoke Arrangement'
  ];
  const url = buildWhatsAppUrl({
    basePhone: '233302789123',
    tailoringBrief: nineTypes,
    name: 'Kofi Mensah'
  });
  assert.match(url, /Scale%20%26%20Venue/);
  assert.match(url, /Cultural%20Traditions/);
  assert.match(url, /Caskets/);
  assert.doesNotMatch(url, /Repatriation/);
  assert.ok(url.length < 1200);
});

test('buildWhatsAppUrl preserves the source ref when the message is truncated', () => {
  const url = buildWhatsAppUrl({
    basePhone: '233302789123',
    tailoringBrief: ['Scale & Venue', 'Cultural Traditions', 'Caskets'],
    location: 'Kumasi, Ashanti Region, Ghana, West Africa. '.repeat(15),
    name: 'Kofi Mensah-Agyeman '.repeat(40),
    channel: 'google'
  });
  const text = decodeURIComponent(url.split('text=')[1]);
  assert.ok(text.includes('(Ref: google)'));
  assert.ok(text.endsWith('(Ref: google)'));
  assert.ok(url.length < 1200);
});

test('buildWhatsAppMessage matches the text encoded into the URL', () => {
  const options = {
    basePhone: '233302789123',
    tailoringBrief: ['Caskets', 'Cultural Traditions'],
    location: 'Accra',
    name: 'Kofi Mensah',
    channel: 'google'
  };
  const url = buildWhatsAppUrl(options);
  const encoded = decodeURIComponent(url.split('text=')[1]);
  assert.equal(encoded, buildWhatsAppMessage(options));
});

test('postLeadPayload returns true on 2xx and false otherwise', async () => {
  const okFetch = async () => ({ ok: true } as Response);
  assert.equal(await postLeadPayload('https://example.test/lead', {} as never, okFetch as typeof fetch), true);

  const badFetch = async () => ({ ok: false } as Response);
  assert.equal(await postLeadPayload('https://example.test/lead', {} as never, badFetch as typeof fetch), false);

  const rejectFetch = async () => {
    throw new Error('network down');
  };
  assert.equal(await postLeadPayload('https://example.test/lead', {} as never, rejectFetch as typeof fetch), false);
});

test('submitEnquiry resolves true without an endpoint configured', async () => {
  let fetchCalled = false;
  const spyFetch = async () => {
    fetchCalled = true;
    return { ok: true } as Response;
  };
  const result = await submitEnquiry(
    {} as never,
    { utm_source: 'google', utm_medium: 'cpc' },
    spyFetch as typeof fetch
  );
  assert.equal(result, true);
  assert.equal(fetchCalled, false);
});
