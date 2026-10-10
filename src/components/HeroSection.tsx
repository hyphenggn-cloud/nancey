import React from 'react';
import {
  ArrowRight,
  Search,
  ShieldCheck,
  MapPin,
  Activity,
  CheckCircle2,
  Truck,
  Edit3,
  Building2,
  Boxes,
  Zap,
  Navigation
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { COMPANY_CONFIG } from '../data/config';
import { Logo } from './Logo';

interface HeroSectionProps {
  onQuoteClick: () => void;
  onTrackClick: () => void;
  onServicesClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onQuoteClick,
  onTrackClick,
  onServicesClick,
}) => {
  const { content, isEditMode, openEditor } = useSiteContent();
  const hero = content.hero;
  const stats = content.stats;

  return (
    <section className="relative bg-[#070F1E] text-white overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-800 group">
      {/* Owner In-Place Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => openEditor('hero')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg border border-red-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Hero Section</span>
          </button>
        </div>
      )}

      {/* Subtle Grid Pattern for Crisp Engineering Feel */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Warm Ambient Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Brand Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Corporate Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1526] border border-slate-700/80 text-xs text-slate-200 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E60023] animate-pulse" />
              <span>Outshipper Private Limited · CIN: {COMPANY_CONFIG.cin}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] text-balance">
              Moving Businesses{' '}
              <span className="text-[#E60023]">Forward</span>.
            </h1>

            {/* Subheading */}
            <div className="space-y-2 max-w-2xl">
              <p className="text-lg sm:text-xl font-bold text-slate-100">
                Reliable Logistics. Smarter Transportation. Stronger Connections.
              </p>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                Outshipper is a logistics and transportation brand focused on helping businesses move goods efficiently through dependable road transportation and practical, technology-enabled logistics solutions.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onQuoteClick}
                className="px-6 py-3.5 text-sm font-bold text-white bg-[#E60023] hover:bg-red-700 active:bg-red-800 rounded-xl shadow-lg shadow-red-950/40 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Request Transportation Quote</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onTrackClick}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#0A1526] hover:bg-[#11233B] border-2 border-slate-700 hover:border-slate-500 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Search className="w-4 h-4 text-[#E60023]" />
                <span>Track Consignment</span>
              </button>

              <button
                onClick={onServicesClick}
                className="px-4 py-3.5 text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Explore Services →
              </button>
            </div>

            {/* Micro Trust Proof Bar on Crisp Dark Canvas */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-black text-white font-display tabular-nums">
                  Dec 2020
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-0.5">Incorporation Date</div>
              </div>

              <div>
                <div className="text-2xl font-black text-[#E60023] font-display tabular-nums">
                  10,000+
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-0.5">Consignments Handled</div>
              </div>

              <div>
                <div className="text-2xl font-black text-white font-display tabular-nums">
                  800+
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-0.5">Business Clients</div>
              </div>

              <div>
                <div className="text-2xl font-black text-emerald-400 font-display tabular-nums">
                  99.4%
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-0.5">On-Time Performance</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Operations Console on White Backdrop */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-xl space-y-5">
              {/* Card Header with Logo */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo size="sm" />
                <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  DISPATCH ACTIVE
                </span>
              </div>

              {/* Service Corridor Highlights */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Confirmed Service Corridors
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-xs font-medium">
                  {COMPANY_CONFIG.locations.map((loc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#E60023] shrink-0" />
                      <span className="truncate">{loc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Simulation Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900">Active Consignment</span>
                  <span className="text-[#E60023] font-bold">NL123456789</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Gurugram ➔ Bhiwandi (Mumbai)</span>
                  <span className="text-emerald-700 font-semibold font-mono">In Transit (99% SLA)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#E60023] h-full w-3/4 rounded-full" />
                </div>
              </div>

              {/* Quick Contacts Footer in Hero */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div>
                  Phone: <strong className="text-slate-900">{COMPANY_CONFIG.phoneDisplay}</strong>
                </div>
                <div>
                  WhatsApp: <strong className="text-emerald-700">{COMPANY_CONFIG.whatsappDisplay}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
