import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Copy,
  Check,
  ArrowRight,
  WifiOff,
  HardDrive,
  Edit3,
  FileText,
  ShieldCheck,
  Eye,
  Download,
  X,
  FileCheck
} from 'lucide-react';
import { getShipmentByTrackingId, ShipmentRecord, INITIAL_SHIPMENTS, SAMPLE_POD_SVG, SAMPLE_EWAY_SVG } from '../data/shipmentsData';
import { fetchShipmentFromFirestore } from '../services/firestoreService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getCachedShipmentById, cacheShipmentsLocally } from '../services/offlineSyncService';
import { useSiteContent } from '../context/SiteContentContext';

interface TrackingSectionProps {
  initialTrackingId?: string;
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({ initialTrackingId = '' }) => {
  const isOnline = useOnlineStatus();
  const { isEditMode, openEditor } = useSiteContent();
  const [trackingIdInput, setTrackingIdInput] = useState(initialTrackingId || 'NL123456789');
  const [shipment, setShipment] = useState<ShipmentRecord | null>(() => getCachedShipmentById('NL123456789') || getShipmentByTrackingId('NL123456789') || null);
  const [hasSearched, setHasSearched] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isServedFromCache, setIsServedFromCache] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string; type: string } | null>(null);

  useEffect(() => {
    if (initialTrackingId) {
      setTrackingIdInput(initialTrackingId);
      handleTrack(initialTrackingId);
    }
  }, [initialTrackingId]);

  const handleTrack = async (idToTrack?: string) => {
    const query = (idToTrack || trackingIdInput).trim();
    if (!query) return;

    setLoading(true);
    setHasSearched(true);

    if (!isOnline) {
      // Offline mode: retrieve immediately from offline cache
      const cached = getCachedShipmentById(query) || getShipmentByTrackingId(query);
      setShipment(cached || null);
      setIsServedFromCache(true);
      setLoading(false);
      return;
    }

    try {
      const firestoreRecord = await fetchShipmentFromFirestore(query);
      if (firestoreRecord) {
        setShipment(firestoreRecord);
        setIsServedFromCache(false);
        // Persist to offline cache for later access
        cacheShipmentsLocally([firestoreRecord]);
      } else {
        const localFound = getCachedShipmentById(query) || getShipmentByTrackingId(query);
        setShipment(localFound || null);
        setIsServedFromCache(true);
      }
    } catch {
      const localFound = getCachedShipmentById(query) || getShipmentByTrackingId(query);
      setShipment(localFound || null);
      setIsServedFromCache(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetId: string) => {
    setTrackingIdInput(presetId);
    handleTrack(presetId);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="tracking" className="relative -mt-6 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative group">
      {/* Owner In-Place Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-8 z-30">
          <button
            onClick={() => openEditor('hero')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-md border border-orange-400 cursor-pointer animate-pulse"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Tracking Info</span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl border border-slate-800 overflow-hidden">
        {/* Top Header & Search Area */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0B1528] via-[#0F172A] to-[#1E293B] text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Pan-India Real-Time Freight Tracking
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
              Track Your Shipment
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Enter your 11-digit consignment tracking number or E-Way transport receipt to view live vehicle telematics and milestone progress.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder="Enter Tracking ID (e.g. NL123456789)"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-lg text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors uppercase tracking-wider"
              />
            </div>

            <button
              onClick={() => handleTrack()}
              disabled={loading}
              className="px-7 py-3.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Track Shipment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Tracking Numbers for instant testing */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Try Demo Consignments:</span>
            {INITIAL_SHIPMENTS.slice(0, 4).map((demo) => (
              <button
                key={demo.trackingId}
                onClick={() => handlePresetClick(demo.trackingId)}
                className={`px-2.5 py-1 rounded font-mono transition-colors text-[11px] cursor-pointer ${
                  trackingIdInput === demo.trackingId
                    ? 'bg-orange-600 text-white font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {demo.trackingId} ({demo.status})
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="p-6 sm:p-8 bg-slate-50/50">
            {shipment ? (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Offline Cache Status Notification */}
                {(!isOnline || isServedFromCache) && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>
                        <strong>Offline Telematics Active:</strong> Consignment records verified and served from device cache. Full milestone timeline accessible without network.
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200/80 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Device Cache
                    </span>
                  </div>
                )}

                {/* Shipment Top Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Consignment ID & Status */}
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Tracking ID</span>
                      <button
                        onClick={() => handleCopy(shipment.trackingId)}
                        className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                        title="Copy Tracking ID"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="font-mono text-lg font-bold text-slate-900 tracking-wide">
                      {shipment.trackingId}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                      <span className="w-2 h-2 rounded-full bg-orange-600" />
                      <span>{shipment.status}</span>
                    </div>
                  </div>

                  {/* Card 2: Vehicle & Driver */}
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 mb-1">Vehicle & Driver</div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {shipment.vehicleNumber}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 truncate">
                      {shipment.vehicleType}
                    </div>
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{shipment.driverName}</span>
                    </div>
                  </div>

                  {/* Card 3: Route Origin & Destination */}
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 mb-1">Origin → Destination</div>
                    <div className="text-xs font-semibold text-slate-800">
                      From: <span className="font-normal text-slate-600">{shipment.origin}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">
                      To: <span className="font-normal text-slate-600">{shipment.destination}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2">
                      Payload: <span className="font-semibold text-slate-700">{shipment.weight}</span> · {shipment.materialType}
                    </div>
                  </div>

                  {/* Card 4: Estimated Delivery & GPS Status */}
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 mb-1">Estimated Delivery</div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span>{shipment.estimatedDelivery}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Last updated: {shipment.lastUpdated}</span>
                    </div>
                    {shipment.gpsSpeed && (
                      <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                        GPS Speed: {shipment.gpsSpeed}
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Current Location Box */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-600 text-white shrink-0 mt-0.5 sm:mt-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                        Current Vehicle GPS Coordinates
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {shipment.currentLocation}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-2 self-start sm:self-auto">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>E-Way Bill: <strong className="font-mono text-slate-800">{shipment.eWayBillNo}</strong></span>
                  </div>
                </div>

                {/* Professional Tracking Timeline (7 Checkpoints) */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      Shipment Movement Timeline
                    </h3>
                    <span className="text-xs text-slate-500">
                      Standard Pan-India 7-Stage Audit Trail
                    </span>
                  </div>

                  {/* Horizontal on desktop, Vertical on mobile */}
                  <div className="relative">
                    <div className="hidden lg:grid grid-cols-7 gap-2 relative">
                      {/* Connector Line behind steps */}
                      <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

                      {shipment.timeline.map((point, index) => {
                        const isDone = point.completed;
                        const isCurrent = point.current;

                        return (
                          <div key={index} className="relative z-10 flex flex-col items-center text-center px-1">
                            {/* Step Indicator Node */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isCurrent
                                  ? 'bg-orange-600 text-white ring-4 ring-orange-100 shadow-md'
                                  : isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}
                            >
                              {isDone && !isCurrent ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>

                            {/* Step Title */}
                            <div className="mt-3 text-xs font-bold text-slate-900 leading-tight">
                              {point.step}
                            </div>

                            {/* Timestamp */}
                            <div className="mt-1 text-[11px] text-slate-500 font-medium">
                              {point.timestamp}
                            </div>

                            {/* Location Note */}
                            <div className="mt-1 text-[10px] text-slate-600 leading-tight">
                              {point.location}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile / Tablet Vertical Timeline */}
                    <div className="lg:hidden space-y-6 relative border-l-2 border-slate-200 ml-4 pl-6">
                      {shipment.timeline.map((point, index) => {
                        const isDone = point.completed;
                        const isCurrent = point.current;

                        return (
                          <div key={index} className="relative group">
                            {/* Dot */}
                            <div
                              className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCurrent
                                  ? 'bg-orange-600 text-white ring-4 ring-orange-100'
                                  : isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}
                            >
                              {isDone && !isCurrent ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>

                            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-slate-900">{point.step}</span>
                                <span className="text-xs text-slate-500 font-medium">{point.timestamp}</span>
                              </div>
                              <div className="text-xs text-slate-600 mt-1">
                                {point.location}
                              </div>
                              {point.notes && (
                                <div className="text-xs text-orange-700 bg-orange-50/70 p-2 rounded mt-2">
                                  {point.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section: Verified Consignment Documents & Proof of Delivery (POD) */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-display">
                          Verified Documents &amp; Proof of Delivery (POD)
                        </h4>
                        <p className="text-xs text-slate-500">
                          Official electronic delivery acknowledgment and GST E-Way Bill transit permits.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Certified Outshipper Carrier Transit</span>
                      </span>
                    </div>
                  </div>

                  {/* Documents Grid / List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {/* Always ensure E-Way Bill is visible or generated */}
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 truncate">
                            GST E-Way Bill Permit
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {shipment.eWayBillNo}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDoc({
                              name: `GST E-Way Bill (${shipment.eWayBillNo})`,
                              url: SAMPLE_EWAY_SVG,
                              type: 'E-Way Bill',
                            })
                          }
                          className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>

                    {/* Proof of Delivery (POD) Card */}
                    <div
                      className={`p-3.5 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                        shipment.documents?.some((d) => d.type === 'POD') || shipment.status === 'Delivered'
                          ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/60'
                          : 'border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                            shipment.documents?.some((d) => d.type === 'POD') || shipment.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 truncate flex items-center gap-1.5">
                            <span>Proof of Delivery (POD)</span>
                            {(shipment.documents?.some((d) => d.type === 'POD') || shipment.status === 'Delivered') && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {shipment.status === 'Delivered'
                              ? 'Delivered & Receiver Stamped'
                              : 'Available upon delivery'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const podDoc = shipment.documents?.find((d) => d.type === 'POD');
                            setPreviewDoc({
                              name: podDoc?.name || `Verified Proof of Delivery - ${shipment.trackingId}`,
                              url: podDoc?.fileUrl || SAMPLE_POD_SVG,
                              type: 'POD',
                            });
                          }}
                          className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View POD</span>
                        </button>
                      </div>
                    </div>

                    {/* Any custom uploaded documents */}
                    {(shipment.documents || [])
                      .filter((d) => d.type !== 'POD' && d.type !== 'E-Way Bill')
                      .map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-slate-900 truncate">
                                {doc.name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {doc.type} · {doc.uploadedAt}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setPreviewDoc({
                                name: doc.name,
                                url: doc.fileUrl,
                                type: doc.type,
                              })
                            }
                            className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Preview</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Error State: Tracking ID Not Found */
              <div className="py-10 px-4 text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Tracking Information Not Found
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tracking information could not be found for <strong className="font-mono text-slate-900">{trackingIdInput}</strong>. Please check your Tracking ID and try again, or test one of the demo consignment IDs above.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handlePresetClick('NL123456789')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Load Sample Tracking Record (NL123456789)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Document & POD Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <h4 className="font-bold text-sm">{previewDoc.name}</h4>
                <p className="text-[11px] text-slate-400">
                  {previewDoc.type} · Outshipper Verified Digital Document
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.url}
                  download={`${previewDoc.type}-${shipment?.trackingId || 'doc'}`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center flex-1 bg-slate-950/40 min-h-[350px]">
              <img
                src={previewDoc.url}
                alt={previewDoc.name}
                className="max-h-[70vh] max-w-full object-contain rounded-lg border border-slate-800 shadow-lg bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
