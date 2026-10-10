import React from 'react';
import {
  ShieldCheck,
  Eye,
  Cpu,
  Users,
  Award,
  Building,
  CheckCircle,
  Edit3,
  MapPin,
  Compass,
  Target,
  FileCheck2,
  Calendar,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { COMPANY_CONFIG } from '../data/config';
import { useSiteContent } from '../context/SiteContentContext';

export const AboutSection: React.FC = () => {
  const { content, isEditMode, openEditor } = useSiteContent();
  const about = content.about;
  const stats = content.stats;

  return (
    <section id="about" className="py-20 bg-[#070F1E] border-b border-slate-800 relative group">
      {/* Owner In-Place Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => openEditor('about')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-md border border-red-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit About &amp; Brand</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Banner Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-800/70 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#E60023]"></span>
            <span>About Outshipper Private Limited</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Moving Businesses <span className="text-[#E60023]">Forward</span>
          </h2>

          <p className="mt-3 text-lg sm:text-xl font-medium text-slate-200 leading-relaxed">
            Reliable Logistics. Smarter Transportation. Stronger Connections.
          </p>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Outshipper is a logistics and transportation brand focused on helping businesses move goods efficiently through dependable road transportation and logistics solutions.
          </p>
        </div>

        {/* 2-Column Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Corporate Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0D1B2E] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  CORPORATE INCORPORATION &amp; GOVERNANCE
                </span>
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-900/60">
                  CIN: {COMPANY_CONFIG.cin}
                </span>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                <strong className="text-white">Outshipper Private Limited</strong> is an Indian private limited company incorporated on <strong className="text-white">23 December 2020</strong>. The company operates in the transport and logistics sector, with a focus on road transportation.
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Our approach is built around operational efficiency, reliable coordination, transparent communication and long-term business relationships. We aim to help businesses manage transportation requirements with greater convenience and confidence.
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We aim to simplify transportation operations, strengthen connections between businesses and transport partners, and support smoother movement of goods through practical, technology-enabled logistics solutions.
              </p>

              <div className="pt-2 border-t border-slate-800 text-xs font-semibold text-slate-400 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Incorporated under the Companies Act, 2013 · Ministry of Corporate Affairs, India</span>
              </div>
            </div>

            {/* Statistics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0D1B2E] border border-slate-800 text-center shadow-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">
                  2020
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1">Incorporated (23 Dec)</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1B2E] border border-slate-800 text-center shadow-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#E60023] font-display tabular-nums">
                  10,000+
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1">Consignments Handled</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1B2E] border border-slate-800 text-center shadow-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">
                  800+
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1">Business Clients</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1B2E] border border-slate-800 text-center shadow-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display tabular-nums">
                  99.4%
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1">On-Time Coordination</div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission & Vision */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mission Card */}
            <div className="bg-[#0D1B2E] border-2 border-slate-800 hover:border-red-500/40 rounded-2xl p-6 sm:p-7 shadow-lg transition-colors space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/80 text-[#E60023] border border-red-900/60 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block">
                    OUR PURPOSE
                  </span>
                  <h3 className="text-lg font-bold text-white font-display">
                    Our Mission
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                To make transportation and logistics simpler, more efficient and more accessible for businesses through dependable service and continuous improvement.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-[#0D1B2E] border-2 border-slate-800 hover:border-red-500/40 rounded-2xl p-6 sm:p-7 shadow-lg transition-colors space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    THE HORIZON
                  </span>
                  <h3 className="text-lg font-bold text-white font-display">
                    Our Vision
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                To build a trusted logistics brand that connects businesses, transportation partners and markets through efficient operations and technology-driven solutions.
              </p>
            </div>

            {/* Closing Brand Manifesto */}
            <div className="bg-[#0A1526] text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-2 text-center">
              <div className="text-sm font-display font-extrabold text-white">
                Outshipper — Connecting Businesses Through Logistics.
              </div>
              <p className="text-xs text-slate-400">
                On Time Every Time · Transparent Communication · Long-Term Value
              </p>
            </div>
          </div>
        </div>

        {/* Confirmed Service Locations Section */}
        <div className="bg-[#0D1B2E] rounded-2xl p-8 border border-slate-800 shadow-xl mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider font-mono">
                <MapPin className="w-4 h-4" />
                <span>Operational Geography</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white mt-1">
                Our Confirmed Service Locations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Service locations where Outshipper operations or coverage are confirmed:
              </p>
            </div>

            <div className="text-xs text-slate-300 bg-[#0A1526] px-3.5 py-2 rounded-lg border border-slate-800 font-medium">
              Road Transportation Hubs &amp; Industrial Expressways
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {COMPANY_CONFIG.locations.map((loc, i) => (
              <div
                key={i}
                className="bg-[#0A1526] rounded-xl p-5 border border-slate-800 shadow-sm hover:border-red-500/60 transition-colors flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-red-950/80 text-[#E60023] border border-red-900/60 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    {loc.split(',')[0]}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {loc.split(',')[1] || 'Industrial Hub'}
                  </span>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                    ✓ Confirmed Coverage
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Corporate Office Callout */}
        <div className="bg-[#0D1B2E] rounded-2xl p-6 sm:p-8 border-2 border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              <Building className="w-4 h-4 text-[#E60023]" />
              <span>Registered Corporate Office</span>
            </div>
            <h4 className="text-lg font-bold font-display text-white">
              {COMPANY_CONFIG.legalName}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {COMPANY_CONFIG.address.full}
            </p>
            <div className="text-xs text-slate-400 font-mono pt-1">
              CIN: <strong className="text-white">{COMPANY_CONFIG.cin}</strong> · Date of Incorporation: <strong className="text-white">23 December 2020</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`tel:${COMPANY_CONFIG.phone}`}
              className="px-5 py-3 bg-[#E60023] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>{COMPANY_CONFIG.phoneDisplay}</span>
            </a>

            <a
              href={`mailto:${COMPANY_CONFIG.email}`}
              className="px-5 py-3 bg-[#0A1526] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{COMPANY_CONFIG.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
