/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Enquiry options with a deliberate split between what the visitor reads
 * and what the CRM receives.
 *
 * `value` is the CRM contract. It is stored in form state, posted in the
 * lead payload, and pushed to the GTM dataLayer. Never rename a value
 * without updating the CRM mapping and `docs/crm-integration.md`.
 *
 * `label` is display copy. Edit it freely; it never reaches the CRM.
 */
export interface EnquiryOption {
  value: string;
  label: string;
}

export const NEED_TYPE_OPTIONS: EnquiryOption[] = [
  { value: 'Full Funeral Arrangement', label: 'Full funeral arrangement' },
  { value: 'Scale & Venue', label: 'Venue and guest numbers' },
  { value: 'Cultural Traditions', label: 'Cultural traditions' },
  { value: 'Caskets', label: 'Caskets' },
  { value: 'Logistics & Transport', label: 'Transport and logistics' },
  { value: 'Catering / Hospitality', label: 'Catering and hospitality' },
  { value: 'Repatriation', label: 'Repatriation' },
  { value: 'Cemetery Support', label: 'Cemetery and burial' },
  { value: 'Budget Guidance', label: 'Budget guidance' }
];

export const TIMING_OPTIONS: EnquiryOption[] = [
  { value: 'Immediate need (Within days)', label: 'Within days' },
  { value: 'Near term (Within 1-3 months)', label: 'Within 1 to 3 months' },
  { value: 'Future planning / Pre-need', label: 'Planning ahead' },
  { value: 'Just gathering information', label: 'Still gathering information' }
];

export const NEXT_STEP_OPTIONS: EnquiryOption[] = [
  { value: 'WhatsApp conversation', label: 'WhatsApp' },
  { value: 'Phone call from an advisor', label: 'Phone call from an advisor' },
  { value: 'Private 1-on-1 consultation', label: 'Private consultation' }
];

export const DECISION_OPTIONS: EnquiryOption[] = [
  { value: 'I am the sole decision maker', label: 'I am the only decision maker' },
  { value: 'Spouse / partner needs to approve', label: 'My spouse or partner' },
  { value: 'Siblings / family members need to approve', label: 'Siblings or family members' },
  { value: 'Elders / family council need to approve', label: 'Elders or family council' },
  { value: 'Other decision process', label: 'Other' }
];

export const DEFAULT_NEED_TYPE = 'Full Funeral Arrangement';
export const DEFAULT_PREFERRED_NEXT_STEP = 'WhatsApp conversation';

/** Returns the display label for a stored value, or the value itself if unknown. */
export function optionLabel(options: EnquiryOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

/** Convenience mapper for need-type values in the WhatsApp message. */
export function needTypeLabel(value: string): string {
  return optionLabel(NEED_TYPE_OPTIONS, value);
}
