import React, { useState } from 'react';
import { Cpu, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Sparkles, Truck, FileText, Edit3, MessageSquare, ExternalLink } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import {
  formatSmartAnalysisWhatsAppMessage,
  getWhatsAppUrl,
  OWNER_WHATSAPP_RAW,
  OWNER_WHATSAPP_DISPLAY,
} from '../lib/whatsapp';

interface AnalysisResult {
  recommendedVehicle: string;
  payloadCategory: string;
  shipmentPriority: 'Standard Road Freight' | 'Priority Line-Haul' | 'Heavy-Haul / Special Escort';
  estimatedCorridorKm: number;
  tollCheckpoints: string;
  eWayRequirement: string;
  operationalConsiderations: string[];
  suggestedNextSteps: string[];
}

interface SmartLogisticsAnalysisProps {
  onApplyToQuote: (details: {
    origin: string;
    destination: string;
    cargo: string;
    weight: string;
    vehicle: string;
  }) => void;
}

export const SmartLogisticsAnalysis: React.FC<SmartLogisticsAnalysisProps> = ({ onApplyToQuote }) => {
  const { isEditMode, openEditor } = useSiteContent();
  const [pickup, setPickup] = useState('Gurugram, Haryana (NCR)');
  const [delivery, setDelivery] = useState('Bhiwandi, Mumbai (Maharashtra)');
  const [cargoType, setCargoType] = useState('Industrial Machinery & Spares');
  const [weightKg, setWeightKg] = useState('12000');
  const [vehiclePreference, setVehiclePreference] = useState('Auto-Detect Best Match');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-12');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const runAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    setTimeout(() => {
      const weightNum = parseFloat(weightKg) || 1000;
      const weightTonnes = weightNum / 1000;

      let vehicle = '32 Ft Multi-Axle Heavy Truck';
      let priority: AnalysisResult['shipmentPriority'] = 'Priority Line-Haul';
      const considerations: string[] = [];

      if (weightTonnes <= 1.2) {
        vehicle = 'Mini Truck (Tata Ace / Mahindra Bolero Maxi)';
        priority = 'Standard Road Freight';
        considerations.push('Ideal for intra-city routes; exempt from daytime heavy vehicle city bans.');
      } else if (weightTonnes <= 4.5) {
        vehicle = '14 Ft ICV (Eicher Pro / Tata 407)';
        priority = 'Standard Road Freight';
        considerations.push('Palletized loading supported; fast expressway cruising speed (~60-70 km/h).');
      } else if (weightTonnes <= 10.0) {
        vehicle = '20 Ft Commercial Truck (BharatBenz / Eicher)';
        priority = 'Priority Line-Haul';
        considerations.push('Inter-state transit permit compliant; dual-driver configuration suggested for lanes >800 km.');
      } else if (weightTonnes <= 18.5) {
        vehicle = '32 Ft Multi-Axle Heavy Truck (Tata Signa 2823)';
        priority = 'Priority Line-Haul';
        considerations.push('Multi-axle load distribution ensures compliance with NHAI gross vehicle weight (GVW) limits.');
        considerations.push('High-cube container prevents weather exposure and transit moisture.');
      } else if (weightTonnes <= 25.0) {
        vehicle = '32-40 Ft Container Truck (High Cube ISO)';
        priority = 'Priority Line-Haul';
        considerations.push('Digital e-seal security recommended for high-value machinery.');
      } else {
        vehicle = 'Heavy Commercial Trailer (40-50 Ft Flatbed/Lowbed)';
        priority = 'Heavy-Haul / Special Escort';
        considerations.push('Route survey required for low-clearance flyovers and bridge weight limits.');
        considerations.push('Special NHAI transit corridor approvals may apply for ODC (Over-Dimensional Cargo).');
      }

      considerations.push('Mandatory GST E-Way Bill generation required prior to vehicle dispatch.');
      considerations.push('All Outshipper line-haul vehicles are equipped with continuous GPS telematics & temperature/shock monitoring.');

      setResult({
        recommendedVehicle: vehiclePreference !== 'Auto-Detect Best Match' ? `${vehiclePreference} (Analyzed payload: ${weightTonnes} MT)` : vehicle,
        payloadCategory: `${weightTonnes} Metric Tonnes (${weightNum.toLocaleString()} kg)`,
        shipmentPriority: priority,
        estimatedCorridorKm: 1420,
        tollCheckpoints: 'Fastag Automated Commercial Corridor (approx. 14 toll plazas)',
        eWayRequirement: 'Mandatory Part-A & Part-B E-Way Bill compliance for consignments > ₹50,000',
        operationalConsiderations: considerations,
        suggestedNextSteps: [
          'Verify pickup facility loading dock height and forklift availability.',
          'Generate GST E-Way Bill with transporter ID provided upon formal booking.',
          'Request an official binding rate contract via Outshipper Quotation Desk.',
        ],
      });

      setAnalyzing(false);
    }, 400);
  };

  return (
    <section id="analysis" className="py-20 bg-[#0A1526] border-b border-slate-800 relative group">
      {/* Owner In-Place Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-8 z-30">
          <button
            onClick={() => openEditor('fleet')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-md border border-orange-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Fleet & Analysis Engine</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-orange-950/70 border border-orange-800/70 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Freight Routing Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Smart Logistics Analysis
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            Enter your shipment parameters to analyze optimal vehicle match, highway routing regulations, payload compliance, and dispatch prerequisites.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-6 bg-[#0D1B2E] rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-400" />
              <span>Consignment Parameters</span>
            </h3>

            <form onSubmit={runAnalysis} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="City, State / Industrial Area"
                    className="w-full p-2.5 bg-[#0A1526] border border-slate-700 rounded-md focus:outline-none focus:border-orange-500 font-medium text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Delivery Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                    placeholder="Destination Hub / City"
                    className="w-full p-2.5 bg-[#0A1526] border border-slate-700 rounded-md focus:outline-none focus:border-orange-500 font-medium text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Cargo / Material Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                    placeholder="e.g. Auto Parts, FMCG, Chemicals"
                    className="w-full p-2.5 bg-[#0A1526] border border-slate-700 rounded-md focus:outline-none focus:border-orange-500 font-medium text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Approximate Cargo Weight (in kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="Weight in kg (e.g. 12000 for 12T)"
                    className="w-full p-2.5 bg-[#0A1526] border border-slate-700 rounded-md focus:outline-none focus:border-orange-500 font-medium text-white font-mono placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Preferred Vehicle Class (Optional)
                  </label>
                  <select
                    value={vehiclePreference}
                    onChange={(e) => setVehiclePreference(e.target.value)}
                    className="w-full p-2.5 bg-[#0A1526] border border-slate-700 rounded-md focus:outline-none focus:border-orange-500 font-medium text-white"
                  >
                    <option value="Auto-Detect Best Match" className="bg-[#0A1526] text-white">Auto-Detect Best Match</option>
                    <option value="Mini Truck (Tata Ace)" className="bg-[#0A1526] text-white">Mini Truck (~1 MT)</option>
                    <option value="Pickup Truck (Bolero)" className="bg-[#0A1526] text-white">Pickup Truck (~2.5 MT)</option>
                    <option value="14 Ft ICV (Eicher/Tata)" className="bg-[#0A1526] text-white">14 Ft ICV (~4.5 MT)</option>
                    <option value="17 Ft Truck" className="bg-[#0A1526] text-white">17 Ft Truck (~7 MT)</option>
                    <option value="20 Ft Truck" className="bg-[#0A1526] text-white">20 Ft Truck (~10 MT)</option>
                    <option value="32 Ft Multi-Axle" className="bg-[#0A1526] text-white">32 Ft Multi-Axle (~18.5 MT)</option>
                    <option value="Container Truck" className="bg-[#0A1526] text-white">Container Truck (~25 MT)</option>
                    <option value="Heavy Trailer" className="bg-[#0A1526] text-white">Trailer / ODC (~40 MT)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Required Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full p-2.5 bg-[#0A1526] border border-slate-700 rounded-md focus:outline-none focus:border-orange-500 font-medium text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={analyzing}
                  className="w-full py-3 bg-[#E60023] hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                >
                  {analyzing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Run Smart Logistics Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6">
            {result ? (
              <div className="bg-[#0B1528] text-white rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono text-orange-400 font-bold uppercase">
                    AI Logistics Assessment
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Simulated Route Plan
                  </span>
                </div>

                {/* Recommendation Banner */}
                <div className="p-4 rounded-lg bg-slate-800/90 border border-slate-700 space-y-2">
                  <div className="text-xs text-slate-400">Recommended Vehicle Category:</div>
                  <div className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <Truck className="w-5 h-5 text-orange-400 shrink-0" />
                    <span>{result.recommendedVehicle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs pt-1 text-slate-300">
                    <span>Priority: <strong className="text-orange-400">{result.shipmentPriority}</strong></span>
                    <span>·</span>
                    <span>Payload: <strong>{result.payloadCategory}</strong></span>
                  </div>
                </div>

                {/* Considerations */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Logistics & Regulatory Considerations
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.operationalConsiderations.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Next Steps */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Suggested Next Steps
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.suggestedNextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clear AI Disclaimer (Required by prompt) */}
                <div className="p-3 rounded bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Disclaimer:</strong> This is an AI-generated logistics assessment for vehicle sizing and operational planning. It does not constitute a guaranteed vehicle reservation or binding tariff quote.
                  </span>
                </div>

                {/* Action Buttons: Apply to Quote or Send Direct to Owner on WhatsApp */}
                <div className="space-y-2 pt-1">
                  <a
                    href={getWhatsAppUrl(
                      formatSmartAnalysisWhatsAppMessage({
                        origin: pickup,
                        destination: delivery,
                        cargo: cargoType,
                        weight: weightKg,
                        vehicle: result.recommendedVehicle,
                        priority: result.shipmentPriority,
                        distanceKm: result.estimatedCorridorKm,
                      }),
                      OWNER_WHATSAPP_RAW
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Route &amp; Cargo Plan to Owner via WhatsApp ({OWNER_WHATSAPP_DISPLAY})</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <button
                    onClick={() =>
                      onApplyToQuote({
                        origin: pickup,
                        destination: delivery,
                        cargo: cargoType,
                        weight: `${(parseFloat(weightKg) / 1000).toFixed(1)} MT`,
                        vehicle: result.recommendedVehicle,
                      })
                    }
                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Apply This Specification to Official Quote Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[360px] bg-slate-100/70 rounded-xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-xs">
                  <Cpu className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base font-display">
                  Run Assessment to View Logistics Blueprint
                </h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Fill in your origin, destination, cargo classification, and weight to generate vehicle class recommendations and highway compliance parameters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
