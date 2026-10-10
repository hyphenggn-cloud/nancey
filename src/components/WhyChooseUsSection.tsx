import React from 'react';
import {
  Briefcase,
  Layers,
  Wrench,
  MessageSquare,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const WhyChooseUsSection: React.FC = () => {
  const { content, isEditMode, openEditor } = useSiteContent();
  const why = content.whyChooseUs;

  const cardDetails = [
    {
      title: 'A Business-Focused Approach to Logistics',
      description: 'We structure our operations around the commercial priorities, inventory schedules, and delivery commitments of businesses.',
      icon: <Briefcase className="w-6 h-6 text-[#E60023]" />,
      badge: 'Commercial Focus'
    },
    {
      title: 'Emphasis on Reliable Coordination',
      description: 'Active coordination between shippers, transport partners and destination docks ensures smooth consignment movement.',
      icon: <Layers className="w-6 h-6 text-slate-900" />,
      badge: 'Smooth Movement'
    },
    {
      title: 'Practical Transportation Solutions',
      description: 'Real-world, dependable road transportation solutions engineered to solve genuine logistics challenges without unnecessary complexity.',
      icon: <Wrench className="w-6 h-6 text-[#E60023]" />,
      badge: 'Dependable Solutions'
    },
    {
      title: 'Clear & Professional Communication',
      description: 'Transparent updates, honest transit schedules, and accessible dispatch communication at every operational step.',
      icon: <MessageSquare className="w-6 h-6 text-slate-900" />,
      badge: 'Transparent Status'
    },
    {
      title: 'Commitment to Continuous Improvement',
      description: 'Constantly refining workflows, adopting practical digital tools, and expanding our partner network to serve businesses better.',
      icon: <TrendingUp className="w-6 h-6 text-[#E60023]" />,
      badge: 'Process Excellence'
    },
    {
      title: 'Long-Term Relationships',
      description: 'We focus on building enduring, mutually respectful relationships with customers and transport partners based on trust and value.',
      icon: <HeartHandshake className="w-6 h-6 text-slate-900" />,
      badge: 'Trusted Partnership'
    }
  ];

  return (
    <section className="py-20 bg-[#0A1526] border-b border-slate-800 relative group">
      {/* Owner In-Place Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => openEditor('why')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-md border border-red-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Why Choose Us</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-red-800/70 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Core Values &amp; Approach</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Why Choose Outshipper?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            Our approach is built around operational efficiency, reliable coordination, transparent communication and long-term business relationships.
          </p>
        </div>

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardDetails.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#0D1B2E] rounded-2xl p-7 border border-slate-800 hover:border-[#E60023] hover:shadow-2xl hover:bg-[#11233B] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 shadow-sm flex items-center justify-center text-white">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-300 bg-[#0A1526] px-2.5 py-1 rounded-md border border-slate-800">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-display mb-2 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span>{card.title}</span>
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Outshipper Principle</span>
                <span className="font-mono font-bold text-slate-200">0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
