import React, { useState } from 'react';
import {
  Truck,
  Boxes,
  Navigation,
  Users,
  Cpu,
  ArrowRight,
  X,
  CheckCircle2,
  Edit3,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { SERVICES_DATA, LogisticsService } from '../data/servicesData';
import { useSiteContent } from '../context/SiteContentContext';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const { content, isEditMode, openEditor } = useSiteContent();
  const [activeModalService, setActiveModalService] = useState<LogisticsService | null>(null);

  // The 5 authorized services for Outshipper
  const servicesList: LogisticsService[] = SERVICES_DATA;

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-6 h-6" />;
      case 'Navigation':
        return <Navigation className="w-6 h-6" />;
      case 'Boxes':
        return <Boxes className="w-6 h-6" />;
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'Cpu':
      default:
        return <Cpu className="w-6 h-6" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-[#0A1526] border-b border-slate-800 relative group">
      {/* Owner In-Place Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => openEditor('services')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-md border border-red-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Services</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-red-800/70 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Our Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Our Services
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            Practical, technology-enabled road transportation and logistics coordination solutions designed to help businesses move goods smoothly and reliably.
          </p>
        </div>

        {/* 5 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, index) => (
            <div
              key={service.id}
              className={`bg-[#0D1B2E] rounded-2xl p-7 border border-slate-800 shadow-xl hover:shadow-2xl hover:border-red-500/50 hover:bg-[#11233B] transition-all duration-200 flex flex-col justify-between ${
                index === 3 || index === 4 ? 'lg:col-span-1' : ''
              }`}
            >
              <div>
                {/* Icon & Counter */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center group-hover:bg-[#E60023] group-hover:text-white transition-colors duration-200 shadow-2xs border border-slate-700">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-display text-white mb-2">
                  {service.name}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {service.shortDescription}
                </p>

                {/* Key features bullet points */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {service.keyFeatures.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalService(service)}
                  className="text-xs font-bold text-slate-300 hover:text-[#E60023] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Learn Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectServiceForQuote(service.name)}
                  className="px-3.5 py-1.5 bg-[#E60023] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detailed View */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#E60023] flex items-center justify-center">
                {getServiceIcon(activeModalService.iconName)}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block">
                  OUTSHIPPER CORE SERVICE
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  {activeModalService.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-5">
              {activeModalService.fullDescription}
            </p>

            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Key Operational Capabilities
              </h4>
              <div className="space-y-2">
                {activeModalService.keyFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs mb-6">
              <div>
                <strong className="text-slate-900">Ideal For:</strong>{' '}
                <span className="text-slate-600">{activeModalService.idealFor}</span>
              </div>
              <div>
                <strong className="text-slate-900">Coverage:</strong>{' '}
                <span className="text-slate-600">{activeModalService.coverage}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectServiceForQuote(activeModalService.name);
                  setActiveModalService(null);
                }}
                className="px-5 py-2 bg-[#E60023] hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Request Quote for this Service
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
