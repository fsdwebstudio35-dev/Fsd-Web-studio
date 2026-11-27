import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { buildMailtoUrl, buildWhatsAppUrl, STUDIO_CONFIG } from '../config/studioConfig';
import {
  SERVICE_CONTACT_PROFILES,
  SERVICES,
  STUDIO_IMAGES,
} from '../data/studioData';
import { ImageWithFallback } from '../components/ImageWithFallback';
import {
  EASE_AGENCY,
  LetterReveal,
  MagneticButton,
  MagneticLink,
  Reveal,
  useIsFinePointer,
} from '../components/MotionSystem';

interface ContactPageProps {
  preselectedService?: string;
}

interface FormValues {
  name: string;
  email: string;
  whatsapp: string;
  businessName: string;
  projectType: string;
  budget: string;
  description: string;
  selectedScopes: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  whatsapp?: string;
  businessName?: string;
  projectType?: string;
  budget?: string;
  description?: string;
}

const SERVICE_OPTIONS = SERVICES.map((s) => s.title);

export const ContactPage: React.FC<ContactPageProps> = ({
  preselectedService = '',
}) => {
  const isFine = useIsFinePointer();
  const initialService =
    preselectedService && SERVICE_CONTACT_PROFILES[preselectedService]
      ? preselectedService
      : SERVICES[0].title;

  const initialProfile = SERVICE_CONTACT_PROFILES[initialService];

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    whatsapp: '',
    businessName: '',
    projectType: initialService,
    budget: initialProfile.budgetOptions[1],
    description: '',
    selectedScopes: [initialProfile.scopeTags[0]],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const [orderMeta, setOrderMeta] = useState<{
    orderCode: string;
    emailSent: boolean;
    recipientEmail: string;
  } | null>(null);

  const activeProfile =
    SERVICE_CONTACT_PROFILES[values.projectType] ??
    SERVICE_CONTACT_PROFILES[SERVICES[0].title];

  const activeServiceItem = SERVICES.find(
    (s) => s.title === activeProfile.serviceTitle
  );
  const activeServiceImage =
    activeServiceItem?.image || STUDIO_IMAGES.aboutWorkspace;

  const selectService = (serviceTitle: string) => {
    const profile =
      SERVICE_CONTACT_PROFILES[serviceTitle] ??
      SERVICE_CONTACT_PROFILES[SERVICES[0].title];

    setSubmittedData(null);
    setOrderMeta(null);
    setSubmitError('');
    setErrors({});
    setValues((prev) => ({
      ...prev,
      projectType: serviceTitle,
      budget: profile.budgetOptions[1] ?? profile.budgetOptions[0],
      selectedScopes: [profile.scopeTags[0]],
    }));
  };

  useEffect(() => {
    if (preselectedService && SERVICE_CONTACT_PROFILES[preselectedService]) {
      selectService(preselectedService);
    }
  }, [preselectedService]);

  const validate = (form: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    const digitsOnly = form.whatsapp.replace(/[^\d]/g, '');
    if (!form.whatsapp.trim() || digitsOnly.length < 7 || digitsOnly.length > 15) {
      nextErrors.whatsapp =
        'Please enter a valid WhatsApp number with country code (7–15 digits).';
    }

    if (!form.businessName.trim() || form.businessName.trim().length < 2) {
      nextErrors.businessName = 'Please enter your business or project name.';
    }

    if (!form.projectType) {
      nextErrors.projectType = 'Please select a project type.';
    }

    if (!form.budget) {
      nextErrors.budget = 'Please choose an estimated budget range.';
    }

    if (!form.description.trim() || form.description.trim().length < 15) {
      nextErrors.description =
        'Please enter at least 15 characters describing your project.';
    }

    return nextErrors;
  };

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    if (field === 'projectType') {
      selectService(value);
      return;
    }
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleScope = (tag: string) => {
    setValues((prev) => {
      const exists = prev.selectedScopes.includes(tag);
      return {
        ...prev,
        selectedScopes: exists
          ? prev.selectedScopes.filter((item) => item !== tag)
          : [...prev.selectedScopes, tag],
      };
    });
  };

  const formatWhatsAppInquiry = (data: FormValues): string => {
    return [
      `Hello ${STUDIO_CONFIG.brandName},`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `WhatsApp: ${data.whatsapp}`,
      `Business: ${data.businessName}`,
      `Project Type: ${data.projectType}`,
      `Budget: ${data.budget}`,
      `Scope: ${data.selectedScopes.join(', ') || 'Standard'}`,
      `Description: ${data.description}`,
    ].join('\n');
  };

  const formatOrderEmailBody = (data: FormValues, orderCode?: string): string => {
    return [
      `Hello ${STUDIO_CONFIG.brandName},`,
      '',
      ...(orderCode ? [`Order Reference: ${orderCode}`] : []),
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `WhatsApp: ${data.whatsapp}`,
      `Business: ${data.businessName}`,
      `Project Type: ${data.projectType}`,
      `Budget: ${data.budget}`,
      `Key Features: ${data.selectedScopes.join(', ') || 'Standard'}`,
      '',
      'Project Description:',
      data.description,
    ].join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        orderCode?: string;
        emailSent?: boolean;
        recipientEmail?: string;
      };

      if (!response.ok) {
        setSubmitError(
          payload.error || 'Could not submit your order right now. Please try again.'
        );
        return;
      }

      setOrderMeta({
        orderCode: payload.orderCode || 'ORD-STUDIO',
        emailSent: Boolean(payload.emailSent),
        recipientEmail: payload.recipientEmail || STUDIO_CONFIG.email,
      });
      setSubmittedData(values);
    } catch {
      setSubmitError(
        'Network error while submitting your order. Please try again or use WhatsApp/Email directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setOrderMeta(null);
    setSubmitError('');
    setValues((prev) => ({
      ...prev,
      name: '',
      email: '',
      whatsapp: '',
      businessName: '',
      description: '',
    }));
    setErrors({});
  };

  const directWhatsappUrl = buildWhatsAppUrl(
    `Hello ${STUDIO_CONFIG.brandName}, I am interested in ${values.projectType} (${values.budget}).`
  );

  const preparedWhatsappUrl = submittedData
    ? buildWhatsAppUrl(formatWhatsAppInquiry(submittedData))
    : directWhatsappUrl;

  const preparedMailtoUrl = submittedData
    ? buildMailtoUrl(
        `New Order${orderMeta?.orderCode ? ` [${orderMeta.orderCode}]` : ''} — ${submittedData.projectType} (${submittedData.businessName})`,
        formatOrderEmailBody(submittedData, orderMeta?.orderCode)
      )
    : buildMailtoUrl(
        `Project Inquiry — ${values.projectType}`,
        formatOrderEmailBody(values)
      );

  const inputBaseClass =
    'w-full h-12 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] placeholder:text-[#101B16]/45 focus:outline-none focus:ring-2 transition-all duration-200';

  return (
    <div className="bg-white text-[#101B16]">
      {/* Page Header & Dynamic Service Selector */}
      <section className="pt-10 pb-8 lg:pt-14 lg:pb-10 border-b border-[#101B16]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/60 mb-2.5">
              Select Project Type
            </p>
            <div
              role="tablist"
              aria-label="Project inquiry categories"
              className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
            >
              {SERVICE_OPTIONS.map((title) => {
                const isSelected = values.projectType === title;
                return (
                  <button
                    key={title}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => selectService(title)}
                    className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isSelected
                        ? 'text-white'
                        : 'bg-[#F4F6F4] text-[#101B16] hover:bg-[#e5eae5]'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="contact-service-pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 bg-[#101B16] rounded-full"
                      />
                    )}
                    <span className="relative z-10">
                      <LetterReveal text={title} trigger="mount" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProfile.serviceTitle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: EASE_AGENCY }}
                className="lg:col-span-7"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-2">
                  <LetterReveal text={activeProfile.kicker} trigger="mount" />
                </p>
                <h1
                  className="font-display font-extrabold text-[#101B16] tracking-tight leading-[1.08] text-balance"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.25rem)' }}
                >
                  <LetterReveal
                    text={activeProfile.headline}
                    trigger="mount"
                    delay={0.04}
                    stagger={0.018}
                  />
                </h1>
                <p className="mt-4 text-base sm:text-lg text-[#101B16]/75 leading-relaxed">
                  <LetterReveal text={activeProfile.subheadline} trigger="mount" delay={0.18} />
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfile.serviceTitle}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: EASE_AGENCY }}
                  className="group relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#101B16] border border-[#101B16]/10 shadow-md"
                >
                  <ImageWithFallback
                    src={activeServiceImage}
                    alt={`${activeProfile.serviceTitle} project preview`}
                    loading="eager"
                    fallbackTitle={activeProfile.serviceTitle}
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#101B16]/80 via-[#101B16]/20 to-transparent"
                  />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2 text-white">
                    <span className="font-display font-bold text-sm">
                      {activeProfile.serviceTitle}
                    </span>
                    <span className="text-xs font-semibold text-[#B9F6CA]">
                      {activeProfile.budgetOptions[1] ?? activeProfile.budgetOptions[0]}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Form & Channels Grid (Soft Gray #F4F6F4) */}
      <section className="py-12 lg:py-16 bg-[#F4F6F4]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Inquiry Form Card */}
            <Reveal direction="right" className="lg:col-span-7">
              <div className="rounded-2xl bg-white border border-[#101B16]/10 p-6 sm:p-8 lg:p-9 shadow-[0_6px_28px_rgba(16,27,22,0.05)]">
                <AnimatePresence mode="wait">
                  {submittedData ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.97, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97, y: -12 }}
                      transition={{ duration: 0.3, ease: EASE_AGENCY }}
                      className="py-4 space-y-6"
                      role="status"
                      aria-live="polite"
                    >
                      <motion.div
                        initial={{ scale: 0.7, rotate: -12 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 20 }}
                        className="w-12 h-12 rounded-full bg-[#B9F6CA] text-[#101B16] flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                      </motion.div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/60">
                          <LetterReveal
                            text={
                              orderMeta?.orderCode
                                ? `Order Recorded · ${orderMeta.orderCode}`
                                : 'Order Prepared'
                            }
                            trigger="mount"
                          />
                        </p>
                        <h2 className="font-display font-extrabold text-2xl text-[#101B16] mt-1">
                          <LetterReveal text={`Thank you, ${submittedData.name}`} trigger="mount" />
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-[#101B16]/75 leading-relaxed">
                          {orderMeta?.emailSent ? (
                            <>
                              Your order for{' '}
                              <span className="font-bold text-[#101B16]">
                                {submittedData.projectType}
                              </span>{' '}
                              has been sent directly to{' '}
                              <span className="font-bold text-[#101B16]">
                                {orderMeta.recipientEmail}
                              </span>
                              . You can also send a copy on WhatsApp or your email app below.
                            </>
                          ) : (
                            <>
                              Your order for{' '}
                              <span className="font-bold text-[#101B16]">
                                {submittedData.projectType}
                              </span>{' '}
                              is validated and saved. Send it directly via{' '}
                              <span className="font-bold text-[#101B16]">
                                {orderMeta?.recipientEmail || STUDIO_CONFIG.email}
                              </span>{' '}
                              or WhatsApp below.
                            </>
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#F4F6F4] p-5 space-y-2.5 text-sm">
                        {orderMeta?.orderCode && (
                          <div className="flex justify-between gap-4">
                            <span className="text-[#101B16]/65">Order Reference</span>
                            <span className="font-mono font-bold text-[#101B16] text-right">
                              {orderMeta.orderCode}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between gap-4">
                          <span className="text-[#101B16]/65">Business</span>
                          <span className="font-semibold text-[#101B16] text-right">
                            {submittedData.businessName}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#101B16]/65">Project Type</span>
                          <span className="font-semibold text-[#101B16] text-right">
                            {submittedData.projectType}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#101B16]/65">Budget</span>
                          <span className="font-semibold text-[#101B16] tabular-nums text-right">
                            {submittedData.budget}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#101B16]/65">WhatsApp</span>
                          <span className="font-semibold text-[#101B16] tabular-nums text-right">
                            {submittedData.whatsapp}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#101B16] text-white p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#B9F6CA] mb-2">
                          Order Summary ({orderMeta?.recipientEmail || STUDIO_CONFIG.email})
                        </p>
                        <pre className="text-xs text-white/85 whitespace-pre-wrap font-sans leading-relaxed">
                          {formatOrderEmailBody(submittedData, orderMeta?.orderCode)}
                        </pre>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <MagneticLink
                          href={preparedMailtoUrl}
                          className="group h-12 px-6 rounded-full bg-[#101B16] hover:bg-[#1c2e26] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors"
                        >
                          <Mail className="w-4 h-4 text-[#B9F6CA]" aria-hidden="true" />
                          <LetterReveal text="Send Order via Email" trigger="mount" />
                          <ArrowUpRight
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </MagneticLink>

                        <MagneticLink
                          href={preparedWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group h-12 px-6 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] text-sm font-bold inline-flex items-center gap-2 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" aria-hidden="true" />
                          <LetterReveal text="Send on WhatsApp" trigger="mount" />
                          <ArrowUpRight
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </MagneticLink>

                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={handleReset}
                          className="h-12 px-6 rounded-full bg-[#F4F6F4] hover:bg-[#e5eae5] text-[#101B16] text-sm font-bold transition-colors cursor-pointer"
                        >
                          <LetterReveal text="New Order" trigger="mount" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-5"
                    >
                      <div className="pb-4 border-b border-[#101B16]/10 flex items-center justify-between gap-4">
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#101B16]">
                          <LetterReveal text={activeProfile.formHeading} trigger="mount" />
                        </h2>
                        <span className="text-xs text-[#101B16]/55 whitespace-nowrap">
                          * Required
                        </span>
                      </div>

                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            Name *
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            value={values.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            placeholder="Your full name"
                            aria-invalid={Boolean(errors.name)}
                            className={`${inputBaseClass} ${
                              errors.name
                                ? 'ring-2 ring-red-600/50 bg-red-50'
                                : 'focus:ring-[#101B16]/35 focus:bg-white focus:shadow-[0_4px_14px_rgba(16,27,22,0.06)]'
                            }`}
                          />
                          <AnimatePresence>
                            {errors.name && (
                              <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700"
                              >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>{errors.name}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            Email *
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            value={values.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            placeholder="you@company.com"
                            aria-invalid={Boolean(errors.email)}
                            className={`${inputBaseClass} ${
                              errors.email
                                ? 'ring-2 ring-red-600/50 bg-red-50'
                                : 'focus:ring-[#101B16]/35 focus:bg-white focus:shadow-[0_4px_14px_rgba(16,27,22,0.06)]'
                            }`}
                          />
                          <AnimatePresence>
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700"
                              >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>{errors.email}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* WhatsApp & Business Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-whatsapp"
                            className="block text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            WhatsApp Number *
                          </label>
                          <input
                            id="contact-whatsapp"
                            type="tel"
                            value={values.whatsapp}
                            onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                            placeholder="+1 555 234 5678"
                            aria-invalid={Boolean(errors.whatsapp)}
                            className={`${inputBaseClass} ${
                              errors.whatsapp
                                ? 'ring-2 ring-red-600/50 bg-red-50'
                                : 'focus:ring-[#101B16]/35 focus:bg-white focus:shadow-[0_4px_14px_rgba(16,27,22,0.06)]'
                            }`}
                          />
                          <AnimatePresence>
                            {errors.whatsapp && (
                              <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700"
                              >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>{errors.whatsapp}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        <div>
                          <label
                            htmlFor="contact-businessName"
                            className="block text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            Business Name *
                          </label>
                          <input
                            id="contact-businessName"
                            type="text"
                            value={values.businessName}
                            onChange={(e) =>
                              handleFieldChange('businessName', e.target.value)
                            }
                            placeholder="Your company or brand"
                            aria-invalid={Boolean(errors.businessName)}
                            className={`${inputBaseClass} ${
                              errors.businessName
                                ? 'ring-2 ring-red-600/50 bg-red-50'
                                : 'focus:ring-[#101B16]/35 focus:bg-white focus:shadow-[0_4px_14px_rgba(16,27,22,0.06)]'
                            }`}
                          />
                          <AnimatePresence>
                            {errors.businessName && (
                              <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700"
                              >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>{errors.businessName}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Project Type & Budget */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-projectType"
                            className="block text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            Project Type *
                          </label>
                          <select
                            id="contact-projectType"
                            value={values.projectType}
                            onChange={(e) =>
                              handleFieldChange('projectType', e.target.value)
                            }
                            className="w-full h-12 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/35 focus:bg-white transition-all"
                          >
                            {SERVICE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="contact-budget"
                            className="block text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            Budget *
                          </label>
                          <select
                            id="contact-budget"
                            value={values.budget}
                            onChange={(e) => handleFieldChange('budget', e.target.value)}
                            className="w-full h-12 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/35 focus:bg-white transition-all tabular-nums"
                          >
                            {activeProfile.budgetOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Scope Features */}
                      <div>
                        <span className="block text-xs font-bold text-[#101B16] mb-2">
                          Key Features Needed
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeProfile.scopeTags.map((tag) => {
                            const isChecked = values.selectedScopes.includes(tag);
                            return (
                              <motion.button
                                key={tag}
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleScope(tag)}
                                aria-pressed={isChecked}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                  isChecked
                                    ? 'bg-[#101B16] text-[#B9F6CA]'
                                    : 'bg-[#F4F6F4] text-[#101B16] hover:bg-[#e5eae5]'
                                }`}
                              >
                                {isChecked && (
                                  <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                )}
                                <span>{tag}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Project Description */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="contact-description"
                            className="block text-xs font-bold text-[#101B16]"
                          >
                            Project Description *
                          </label>
                          <span className="text-[11px] text-[#101B16]/50 tabular-nums">
                            {values.description.length} chars
                          </span>
                        </div>
                        <textarea
                          id="contact-description"
                          rows={4}
                          value={values.description}
                          onChange={(e) =>
                            handleFieldChange('description', e.target.value)
                          }
                          placeholder={activeProfile.descriptionPlaceholder}
                          aria-invalid={Boolean(errors.description)}
                          className={`w-full p-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] placeholder:text-[#101B16]/45 focus:outline-none focus:ring-2 transition-all duration-200 resize-y ${
                            errors.description
                              ? 'ring-2 ring-red-600/50 bg-red-50'
                              : 'focus:ring-[#101B16]/35 focus:bg-white focus:shadow-[0_4px_14px_rgba(16,27,22,0.06)]'
                          }`}
                        />
                        <AnimatePresence>
                          {errors.description && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700"
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              <span>{errors.description}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {submitError && (
                        <p className="flex items-center gap-1.5 text-xs text-red-700">
                          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>{submitError}</span>
                        </p>
                      )}

                      {/* Submit + Direct Email & WhatsApp */}
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <MagneticButton
                          type="submit"
                          disabled={isSubmitting}
                          className="group h-12 px-5 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] disabled:opacity-60 text-[#101B16] text-sm font-bold inline-flex items-center justify-center gap-2 border border-[#101B16]/10 shadow-sm hover:shadow-[0_10px_24px_rgba(185,246,202,0.48)] transition-all whitespace-nowrap cursor-pointer"
                        >
                          <Send
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                          <LetterReveal
                            text={isSubmitting ? 'Sending Order...' : 'Submit Order'}
                            trigger="mount"
                          />
                          {!isSubmitting && (
                            <ArrowRight
                              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          )}
                        </MagneticButton>

                        <MagneticLink
                          href={preparedMailtoUrl}
                          className="group h-12 px-5 rounded-full bg-[#F4F6F4] hover:bg-[#e5eae5] text-[#101B16] text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                        >
                          <Mail
                            className="w-4 h-4 text-[#101B16] transition-transform duration-200 group-hover:scale-110"
                            aria-hidden="true"
                          />
                          <LetterReveal text="Send by Email" trigger="mount" />
                        </MagneticLink>

                        <MagneticLink
                          href={directWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group h-12 px-5 rounded-full bg-[#101B16] hover:bg-[#1c2e26] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                        >
                          <MessageCircle
                            className="w-4 h-4 text-[#B9F6CA] transition-transform duration-200 group-hover:scale-110"
                            aria-hidden="true"
                          />
                          <LetterReveal text="WhatsApp Direct" trigger="mount" />
                        </MagneticLink>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            {/* Right Sidebar: Included Highlights + WhatsApp + Email */}
            <Reveal direction="left" delay={0.08} className="lg:col-span-5 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfile.serviceTitle}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: EASE_AGENCY }}
                  whileHover={isFine ? { y: -3 } : undefined}
                  className="rounded-2xl bg-white border border-[#101B16]/10 p-6 sm:p-7 space-y-4 shadow-[0_4px_20px_rgba(16,27,22,0.03)] hover:shadow-[0_14px_30px_rgba(16,27,22,0.07)] transition-shadow"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/60">
                    <LetterReveal text={`${activeProfile.serviceTitle} Scope`} trigger="mount" />
                  </p>
                  <h3 className="font-display font-bold text-xl text-[#101B16]">
                    <LetterReveal text="Included in This Service" trigger="mount" />
                  </h3>
                  <ul className="space-y-3">
                    {activeProfile.includedHighlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-[#101B16]/80"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#B9F6CA] text-[#101B16] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" aria-hidden="true" />
                        </span>
                        <LetterReveal text={item} trigger="mount" />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <motion.div
                whileHover={isFine ? { y: -3 } : undefined}
                transition={{ duration: 0.22, ease: EASE_AGENCY }}
                className="relative overflow-hidden rounded-2xl bg-[#101B16] text-white p-6 sm:p-7 space-y-4 shadow-[0_8px_28px_rgba(16,27,22,0.12)]"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <ImageWithFallback
                    src={STUDIO_IMAGES.ctaBackdrop}
                    alt=""
                    className="w-full h-full object-cover opacity-25"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#101B16]/94 via-[#101B16]/88 to-[#101B16]/94" />
                </div>

                <div className="relative space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#B9F6CA]">
                    <LetterReveal text="WhatsApp Consultation" />
                  </p>
                  <h3 className="font-display font-bold text-xl">
                    <LetterReveal text={`Chat Directly With ${STUDIO_CONFIG.brandName}`} />
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    <LetterReveal text={activeProfile.whatsappPitch} />
                  </p>
                  <MagneticLink
                    href={directWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-11 px-5 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors w-full"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <LetterReveal text="Chat on WhatsApp" />
                    <ArrowUpRight
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </MagneticLink>
                  <p className="text-xs text-white/70 tabular-nums">
                    {STUDIO_CONFIG.whatsappDisplay}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={isFine ? { y: -3 } : undefined}
                transition={{ duration: 0.22, ease: EASE_AGENCY }}
                className="rounded-2xl bg-white border border-[#101B16]/10 p-6 sm:p-7 space-y-3 shadow-[0_4px_20px_rgba(16,27,22,0.03)] hover:shadow-[0_14px_30px_rgba(16,27,22,0.07)] transition-shadow"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/60">
                  <LetterReveal text="Email Inquiry" />
                </p>
                <a
                  href={preparedMailtoUrl}
                  className="group p-4 rounded-xl bg-[#F4F6F4] hover:bg-[#e5eae5] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-[#101B16] shrink-0" aria-hidden="true" />
                    <span className="text-sm font-bold text-[#101B16] truncate">
                      {STUDIO_CONFIG.email}
                    </span>
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#101B16] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
                <p className="text-xs text-[#101B16]/60">
                  <LetterReveal text={STUDIO_CONFIG.hours} />
                </p>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
