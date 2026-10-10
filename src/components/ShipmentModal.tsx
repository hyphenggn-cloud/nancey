import React, { useState, useEffect } from 'react';
import {
  Package,
  X,
  Truck,
  MapPin,
  Calendar,
  User,
  Phone,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Shield,
  Layers,
  Upload
} from 'lucide-react';
import {
  ShipmentRecord,
  ShipmentStatus,
  ShipmentDocument,
  TimelineCheckpoint,
  TRACKING_STAGES,
  INITIAL_SHIPMENTS
} from '../data/shipmentsData';
import { FLEET_DATA } from '../data/fleetData';
import { UploadDocumentSection } from './UploadDocumentSection';

interface ShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentToEdit?: ShipmentRecord | null;
  onSaveShipment: (shipment: ShipmentRecord) => Promise<void>;
  onOpenDocumentUpload?: (shipment: ShipmentRecord) => void;
}

export const ShipmentModal: React.FC<ShipmentModalProps> = ({
  isOpen,
  onClose,
  shipmentToEdit,
  onSaveShipment,
  onOpenDocumentUpload,
}) => {
  const isEditing = Boolean(shipmentToEdit);

  // Form State
  const [trackingId, setTrackingId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [origin, setOrigin] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [status, setStatus] = useState<ShipmentStatus>('Booking Confirmed');
  const [currentLocation, setCurrentLocation] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [weight, setWeight] = useState('');
  const [eWayBillNo, setEWayBillNo] = useState('');
  const [gpsSpeed, setGpsSpeed] = useState('60 km/h');
  const [timeline, setTimeline] = useState<TimelineCheckpoint[]>([]);
  const [documents, setDocuments] = useState<ShipmentDocument[]>([]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill on open
  useEffect(() => {
    if (shipmentToEdit) {
      setTrackingId(shipmentToEdit.trackingId);
      setCustomerName(shipmentToEdit.customerName || '');
      setCompanyName(shipmentToEdit.companyName || '');
      setOrigin(shipmentToEdit.origin || '');
      setOriginAddress(shipmentToEdit.originAddress || '');
      setDestination(shipmentToEdit.destination || '');
      setDestinationAddress(shipmentToEdit.destinationAddress || '');
      setVehicleNumber(shipmentToEdit.vehicleNumber || '');
      setVehicleType(shipmentToEdit.vehicleType || '');
      setDriverName(shipmentToEdit.driverName || '');
      setDriverPhone(shipmentToEdit.driverPhone || '');
      setStatus(shipmentToEdit.status || 'In Transit');
      setCurrentLocation(shipmentToEdit.currentLocation || '');
      setEstimatedDelivery(shipmentToEdit.estimatedDelivery || '');
      setMaterialType(shipmentToEdit.materialType || '');
      setWeight(shipmentToEdit.weight || '');
      setEWayBillNo(shipmentToEdit.eWayBillNo || '');
      setGpsSpeed(shipmentToEdit.gpsSpeed || '60 km/h');
      setTimeline(shipmentToEdit.timeline || []);
      setDocuments(shipmentToEdit.documents || []);
    } else {
      // Default new shipment template
      const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
      setTrackingId(`NL${randomDigits}`);
      setCustomerName('');
      setCompanyName('');
      setOrigin('Delhi NCR Hub (Gurugram)');
      setOriginAddress('Sector 18, Udyog Vihar Phase IV, Gurugram');
      setDestination('Mumbai Port Hub (Bhiwandi)');
      setDestinationAddress('Mankoli Logistics Hub, Bhiwandi, Maharashtra');
      setVehicleNumber('HR-55-AB-9821');
      setVehicleType(FLEET_DATA[0]?.type || '32 Ft Multi-Axle Container');
      setDriverName('Baldev Singh');
      setDriverPhone('+91 98721 44556');
      setStatus('Booking Confirmed');
      setCurrentLocation('Outshipper Dispatch Hub, Gurugram');
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      setEstimatedDelivery(
        futureDate.toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }) +
          ', 05:00 PM IST'
      );
      setMaterialType('Industrial Goods & Commercial Cargo');
      setWeight('15.0 MT');
      setEWayBillNo(`EWB-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
      setGpsSpeed('0 km/h');
      setDocuments([]);
      setTimeline([
        {
          step: 'Booking Confirmed',
          location: 'Outshipper Dispatch Center, Gurugram',
          timestamp: 'Just Now',
          completed: true,
          current: true,
        },
        {
          step: 'Pickup Scheduled',
          location: 'Consignor Warehouse Dock',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          step: 'In Transit',
          location: 'National Highway Corridor',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          step: 'Delivered',
          location: 'Consignee Delivery Dock',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
      ]);
    }
    setErrorMsg('');
  }, [shipmentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleGenerateId = () => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    setTrackingId(`NL${randomDigits}`);
  };

  const handleApplyFleetVehicle = (vehicleTypeString: string) => {
    setVehicleType(vehicleTypeString);
  };

  const handleAddCheckpoint = () => {
    const newCheckpoint: TimelineCheckpoint = {
      step: 'Checkpoint En-Route',
      location: currentLocation || 'Highway Transit Hub',
      timestamp: 'Pending',
      completed: false,
      current: false,
    };
    setTimeline([...timeline, newCheckpoint]);
  };

  const handleRemoveCheckpoint = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const handleToggleCheckpointDone = (index: number) => {
    setTimeline(
      timeline.map((cp, i) => (i === index ? { ...cp, completed: !cp.completed } : cp))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!trackingId.trim()) {
      setErrorMsg('Please specify a valid Tracking ID.');
      return;
    }
    if (!companyName.trim() && !customerName.trim()) {
      setErrorMsg('Please specify a Client / Company name.');
      return;
    }
    if (!origin.trim() || !destination.trim()) {
      setErrorMsg('Please specify both Origin and Destination hubs.');
      return;
    }

    setSaving(true);
    try {
      const payload: ShipmentRecord = {
        trackingId: trackingId.trim().toUpperCase(),
        customerName: customerName.trim() || companyName.trim(),
        companyName: companyName.trim() || customerName.trim(),
        origin: origin.trim(),
        originAddress: originAddress.trim() || origin.trim(),
        destination: destination.trim(),
        destinationAddress: destinationAddress.trim() || destination.trim(),
        vehicleNumber: vehicleNumber.trim() || 'HR-55-AB-9821',
        vehicleType: vehicleType.trim() || 'Heavy Goods Vehicle',
        driverName: driverName.trim() || 'Assigned Driver',
        driverPhone: driverPhone.trim() || '+91 92123 99003',
        status,
        currentLocation: currentLocation.trim() || origin.trim(),
        estimatedDelivery: estimatedDelivery.trim() || '3-4 Business Days',
        lastUpdated: 'Just now (Updated by Dispatch Admin)',
        materialType: materialType.trim() || 'General Commercial Freight',
        weight: weight.trim() || '12.0 MT',
        eWayBillNo: eWayBillNo.trim() || 'EWB-ONLINE-PENDING',
        gpsSpeed: gpsSpeed.trim(),
        documents: documents,
        timeline: timeline.length > 0 ? timeline : [
          {
            step: 'Booking Confirmed',
            location: origin,
            timestamp: 'Confirmed',
            completed: true,
            current: status === 'Booking Confirmed',
          },
          {
            step: 'In Transit',
            location: 'National Highway Corridor',
            timestamp: 'In Progress',
            completed: ['In Transit', 'Reached Destination Hub', 'Out for Delivery', 'Delivered'].includes(status),
            current: status === 'In Transit',
          },
          {
            step: 'Delivered',
            location: destination,
            timestamp: status === 'Delivered' ? 'Completed' : 'Pending',
            completed: status === 'Delivered',
            current: status === 'Delivered',
          }
        ],
      };

      await onSaveShipment(payload);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to save shipment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-display text-base text-white">
                  {isEditing ? 'Edit Consignment Record' : 'Add New Freight Shipment'}
                </h3>
                {isEditing && shipmentToEdit && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-800">
                    {shipmentToEdit.trackingId}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Re-edit waybill, reassign vehicle/driver, and update milestones.'
                  : 'Register a new consignment with live tracking ID, vehicle allocation & route.'}
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Core Consignment Identifiers */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Consignment & Client Particulars</span>
              </h4>
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleGenerateId}
                  className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate New ID</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tracking ID *</label>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  disabled={isEditing}
                  placeholder="e.g. NL123456789"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-orange-500 disabled:opacity-70"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Company / Consignor *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Electronics Pvt Ltd"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Contact Person</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rajesh Malhotra"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Origin & Destination Lane */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Route & Checkpoint Specifications</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <label className="block text-slate-400 font-semibold">Origin Hub / City *</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Delhi NCR Hub (Gurugram)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
                <input
                  type="text"
                  value={originAddress}
                  onChange={(e) => setOriginAddress(e.target.value)}
                  placeholder="Full Origin Address (e.g. Sector 18, Udyog Vihar)"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400 font-semibold">Destination Hub / City *</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Mumbai Port Hub (Bhiwandi)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="Full Destination Address (e.g. Mankoli Logistics Park)"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vehicle & Driver Allocation */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Fleet & Pilot Deployment</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Vehicle Number *</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. HR-55-AB-9821"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => handleApplyFleetVehicle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 truncate"
                >
                  {FLEET_DATA.map((f) => (
                    <option key={f.id} value={f.type}>
                      {f.type} ({f.capacityTonnes})
                    </option>
                  ))}
                  <option value="Custom Commercial Vehicle">Custom Fleet Vehicle</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Baldev Singh"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Driver Phone</label>
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

          {/* Section 4: Consignment Status & Telematics */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Status, Telematics & Commercial Cargo</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-orange-400 font-bold focus:outline-none focus:border-orange-500"
                >
                  <option value="Booking Confirmed">Booking Confirmed</option>
                  <option value="Pickup Scheduled">Pickup Scheduled</option>
                  <option value="Shipment Picked Up">Shipment Picked Up</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Reached Destination Hub">Reached Destination Hub</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Current GPS Location</label>
                <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="e.g. Ratlam Highway Junction, MP"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Estimated Delivery (ETA)</label>
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="e.g. Oct 08, 2026, 04:30 PM"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Material / Cargo Type</label>
                <input
                  type="text"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  placeholder="e.g. Consumer Electronics & Spares"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Gross Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 16.5 MT"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">GST E-Way Bill Number</label>
                <input
                  type="text"
                  value={eWayBillNo}
                  onChange={(e) => setEWayBillNo(e.target.value)}
                  placeholder="e.g. EWB-2910-4829-1092"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Embedded 'Upload Document' Component (Attach POD, Invoices & Store Metadata) */}
          <UploadDocumentSection
            shipmentTrackingId={trackingId || 'NL-PENDING'}
            consigneeName={companyName || customerName}
            documents={documents}
            onDocumentsChange={(updatedDocs) => setDocuments(updatedDocs)}
            onPodAttached={() => {
              setStatus('Delivered');
            }}
          />

          {/* Section 6: Milestones Timeline Editor */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Tracking Milestones ({timeline.length})</span>
              </h4>
              <button
                type="button"
                onClick={handleAddCheckpoint}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Checkpoint</span>
              </button>
            </div>

            <div className="space-y-2">
              {timeline.map((cp, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCheckpointDone(idx)}
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer ${
                        cp.completed ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                      title="Toggle Completed"
                    >
                      {cp.completed && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>
                    <span className="font-mono text-slate-500 font-bold">{idx + 1}.</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                    <input
                      type="text"
                      value={cp.step}
                      onChange={(e) => {
                        const updated = [...timeline];
                        updated[idx].step = e.target.value;
                        setTimeline(updated);
                      }}
                      placeholder="Stage Title"
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                    />

                    <input
                      type="text"
                      value={cp.location}
                      onChange={(e) => {
                        const updated = [...timeline];
                        updated[idx].location = e.target.value;
                        setTimeline(updated);
                      }}
                      placeholder="Location"
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300"
                    />

                    <input
                      type="text"
                      value={cp.timestamp}
                      onChange={(e) => {
                        const updated = [...timeline];
                        updated[idx].timestamp = e.target.value;
                        setTimeline(updated);
                      }}
                      placeholder="Timestamp (e.g. Oct 06 - 02:30 PM)"
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCheckpoint(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    title="Remove checkpoint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
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
            <span>{isEditing ? 'Save Consignment Changes' : 'Publish & Dispatch Shipment'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
