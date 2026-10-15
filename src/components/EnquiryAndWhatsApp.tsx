/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import {
  validateGhanaPhoneNumber,
  buildWhatsAppUrl,
  createCrmLeadPayload,
  CrmLeadPayload,
  UtmParams
} from '../utils/conversion';

interface EnquiryAndWhatsAppProps {
  selectedDimensions: string[];
  onToggleDimension: (dimensionKey: string) => void;
  activeUtms: UtmParams;
  channelName: string;
  onLeadCaptured: (lead: CrmLeadPayload) => void;
  onLogEvent: (event: any) => void;
}

export const EnquiryAndWhatsApp: React.FC<EnquiryAndWhatsAppProps> = ({
  selectedDimensions,
  onToggleDimension,
  activeUtms,
  channelName,
  onLeadCaptured,
  onLogEvent
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone_whatsapp: '',
    location: '',
    need_type: selectedDimensions.length > 0 ? selectedDimensions : ['Full Bespoke Arrangement'],
    timing: '',
    preferred_next_step: 'WhatsApp conversation',
    email: '',
    budget_indicator: 'Prefer to discuss during consultation',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<CrmLeadPayload | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Sync selectedDimensions when changed from brief builder
  useEffect(() => {
    if (selectedDimensions.length > 0) {
      setFormData((prev) => ({
        ...prev,
        need_type: Array.from(new Set([...prev.need_type, ...selectedDimensions]))
      }));
    }
  }, [selectedDimensions]);

  const needTypeOptions = [
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

  const locationOptions = [
    'Accra / Greater Accra',
    'Kumasi / Ashanti',
    'Takoradi / Western',
    'Tamale / Northern',
    'Cape Coast / Central',
    'Diaspora / International (Planning for Ghana)',
    'Other Location'
  ];

  const timingOptions = [
    'Immediate need (Within days)',
    'Near term (Within 1–3 months)',
    'Future planning / Pre-need',
    'Just gathering information'
  ];

  const nextStepOptions = [
    'WhatsApp conversation',
    'Phone call from an advisor',
    'Private 1-on-1 consultation',
    'In-person branch visit'
  ];

  const budgetOptions = [
    'Prefer to discuss during consultation',
    'Modest & dignified',
    'Mid-range comprehensive',
    'Large-scale bespoke tribute'
  ];

  // Pure single-field validator for real-time feedback
  const getFieldError = (field: string, value: any): string | null => {
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
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onLogEvent({
        event: 'form_start',
        label: `User interacted with field: ${field}`,
        section: 'Enquiry Form'
      });
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Real-time validation as user types
    const err = getFieldError(field, value);
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

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = formData[field as keyof typeof formData];
    const err = getFieldError(field, val);
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
    const current = formData.need_type;
    const exists = current.includes(option);
    const updated = exists ? current.filter((x) => x !== option) : [...current, option];
    handleFieldChange('need_type', updated);
  };

  const validateForm = (): boolean => {
    const fields = ['name', 'phone_whatsapp', 'location', 'need_type', 'timing', 'preferred_next_step', 'email'];
    const newErrors: Record<string, string> = {};
    const allTouched: Record<string, boolean> = {};

    fields.forEach((field) => {
      allTouched[field] = true;
      const err = getFieldError(field, formData[field as keyof typeof formData]);
      if (err) {
        newErrors[field] = err;
      }
    });

    setTouched((prev) => ({ ...prev, ...allTouched }));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Build CRM payload
    const { payload, error } = createCrmLeadPayload(formData, activeUtms);

    setTimeout(() => {
      setIsSubmitting(false);
      if (payload) {
        setSubmittedLead(payload);
        onLeadCaptured(payload);
        onLogEvent({
          event: 'form_submit',
          label: `Bespoke Consultation Lead: ${payload.leadId}`,
          section: 'Enquiry Form',
          metadata: {
            leadId: payload.leadId,
            location: payload.qualification.location,
            timing: payload.qualification.timing,
            needs: payload.qualification.need_type
          }
        });
      } else if (error) {
        setErrors({ general: error });
      }
    }, 600);
  };

  // Build live WhatsApp URL
  const whatsAppUrl = buildWhatsAppUrl({
    basePhone: '233302789123',
    tailoringBrief: formData.need_type,
    location: formData.location || undefined,
    channel: channelName,
    name: formData.name || undefined
  });

  const copyLeadJson = () => {
    if (submittedLead) {
      navigator.clipboard.writeText(JSON.stringify(submittedLead, null, 2));
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  return (
    <section id="enquiry-form" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E7E2D6] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          {/* 4-Step Process Reminder Pill (From Strategy/Wireframe page 10) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A55A3]/10 text-[#3A55A3] text-[11px] sm:text-xs font-semibold tracking-wide">
            <span>01 Share Needs</span>
            <span>→</span>
            <span>02 Shape Service</span>
            <span>→</span>
            <span>03 Review &amp; Approve</span>
            <span>→</span>
            <span>04 Carry Through</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B] tracking-tight">
            Tell us what you need. A FamilyCare advisor will help you understand the next step.
          </h2>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            There is no obligation. We clarify options, check location coverage, and prepare a calm, transparent proposal tailored strictly to your wishes.
          </p>
        </div>

        {/* Dual-Path Container (Form Left, WhatsApp Concierge Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 Columns): Qualification Form or Success State */}
          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#DDD7C6] p-6 sm:p-9 shadow-md">
            {!submittedLead ? (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="border-b border-[#F2EFE9] pb-4">
                  <h3 className="font-editorial text-2xl font-bold text-[#18181B]">
                    Request a Bespoke Consultation
                  </h3>
                  <p className="text-xs text-[#52525B] mt-1">
                    Fields marked with <span className="text-red-500">*</span> are essential for an advisor to review your brief accurately.
                  </p>
                </div>

                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="form-name" className="block text-xs font-semibold text-[#18181B]">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      {touched.name && !errors.name && formData.name.trim().length >= 2 && (
                        <span className="text-[11px] text-[#00A859] font-medium flex items-center gap-1">
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
                      placeholder="e.g. Dennis Rockson"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden ${
                        touched.name && errors.name
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : touched.name && !errors.name && formData.name.trim().length >= 2
                          ? 'border-[#00A859] bg-[#E8F8F0]/30 focus:ring-2 focus:ring-[#00A859]'
                          : 'border-[#DDD7C6] bg-[#FAF8F5] focus:ring-2 focus:ring-[#00A859]'
                      }`}
                      required
                    />
                    {touched.name && errors.name ? (
                      <p className="text-[11px] text-red-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-zinc-400">
                        Enter first and family name
                      </p>
                    )}
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="form-phone" className="block text-xs font-semibold text-[#18181B]">
                        Phone / WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      {touched.phone_whatsapp && !errors.phone_whatsapp && formData.phone_whatsapp.trim() && (
                        <span className="text-[11px] text-[#00A859] font-medium flex items-center gap-1">
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
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden ${
                        touched.phone_whatsapp && errors.phone_whatsapp
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : touched.phone_whatsapp && !errors.phone_whatsapp && formData.phone_whatsapp.trim()
                          ? 'border-[#00A859] bg-[#E8F8F0]/30 focus:ring-2 focus:ring-[#00A859]'
                          : 'border-[#DDD7C6] bg-[#FAF8F5] focus:ring-2 focus:ring-[#00A859]'
                      }`}
                      required
                    />
                    {touched.phone_whatsapp && errors.phone_whatsapp ? (
                      <p className="text-[11px] text-red-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone_whatsapp}</span>
                      </p>
                    ) : touched.phone_whatsapp && !errors.phone_whatsapp && formData.phone_whatsapp.trim() ? (
                      <p className="text-[11px] text-emerald-700 flex items-center gap-1.5 font-medium animate-in fade-in duration-150">
                        <Check className="w-3.5 h-3.5 shrink-0 text-[#00A859]" />
                        <span>Valid phone format (Ghana / Intl standard)</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-zinc-400">
                        Accepts Ghana 020/024/050/054/055... or +233 international
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Location & Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Location */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="form-location" className="block text-xs font-semibold text-[#18181B]">
                        Location / Region <span className="text-red-500">*</span>
                      </label>
                      {touched.location && !errors.location && formData.location && (
                        <span className="text-[11px] text-[#00A859] font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                    <select
                      id="form-location"
                      value={formData.location}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      onBlur={() => handleFieldBlur('location')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden bg-[#FAF8F5] ${
                        touched.location && errors.location
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : touched.location && !errors.location && formData.location
                          ? 'border-[#00A859] bg-[#E8F8F0]/30 focus:ring-2 focus:ring-[#00A859]'
                          : 'border-[#DDD7C6] focus:ring-2 focus:ring-[#00A859]'
                      }`}
                      required
                    >
                      <option value="">Select service location...</option>
                      {locationOptions.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    {touched.location && errors.location ? (
                      <p className="text-[11px] text-red-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.location}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-zinc-400">
                        Service available across Ghana &amp; for diaspora families
                      </p>
                    )}
                  </div>

                  {/* Timing */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="form-timing" className="block text-xs font-semibold text-[#18181B]">
                        When do you need assistance? <span className="text-red-500">*</span>
                      </label>
                      {touched.timing && !errors.timing && formData.timing && (
                        <span className="text-[11px] text-[#00A859] font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                    <select
                      id="form-timing"
                      value={formData.timing}
                      onChange={(e) => handleFieldChange('timing', e.target.value)}
                      onBlur={() => handleFieldBlur('timing')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden bg-[#FAF8F5] ${
                        touched.timing && errors.timing
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : touched.timing && !errors.timing && formData.timing
                          ? 'border-[#00A859] bg-[#E8F8F0]/30 focus:ring-2 focus:ring-[#00A859]'
                          : 'border-[#DDD7C6] focus:ring-2 focus:ring-[#00A859]'
                      }`}
                      required
                    >
                      <option value="">Select urgency / timeline...</option>
                      {timingOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {touched.timing && errors.timing ? (
                      <p className="text-[11px] text-red-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.timing}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-zinc-400">
                        Helps assign immediate on-call vs planning advisor
                      </p>
                    )}
                  </div>
                </div>

                {/* What do you need help with? Multi-select pills */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#18181B]">
                      What needs to be arranged? <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#52525B]">
                      Synced with your selections above
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {needTypeOptions.map((opt) => {
                      const isSelected = formData.need_type.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleNeedType(opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-[#00A859] text-white border-[#00A859] shadow-2xs'
                              : 'bg-[#FAF8F5] text-[#18181B] border-[#DDD7C6] hover:bg-[#F2EFE9]'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {touched.need_type && errors.need_type ? (
                    <p className="text-[11px] text-red-600 flex items-center gap-1.5 pt-1 animate-in fade-in duration-150">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.need_type}</span>
                    </p>
                  ) : formData.need_type.length > 0 ? (
                    <p className="text-[11px] text-emerald-700 flex items-center gap-1.5 pt-1 font-medium animate-in fade-in duration-150">
                      <Check className="w-3.5 h-3.5 shrink-0 text-[#00A859]" />
                      <span>{formData.need_type.length} requirement area{formData.need_type.length > 1 ? 's' : ''} tailored</span>
                    </p>
                  ) : null}
                </div>

                {/* Row 3: Preferred Next Step & Budget Indicator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Preferred Next Step */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-next-step" className="block text-xs font-semibold text-[#18181B]">
                      Preferred Next Step <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="form-next-step"
                      value={formData.preferred_next_step}
                      onChange={(e) => handleFieldChange('preferred_next_step', e.target.value)}
                      onBlur={() => handleFieldBlur('preferred_next_step')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden bg-[#FAF8F5] ${
                        touched.preferred_next_step && errors.preferred_next_step
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : 'border-[#DDD7C6] focus:ring-2 focus:ring-[#00A859]'
                      }`}
                      required
                    >
                      {nextStepOptions.map((step) => (
                        <option key={step} value={step}>
                          {step}
                        </option>
                      ))}
                    </select>
                    {touched.preferred_next_step && errors.preferred_next_step && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.preferred_next_step}</span>
                      </p>
                    )}
                  </div>

                  {/* Budget Indicator */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-budget" className="block text-xs font-semibold text-[#18181B]">
                      Budget Guidance <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      id="form-budget"
                      value={formData.budget_indicator}
                      onChange={(e) => handleFieldChange('budget_indicator', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD7C6] bg-[#FAF8F5] text-sm focus:ring-2 focus:ring-[#00A859] focus:outline-hidden"
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-zinc-400">
                      Transparent itemized proposals; zero hidden fees
                    </p>
                  </div>
                </div>

                {/* Email Address & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="form-email" className="block text-xs font-semibold text-[#18181B]">
                        Email Address <span className="text-zinc-400 font-normal">(Optional)</span>
                      </label>
                      {touched.email && !errors.email && formData.email.trim() && (
                        <span className="text-[11px] text-[#00A859] font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      id="form-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email')}
                      placeholder="e.g. family@domain.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden bg-[#FAF8F5] ${
                        touched.email && errors.email
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : touched.email && !errors.email && formData.email.trim()
                          ? 'border-[#00A859] bg-[#E8F8F0]/30 focus:ring-2 focus:ring-[#00A859]'
                          : 'border-[#DDD7C6] focus:ring-2 focus:ring-[#00A859]'
                      }`}
                    />
                    {touched.email && errors.email ? (
                      <p className="text-[11px] text-red-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-zinc-400">
                        Required only if requesting a written email proposal
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="form-notes" className="block text-xs font-semibold text-[#18181B]">
                      Additional Notes / Custom Wishes <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="form-notes"
                      type="text"
                      value={formData.notes}
                      onChange={(e) => handleFieldChange('notes', e.target.value)}
                      placeholder="e.g. Traditional Akan rites, diaspora kin"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD7C6] bg-[#FAF8F5] text-sm focus:ring-2 focus:ring-[#00A859] focus:outline-hidden"
                    />
                    <p className="text-[10px] text-zinc-400">
                      Share any family customs or diaspora attendee considerations
                    </p>
                  </div>
                </div>

                {/* Privacy & Consent Notice */}
                <p className="text-[11px] text-[#52525B] leading-relaxed">
                  FamilyCare treats your family's bereavement details with strict confidentiality. Your contact information is never shared or used for spam.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#00A859] hover:bg-[#072A1A] text-white font-semibold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span>Registering Consultation...</span>
                  ) : (
                    <>
                      <span>Request My Bespoke Consultation</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success State - Strategy Section 10 & Wireframe Page 10 */
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="p-4 rounded-2xl bg-[#E8F8F0] border border-[#BCE8D1] flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-[#00A859] text-white">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-editorial text-2xl font-bold text-[#072A1A]">
                      Thank You, {submittedLead.identity.name}.
                    </h4>
                    <p className="text-xs sm:text-sm text-[#072A1A]/80 mt-1">
                      Your enquiry has been received into FamilyCare’s dedicated Bespoke pipeline. An advisor has been notified.
                    </p>
                    <div className="mt-2 text-xs font-mono font-bold text-[#00A859]">
                      Reference: {submittedLead.leadId}
                    </div>
                  </div>
                </div>

                {/* What Happens Next - Step Clarity */}
                <div className="border border-[#DDD7C6] rounded-2xl p-5 bg-[#FAF8F5] space-y-3">
                  <h5 className="font-semibold text-xs text-[#18181B] uppercase tracking-wider">
                    What happens next:
                  </h5>
                  <ul className="text-xs text-[#52525B] space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A859] mt-1.5 shrink-0" />
                      <span>An advisor will review your requested items (<strong>{submittedLead.qualification.need_type.join(', ')}</strong>) for {submittedLead.qualification.location}.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3A55A3] mt-1.5 shrink-0" />
                      <span>We will contact you via your preferred route (<strong>{submittedLead.qualification.preferred_next_step}</strong>) within our standard response window.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A859] mt-1.5 shrink-0" />
                      <span>You will receive an itemized, transparent draft proposal to discuss with other family decision-makers.</span>
                    </li>
                  </ul>
                </div>

                {/* Immediate Conversion Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#00A859] hover:bg-[#072A1A] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Right Now</span>
                  </a>

                  <a
                    href="tel:+233302789123"
                    className="py-3 px-4 rounded-xl border border-[#3A55A3] bg-[#EEF2FC] hover:bg-[#DCE5FA] text-[#3A55A3] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Advisor Directly</span>
                  </a>
                </div>

                {/* Inspect Lead CRM Payload */}
                <div className="pt-2 border-t border-[#E7E2D6]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-zinc-500 uppercase">
                      Audited CRM Payload (Dispatched to Pipeline)
                    </span>
                    <button
                      onClick={copyLeadJson}
                      className="text-[11px] text-zinc-600 hover:text-zinc-900 flex items-center gap-1 bg-[#F2EFE9] px-2 py-1 rounded"
                    >
                      {copiedPayload ? <Check className="w-3 h-3 text-[#00A859]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPayload ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-zinc-900 text-zinc-200 text-[10px] font-mono rounded-xl overflow-x-auto max-h-36">
                    {JSON.stringify(submittedLead, null, 2)}
                  </pre>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setSubmittedLead(null);
                      setFormData({
                        name: '',
                        phone_whatsapp: '',
                        location: '',
                        need_type: ['Full Bespoke Arrangement'],
                        timing: '',
                        preferred_next_step: 'WhatsApp conversation',
                        email: '',
                        budget_indicator: 'Prefer to discuss during consultation',
                        notes: ''
                      });
                    }}
                    className="text-xs text-[#3A55A3] hover:underline"
                  >
                    Submit another consultation enquiry
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (5 Columns): Direct WhatsApp Concierge Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary WhatsApp Concierge Card */}
            <div className="bg-white rounded-3xl border-2 border-[#00A859]/30 p-6 sm:p-7 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A859]/5 rounded-bl-full pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#E8F8F0] text-[#00A859]">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#00A859] uppercase tracking-wider block">
                        Conversational Sales Layer
                      </span>
                      <h4 className="font-editorial text-xl font-bold text-[#18181B]">
                        WhatsApp FamilyCare
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#072A1A] text-[10px] font-bold">
                    98.4% Ghana Reach
                  </span>
                </div>

                <p className="text-xs text-[#52525B] leading-relaxed">
                  Prefer a direct chat? Start a private conversation with a FamilyCare advisor right now. Your selected tailoring brief and enquiry intent are pre-formatted automatically.
                </p>

                {/* Live Message Preview Bubble */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Live Pre-Filled Message Preview:
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#E8F8F0]/70 border border-[#BCE8D1] text-xs text-[#072A1A] font-sans leading-relaxed relative">
                    <div className="absolute top-2 right-2 text-[10px] text-emerald-700 font-mono">
                      WhatsApp Draft
                    </div>
                    "Hello FamilyCare, I would like to discuss a Contract / Bespoke funeral arrangement
                    {formData.name ? ` for ${formData.name}` : ''}. I would like help understanding the next steps and shaping a tribute around our family's wishes.
                    {formData.location ? ` Location: ${formData.location}.` : ''}
                    {formData.need_type.length > 0 ? ` Key areas: ${formData.need_type.join(', ')}.` : ''}
                    {channelName ? ` (Ref: ${channelName})` : ''}"
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    onLogEvent({
                      event: 'whatsapp_click',
                      label: 'User clicked Direct WhatsApp Concierge Button',
                      section: 'Enquiry & WhatsApp'
                    })
                  }
                  className="w-full py-3.5 px-4 rounded-xl bg-[#00A859] hover:bg-[#072A1A] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp FamilyCare Now</span>
                </a>
              </div>
            </div>

            {/* Direct Telephone Consultation Card */}
            <div className="bg-white rounded-3xl border border-[#DDD7C6] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#EEF2FC] text-[#3A55A3]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-editorial text-lg font-bold text-[#18181B]">
                    Direct Telephone Line
                  </h4>
                  <div className="text-xs text-[#52525B]">
                    Speak with a duty advisor immediately
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2D6] space-y-1">
                <div className="text-xs text-[#52525B]">National Consultation &amp; Protocol Desk:</div>
                <div className="font-mono text-base font-bold text-[#18181B] flex items-center justify-between">
                  <span>+233 (0)30 278 9123</span>
                  <a
                    href="tel:+233302789123"
                    onClick={() =>
                      onLogEvent({
                        event: 'phone_click',
                        label: 'User tapped National Desk phone number',
                        section: 'Enquiry & WhatsApp'
                      })
                    }
                    className="text-xs font-sans text-[#3A55A3] hover:underline"
                  >
                    Tap to Call
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#52525B]">
                <Clock className="w-3.5 h-3.5 text-[#00A859]" />
                <span>Advisors on call 24 hours a day, 7 days a week</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
