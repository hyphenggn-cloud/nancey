import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/config';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-h-[85vh] overflow-y-auto text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                Privacy Policy
              </h3>
            </div>
            <p className="text-slate-500 text-xs">
              Last Updated: October 2026 · {COMPANY_CONFIG.legalName}
            </p>

            <h4 className="font-bold text-slate-900 pt-2">1. Scope and Commitment</h4>
            <p>
              Outshipper Private Limited (“Outshipper”, “we”, “our”, or “us”) respects your commercial privacy. This policy describes how we collect, handle, and protect corporate customer data, consignment tracking IDs, and contact submissions.
            </p>

            <h4 className="font-bold text-slate-900 pt-2">2. Data We Collect</h4>
            <p>
              We collect information provided directly through quotation forms, enquiry forms, and consignment dispatch requests, including Company Name, Contact Representative, Email, Phone Number, Cargo Class, and Pickup/Delivery locations.
            </p>

            <h4 className="font-bold text-slate-900 pt-2">3. Use of Commercial Information</h4>
            <p>
              Consignment details and telematics data are used strictly to provide transportation services, generate legal E-Way Bills, coordinate road dispatch, calculate route tariffs, and deliver electronic Proof of Delivery (e-POD).
            </p>

            <h4 className="font-bold text-slate-900 pt-2">4. Data Security & Confidentially</h4>
            <p>
              We implement industry-standard encryption and administrative safeguards to prevent unauthorized access or disclosure of your freight schedules and cargo values.
            </p>

            <h4 className="font-bold text-slate-900 pt-2">5. Contact Our Compliance Office</h4>
            <p>
              For privacy queries or data correction requests, contact our legal desk at <a href={`mailto:${COMPANY_CONFIG.email}`} className="text-orange-600 underline">{COMPANY_CONFIG.email}</a>.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                Terms & Conditions
              </h3>
            </div>
            <p className="text-slate-500 text-xs">
              Last Updated: October 2026 · {COMPANY_CONFIG.legalName}
            </p>

            <h4 className="font-bold text-slate-900 pt-2">1. Acceptance of Carriage Terms</h4>
            <p>
              All freight movements, Full Truck Load (FTL), Part Truck Load (PTL), and logistics coordination arrangements executed with Outshipper Private Limited are governed by standard Indian Carrier laws and mutual freight contracts.
            </p>

            <h4 className="font-bold text-slate-900 pt-2">2. E-Way Bill & Regulatory Compliance</h4>
            <p>
              The consignor is legally obligated to furnish accurate GST invoices and valid Part-A E-Way Bills prior to vehicle loading. Outshipper drivers and coordinators will update Part-B transporter details upon physical dispatch.
            </p>

            <h4 className="font-bold text-slate-900 pt-2">3. Loading, Detention & Demurrage</h4>
            <p>
              Standard vehicle loading and unloading turnaround allowances are specified in individual commercial rate agreements. Detention charges apply when shipper/consignee delays exceed the agreed free hours.
            </p>

            <h4 className="font-bold text-slate-900 pt-2">4. Cargo Insurance & Transit Liability</h4>
            <p>
              Shippers are advised to maintain active transit insurance policies for high-value consignments. Outshipper issues standard Carrier Consignment Notes (LR/Bilty) with liability defined under the Carriage by Road Act.
            </p>

            <h4 className="font-bold text-slate-900 pt-2">5. Force Majeure</h4>
            <p>
              Transit timelines are subject to highway blockades, extreme weather disruptions, and official regulatory closures outside reasonable carrier control.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
