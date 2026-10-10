import React, { useState, useEffect } from 'react';
import {
  Truck,
  X,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Fuel,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Upload
} from 'lucide-react';
import { TripRecord, TripStatus } from '../data/tripsData';
import { ShipmentRecord } from '../data/shipmentsData';
import { FLEET_DATA } from '../data/fleetData';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripToEdit?: TripRecord | null;
  shipments: ShipmentRecord[];
  onSaveTrip: (trip: TripRecord) => Promise<void>;
  onOpenDocumentUpload?: (trip: TripRecord) => void;
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  tripToEdit,
  shipments,
  onSaveTrip,
  onOpenDocumentUpload,
}) => {
  const isEditing = Boolean(tripToEdit);

  const [tripNumber, setTripNumber] = useState('');
  const [shipmentId, setShipmentId] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [originHub, setOriginHub] = useState('');
  const [destinationHub, setDestinationHub] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [expectedArrival, setExpectedArrival] = useState('');
  const [status, setStatus] = useState<TripStatus>('Scheduled');
  const [currentKm, setCurrentKm] = useState(0);
  const [totalKm, setTotalKm] = useState(1200);
  const [tollCheckpointsPassed, setTollCheckpointsPassed] = useState(6);
  const [fastagDeductionINR, setFastagDeductionINR] = useState('₹3,200');
  const [fuelExpenseINR, setFuelExpenseINR] = useState('₹22,000');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (tripToEdit) {
      setTripNumber(tripToEdit.tripNumber || tripToEdit.id);
      setShipmentId(tripToEdit.shipmentId || '');
      setVehicleNumber(tripToEdit.vehicleNumber || '');
      setVehicleType(tripToEdit.vehicleType || '');
      setDriverName(tripToEdit.driverName || '');
      setDriverPhone(tripToEdit.driverPhone || '');
      setOriginHub(tripToEdit.originHub || '');
      setDestinationHub(tripToEdit.destinationHub || '');
      setStartDateTime(tripToEdit.startDateTime || '');
      setExpectedArrival(tripToEdit.expectedArrival || '');
      setStatus(tripToEdit.status || 'On Route');
      setCurrentKm(tripToEdit.currentKm || 0);
      setTotalKm(tripToEdit.totalKm || 1000);
      setTollCheckpointsPassed(tripToEdit.tollCheckpointsPassed || 0);
      setFastagDeductionINR(tripToEdit.fastagDeductionINR || '₹0');
      setFuelExpenseINR(tripToEdit.fuelExpenseINR || '₹0');
      setNotes(tripToEdit.notes || '');
    } else {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setTripNumber(`TRP-2026-0${randomSuffix}`);
      setShipmentId(shipments[0]?.trackingId || 'NL123456789');
      setVehicleNumber('HR-55-AB-9821');
      setVehicleType(FLEET_DATA[0]?.type || '32 Ft Multi-Axle Container');
      setDriverName('Baldev Singh');
      setDriverPhone('+91 98721 44556');
      setOriginHub('Delhi NCR Hub (Gurugram)');
      setDestinationHub('Mumbai Port Hub (Bhiwandi)');

      const now = new Date();
      setStartDateTime(
        now.toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }) +
          ' - 06:00 PM'
      );
      const arr = new Date();
      arr.setDate(arr.getDate() + 3);
      setExpectedArrival(
        arr.toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }) +
          ' - 04:30 PM'
      );
      setStatus('Scheduled');
      setCurrentKm(0);
      setTotalKm(1420);
      setTollCheckpointsPassed(0);
      setFastagDeductionINR('₹4,800');
      setFuelExpenseINR('₹26,000');
      setNotes('Priority line-haul corridor dispatch with Fastag automated toll clearance.');
    }
    setErrorMsg('');
  }, [tripToEdit, isOpen, shipments]);

  if (!isOpen) return null;

  const handleGenerateTripNo = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setTripNumber(`TRP-2026-0${randomSuffix}`);
  };

  const handleSelectShipment = (selectedTrackingId: string) => {
    setShipmentId(selectedTrackingId);
    const found = shipments.find((s) => s.trackingId === selectedTrackingId);
    if (found) {
      if (found.origin) setOriginHub(found.origin);
      if (found.destination) setDestinationHub(found.destination);
      if (found.vehicleNumber) setVehicleNumber(found.vehicleNumber);
      if (found.vehicleType) setVehicleType(found.vehicleType);
      if (found.driverName) setDriverName(found.driverName);
      if (found.driverPhone) setDriverPhone(found.driverPhone);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!tripNumber.trim()) {
      setErrorMsg('Please specify a Trip Number.');
      return;
    }
    if (!originHub.trim() || !destinationHub.trim()) {
      setErrorMsg('Please specify origin and destination hubs.');
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: TripRecord = {
        id: tripToEdit?.id || tripNumber.trim(),
        tripNumber: tripNumber.trim(),
        shipmentId: shipmentId.trim(),
        vehicleNumber: vehicleNumber.trim() || 'HR-55-AB-9821',
        vehicleType: vehicleType.trim() || '32 Ft Multi-Axle Container',
        driverName: driverName.trim() || 'Assigned Driver',
        driverPhone: driverPhone.trim() || '+91 92123 99003',
        originHub: originHub.trim(),
        destinationHub: destinationHub.trim(),
        startDateTime: startDateTime.trim(),
        expectedArrival: expectedArrival.trim(),
        status,
        currentKm: Number(currentKm) || 0,
        totalKm: Number(totalKm) || 1000,
        tollCheckpointsPassed: Number(tollCheckpointsPassed) || 0,
        fastagDeductionINR: fastagDeductionINR.trim() || '₹0',
        fuelExpenseINR: fuelExpenseINR.trim() || '₹0',
        podUploaded: tripToEdit?.podUploaded || false,
        documents: tripToEdit?.documents || [],
        notes: notes.trim(),
        createdAt: tripToEdit?.createdAt || now,
        updatedAt: now,
      };

      await onSaveTrip(payload);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to save trip.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-display text-base text-white">
                  {isEditing ? 'Edit Trip Record' : 'Create Line-Haul Fleet Trip'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-800">
                  {tripNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Log line-haul journey, Fastag toll allocations, vehicle route and dispatch telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Trip & Consignment Linkage */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Trip Identifiers & Linked Waybill</span>
              </h4>
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleGenerateTripNo}
                  className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate Trip No</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Trip Number *</label>
                <input
                  type="text"
                  value={tripNumber}
                  onChange={(e) => setTripNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. TRP-2026-0891"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Linked Consignment</label>
                <select
                  value={shipmentId}
                  onChange={(e) => handleSelectShipment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- Standalone Trip (No Waybill) --</option>
                  {shipments.map((s) => (
                    <option key={s.trackingId} value={s.trackingId}>
                      {s.trackingId} ({s.companyName} - {s.origin} → {s.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Trip Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TripStatus)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-orange-400 font-bold focus:outline-none focus:border-orange-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Loading">Loading at Hub</option>
                  <option value="On Route">On Route (Highway)</option>
                  <option value="Completed">Completed / Delivered</option>
                  <option value="Delayed">Delayed / Traffic</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Origin & Destination Hubs */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Transit Route Hubs</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Origin Hub *</label>
                <input
                  type="text"
                  value={originHub}
                  onChange={(e) => setOriginHub(e.target.value)}
                  placeholder="e.g. Delhi NCR Hub (Gurugram)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Destination Hub *</label>
                <input
                  type="text"
                  value={destinationHub}
                  onChange={(e) => setDestinationHub(e.target.value)}
                  placeholder="e.g. Mumbai Port Hub (Bhiwandi)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Dispatch Start Date & Time</label>
                <input
                  type="text"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  placeholder="e.g. Oct 04, 2026 - 06:45 PM"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Estimated Arrival (ETA)</label>
                <input
                  type="text"
                  value={expectedArrival}
                  onChange={(e) => setExpectedArrival(e.target.value)}
                  placeholder="e.g. Oct 08, 2026 - 04:30 PM"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vehicle & Driver Allocation */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Assigned Vehicle & Commercial Driver</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Vehicle Number</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. HR-55-AB-9821"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 truncate"
                >
                  {FLEET_DATA.map((f) => (
                    <option key={f.id} value={f.type}>
                      {f.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Driver Pilot</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Baldev Singh"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Driver Mobile</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="e.g. +91 98721 44556"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Kilometer Telematics & Expenses */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              <span>Distance Progress, Fastag Tolls & Fuel Advance</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Current Distance (KM)</label>
                <input
                  type="number"
                  value={currentKm}
                  onChange={(e) => setCurrentKm(Number(e.target.value))}
                  placeholder="e.g. 980"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Total Lane Distance (KM)</label>
                <input
                  type="number"
                  value={totalKm}
                  onChange={(e) => setTotalKm(Number(e.target.value))}
                  placeholder="e.g. 1420"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Fastag Toll Expenses</label>
                <input
                  type="text"
                  value={fastagDeductionINR}
                  onChange={(e) => setFastagDeductionINR(e.target.value)}
                  placeholder="e.g. ₹4,820"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Diesel / Fuel Advance</label>
                <input
                  type="text"
                  value={fuelExpenseINR}
                  onChange={(e) => setFuelExpenseINR(e.target.value)}
                  placeholder="e.g. ₹26,400"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Distance Progress Visualizer */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                <span>Trip Completed: {totalKm > 0 ? Math.min(100, Math.round((currentKm / totalKm) * 100)) : 0}%</span>
                <span>{currentKm} / {totalKm} KM</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all"
                  style={{ width: `${totalKm > 0 ? Math.min(100, Math.round((currentKm / totalKm) * 100)) : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Section 5: Trip Documents & POD Quick Trigger */}
          {isEditing && tripToEdit && (
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Trip Documents & Proof of Delivery (POD)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {(tripToEdit.documents?.length || 0)} document(s) linked
                  {tripToEdit.podUploaded ? ' · POD Uploaded ✓' : ' · Pending POD Upload'}
                </p>
              </div>

              {onOpenDocumentUpload && (
                <button
                  type="button"
                  onClick={() => onOpenDocumentUpload(tripToEdit)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload POD / Trip Docs</span>
                </button>
              )}
            </div>
          )}

          {/* Section 6: Notes */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-400">
              Trip Directives & Operational Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Priority corridor via NH-48. Driver equipped with GPS telematics unit."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{isEditing ? 'Save Trip Updates' : 'Schedule & Dispatch Trip'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
