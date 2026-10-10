import React from 'react';
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Heart, Edit3, MessageSquare } from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY_CONFIG } from '../data/config';
import { PWAInstallButton } from './PWAInstallButton';
import { useSiteContent } from '../context/SiteContentContext';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
  onOpenDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenLegal,
  onOpenDashboard,
}) => {
  const { content, isEditMode, openEditor } = useSiteContent();
  const { isAdmin, openOwnerModal } = useAuth();
  const contact = content.contact;
  const company = content.company;

  return (
    <footer className="bg-[#050B15] text-white border-t border-slate-800 pt-16 pb-12 relative group">
      {/* Owner in-place edit button */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => openEditor('brand')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-md border border-red-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Brand &amp; Legal Info</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand Lockup & Registered Office */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="cursor-pointer inline-block"
              role="button"
              tabIndex={0}
            >
              <Logo size="md" variant="white" />
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Outshipper is a logistics and transportation brand focused on helping businesses move goods efficiently through dependable road transportation and logistics solutions.
            </p>

            <div className="pt-1 text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {COMPANY_CONFIG.address.full}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`tel:${COMPANY_CONFIG.phone}`} className="hover:text-white transition-colors">
                  {COMPANY_CONFIG.phoneDisplay} · Dispatch Helpline
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${COMPANY_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  {COMPANY_CONFIG.whatsappDisplay} · WhatsApp Desk
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`mailto:${COMPANY_CONFIG.email}`} className="hover:text-white transition-colors">
                  {COMPANY_CONFIG.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <PWAInstallButton />
            </div>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Consignment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('testimonials')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Client Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Operations Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Services (Outshipper Core Services) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  1. Road Transportation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  2. Logistics Coordination
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  3. Business Transportation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  4. Transport Partner Network
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  5. Technology-Enabled Logistics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Locations & Corporate */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Locations
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {COMPANY_CONFIG.locations.map((loc, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{loc}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              CIN: {COMPANY_CONFIG.cin}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2020 – 2026 Outshipper Private Limited. CIN: {COMPANY_CONFIG.cin}. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-800">·</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <span className="text-slate-800">·</span>
            <button
              onClick={openOwnerModal}
              className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              title="Website Owner Access"
            >
              <ShieldCheck className="w-3 h-3 text-red-400" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
