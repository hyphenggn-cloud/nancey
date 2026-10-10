import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  AlertCircle,
  Building,
  HardDrive,
  WifiOff,
  Edit3,
  MessageSquare,
  Send,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { COMPANY_CONFIG } from '../data/config';
import { FLEET_DATA } from '../data/fleetData';
import { useAuth } from '../context/AuthContext';
import { submitQuoteToFirestore } from '../services/firestoreService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { queueOfflineQuote } from '../services/offlineSyncService';
import { useSiteContent } from '../context/SiteContentContext';
import {
  formatQuoteWhatsAppMessage,
  getWhatsAppUrl,
  OWNER_WHATSAPP_DISPLAY,
  OWNER_WHATSAPP_RAW
} from '../lib/whatsapp';

export interface QuoteRequestData {
  id: string;
  userId?: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  pickupLocation: string;
  deliveryLocation: string;
  materialType: string;
  approximateWeight: string;
  vehicleRequirement: string;
  pickupDate: string;
  additionalRequirements: string;
  submittedAt: string;
  status: 'New' | 'In Review' | 'Quoted' | 'Dispatched';
}

interface QuoteSectionProps {
  initialVehicle?: string;
  prefillData?: {
    origin?: string;
    destination?: string;
    cargo?: string;
    weight?: string;
    vehicle?: string;
  } | null;
  onQuoteSubmitted?: (quote: QuoteRequestData) => void;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  initialVehicle = '',
  prefillData,
  onQuoteSubmitted,
}) => {
  const { user } = useAuth();
  const isOnline = useOnlineStatus();
  const { content, isEditMode, openEditor } = useSiteContent();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: user?.displayName || '',
    mobileNumber: '',
    email: user?.email || '',
    pickupLocation: '',
    deliveryLocation: '',
    materialType: '',
    approximateWeight: '',
    vehicleRequirement: initialVehicle || 'Select Vehicle Category',
    pickupDate: '',
    additionalRequirements: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [savedOffline, setSavedOffline] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const [autoRedirectWhatsApp, setAutoRedirectWhatsApp] = useState(true);
  const [copiedDetails, setCopiedDetails] = useState(false);
  const [lastFormattedMessage, setLastFormattedMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        contactPerson: prev.contactPerson || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (initialVehicle) {
      setFormData((prev) => ({ ...prev, vehicleRequirement: initialVehicle }));
    }
  }, [initialVehicle]);

  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        pickupLocation: prefillData.origin || prev.pickupLocation,
        deliveryLocation: prefillData.destination || prev.deliveryLocation,
        materialType: prefillData.cargo || prev.materialType,
        approximateWeight: prefillData.weight || prev.approximateWeight,
        vehicleRequirement: prefillData.vehicle || prev.vehicleRequirement,
      }));
    }
  }, [prefillData]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact person is required';
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.mobileNumber.trim())) {
      errs.mobileNumber = 'Please enter a valid mobile number (e.g. +91 98100 23456)';
    }
    if (!formData.email.trim()) {
      errs.email = 'Business email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid corporate email';
    }
    if (!formData.pickupLocation.trim()) errs.pickupLocation = 'Pickup location is required';
    if (!formData.deliveryLocation.trim()) errs.deliveryLocation = 'Delivery location is required';
    if (!formData.materialType.trim()) errs.materialType = 'Material / cargo type is required';
    if (!formData.approximateWeight.trim()) errs.approximateWeight = 'Approximate weight is required';
    if (formData.vehicleRequirement === 'Select Vehicle Category') {
      errs.vehicleRequirement = 'Please select a vehicle category';
    }
    if (!formData.pickupDate) errs.pickupDate = 'Pickup date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const newQuote: QuoteRequestData = {
      id: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
      userId: user?.uid,
      ...formData,
      submittedAt: new Date().toLocaleString(),
      status: 'New',
    };

    // Format full details for direct WhatsApp transmission to owner (+91 80531 26441)
    const waMessage = formatQuoteWhatsAppMessage(newQuote);
    const waUrl = getWhatsAppUrl(waMessage, OWNER_WHATSAPP_RAW);
    setWhatsAppUrl(waUrl);
    setLastFormattedMessage(waMessage);

    if (!isOnline) {
      queueOfflineQuote(newQuote);
      setSavedOffline(true);
    } else {
      // 1. Submit to Firestore
      try {
        await submitQuoteToFirestore(newQuote, user?.uid);
        setSavedOffline(false);
      } catch (err) {
        console.warn('Could not persist to Firestore directly, queueing offline:', err);
        queueOfflineQuote(newQuote);
        setSavedOffline(true);
      }
    }

    // 2. Local fallback storage
    try {
      const stored = localStorage.getItem('outshipper_quotes');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newQuote);
      localStorage.setItem('outshipper_quotes', JSON.stringify(list));
    } catch {
      // Safe fallback
    }

    if (onQuoteSubmitted) {
      onQuoteSubmitted(newQuote);
    }

    setSubmittedId(newQuote.id);
    setSubmitted(true);
    setSubmitting(false);

    // Direct WhatsApp transmission to Owner
    if (autoRedirectWhatsApp) {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyDetails = () => {
    if (lastFormattedMessage) {
      navigator.clipboard.writeText(lastFormattedMessage);
      setCopiedDetails(true);
      setTimeout(() => setCopiedDetails(false), 2500);
    }
  };

  const handleReset = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      mobileNumber: '',
      email: '',
      pickupLocation: '',
      deliveryLocation: '',
      materialType: '',
      approximateWeight: '',
      vehicleRequirement: 'Select Vehicle Category',
      pickupDate: '',
      additionalRequirements: '',
    });
    setSubmitted(false);
    setSavedOffline(false);
    setWhatsAppUrl('');
    setLastFormattedMessage('');
    setCopiedDetails(false);
    setErrors({});
  };

  return (
    <section id="quote" className="py-20 bg-[#0A1526] text-white border-b border-slate-800 relative group">
      {/* Owner In-Place Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-8 z-30">
          <button
            onClick={() => openEditor('contact')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-md border border-orange-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Quote & Dispatch Info</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Commercial SLA & Assurance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-orange-950/80 border border-orange-800/60 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <span>B2B Commercial Rate Request</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Request a Commercial Freight Quote
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Partner with Outshipper Private Limited for competitive contractual rates, transparent billing, and dedicated vehicle commitments across verified commercial corridors.
            </p>

            {/* Value checklist */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-orange-600/20 border border-orange-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Fast Commercial Quotation SLA
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Our freight dispatch officers review payload and lane parameters to furnish competitive pricing within 2 to 4 business hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-orange-600/20 border border-orange-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Transparent Rate Structure
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clear breakdown of freight, toll tariffs, loading terms, and fuel index with zero hidden end-of-trip surcharges.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-orange-600/20 border border-orange-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <PhoneCall className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Direct Commercial Helpline
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Need urgent vehicle placement for today? Call our priority team directly at{' '}
                    <strong className="text-white tabular-nums">{content.contact.phoneDisplay || COMPANY_CONFIG.phoneDisplay}</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Form or Success State */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            {submitted ? (
              /* Success State */
              <div className="text-center py-8 space-y-5 animate-in fade-in duration-200">
                <div className={`w-16 h-16 rounded-full ${savedOffline ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center mx-auto shadow-sm`}>
                  {savedOffline ? <HardDrive className="w-9 h-9" /> : <CheckCircle2 className="w-9 h-9" />}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded">
                    QUOTATION REFERENCE: #{submittedId}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-slate-900 pt-2">
                    {savedOffline ? 'Quote Request Saved Offline' : 'Quote Request Received Successfully'}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Thank you for contacting Outshipper Private Limited. Our logistics team will review your requirement and contact you shortly.
                  </p>
                  {savedOffline && (
                    <div className="inline-flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs mt-2">
                      <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>
                        Your quote was queued locally because of limited network. Our background service worker will automatically upload it as soon as internet connection returns.
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1 text-slate-700">
                  <div><strong>Company:</strong> {formData.companyName}</div>
                  <div><strong>Contact Person:</strong> {formData.contactPerson} ({formData.mobileNumber})</div>
                  <div><strong>Route:</strong> {formData.pickupLocation} → {formData.deliveryLocation}</div>
                  <div><strong>Vehicle Class:</strong> {formData.vehicleRequirement}</div>
                  <div><strong>Target Pickup:</strong> {formData.pickupDate}</div>
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
                    Your quote details have been generated. Click below to chat directly with the owner on WhatsApp or re-open the message if it did not open automatically.
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

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Another Quote Request
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-3 mb-2 flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-xs">
                    Freight Specification Form
                  </span>
                  <span className="text-slate-400 text-[11px]">* Required fields</span>
                </div>

                {/* Company & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Apex Industrial Solutions Ltd."
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.companyName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.companyName && <p className="text-red-500 text-[11px] mt-0.5">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Name of Dispatch Manager"
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.contactPerson ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.contactPerson && <p className="text-red-500 text-[11px] mt-0.5">{errors.contactPerson}</p>}
                  </div>
                </div>

                {/* Mobile & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="+91 98100 23456"
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.mobileNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.mobileNumber && <p className="text-red-500 text-[11px] mt-0.5">{errors.mobileNumber}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Business Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="logistics@company.com"
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-[11px] mt-0.5">{errors.email}</p>}
                  </div>
                </div>

                {/* Pickup & Delivery Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pickup Location / Pincode *
                    </label>
                    <input
                      type="text"
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      placeholder="Origin City, State or Industrial Estate"
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.pickupLocation ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.pickupLocation && <p className="text-red-500 text-[11px] mt-0.5">{errors.pickupLocation}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Delivery Location / Pincode *
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryLocation}
                      onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                      placeholder="Destination City, Port or Hub"
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.deliveryLocation ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.deliveryLocation && <p className="text-red-500 text-[11px] mt-0.5">{errors.deliveryLocation}</p>}
                  </div>
                </div>

                {/* Material Type & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Material Type *
                    </label>
                    <input
                      type="text"
                      value={formData.materialType}
                      onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                      placeholder="e.g. Electrical Panels, FMCG, Auto Spares"
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.materialType ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.materialType && <p className="text-red-500 text-[11px] mt-0.5">{errors.materialType}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Approximate Weight *
                    </label>
                    <input
                      type="text"
                      value={formData.approximateWeight}
                      onChange={(e) => setFormData({ ...formData, approximateWeight: e.target.value })}
                      placeholder="e.g. 12 MT or 4500 kg"
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.approximateWeight ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {errors.approximateWeight && <p className="text-red-500 text-[11px] mt-0.5">{errors.approximateWeight}</p>}
                  </div>
                </div>

                {/* Vehicle Requirement & Pickup Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Vehicle Requirement *
                    </label>
                    <select
                      value={formData.vehicleRequirement}
                      onChange={(e) => setFormData({ ...formData, vehicleRequirement: e.target.value })}
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.vehicleRequirement ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    >
                      <option value="Select Vehicle Category" disabled>Select Vehicle Category</option>
                      {FLEET_DATA.map((v) => (
                        <option key={v.id} value={v.type}>
                          {v.type} ({v.capacityTonnes})
                        </option>
                      ))}
                      <option value="Need Transport Recommendation">Let Outshipper Recommend</option>
                    </select>
                    {errors.vehicleRequirement && <p className="text-red-500 text-[11px] mt-0.5">{errors.vehicleRequirement}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                      className={`w-full p-2.5 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 text-slate-900 font-medium ${
                        errors.pickupDate ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-red-500 focus:ring-red-500'
                      }`}
                    />
                    {errors.pickupDate && <p className="text-red-500 text-[11px] mt-0.5">{errors.pickupDate}</p>}
                  </div>
                </div>

                {/* Additional Requirements */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Additional Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                    placeholder="e.g. Tarpaulin covering needed, multiple pickup points, loading labour assistance required"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-red-500 focus:ring-red-500 text-slate-900 font-medium"
                  />
                </div>

                {/* Owner Direct WhatsApp Notification Notice */}
                <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-lg text-emerald-950 text-xs flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900 block">
                      ⚡ Instant Owner Alert on WhatsApp:
                    </span>
                    <span className="text-emerald-700 text-[11px] leading-relaxed">
                      Upon submission, your freight details will automatically format and send straight to Outshipper Owner ({OWNER_WHATSAPP_DISPLAY}) for priority rate quoting.
                    </span>
                  </div>
                </div>

                {/* Submit button */}
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
                        <span>Submit Quote &amp; Send to Owner via WhatsApp</span>
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
