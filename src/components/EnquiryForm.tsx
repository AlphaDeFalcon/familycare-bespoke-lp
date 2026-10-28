/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, Check, Send } from 'lucide-react';
import {
  getEnquiryFieldError,
  createCrmLeadPayload,
  submitEnquiry,
  type CrmLeadPayload,
  type UtmParams
} from '../utils/conversion';
import { EnquirySuccess } from './EnquirySuccess';
import { GHANA_REGIONS } from '../utils/regions';
import {
  NEED_TYPE_OPTIONS,
  TIMING_OPTIONS,
  NEXT_STEP_OPTIONS,
  DECISION_OPTIONS,
  DEFAULT_NEED_TYPE,
  DEFAULT_PREFERRED_NEXT_STEP
} from '../utils/enquiryOptions';

interface EnquiryFormProps {
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
  decision_process: string;
  consent_granted: boolean;
  email: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  phone_whatsapp: '',
  location: '',
  need_type: [DEFAULT_NEED_TYPE],
  timing: '',
  preferred_next_step: DEFAULT_PREFERRED_NEXT_STEP,
  decision_process: '',
  consent_granted: false,
  email: '',
  notes: ''
};

/** Which fields each step validates before allowing the visitor to advance. */
const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  1: ['name', 'phone_whatsapp', 'location'],
  2: ['need_type', 'timing'],
  3: ['preferred_next_step', 'email', 'decision_process', 'consent_granted']
};

const STEP_TITLES: Record<number, string> = {
  1: 'How we can reach you',
  2: 'What needs to be arranged',
  3: 'Next steps'
};

const inputBaseClass = 'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-accent';

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  attribution,
  whatsAppUrl,
  onDraftChange,
  onFormStart,
  onSubmitSuccess,
  onWhatsAppClick,
  onPhoneClick
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => ({ ...INITIAL_FORM }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<CrmLeadPayload | null>(null);

  // Move focus to the step heading when the step changes, so keyboard and
  // screen-reader users land in the right place. Skipped on first mount.
  useEffect(() => {
    if (step > 1) {
      document.getElementById('enquiry-form-step-heading')?.focus();
    }
  }, [step]);

  const emitDraft = (next: FormData) => {
    onDraftChange({
      name: next.name,
      location: next.location,
      needTypes: next.need_type
    });
  };

  const handleFieldChange = (field: keyof FormData, value: string | string[] | boolean) => {
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

  const validateFields = (fields: (keyof FormData)[]): boolean => {
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
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleStepAdvance = () => {
    if (!validateFields(STEP_FIELDS[step])) {
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleStepBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields(STEP_FIELDS[3])) {
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
    setStep(1);
    setFormData({ ...INITIAL_FORM });
    emitDraft({ ...INITIAL_FORM });
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

  const renderProgress = () => (
    <div>
      <div className="flex items-center gap-2" aria-hidden="true">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? 'bg-accent' : 'bg-hairline'}`}
          />
        ))}
      </div>
      <div className="text-xs font-semibold text-accent-deep mt-2">
        Step {step} of 3
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step < 3) {
          handleStepAdvance();
        } else {
          void handleSubmit(e);
        }
      }}
      className="space-y-6"
      noValidate
    >
      <div className="border-b border-hairline pb-4">
        <h3 className="font-display text-2xl font-bold text-ink">
          Talk to Us
        </h3>
        <p className="text-xs text-muted mt-1">
          Three short steps. Your answers help your advisor prepare for the conversation.
        </p>
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {renderProgress()}

      <h4
        id="enquiry-form-step-heading"
        tabIndex={-1}
        className="font-display text-xl font-bold text-ink focus:outline-none"
      >
        {STEP_TITLES[step]}
      </h4>

      {/* Step 1: Contact details */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="form-name" className="block text-xs font-semibold text-body">
                  Full name <span className="text-red-500">*</span>
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
                <p role="alert" id="form-name-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              ) : (
                <p className="text-[10px] text-muted">First name and family name.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="form-phone" className="block text-xs font-semibold text-body">
                  Phone or WhatsApp number <span className="text-red-500">*</span>
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
                <p role="alert" id="form-phone-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone_whatsapp}</span>
                </p>
              ) : (
                <p className="text-[10px] text-muted">Ghana numbers (020, 024, 050, 054, 055) or +233 international.</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="form-location" className="block text-xs font-semibold text-body">
              Where will the funeral take place? <span className="text-red-500">*</span>
            </label>
            <select
              id="form-location"
              value={formData.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              onBlur={() => handleFieldBlur('location')}
              {...errorProps('location', 'form-location-error')}
              className={`${inputBaseClass} ${
                touched.location && errors.location ? 'border-red-400 bg-red-50/20' : 'border-hairline'
              }`}
            >
              <option value="">Select a region...</option>
              {GHANA_REGIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {touched.location && errors.location ? (
              <p role="alert" id="form-location-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.location}</span>
              </p>
            ) : (
              <p className="text-[10px] text-muted">We work across all 16 regions. Branches in Accra, Tema, Kumasi, and Koforidua.</p>
            )}
          </div>
        </>
      )}

      {/* Step 2: What needs to be arranged */}
      {step === 2 && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-body">
                What needs to be arranged? <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-muted">
                Choose all that apply
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {NEED_TYPE_OPTIONS.map((option) => {
                const isSelected = formData.need_type.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleNeedType(option.value)}
                    aria-pressed={isSelected}
                    aria-describedby={
                      touched.need_type && errors.need_type ? 'form-need-type-error' : undefined
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-body border-hairline hover:bg-tint'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {option.label}
                  </button>
                );
              })}
            </div>
            {touched.need_type && errors.need_type ? (
              <p role="alert" id="form-need-type-error" className="text-[11px] text-red-600 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.need_type}</span>
              </p>
            ) : (
              <p className="text-[11px] text-accent flex items-center gap-1.5 pt-1 font-medium">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{formData.need_type.length} area{formData.need_type.length > 1 ? 's' : ''} selected</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="form-timing" className="block text-xs font-semibold text-body">
              When do you need support? <span className="text-red-500">*</span>
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
              <option value="">Select a timeline...</option>
              {TIMING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {touched.timing && errors.timing ? (
              <p role="alert" id="form-timing-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.timing}</span>
              </p>
            ) : (
              <p className="text-[10px] text-muted">This helps us assign the right advisor.</p>
            )}
          </div>
        </>
      )}

      {/* Step 3: Next steps */}
      {step === 3 && (
        <>
          <div className="space-y-1.5">
            <label htmlFor="form-next-step" className="block text-xs font-semibold text-body">
              How would you like us to reach you? <span className="text-red-500">*</span>
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
              {NEXT_STEP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {touched.preferred_next_step && errors.preferred_next_step && (
              <p role="alert" id="form-next-step-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.preferred_next_step}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="form-decision" className="block text-xs font-semibold text-body">
              Who else is involved in the decision? <span className="text-red-500">*</span>
            </label>
            <select
              id="form-decision"
              value={formData.decision_process}
              onChange={(e) => handleFieldChange('decision_process', e.target.value)}
              onBlur={() => handleFieldBlur('decision_process')}
              {...errorProps('decision_process', 'form-decision-error')}
              className={`${inputBaseClass} ${
                touched.decision_process && errors.decision_process ? 'border-red-400 bg-red-50/20' : 'border-hairline'
              }`}
            >
              <option value="">Select who is involved...</option>
              {DECISION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {touched.decision_process && errors.decision_process ? (
              <p role="alert" id="form-decision-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.decision_process}</span>
              </p>
            ) : (
              <p className="text-[10px] text-muted">This helps your advisor prepare a proposal the whole family can approve.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="form-email" className="block text-xs font-semibold text-body">
                Email <span className="text-muted font-normal">(optional)</span>
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
                <p role="alert" id="form-email-error" className="text-[11px] text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              ) : (
                <p className="text-[10px] text-muted">Add an email if you would like the proposal sent in writing.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="form-notes" className="block text-xs font-semibold text-body">
                Anything else we should know? <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id="form-notes"
                type="text"
                value={formData.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="e.g. traditional Akan rites, family travelling from abroad"
                className={`${inputBaseClass} border-hairline`}
              />
              <p className="text-[10px] text-muted">Family customs, guests from abroad, or anything that matters to you.</p>
            </div>
          </div>

          {/* Consent */}
          <div className="space-y-1.5">
            <label htmlFor="form-consent" className="flex items-start gap-2.5 cursor-pointer">
              <input
                id="form-consent"
                type="checkbox"
                checked={formData.consent_granted}
                onChange={(e) => handleFieldChange('consent_granted', e.target.checked)}
                onBlur={() => handleFieldBlur('consent_granted')}
                {...errorProps('consent_granted', 'form-consent-error')}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline accent-[#00A859] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <span className="text-xs text-body leading-relaxed">
                I agree to FamilyCare contacting me about this enquiry and using the details I have shared. <span className="text-red-500">*</span>
              </span>
            </label>
            {touched.consent_granted && errors.consent_granted ? (
              <p role="alert" id="form-consent-error" className="text-[11px] text-red-600 flex items-center gap-1.5 pl-6.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.consent_granted}</span>
              </p>
            ) : null}
          </div>

          {/* Privacy & Consent Notice */}
          <p className="text-[11px] text-muted leading-relaxed">
            Your details stay private. FamilyCare uses them to respond to this enquiry and improve the service. We do not sell your personal information.
          </p>
        </>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={handleStepBack}
            className="px-6 py-4 rounded-full border border-hairline text-muted hover:text-ink hover:border-muted/50 font-semibold text-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="submit"
            className="flex-1 py-4 rounded-full bg-accent hover:bg-accent-deep text-white font-semibold text-base transition-colors flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 rounded-full bg-accent hover:bg-accent-deep text-white font-semibold text-base transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {isSubmitting ? (
              <span>Sending your request...</span>
            ) : (
              <>
                <span>Request My Consultation</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};
