/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Send } from 'lucide-react';
import {
  getEnquiryFieldError,
  createCrmLeadPayload,
  submitEnquiry,
  type CrmLeadPayload,
  type UtmParams
} from '../utils/conversion';
import { EnquirySuccess } from './EnquirySuccess';

interface EnquiryFormProps {
  initialNeedTypes: string[];
  attribution: UtmParams;
  whatsAppUrl: string;
  onDraftChange: (draft: { name: string; location: string; needTypes: string[] }) => void;
  onFormStart: () => void;
  onSubmitSuccess: (lead: CrmLeadPayload) => void;
  onWhatsAppClick: () => void;
  onPhoneClick: () => void;
}

interface FormData {
  name: string;
  phone_whatsapp: string;
  location: string;
  need_type: string[];
  timing: string;
  preferred_next_step: string;
  email: string;
  budget_indicator: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  phone_whatsapp: '',
  location: '',
  need_type: ['Full Bespoke Arrangement'],
  timing: '',
  preferred_next_step: 'WhatsApp conversation',
  email: '',
  budget_indicator: 'Prefer to discuss during consultation',
  notes: ''
};

const NEED_TYPE_OPTIONS = [
  'Full Bespoke Arrangement',
  'Scale & Venue',
  'Cultural Traditions',
  'Caskets',
  'Logistics & Transport',
  'Catering / Hospitality',
  'Repatriation',
  'Cemetery Support',
  'Budget Guidance'
];

const TIMING_OPTIONS = [
  'Immediate need (Within days)',
  'Near term (Within 1-3 months)',
  'Future planning / Pre-need',
  'Just gathering information'
];

const NEXT_STEP_OPTIONS = [
  'WhatsApp conversation',
  'Phone call from an advisor',
  'Private 1-on-1 consultation'
];

const BUDGET_OPTIONS = [
  'Prefer to discuss during consultation',
  'Modest & dignified',
  'Mid-range comprehensive',
  'Large-scale bespoke tribute'
];

const inputBaseClass = 'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-accent';

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialNeedTypes,
  attribution,
  whatsAppUrl,
  onDraftChange,
  onFormStart,
  onSubmitSuccess,
  onWhatsAppClick,
  onPhoneClick
}) => {
  const [formData, setFormData] = useState<FormData>(() => ({
    ...INITIAL_FORM,
    need_type: initialNeedTypes.length > 0 ? [...initialNeedTypes] : INITIAL_FORM.need_type
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<CrmLeadPayload | null>(null);

  // Sync brief-builder selections into the form
  useEffect(() => {
    if (initialNeedTypes.length > 0) {
      setFormData((prev) => {
        const merged = Array.from(new Set([...prev.need_type, ...initialNeedTypes]));
        return { ...prev, need_type: merged };
      });
    }
  }, [initialNeedTypes]);

  const emitDraft = (next: FormData) => {
    onDraftChange({
      name: next.name,
      location: next.location,
      needTypes: next.need_type
    });
  };

  const handleFieldChange = (field: keyof FormData, value: string | string[]) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onFormStart();
    }

    const next = { ...formData, [field]: value };
    setFormData(next);
    setTouched((prev) => ({ ...prev, [field]: true }));
    emitDraft(next);

    const err = getEnquiryFieldError(field, value);
    setErrors((prev) => {
      const updated = { ...prev };
      if (err) {
        updated[field] = err;
      } else {
        delete updated[field];
      }
      return updated;
    });
  };

  const handleFieldBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = getEnquiryFieldError(field, formData[field]);
    setErrors((prev) => {
      const updated = { ...prev };
      if (err) {
        updated[field] = err;
      } else {
        delete updated[field];
      }
      return updated;
    });
  };

  const toggleNeedType = (option: string) => {
    const exists = formData.need_type.includes(option);
    const updated = exists ? formData.need_type.filter((x) => x !== option) : [...formData.need_type, option];
    handleFieldChange('need_type', updated);
  };

  const validateForm = (): boolean => {
    const fields: (keyof FormData)[] = [
      'name',
      'phone_whatsapp',
      'location',
      'need_type',
      'timing',
      'preferred_next_step',
      'email'
    ];
    const newErrors: Record<string, string> = {};
    const allTouched: Record<string, boolean> = {};

    fields.forEach((field) => {
      allTouched[field] = true;
      const err = getEnquiryFieldError(field, formData[field]);
      if (err) {
        newErrors[field] = err;
      }
    });

    setTouched((prev) => ({ ...prev, ...allTouched }));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const { payload, error } = createCrmLeadPayload(formData, attribution);

    if (!payload) {
      setIsSubmitting(false);
      setErrors({ general: error || 'Something went wrong. Please check your details and try again.' });
      return;
    }

    const delivered = await submitEnquiry(payload, attribution);

    if (!delivered) {
      setIsSubmitting(false);
      setErrors({ general: 'We could not deliver your enquiry right now. Please try again, or use WhatsApp or phone to reach an advisor directly.' });
      return;
    }

    setIsSubmitting(false);
    setSubmittedLead(payload);
    onSubmitSuccess(payload);
  };

  const resetForm = () => {
    setSubmittedLead(null);
    setFormData({ ...INITIAL_FORM });
    setTouched({});
    setErrors({});
    setHasInteracted(false);
  };

  const errorProps = (field: keyof FormData, errorId: string) =>
    touched[field] && errors[field]
      ? { 'aria-invalid': true, 'aria-describedby': errorId }
      : {};

  if (submittedLead) {
    return (
      <EnquirySuccess
        lead={submittedLead}
        whatsAppUrl={whatsAppUrl}
        onReset={resetForm}
        onWhatsAppClick={onWhatsAppClick}
        onPhoneClick={onPhoneClick}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="border-b border-hairline pb-4">
        <h3 className="font-display text-2xl font-bold text-ink">
          Request a Bespoke Consultation
        </h3>
        <p className="text-xs text-muted mt-1">
          Fields marked with <span className="text-red-500">*</span> are essential for an advisor to review your brief accurately.
        </p>
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Row 1: Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="form-name" className="block text-xs font-semibold text-body">
              Full Name <span className="text-red-500">*</span>
            </label>
            {touched.name && !errors.name && formData.name.trim().length >= 2 && (
              <span className="text-[11px] text-accent font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Valid
              </span>
            )}
          </div>
          <input
            id="form-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={() => handleFieldBlur('name')}
            placeholder="e.g. Kofi Mensah"
            {...errorProps('name', 'form-name-error')}
            className={`${inputBaseClass} ${
              touched.name && errors.name
                ? 'border-red-400 bg-red-50/20'
                : 'border-hairline'
            }`}
          />
          {touched.name && errors.name ? (
            <p id="form-name-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          ) : (
            <p className="text-[10px] text-muted">Enter first and family name</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="form-phone" className="block text-xs font-semibold text-body">
              Phone / WhatsApp Number <span className="text-red-500">*</span>
            </label>
            {touched.phone_whatsapp && !errors.phone_whatsapp && formData.phone_whatsapp.trim() && (
              <span className="text-[11px] text-accent font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Valid
              </span>
            )}
          </div>
          <input
            id="form-phone"
            type="tel"
            value={formData.phone_whatsapp}
            onChange={(e) => handleFieldChange('phone_whatsapp', e.target.value)}
            onBlur={() => handleFieldBlur('phone_whatsapp')}
            placeholder="e.g. 024 123 4567 or +233..."
            {...errorProps('phone_whatsapp', 'form-phone-error')}
            className={`${inputBaseClass} ${
              touched.phone_whatsapp && errors.phone_whatsapp
                ? 'border-red-400 bg-red-50/20'
                : 'border-hairline'
            }`}
          />
          {touched.phone_whatsapp && errors.phone_whatsapp ? (
            <p id="form-phone-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phone_whatsapp}</span>
            </p>
          ) : (
            <p className="text-[10px] text-muted">Accepts Ghana 020/024/050/054/055 or +233 international</p>
          )}
        </div>
      </div>

      {/* Row 2: Location & Timing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="form-location" className="block text-xs font-semibold text-body">
            Location (town or region) <span className="text-red-500">*</span>
          </label>
          <input
            id="form-location"
            type="text"
            value={formData.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            onBlur={() => handleFieldBlur('location')}
            placeholder="e.g. Kumasi, Ashanti Region"
            {...errorProps('location', 'form-location-error')}
            className={`${inputBaseClass} ${
              touched.location && errors.location ? 'border-red-400 bg-red-50/20' : 'border-hairline'
            }`}
          />
          {touched.location && errors.location ? (
            <p id="form-location-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.location}</span>
            </p>
          ) : (
            <p className="text-[10px] text-muted">Tell us the town or region where the service is needed</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="form-timing" className="block text-xs font-semibold text-body">
            When do you need assistance? <span className="text-red-500">*</span>
          </label>
          <select
            id="form-timing"
            value={formData.timing}
            onChange={(e) => handleFieldChange('timing', e.target.value)}
            onBlur={() => handleFieldBlur('timing')}
            {...errorProps('timing', 'form-timing-error')}
            className={`${inputBaseClass} ${
              touched.timing && errors.timing ? 'border-red-400 bg-red-50/20' : 'border-hairline'
            }`}
          >
            <option value="">Select urgency / timeline...</option>
            {TIMING_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {touched.timing && errors.timing ? (
            <p id="form-timing-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.timing}</span>
            </p>
          ) : (
            <p className="text-[10px] text-muted">Helps assign the right advisor for your timeline</p>
          )}
        </div>
      </div>

      {/* What needs to be arranged */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-body">
            What needs to be arranged? <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-muted">
            Synced with your selections above
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {NEED_TYPE_OPTIONS.map((opt) => {
            const isSelected = formData.need_type.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleNeedType(opt)}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-body border-hairline hover:bg-tint'
                }`}
              >
                {isSelected && '✓ '}
                {opt}
              </button>
            );
          })}
        </div>
        {touched.need_type && errors.need_type ? (
          <p id="form-need-type-error" className="text-[11px] text-red-600 flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.need_type}</span>
          </p>
        ) : (
          <p className="text-[11px] text-accent flex items-center gap-1.5 pt-1 font-medium">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>{formData.need_type.length} requirement area{formData.need_type.length > 1 ? 's' : ''} selected</span>
          </p>
        )}
      </div>

      {/* Row 3: Preferred Next Step & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="form-next-step" className="block text-xs font-semibold text-body">
            Preferred Next Step <span className="text-red-500">*</span>
          </label>
          <select
            id="form-next-step"
            value={formData.preferred_next_step}
            onChange={(e) => handleFieldChange('preferred_next_step', e.target.value)}
            onBlur={() => handleFieldBlur('preferred_next_step')}
            {...errorProps('preferred_next_step', 'form-next-step-error')}
            className={`${inputBaseClass} ${
              touched.preferred_next_step && errors.preferred_next_step
                ? 'border-red-400 bg-red-50/20'
                : 'border-hairline'
            }`}
          >
            {NEXT_STEP_OPTIONS.map((step) => (
              <option key={step} value={step}>
                {step}
              </option>
            ))}
          </select>
          {touched.preferred_next_step && errors.preferred_next_step && (
            <p id="form-next-step-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.preferred_next_step}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="form-budget" className="block text-xs font-semibold text-body">
            Budget Guidance <span className="text-muted font-normal">(Optional)</span>
          </label>
          <select
            id="form-budget"
            value={formData.budget_indicator}
            onChange={(e) => handleFieldChange('budget_indicator', e.target.value)}
            className={`${inputBaseClass} border-hairline`}
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-muted">Transparent itemized proposals; zero hidden fees</p>
        </div>
      </div>

      {/* Email & Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="form-email" className="block text-xs font-semibold text-body">
            Email Address <span className="text-muted font-normal">(Optional)</span>
          </label>
          <input
            id="form-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={() => handleFieldBlur('email')}
            placeholder="e.g. family@domain.com"
            {...errorProps('email', 'form-email-error')}
            className={`${inputBaseClass} ${
              touched.email && errors.email ? 'border-red-400 bg-red-50/20' : 'border-hairline'
            }`}
          />
          {touched.email && errors.email ? (
            <p id="form-email-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          ) : (
            <p className="text-[10px] text-muted">Required only if requesting a written email proposal</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="form-notes" className="block text-xs font-semibold text-body">
            Additional Notes / Custom Wishes <span className="text-muted font-normal">(Optional)</span>
          </label>
          <input
            id="form-notes"
            type="text"
            value={formData.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="e.g. Traditional Akan rites, diaspora kin"
            className={`${inputBaseClass} border-hairline`}
          />
          <p className="text-[10px] text-muted">Share any family customs or diaspora attendee considerations</p>
        </div>
      </div>

      {/* Privacy & Consent Notice */}
      <p className="text-[11px] text-muted leading-relaxed">
        FamilyCare treats your family&rsquo;s bereavement details with strict confidentiality. Your contact information is never shared or used for spam.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-full bg-accent hover:bg-ink text-white font-semibold text-base transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {isSubmitting ? (
          <span>Sending...</span>
        ) : (
          <>
            <span>Request My Bespoke Consultation</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
