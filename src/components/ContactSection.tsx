import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Building,
  Headphones,
  WifiOff,
  HardDrive,
  Edit3,
  Copy,
  Check
} from 'lucide-react';
import { COMPANY_CONFIG } from '../data/config';
import { useAuth } from '../context/AuthContext';
import { submitEnquiryToFirestore } from '../services/firestoreService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { queueOfflineEnquiry } from '../services/offlineSyncService';
import { useSiteContent } from '../context/SiteContentContext';
import {
  formatEnquiryWhatsAppMessage,
  getWhatsAppUrl,
  OWNER_WHATSAPP_RAW,
  OWNER_WHATSAPP_DISPLAY
} from '../lib/whatsapp';

export interface ContactEnquiryData {
  id: string;
  userId?: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
  submittedAt: string;
}

interface ContactSectionProps {
  onEnquirySubmitted?: (enquiry: ContactEnquiryData) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onEnquirySubmitted }) => {
  const { user } = useAuth();
  const { content, isEditMode, openEditor } = useSiteContent();
  const contact = content.contact;
  const isOnline = useOnlineStatus();
  const [form, setForm] = useState({
    name: user?.displayName || '',
    company: '',
    phone: '',
    email: user?.email || '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const [lastFormattedMessage, setLastFormattedMessage] = useState('');
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState('');
  const [copiedDetails, setCopiedDetails] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.company.trim()) errs.company = 'Company name is required';
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9+\s-]{8,15}$/.test(form.phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!form.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.message.trim()) errs.message = 'Enquiry message is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const enquiry: ContactEnquiryData = {
      id: 'ENQ-' + Math.floor(100000 + Math.random() * 900000),
      userId: user?.uid,
      ...form,
      submittedAt: new Date().toLocaleString(),
    };

    // Format full details for direct WhatsApp transmission to owner (+91 80531 26441)
    const waMessage = formatEnquiryWhatsAppMessage(enquiry);
    const waUrl = getWhatsAppUrl(waMessage, OWNER_WHATSAPP_RAW);
    setWhatsAppUrl(waUrl);
    setLastFormattedMessage(waMessage);
    setSubmittedEnquiryId(enquiry.id);

    if (!isOnline) {
      // Save to offline queue
      queueOfflineEnquiry(enquiry);
      setSavedOffline(true);
    } else {
      // 1. Submit to Firestore
      try {
        await submitEnquiryToFirestore(enquiry, user?.uid);
        setSavedOffline(false);
      } catch (err) {
        console.warn('Could not persist enquiry to Firestore, falling back to offline queue:', err);
        queueOfflineEnquiry(enquiry);
        setSavedOffline(true);
      }
    }

    // 2. Local fallback storage for dashboard view
    try {
      const stored = localStorage.getItem('outshipper_enquiries');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(enquiry);
      localStorage.setItem('outshipper_enquiries', JSON.stringify(list));
    } catch {
      // Safe fallback
    }

    if (onEnquirySubmitted) {
      onEnquirySubmitted(enquiry);
    }

    setIsSuccess(true);
    setSubmitting(false);

    // Direct WhatsApp transmission to Owner
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyDetails = () => {
    if (lastFormattedMessage) {
      navigator.clipboard.writeText(lastFormattedMessage);
      setCopiedDetails(true);
      setTimeout(() => setCopiedDetails(false), 2500);
    }
  };

  const resetForm = () => {
    setForm({ name: '', company: '', phone: '', email: '', message: '' });
    setIsSuccess(false);
    setSavedOffline(false);
    setWhatsAppUrl('');
    setLastFormattedMessage('');
    setSubmittedEnquiryId('');
    setCopiedDetails(false);
    setErrors({});
  };

  return (
    <section id="contact" className="py-20 bg-[#070F1E] border-b border-slate-800 text-white relative group">
      {/* Owner In-Place Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => openEditor('contact')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-md border border-orange-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Contact & Office Info</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0A1526] border border-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Headphones className="w-3.5 h-3.5 text-orange-400" />
            <span>24/7 Logistics Coordination</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {contact.heading}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            {contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Cards & Quick Action Buttons */}
          <div className="lg:col-span-5 space-y-6">
            {!isOnline && (
              <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-amber-300 text-xs flex items-center gap-2.5">
                <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  <strong>Offline Mode:</strong> Emergency phone lines and WhatsApp contacts are pre-cached and can be dialed directly without internet.
                </span>
              </div>
            )}

            {/* Office Address Card */}
            <div className="p-5 rounded-xl bg-[#0D1B2E] border border-slate-800 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-red-950/80 text-[#E60023] border border-red-900/60 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-display">
                      Registered Corporate Office
                    </h4>
                    <span className="text-[10px] font-mono text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900/60">
                      CIN: {COMPANY_CONFIG.cin}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {COMPANY_CONFIG.address.full}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5 italic">
                    For transportation enquiries, business partnerships and logistics requirements, contact our team through the verified contact details published below.
                  </p>
                </div>
              </div>
            </div>

            {/* Phone & Hotline Card */}
            <div className="p-5 rounded-xl bg-[#0D1B2E] border border-slate-800 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-red-950/80 text-[#E60023] border border-red-900/60 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    Phone &amp; Transportation Hotline
                  </h4>
                  <div className="text-xs text-slate-300 mt-1 space-y-0.5">
                    <div>Direct Contact: <strong className="text-white tabular-nums">{COMPANY_CONFIG.phoneDisplay}</strong></div>
                    <div>WhatsApp Desk: <strong className="text-emerald-400 tabular-nums">{COMPANY_CONFIG.whatsappDisplay}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="p-5 rounded-xl bg-[#0D1B2E] border border-slate-800 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-red-950/80 text-[#E60023] border border-red-900/60 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    Corporate Email Enquiries
                  </h4>
                  <div className="text-xs text-slate-300 mt-1 space-y-0.5">
                    <div>Business &amp; Freight: <a href={`mailto:${COMPANY_CONFIG.email}`} className="text-white font-bold hover:underline">{COMPANY_CONFIG.email}</a></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="p-5 rounded-xl bg-[#0D1B2E] border border-slate-800 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-red-950/80 text-[#E60023] border border-red-900/60 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    Operating &amp; Dispatch Hours
                  </h4>
                  <div className="text-xs text-slate-300 mt-1 space-y-0.5">
                    <div>Coordination Desk: <strong className="text-emerald-400">{COMPANY_CONFIG.businessHours.dispatchDesk}</strong></div>
                    <div>Office Hours: <span className="text-slate-200">{COMPANY_CONFIG.businessHours.office} ({COMPANY_CONFIG.businessHours.days})</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Required Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              {/* Call Now */}
              <a
                href={`tel:${COMPANY_CONFIG.phone}`}
                className="py-3 px-3 bg-[#E60023] hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>Call Now</span>
              </a>

              {/* WhatsApp Us */}
              <a
                href={`https://wa.me/${COMPANY_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>

              {/* Get Directions */}
              <a
                href={COMPANY_CONFIG.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 bg-[#0A1526] hover:bg-slate-800 text-slate-200 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700 text-center"
              >
                <MapPin className="w-4 h-4 text-[#E60023]" />
                <span>Get Directions</span>
              </a>

              {/* Send Email */}
              <a
                href={`mailto:${COMPANY_CONFIG.email}?subject=Transportation%20Inquiry%20-%20Outshipper`}
                className="py-3 px-3 bg-[#0A1526] hover:bg-slate-800 text-slate-200 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700 text-center"
              >
                <Mail className="w-4 h-4 text-[#E60023]" />
                <span>Send Email</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            {isSuccess ? (
              <div className="text-center py-8 space-y-4 animate-in fade-in duration-200">
                <div className={`w-14 h-14 ${savedOffline ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} rounded-full flex items-center justify-center mx-auto`}>
                  {savedOffline ? <HardDrive className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
                </div>

                <div className="space-y-1">
                  {submittedEnquiryId && (
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded">
                      ENQUIRY REFERENCE: #{submittedEnquiryId}
                    </span>
                  )}
                  <h3 className="text-xl font-bold font-display text-slate-900 pt-2">
                    {savedOffline ? 'Enquiry Queued Offline' : 'Enquiry Transmitted to Dispatch Team'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {savedOffline ? (
                      <>
                        Thank you, <strong>{form.name}</strong>. Because network connectivity is currently limited, your enquiry for <strong>{form.company}</strong> has been stored safely in your device’s offline queue. It will automatically upload to Outshipper Private Limited as soon as your connection returns.
                      </>
                    ) : (
                      <>
                        Thank you, <strong>{form.name}</strong>. Your enquiry for <strong>{form.company}</strong> has been logged in real-time. An operational lead will get back to you promptly.
                      </>
                    )}
                  </p>
                </div>

                {/* Direct WhatsApp To Owner Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 border-2 border-emerald-500/40 text-emerald-950 text-left max-w-md mx-auto space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                          Direct WhatsApp to Outshipper Owner
                        </h4>
                        <p className="text-[11px] text-emerald-700 font-medium">
                          Forwarded to Owner: <strong>{OWNER_WHATSAPP_DISPLAY}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-200/90 text-emerald-900 px-2 py-0.5 rounded font-mono">
                      Owner Alert
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Your complete enquiry message has been formatted. Click below to message the owner directly on WhatsApp or re-open the chat window.
                  </p>

                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <a
                      href={whatsAppUrl || `https://wa.me/${OWNER_WHATSAPP_RAW}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs text-center cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat with Owner on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyDetails}
                      className="py-2.5 px-3 bg-white hover:bg-emerald-100/60 border border-emerald-300 text-emerald-900 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedDetails ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Copy Details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="border-b border-slate-200 pb-3 mb-2 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base font-display">
                    Send Us an Enquiry
                  </h3>
                  <span className="text-slate-500 text-[11px]">* Required fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Vikram Singhania"
                      className={`w-full p-2.5 bg-white border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-[11px] mt-0.5">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Your organization / firm"
                      className={`w-full p-2.5 bg-white border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.company ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.company && <p className="text-red-500 text-[11px] mt-0.5">{errors.company}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98100 23456"
                      className={`w-full p-2.5 bg-white border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-[11px] mt-0.5">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="vikram@company.com"
                      className={`w-full p-2.5 bg-white border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-[11px] mt-0.5">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Message / Transport Requirement *
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your freight requirements, frequent routes, or warehouse distribution inquiry..."
                    className={`w-full p-2.5 bg-white border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                      errors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                  {errors.message && <p className="text-red-500 text-[11px] mt-0.5">{errors.message}</p>}
                </div>

                {/* Instant Owner WhatsApp Notification Notice */}
                <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-lg text-emerald-950 text-xs flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900 block">
                      ⚡ Instant Owner Alert on WhatsApp:
                    </span>
                    <span className="text-emerald-700 text-[11px] leading-relaxed">
                      Submitting this enquiry will immediately format and forward your message directly to Outshipper Owner ({OWNER_WHATSAPP_DISPLAY}) via WhatsApp.
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#E60023] hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 text-sm"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 text-white" />
                        <span>Send Enquiry &amp; Message Owner via WhatsApp</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
