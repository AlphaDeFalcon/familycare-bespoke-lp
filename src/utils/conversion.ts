/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
}

export type ChannelSource = 'google_search' | 'meta_instagram' | 'linkedin' | 'youtube' | 'direct';

export interface CampaignChannelConfig {
  id: ChannelSource;
  name: string;
  channelType: string;
  heroBadge: string;
  heroEmphasis: string;
  defaultUtms: UtmParams;
}

export const CAMPAIGN_CHANNELS: Record<ChannelSource, CampaignChannelConfig> = {
  google_search: {
    id: 'google_search',
    name: 'Google Search (High Intent)',
    channelType: 'Paid Search (cpc)',
    heroBadge: 'Direct Bespoke Consultation • Immediate & Planned Assistance',
    heroEmphasis: 'Straightforward guidance on transparent planning, coordination, and custom quotes.',
    defaultUtms: {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'ghana_contract_bespoke_search',
      utm_content: 'ad_bespoke_farewell_wishes',
      utm_term: 'bespoke funeral services ghana',
      gclid: 'gclid_sim_97812gh_famcare'
    }
  },
  meta_instagram: {
    id: 'meta_instagram',
    name: 'Meta / Instagram (Visual & Coordination)',
    channelType: 'Paid Social (feed)',
    heroBadge: 'Dignified Ceremonial Care • Coordinated by FamilyCare',
    heroEmphasis: 'Experience the calm assurance of having every detail and tradition respectfully shaped.',
    defaultUtms: {
      utm_source: 'meta',
      utm_medium: 'paid_social',
      utm_campaign: 'bespoke_honours_coordination',
      utm_content: 'carousel_family_peace_of_mind'
    }
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn (Professional / Pre-Planning)',
    channelType: 'Professional Network (sponsored)',
    heroBadge: 'Structured Executive Planning • Trusted Family Protocol',
    heroEmphasis: 'A consultative, unhurried planning process built for family leaders and decision-makers.',
    defaultUtms: {
      utm_source: 'linkedin',
      utm_medium: 'sponsored_content',
      utm_campaign: 'corporate_family_trust_preplanning',
      utm_content: 'lead_card_calm_governance'
    }
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube (Process & Explanation)',
    channelType: 'Video Discovery (in-stream)',
    heroBadge: 'The FamilyCare Method • Step-by-Step Coordination',
    heroEmphasis: 'Learn how our advisors carry your family through initial wishes to the final tribute.',
    defaultUtms: {
      utm_source: 'youtube',
      utm_medium: 'video',
      utm_campaign: 'how_bespoke_works_explainer',
      utm_content: 'video_consultation_walkthrough'
    }
  },
  direct: {
    id: 'direct',
    name: 'Direct / Organic Visit',
    channelType: 'Organic / Direct',
    heroBadge: 'FamilyCare Funeral Trust • Today\'s Wisdom, Tomorrow\'s Peace of Mind',
    heroEmphasis: 'There is no set package. We listen, then build the funeral around what matters to you.',
    defaultUtms: {
      utm_source: 'direct',
      utm_medium: 'organic',
      utm_campaign: 'brand_direct'
    }
  }
};

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
  const briefText = options.tailoringBrief && options.tailoringBrief.length > 0
    ? `\nKey areas to tailor: ${options.tailoringBrief.join(', ')}.`
    : '';
  const locText = options.location ? `\nLocation: ${options.location}.` : '';
  const nameText = options.name ? ` My name is ${options.name}.` : '';
  const srcText = options.channel ? ` (Ref: ${options.channel})` : '';

  const message = `Hello FamilyCare, I would like to discuss a Contract / Bespoke funeral arrangement.${nameText} I would like help understanding the next steps and shaping a tribute around our family's wishes.${locText}${briefText}${srcText}`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
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
