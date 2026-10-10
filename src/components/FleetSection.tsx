import React, { useState } from 'react';
import { Truck, ArrowRight, Gauge, Package, Check, Layers, ChevronRight, Edit3 } from 'lucide-react';
import { FLEET_DATA, VehicleFleetItem } from '../data/fleetData';
import { useSiteContent } from '../context/SiteContentContext';

interface FleetSectionProps {
  onRequestVehicle: (vehicleType: string) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ onRequestVehicle }) => {
  const { content, isEditMode, openEditor } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Fleet (8 Classes)' },
    { id: 'light', label: 'Light / City (Mini, Pickup)' },
    { id: 'medium', label: 'Medium (14, 17, 20 Ft)' },
    { id: 'heavy', label: 'Heavy & ODC (32 Ft, Container, Trailer)' },
  ];

  // Merge dynamic fleet items with visual attributes
  const fullFleetList: VehicleFleetItem[] = (content.fleet && content.fleet.length > 0 ? content.fleet : FLEET_DATA).map((v, idx) => {
    const fallback = FLEET_DATA[idx] || FLEET_DATA[0];
    return {
      ...fallback,
      ...v,
      highlights: fallback.highlights,
      recommendedCargo: fallback.recommendedCargo,
    };
  });

  const filteredFleet = fullFleetList.filter((v) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'light') return v.id === 'mini-truck' || v.id === 'pickup';
    if (activeCategory === 'medium') return v.id === '14-ft-truck' || v.id === '17-ft-truck' || v.id === '20-ft-truck';
    if (activeCategory === 'heavy') return v.id === '32-ft-multi-axle' || v.id === 'container-truck' || v.id === 'trailer';
    return true;
  });

  return (
    <section id="fleet" className="py-20 bg-[#070F1E] border-b border-slate-800 relative group">
      {/* Owner In-Place Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => openEditor('fleet')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-md border border-orange-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Fleet Categories</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-orange-950/70 border border-orange-800/70 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>Commercial Transportation Fleet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Our Vehicle Fleet Categories
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            From nimble intra-city mini trucks to heavy 40 MT articulated multi-axle trailers, our fleet provides the ideal capacity for every consignment.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-1.5 p-1 bg-[#0D1B2E] border border-slate-800 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#E60023] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFleet.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-[#0D1B2E] rounded-xl border border-slate-800 shadow-xl hover:shadow-2xl hover:border-orange-500/50 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Visual Technical Schematic Blueprint Banner */}
                <div className="relative bg-gradient-to-br from-[#070F1E] via-[#0A1526] to-[#11233B] p-5 text-white flex flex-col items-center justify-center min-h-[140px] overflow-hidden border-b border-slate-800">
                  {/* Subtle Grid */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <pattern id={`fleet-grid-${vehicle.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                      </pattern>
                      <rect width="100%" height="100%" fill={`url(#fleet-grid-${vehicle.id})`} />
                    </svg>
                  </div>

                  {/* Vehicle Blueprint Silhouette */}
                  <div className="relative z-10 w-full max-w-[210px] h-20 flex items-center justify-center">
                    <svg viewBox="0 0 160 60" fill="none" className="w-full h-full drop-shadow-md">
                      {/* Body Structure based on type */}
                      {vehicle.id === 'trailer' ? (
                        <>
                          <rect x="10" y="22" width="40" height="20" rx="3" fill="#EA580C" />
                          <rect x="52" y="28" width="98" height="14" rx="2" fill="#94A3B8" />
                          <circle cx="20" cy="46" r="6" fill="#020617" stroke="#EA580C" strokeWidth="2" />
                          <circle cx="36" cy="46" r="6" fill="#020617" stroke="#EA580C" strokeWidth="2" />
                          <circle cx="118" cy="46" r="6" fill="#020617" stroke="#EA580C" strokeWidth="2" />
                          <circle cx="134" cy="46" r="6" fill="#020617" stroke="#EA580C" strokeWidth="2" />
                          <circle cx="146" cy="46" r="6" fill="#020617" stroke="#EA580C" strokeWidth="2" />
                        </>
                      ) : vehicle.id === '32-ft-multi-axle' || vehicle.id === 'container-truck' ? (
                        <>
                          <rect x="10" y="12" width="100" height="30" rx="2" fill="#0284C7" />
                          <rect x="112" y="18" width="36" height="24" rx="2" fill="#EA580C" />
                          <rect x="124" y="20" width="18" height="10" rx="1" fill="#FFFFFF" />
                          <circle cx="24" cy="46" r="6" fill="#020617" stroke="#38BDF8" strokeWidth="2" />
                          <circle cx="40" cy="46" r="6" fill="#020617" stroke="#38BDF8" strokeWidth="2" />
                          <circle cx="120" cy="46" r="6" fill="#020617" stroke="#EA580C" strokeWidth="2" />
                          <circle cx="138" cy="46" r="6" fill="#020617" stroke="#EA580C" strokeWidth="2" />
                        </>
                      ) : (
                        <>
                          <rect x="15" y="16" width="80" height="26" rx="2" fill="#F97316" />
                          <rect x="97" y="20" width="40" height="22" rx="2" fill="#FFFFFF" />
                          <rect x="108" y="23" width="16" height="9" rx="1" fill="#0F172A" />
                          <circle cx="32" cy="46" r="6" fill="#020617" stroke="#F97316" strokeWidth="2" />
                          <circle cx="118" cy="46" r="6" fill="#020617" stroke="#F97316" strokeWidth="2" />
                        </>
                      )}
                    </svg>
                  </div>

                  <span className="relative z-10 text-[10px] font-mono tracking-widest text-slate-400 mt-1 uppercase">
                    {vehicle.bodyType}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white font-display group-hover:text-orange-400 transition-colors">
                      {vehicle.type}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {vehicle.popularModels}
                    </p>
                  </div>

                  {/* Capacity & Dimensions Pill Box */}
                  <div className="p-3 bg-[#0A1526] rounded-lg border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Rated Capacity:</span>
                      <span className="font-bold text-orange-400 font-mono">
                        {vehicle.capacityTonnes}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Deck Dimensions:</span>
                      <span className="font-semibold text-slate-200 text-[11px]">
                        {vehicle.deckDimensions}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Volume Space:</span>
                      <span className="font-semibold text-slate-200 text-[11px]">
                        {vehicle.volumeCft}
                      </span>
                    </div>
                  </div>

                  {/* Suitable For */}
                  <div className="text-xs">
                    <span className="font-bold text-white block mb-1">
                      Suitable For:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px] line-clamp-3">
                      {vehicle.suitableFor}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onRequestVehicle(vehicle.type)}
                  className="w-full py-2.5 px-3 bg-[#0A1526] hover:bg-[#E60023] text-white text-xs font-bold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group-hover:shadow-md"
                >
                  <span>Request Vehicle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
