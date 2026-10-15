/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

/**
 * Validates Ghanaian and international telephone / WhatsApp numbers
 */
export function validateGhanaPhoneNumber(phone: string): { isValid: boolean; normalized: string; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, normalized: '', error: 'Phone or WhatsApp number is required.' };
  }

  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  if (cleaned.length < 8) {
    return { isValid: false, normalized: cleaned, error: 'Phone number is too short. Please provide a full number.' };
  }

  // Ghana formats:
  // 1) 020..., 023..., 024..., 026..., 027..., 028..., 050..., 054..., 055..., 056..., 057..., 059... (10 digits)
  // 2) +233..., 00233..., 233... (e.g. +233 24 123 4567)
  const ghanaLocalRegex = /^0(20|23|24|26|27|28|50|54|55|56|57|59)[0-9]{7}$/;
  const ghanaIntlRegex = /^(\+?233|00233)(20|23|24|26|27|28|50|54|55|56|57|59)[0-9]{7}$/;
  const generalIntlRegex = /^\+?[1-9][0-9]{7,14}$/;

  if (ghanaLocalRegex.test(cleaned)) {
    const intlFormat = '+233' + cleaned.substring(1);
    return { isValid: true, normalized: intlFormat };
  }

  if (ghanaIntlRegex.test(cleaned)) {
    const withPlus = cleaned.startsWith('+') ? cleaned : '+' + (cleaned.startsWith('00') ? cleaned.substring(2) : cleaned);
    return { isValid: true, normalized: withPlus };
  }

  if (generalIntlRegex.test(cleaned)) {
    const withPlus = cleaned.startsWith('+') ? cleaned : '+' + cleaned;
    return { isValid: true, normalized: withPlus };
  }

  return {
    isValid: false,
    normalized: cleaned,
    error: 'Please enter a valid Ghana number (e.g. 024 123 4567 or +233 24 123 4567) or international number.'
  };
}

/**
 * Builds the prefilled WhatsApp message text. The source ref suffix is
 * appended AFTER truncation so attribution survives long messages.
 */
export function buildWhatsAppMessage(options: {
  tailoringBrief?: string[];
  location?: string;
  channel?: string;
  name?: string;
}): string {
  const briefItems = (options.tailoringBrief || []).slice(0, 3);
  const briefText = briefItems.length > 0
    ? `\nKey areas to tailor: ${briefItems.join(', ')}.`
    : '';
  const locText = options.location ? `\nLocation: ${options.location}.` : '';
  const nameText = options.name ? ` My name is ${options.name}.` : '';
  const srcText = options.channel ? ` (Ref: ${options.channel})` : '';

  const body = `Hello FamilyCare, I would like to discuss a Contract / Bespoke funeral arrangement.${nameText} I would like help understanding the next steps and shaping a tribute around our family's wishes.${locText}${briefText}`;

  const MAX_MESSAGE_LENGTH = 700;
  if ((body + srcText).length <= MAX_MESSAGE_LENGTH) {
    return body + srcText;
  }
  const available = MAX_MESSAGE_LENGTH - srcText.length;
  return `${body.slice(0, Math.max(0, available - 3))}...${srcText}`;
}

/**
 * Builds a tailored WhatsApp click-to-chat URL with prefilled text
 */
export function buildWhatsAppUrl(options: {
  basePhone?: string;
  tailoringBrief?: string[];
  location?: string;
  channel?: string;
  sourceCampaign?: string;
  name?: string;
}): string {
  const targetPhone = (options.basePhone || '233302789123').replace(/[^0-9]/g, '');
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(buildWhatsAppMessage(options))}`;
}

/**
 * CRM Lead Payload Schema according to Wireframe & Strategy Document
 */
export interface CrmLeadPayload {
  leadId: string;
  timestamp: string;
  identity: {
    name: string;
    phone_whatsapp: string;
    normalized_phone: string;
    email?: string;
  };
  qualification: {
    location: string;
    need_type: string[];
    timing: string;
    preferred_next_step: string;
    budget_indicator?: string;
    notes?: string;
  };
  commercial: {
    product: 'Contract / Bespoke Funeral Services';
    journeyStage: 'Qualified Opportunity';
    status: 'New Enquiry Captured';
  };
  attribution: UtmParams;
}

export function createCrmLeadPayload(
  formData: {
    name: string;
    phone_whatsapp: string;
    location: string;
    need_type: string[];
    timing: string;
    preferred_next_step: string;
    email?: string;
    budget_indicator?: string;
    notes?: string;
  },
  attribution: UtmParams
): { payload: CrmLeadPayload | null; error?: string } {
  if (!formData.name || formData.name.trim().length < 2) {
    return { payload: null, error: 'Full name must be at least 2 characters.' };
  }

  const phoneCheck = validateGhanaPhoneNumber(formData.phone_whatsapp);
  if (!phoneCheck.isValid) {
    return { payload: null, error: phoneCheck.error || 'Invalid phone or WhatsApp number.' };
  }

  if (!formData.location) {
    return { payload: null, error: 'Please select a location.' };
  }

  if (!formData.need_type || formData.need_type.length === 0) {
    return { payload: null, error: 'Please select at least one requirement area.' };
  }

  if (!formData.timing) {
    return { payload: null, error: 'Please indicate when assistance is needed.' };
  }

  if (!formData.preferred_next_step) {
    return { payload: null, error: 'Please choose your preferred next step.' };
  }

  if (formData.email && formData.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return { payload: null, error: 'Please provide a valid email address.' };
    }
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const leadId = `FC-BESPOKE-${Date.now().toString().slice(-6)}-${randomSuffix}`;

  const payload: CrmLeadPayload = {
    leadId,
    timestamp: new Date().toISOString(),
    identity: {
      name: formData.name.trim(),
      phone_whatsapp: formData.phone_whatsapp.trim(),
      normalized_phone: phoneCheck.normalized,
      email: formData.email?.trim() || undefined
    },
    qualification: {
      location: formData.location,
      need_type: [...formData.need_type],
      timing: formData.timing,
      preferred_next_step: formData.preferred_next_step,
      budget_indicator: formData.budget_indicator || 'Prefer to discuss during consultation',
      notes: formData.notes?.trim() || undefined
    },
    commercial: {
      product: 'Contract / Bespoke Funeral Services',
      journeyStage: 'Qualified Opportunity',
      status: 'New Enquiry Captured'
    },
    attribution: { ...attribution }
  };

  return { payload };
}

export interface AnalyticsEvent {
  id: string;
  event: 'page_view' | 'cta_click' | 'whatsapp_click' | 'phone_click' | 'form_start' | 'form_submit' | 'brief_tailor_toggle';
  label: string;
  timestamp: string;
  section?: string;
  channel: string;
  metadata?: Record<string, any>;
}

/**
 * Per-field validation for the enquiry form. Returns an error message
 * or null when the field is valid.
 */
export function getEnquiryFieldError(field: string, value: unknown): string | null {
  switch (field) {
    case 'name': {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) return 'Please provide your full name (at least 2 characters).';
      if (trimmed.length < 2) return 'Name must be at least 2 characters.';
      return null;
    }
    case 'phone_whatsapp': {
      const valStr = typeof value === 'string' ? value : '';
      if (!valStr.trim()) return 'Phone or WhatsApp number is required.';
      const res = validateGhanaPhoneNumber(valStr);
      if (!res.isValid) {
        return res.error || 'Please enter a valid Ghana or international phone number.';
      }
      return null;
    }
    case 'location': {
      if (!value) return 'Please select the primary location for the service.';
      return null;
    }
    case 'timing': {
      if (!value) return 'Please indicate when you require assistance.';
      return null;
    }
    case 'need_type': {
      if (!Array.isArray(value) || value.length === 0) {
        return 'Please select at least one requirement area.';
      }
      return null;
    }
    case 'preferred_next_step': {
      if (!value) return 'Please select your preferred next contact step.';
      return null;
    }
    case 'email': {
      const emailStr = typeof value === 'string' ? value.trim() : '';
      if (emailStr) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailStr)) {
          return 'Please provide a valid email format (e.g. family@domain.com) or leave blank.';
        }
      }
      return null;
    }
    default:
      return null;
  }
}

const LEAD_POST_TIMEOUT_MS = 8000;

/**
 * POSTs a CRM lead payload as JSON to the configured endpoint.
 * Returns true only on a 2xx response; network errors and timeouts
 * resolve to false so the caller can surface a retryable error.
 */
export async function postLeadPayload(
  endpoint: string,
  payload: CrmLeadPayload,
  fetchFn: typeof fetch = fetch
): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LEAD_POST_TIMEOUT_MS);
  try {
    const response = await fetchFn(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Submits an enquiry to the configured lead endpoint when one exists
 * (VITE_LEAD_ENDPOINT). Without an endpoint the submission is accepted
 * locally, which is the normal case until the client wires a CRM.
 */
export async function submitEnquiry(
  payload: CrmLeadPayload,
  attribution: UtmParams,
  fetchFn: typeof fetch = fetch
): Promise<boolean> {
  const endpoint = import.meta.env?.VITE_LEAD_ENDPOINT as string | undefined;
  if (endpoint) {
    return postLeadPayload(endpoint, payload, fetchFn);
  }
  await new Promise((resolve) => setTimeout(resolve, 400));
  return true;
}
