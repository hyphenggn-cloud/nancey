import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Truck,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  FileText,
  Mail,
  BarChart3,
  Settings,
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  ExternalLink,
  Shield,
  ShieldCheck,
  MapPin,
  TrendingUp,
  AlertTriangle,
  LogIn,
  LogOut,
  Upload,
  Eye,
  FileCheck,
  Compass,
  CreditCard,
  Fuel,
  CheckCircle2,
  AlertCircle,
  Sliders,
  MessageSquare
} from 'lucide-react';
import { INITIAL_SHIPMENTS, ShipmentRecord, ShipmentStatus, ShipmentDocument } from '../data/shipmentsData';
import { INITIAL_TRIPS, TripRecord, TripStatus } from '../data/tripsData';
import { FLEET_DATA } from '../data/fleetData';
import { QuoteRequestData } from './QuoteSection';
import { ContactEnquiryData } from './ContactSection';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { cacheShipmentsLocally, cacheTripsLocally } from '../services/offlineSyncService';
import {
  formatQuoteWhatsAppMessage,
  formatEnquiryWhatsAppMessage,
  formatOwnerQuoteReplyMessage,
  getWhatsAppUrl,
  OWNER_WHATSAPP_RAW,
  OWNER_WHATSAPP_DISPLAY
} from '../lib/whatsapp';
import {
  subscribeToShipments,
  subscribeToTrips,
  subscribeToQuotes,
  subscribeToEnquiries,
  updateShipmentStatusInFirestore,
  addShipmentToFirestore,
  updateShipmentInFirestore,
  deleteShipmentFromFirestore,
  addTripToFirestore,
  updateTripInFirestore,
  deleteTripFromFirestore,
  uploadShipmentDocument,
  deleteShipmentDocument,
  uploadTripDocument,
  deleteTripDocument
} from '../services/firestoreService';
import { ShipmentModal } from './ShipmentModal';
import { TripModal } from './TripModal';
import { DocumentUploadModal } from './DocumentUploadModal';

interface DashboardViewProps {
  onBackToWebsite: () => void;
  onTrackShipment: (trackingId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onBackToWebsite,
  onTrackShipment,
}) => {
  const { user, isAdmin, openOwnerModal, signInWithGoogle, logout } = useAuth();
  const { openEditor } = useSiteContent();
  const isOnline = useOnlineStatus();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'shipments' | 'trips' | 'quotes' | 'enquiries' | 'vehicles' | 'drivers' | 'reports' | 'settings'
  >('dashboard');

  // Main Data States
  const [shipments, setShipments] = useState<ShipmentRecord[]>(INITIAL_SHIPMENTS);
  const [trips, setTrips] = useState<TripRecord[]>(INITIAL_TRIPS);
  const [quotes, setQuotes] = useState<QuoteRequestData[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiryData[]>([]);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [tripSearchTerm, setTripSearchTerm] = useState('');
  const [tripStatusFilter, setTripStatusFilter] = useState<string>('All');

  // Modal States
  const [shipmentModalOpen, setShipmentModalOpen] = useState(false);
  const [shipmentToEdit, setShipmentToEdit] = useState<ShipmentRecord | null>(null);

  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<TripRecord | null>(null);

  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [documentTarget, setDocumentTarget] = useState<{
    type: 'shipment' | 'trip';
    id: string;
    title: string;
    docs: ShipmentDocument[];
  } | null>(null);

  // Deletion Confirmation States
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'shipment' | 'trip';
    id: string;
    label: string;
  } | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time Firestore subscriptions with localStorage fallback
  useEffect(() => {
    // 1. Subscribe to Shipments
    const unsubShipments = subscribeToShipments((liveShipments) => {
      setShipments(liveShipments);
      cacheShipmentsLocally(liveShipments);
    });

    // 2. Subscribe to Trips
    const unsubTrips = subscribeToTrips((liveTrips) => {
      setTrips(liveTrips);
      cacheTripsLocally(liveTrips);
    });

    // 3. Subscribe to Quotes
    const unsubQuotes = subscribeToQuotes(user?.uid, isAdmin, (liveQuotes) => {
      if (liveQuotes.length > 0) {
        setQuotes(liveQuotes);
      } else {
        try {
          const stored = localStorage.getItem('outshipper_quotes') || localStorage.getItem('nancy_logistics_quotes');
          if (stored) setQuotes(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    });

    // 4. Subscribe to Enquiries
    const unsubEnquiries = subscribeToEnquiries((liveEnquiries) => {
      if (liveEnquiries.length > 0) {
        setEnquiries(liveEnquiries);
      } else {
        try {
          const stored = localStorage.getItem('outshipper_enquiries') || localStorage.getItem('nancy_logistics_enquiries');
          if (stored) setEnquiries(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    });

    return () => {
      unsubShipments();
      unsubTrips();
      unsubQuotes();
      unsubEnquiries();
    };
  }, [user, isAdmin]);

  // Handlers for Shipments
  const handleStatusChange = async (trackingId: string, newStatus: ShipmentStatus) => {
    setShipments((prev) =>
      prev.map((s) => (s.trackingId === trackingId ? { ...s, status: newStatus } : s))
    );

    try {
      await updateShipmentStatusInFirestore(trackingId, newStatus);
      showToast(`Status updated to "${newStatus}" for ${trackingId}`);
    } catch (err) {
      console.warn('Could not update status in Firestore:', err);
    }
  };

  const handleSaveShipment = async (savedShipment: ShipmentRecord) => {
    const isEdit = shipments.some((s) => s.trackingId === savedShipment.trackingId);
    if (isEdit) {
      setShipments((prev) =>
        prev.map((s) => (s.trackingId === savedShipment.trackingId ? savedShipment : s))
      );
      await updateShipmentInFirestore(savedShipment.trackingId, savedShipment);
      showToast(`Consignment ${savedShipment.trackingId} updated successfully.`);
    } else {
      setShipments((prev) => [savedShipment, ...prev]);
      await addShipmentToFirestore(savedShipment);
      showToast(`New shipment ${savedShipment.trackingId} dispatched!`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'shipment') {
      const trackingId = itemToDelete.id;
      setShipments((prev) => prev.filter((s) => s.trackingId !== trackingId));
      try {
        await deleteShipmentFromFirestore(trackingId);
        showToast(`Shipment ${trackingId} permanently deleted.`);
      } catch (err) {
        console.error(err);
      }
    } else if (itemToDelete.type === 'trip') {
      const tripId = itemToDelete.id;
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      try {
        await deleteTripFromFirestore(tripId);
        showToast(`Trip ${tripId} permanently deleted.`);
      } catch (err) {
        console.error(err);
      }
    }

    setItemToDelete(null);
  };

  // Handlers for Trips
  const handleSaveTrip = async (savedTrip: TripRecord) => {
    const isEdit = trips.some((t) => t.id === savedTrip.id);
    if (isEdit) {
      setTrips((prev) => prev.map((t) => (t.id === savedTrip.id ? savedTrip : t)));
      await updateTripInFirestore(savedTrip.id, savedTrip);
      showToast(`Trip ${savedTrip.tripNumber} updated.`);
    } else {
      setTrips((prev) => [savedTrip, ...prev]);
      await addTripToFirestore(savedTrip);
      showToast(`New trip ${savedTrip.tripNumber} scheduled!`);
    }
  };

  // Document & POD Handlers
  const handleOpenDocModalForShipment = (shipment: ShipmentRecord) => {
    setDocumentTarget({
      type: 'shipment',
      id: shipment.trackingId,
      title: `${shipment.companyName} (${shipment.origin} → ${shipment.destination})`,
      docs: shipment.documents || [],
    });
    setDocumentModalOpen(true);
  };

  const handleOpenDocModalForTrip = (trip: TripRecord) => {
    setDocumentTarget({
      type: 'trip',
      id: trip.tripNumber || trip.id,
      title: `${trip.originHub} → ${trip.destinationHub} (${trip.vehicleNumber})`,
      docs: trip.documents || [],
    });
    setDocumentModalOpen(true);
  };

  const handleDocumentUploaded = async (doc: ShipmentDocument) => {
    if (!documentTarget) return;

    if (documentTarget.type === 'shipment') {
      await uploadShipmentDocument(documentTarget.id, doc);
      setShipments((prev) =>
        prev.map((s) => {
          if (s.trackingId === documentTarget.id) {
            const existing = s.documents || [];
            return {
              ...s,
              documents: [doc, ...existing.filter((d) => d.id !== doc.id)],
              status: doc.type === 'POD' ? 'Delivered' : s.status,
            };
          }
          return s;
        })
      );
      setDocumentTarget((prev) => (prev ? { ...prev, docs: [doc, ...prev.docs] } : null));
      showToast(`Document "${doc.name}" attached to ${documentTarget.id}.`);
    } else {
      await uploadTripDocument(documentTarget.id, doc);
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === documentTarget.id || t.tripNumber === documentTarget.id) {
            const existing = t.documents || [];
            return {
              ...t,
              documents: [doc, ...existing.filter((d) => d.id !== doc.id)],
              podUploaded: doc.type === 'POD' ? true : t.podUploaded,
            };
          }
          return t;
        })
      );
      setDocumentTarget((prev) => (prev ? { ...prev, docs: [doc, ...prev.docs] } : null));
      showToast(`Document "${doc.name}" attached to Trip ${documentTarget.id}.`);
    }
  };

  const handleDocumentDeleted = async (docId: string) => {
    if (!documentTarget) return;

    if (documentTarget.type === 'shipment') {
      await deleteShipmentDocument(documentTarget.id, docId);
      setShipments((prev) =>
        prev.map((s) =>
          s.trackingId === documentTarget.id
            ? { ...s, documents: (s.documents || []).filter((d) => d.id !== docId) }
            : s
        )
      );
      setDocumentTarget((prev) =>
        prev ? { ...prev, docs: prev.docs.filter((d) => d.id !== docId) } : null
      );
      showToast('Document removed.');
    } else {
      await deleteTripDocument(documentTarget.id, docId);
      setTrips((prev) =>
        prev.map((t) =>
          t.id === documentTarget.id || t.tripNumber === documentTarget.id
            ? { ...t, documents: (t.documents || []).filter((d) => d.id !== docId) }
            : t
        )
      );
      setDocumentTarget((prev) =>
        prev ? { ...prev, docs: prev.docs.filter((d) => d.id !== docId) } : null
      );
      showToast('Trip document removed.');
    }
  };

  // Filtered Shipments
  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Trips
  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.tripNumber.toLowerCase().includes(tripSearchTerm.toLowerCase()) ||
      t.shipmentId.toLowerCase().includes(tripSearchTerm.toLowerCase()) ||
      t.originHub.toLowerCase().includes(tripSearchTerm.toLowerCase()) ||
      t.destinationHub.toLowerCase().includes(tripSearchTerm.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(tripSearchTerm.toLowerCase()) ||
      t.driverName.toLowerCase().includes(tripSearchTerm.toLowerCase());

    const matchesStatus = tripStatusFilter === 'All' || t.status === tripStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-70 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToWebsite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-white text-sm">
              OUTSHIPPER<span className="text-[#E60023] ml-0.5">PVT LTD</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-900/60 text-[10px] font-mono font-bold">
              OWNER &amp; OPS CONTROL PANEL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Real-time Status */}
          <div className="hidden sm:flex items-center gap-2">
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Firestore Synced · Real-time</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Offline Mode · Cached Operations</span>
              </span>
            )}
          </div>

          {/* Quick Edit Website CMS Button */}
          <button
            onClick={() => openEditor()}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-red-400 hover:text-red-300 font-semibold rounded-lg transition-colors cursor-pointer"
            title="Edit Website Content (CMS)"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Website (CMS)</span>
          </button>

          {/* Owner Status / Auth Control */}
          {isAdmin ? (
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/80 rounded-lg px-2.5 py-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-bold text-[11px]">Owner Verified</span>
              <span className="text-slate-400 text-[10px] truncate max-w-[140px]">
                {user?.email || 'connect@outshipper.in'}
              </span>
            </div>
          ) : (
            <button
              onClick={openOwnerModal}
              className="px-3 py-1 bg-[#E60023] hover:bg-red-700 text-white font-bold rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Authenticate as Outshipper Owner"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Owner Login / Passkey</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => logout()}
              className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-4 space-y-1 shrink-0 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Dispatch &amp; Operations
            </div>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Operations Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('shipments')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'shipments'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Shipments Dispatch</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 font-mono text-slate-300">
                {shipments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('trips')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'trips'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4" />
                <span>Trips &amp; Line-Haul</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 font-mono text-slate-300">
                {trips.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'quotes'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Quotes Received</span>
              </div>
              {quotes.length > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-500 text-white font-bold font-mono">
                  {quotes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Contact Enquiries</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 font-mono text-slate-300">
                {enquiries.length}
              </span>
            </button>

            <div className="pt-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Fleet &amp; Resources
            </div>

            <button
              onClick={() => setActiveTab('vehicles')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'vehicles'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Vehicles &amp; Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('drivers')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'drivers'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Commercial Drivers</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Audit Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Console Settings</span>
            </button>
          </div>

          {/* Sidebar Bottom: Owner Panel Access Card */}
          <div className="pt-4 border-t border-slate-800/80 mt-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>Owner Panel</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                  {isAdmin ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Full authority to Add, Edit, Delete shipments &amp; trips, and upload POD documents.
              </p>
              {!isAdmin ? (
                <button
                  onClick={openOwnerModal}
                  className="w-full py-1.5 px-2 bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Unlock Owner Mode
                </button>
              ) : (
                <button
                  onClick={() => openEditor()}
                  className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-orange-300 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Edit Live Site (CMS)</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* TAB 1: OPERATIONS DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold font-display text-white">
                      Pan-India Dispatch &amp; Line-Haul Command
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Real-time operational dashboard for Outshipper Private Limited. Manage freight consignments, trip line-hauls, Proof of Delivery (POD) uploads, and commercial quotations.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setShipmentToEdit(null);
                      setShipmentModalOpen(true);
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Shipment</span>
                  </button>

                  <button
                    onClick={() => {
                      setTripToEdit(null);
                      setTripModalOpen(true);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-orange-400" />
                    <span>+ Add Trip</span>
                  </button>
                </div>
              </div>

              {/* High-Level Metric Tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Total Waybill Consignments</div>
                  <div className="text-2xl font-bold text-white font-display tabular-nums mt-1">
                    {shipments.length}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Live Tracking Sync</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Active Highway Trips</div>
                  <div className="text-2xl font-bold text-orange-400 font-display tabular-nums mt-1">
                    {trips.length}
                  </div>
                  <div className="text-[10px] text-orange-300/80 mt-2">
                    {trips.filter((t) => t.status === 'On Route').length} In Transit Line-Hauls
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Verified PODs Uploaded</div>
                  <div className="text-2xl font-bold text-emerald-400 font-display tabular-nums mt-1">
                    {shipments.filter((s) => s.documents?.some((d) => d.type === 'POD') || s.status === 'Delivered').length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">Delivered &amp; Stamped</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Pending Quote Inquiries</div>
                  <div className="text-2xl font-bold text-cyan-400 font-display tabular-nums mt-1">
                    {quotes.length}
                  </div>
                  <div className="text-[10px] text-cyan-300/80 mt-2">Commercial Shipper Leads</div>
                </div>
              </div>

              {/* Live Shipments Quick Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-display">
                      Active Consignments (Live Dispatches)
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">({shipments.length})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setShipmentToEdit(null);
                        setShipmentModalOpen(true);
                      }}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Shipment</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('shipments')}
                      className="text-xs text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                    >
                      Manage All Shipments →
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/60 border-b border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Tracking ID</th>
                        <th className="py-2.5 px-3">Client</th>
                        <th className="py-2.5 px-3">Origin → Destination</th>
                        <th className="py-2.5 px-3">Vehicle</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">POD &amp; Docs</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {shipments.slice(0, 6).map((s) => {
                        const hasPod = s.documents?.some((d) => d.type === 'POD');
                        return (
                          <tr key={s.trackingId} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-orange-400">
                              {s.trackingId}
                            </td>
                            <td className="py-3 px-3 font-medium text-white">{s.companyName}</td>
                            <td className="py-3 px-3 text-slate-300">
                              {s.origin} → {s.destination}
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-400">{s.vehicleNumber}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  s.status === 'Delivered'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                    : s.status === 'In Transit'
                                    ? 'bg-orange-950 text-orange-400 border border-orange-800/60'
                                    : 'bg-blue-950 text-blue-400 border border-blue-800/60'
                                }`}
                              >
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => handleOpenDocModalForShipment(s)}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                                  hasPod
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                {hasPod ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>POD Attached</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3 h-3 text-slate-400" />
                                    <span>Upload POD</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setShipmentToEdit(s);
                                    setShipmentModalOpen(true);
                                  }}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
                                  title="Edit Consignment"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    onTrackShipment(s.trackingId);
                                    onBackToWebsite();
                                  }}
                                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold cursor-pointer"
                                  title="Public Tracking"
                                >
                                  Track
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHIPMENTS DISPATCH (FULL CRUD: ADD, EDIT, DELETE, POD UPLOAD) */}
          {activeTab === 'shipments' && (
            <div className="space-y-6">
              {/* Header with Add Shipment Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">
                    Shipment Consignment Records
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Owner management panel: Add new shipments, re-edit waybills, upload Proof of Delivery (POD), and delete records.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, Client, Route..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500 w-48 sm:w-56"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Booking Confirmed">Booking Confirmed</option>
                    <option value="Pickup Scheduled">Pickup Scheduled</option>
                    <option value="Shipment Picked Up">Shipment Picked Up</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Reached Destination Hub">Reached Destination Hub</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => {
                      setShipmentToEdit(null);
                      setShipmentModalOpen(true);
                    }}
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Shipment</span>
                  </button>
                </div>
              </div>

              {/* Shipments Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/80 border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Tracking ID</th>
                        <th className="py-3 px-4">Client / Consignor</th>
                        <th className="py-3 px-4">Origin Hub</th>
                        <th className="py-3 px-4">Destination Hub</th>
                        <th className="py-3 px-4">Vehicle &amp; Driver</th>
                        <th className="py-3 px-4">Status (Editable)</th>
                        <th className="py-3 px-4">POD &amp; Documents</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredShipments.map((s) => {
                        const hasPod = s.documents?.some((d) => d.type === 'POD');
                        const docCount = s.documents?.length || 0;

                        return (
                          <tr key={s.trackingId} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                              {s.trackingId}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white">{s.companyName}</div>
                              <div className="text-[11px] text-slate-400">{s.customerName}</div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">{s.origin}</td>
                            <td className="py-3.5 px-4 text-slate-300">{s.destination}</td>
                            <td className="py-3.5 px-4">
                              <div className="font-mono text-white">{s.vehicleNumber}</div>
                              <div className="text-[11px] text-slate-400">{s.driverName}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={s.status}
                                onChange={(e) =>
                                  handleStatusChange(s.trackingId, e.target.value as ShipmentStatus)
                                }
                                className="bg-slate-800 border border-slate-700 text-orange-300 text-[11px] font-semibold rounded px-2 py-1 focus:outline-none focus:border-orange-500 cursor-pointer"
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
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleOpenDocModalForShipment(s)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                  hasPod
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                }`}
                                title="Manage documents & Proof of Delivery"
                              >
                                {hasPod ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>POD Verified ({docCount})</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                                    <span>Upload POD ({docCount})</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setShipmentToEdit(s);
                                    setShipmentModalOpen(true);
                                  }}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded transition-colors cursor-pointer"
                                  title="Edit full shipment consignment"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-orange-400" />
                                </button>

                                <button
                                  onClick={() =>
                                    setItemToDelete({
                                      type: 'shipment',
                                      id: s.trackingId,
                                      label: `Shipment ${s.trackingId} (${s.companyName})`,
                                    })
                                  }
                                  className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded transition-colors cursor-pointer"
                                  title="Delete shipment record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    onTrackShipment(s.trackingId);
                                    onBackToWebsite();
                                  }}
                                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold cursor-pointer"
                                  title="View Public Tracking Page"
                                >
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredShipments.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No shipments match the current search or filter criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TRIPS & LINE-HAUL FLEET MANAGEMENT (ADD, EDIT, DELETE, POD UPLOAD) */}
          {activeTab === 'trips' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">
                    Line-Haul Fleet Trips
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage active line-hauls, kilometer milestones, Fastag toll allocations, and trip Proof of Delivery (POD).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Trip, Vehicle, Driver..."
                      value={tripSearchTerm}
                      onChange={(e) => setTripSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500 w-48 sm:w-56"
                    />
                  </div>

                  <select
                    value={tripStatusFilter}
                    onChange={(e) => setTripStatusFilter(e.target.value)}
                    className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="All">All Trip Statuses</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Loading">Loading</option>
                    <option value="On Route">On Route</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => {
                      setTripToEdit(null);
                      setTripModalOpen(true);
                    }}
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Trip</span>
                  </button>
                </div>
              </div>

              {/* Trip Stats Ribbon */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] text-slate-400">Total Trips Registered</span>
                  <div className="text-xl font-bold text-white font-mono mt-1">{trips.length}</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] text-slate-400">On Highway Line-Haul</span>
                  <div className="text-xl font-bold text-orange-400 font-mono mt-1">
                    {trips.filter((t) => t.status === 'On Route').length}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] text-slate-400">Delivered / Completed</span>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                    {trips.filter((t) => t.status === 'Completed').length}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] text-slate-400">POD Uploaded Status</span>
                  <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
                    {trips.filter((t) => t.podUploaded || t.documents?.some((d) => d.type === 'POD')).length} / {trips.length}
                  </div>
                </div>
              </div>

              {/* Trips Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-800/80 border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Trip Number</th>
                        <th className="py-3 px-4">Waybill Consignment</th>
                        <th className="py-3 px-4">Vehicle &amp; Driver</th>
                        <th className="py-3 px-4">Route Hubs</th>
                        <th className="py-3 px-4">Distance Progress</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">POD &amp; Documents</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredTrips.map((t) => {
                        const hasPod = t.podUploaded || t.documents?.some((d) => d.type === 'POD');
                        const docCount = t.documents?.length || 0;
                        const pct = t.totalKm > 0 ? Math.min(100, Math.round((t.currentKm / t.totalKm) * 100)) : 0;

                        return (
                          <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-mono font-bold text-orange-400">{t.tripNumber}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{t.startDateTime}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              {t.shipmentId ? (
                                <button
                                  onClick={() => {
                                    onTrackShipment(t.shipmentId);
                                    onBackToWebsite();
                                  }}
                                  className="font-mono text-cyan-400 hover:underline font-semibold"
                                >
                                  {t.shipmentId}
                                </button>
                              ) : (
                                <span className="text-slate-500 italic">No waybill linked</span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-mono text-white font-semibold">{t.vehicleNumber}</div>
                              <div className="text-[11px] text-slate-400">
                                {t.driverName} ({t.driverPhone})
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="text-white">{t.originHub}</div>
                              <div className="text-[11px] text-slate-400">→ {t.destinationHub}</div>
                            </td>

                            <td className="py-3.5 px-4 min-w-[140px]">
                              <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                                <span>{t.currentKm} / {t.totalKm} KM</span>
                                <span>{pct}%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-orange-500 h-full rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  t.status === 'Completed'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                    : t.status === 'On Route'
                                    ? 'bg-orange-950 text-orange-400 border border-orange-800/60'
                                    : 'bg-blue-950 text-blue-400 border border-blue-800/60'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleOpenDocModalForTrip(t)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                  hasPod
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                }`}
                                title="Manage trip documents and Proof of Delivery"
                              >
                                {hasPod ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>POD Uploaded ({docCount})</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                                    <span>Upload POD ({docCount})</span>
                                  </>
                                )}
                              </button>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setTripToEdit(t);
                                    setTripModalOpen(true);
                                  }}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded transition-colors cursor-pointer"
                                  title="Edit trip"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-orange-400" />
                                </button>

                                <button
                                  onClick={() =>
                                    setItemToDelete({
                                      type: 'trip',
                                      id: t.id,
                                      label: `Trip ${t.tripNumber} (${t.originHub} → ${t.destinationHub})`,
                                    })
                                  }
                                  className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded transition-colors cursor-pointer"
                                  title="Delete trip record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredTrips.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No trips found matching the criteria. Click "+ Add New Trip" above to register a line-haul dispatch.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: QUOTES RECEIVED */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">
                  Incoming Commercial Rate Inquiries
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Requests submitted by B2B clients via the public "Get a Quote" quotation form.
                </p>
              </div>

              {quotes.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                  <p>No new quote requests have been submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-orange-400 font-bold">{q.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950 text-orange-400 border border-orange-900/60">
                            {q.status}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px]">Submitted: {q.submittedAt}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
                        <div>
                          <span className="text-slate-500 block">Company &amp; Contact</span>
                          <span className="font-bold text-white text-sm block">{q.companyName}</span>
                          <span className="text-slate-300">{q.contactPerson}</span>
                          <div className="text-slate-400 mt-1 font-mono">{q.mobileNumber}</div>
                          <div className="text-slate-400">{q.email}</div>
                        </div>

                        <div>
                          <span className="text-slate-500 block">Route Specification</span>
                          <div className="text-slate-200 mt-1">
                            <strong>From:</strong> {q.pickupLocation}
                          </div>
                          <div className="text-slate-200 mt-1">
                            <strong>To:</strong> {q.deliveryLocation}
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-500 block">Cargo &amp; Vehicle Class</span>
                          <div className="text-white font-medium mt-1">
                            {q.materialType} ({q.approximateWeight})
                          </div>
                          <div className="text-orange-400 font-semibold mt-1">
                            {q.vehicleRequirement}
                          </div>
                          <div className="text-slate-400 text-[11px] mt-1">
                            Pickup Date: {q.pickupDate}
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-500 block">Special Directives</span>
                          <p className="text-slate-300 text-[11px] mt-1 italic">
                            {q.additionalRequirements || 'Standard road transit requirements.'}
                          </p>
                        </div>
                      </div>

                      {/* Action Bar for Quotes: Reply to customer on WhatsApp or Forward to Owner */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={getWhatsAppUrl(
                              formatOwnerQuoteReplyMessage(q),
                              q.mobileNumber
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reply to Customer on WhatsApp ({q.mobileNumber})</span>
                          </a>

                          <a
                            href={getWhatsAppUrl(
                              formatQuoteWhatsAppMessage(q),
                              OWNER_WHATSAPP_RAW
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer text-[11px]"
                          >
                            <span>Forward to Owner WhatsApp ({OWNER_WHATSAPP_DISPLAY})</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>

                        <button
                          onClick={() => {
                            const newTrackingId = `NL${Math.floor(100000000 + Math.random() * 900000000)}`;
                            setShipmentToEdit({
                              trackingId: newTrackingId,
                              customerName: q.contactPerson,
                              companyName: q.companyName,
                              origin: q.pickupLocation,
                              originAddress: q.pickupLocation,
                              destination: q.deliveryLocation,
                              destinationAddress: q.deliveryLocation,
                              vehicleNumber: 'HR-55-AB-9821',
                              vehicleType: q.vehicleRequirement,
                              driverName: 'Baldev Singh',
                              driverPhone: '+91 98100 23456',
                              status: 'Booking Confirmed',
                              currentLocation: q.pickupLocation,
                              estimatedDelivery: q.pickupDate || new Date().toISOString().split('T')[0],
                              lastUpdated: new Date().toLocaleString(),
                              materialType: q.materialType,
                              weight: q.approximateWeight,
                              eWayBillNo: `EWB-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
                              timeline: [
                                {
                                  step: 'Booking Confirmed',
                                  location: q.pickupLocation,
                                  timestamp: new Date().toLocaleString(),
                                  completed: true,
                                  current: true,
                                  notes: `Converted from quote #${q.id} for ${q.companyName}`,
                                }
                              ]
                            });
                            setShipmentModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Convert to Active Shipment</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CONTACT ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">
                  Contact Form Enquiries
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enquiries received through the public contact page.
                </p>
              </div>

              {enquiries.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
                  <Mail className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                  <p>No enquiries recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                        <span className="font-mono text-orange-400 font-bold">{enq.id}</span>
                        <span className="text-slate-400 text-[11px]">{enq.submittedAt}</span>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-bold text-white text-sm block">{enq.name}</span>
                          <span className="text-slate-300">{enq.company}</span>
                          <div className="text-slate-400 mt-1">{enq.phone} · {enq.email}</div>
                        </div>

                        <div className="sm:col-span-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                            Message Content:
                          </span>
                          <p className="text-slate-200 leading-relaxed text-xs">{enq.message}</p>
                        </div>
                      </div>

                      {/* Action Bar for Enquiries */}
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <a
                          href={getWhatsAppUrl(
                            `Hello ${enq.name}, thank you for reaching out to Outshipper Private Limited regarding your enquiry (Ref: #${enq.id}). How can our dispatch team assist you further?`,
                            enq.phone
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Reply to Client on WhatsApp ({enq.phone})</span>
                        </a>

                        <a
                          href={getWhatsAppUrl(
                            formatEnquiryWhatsAppMessage(enq),
                            OWNER_WHATSAPP_RAW
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer text-[11px]"
                        >
                          <span>Forward to Owner WhatsApp ({OWNER_WHATSAPP_DISPLAY})</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: VEHICLES DIRECTORY */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">
                  Commercial Fleet Registry
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Catalog of all standardized truck categories and their operational capabilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FLEET_DATA.map((v) => (
                  <div
                    key={v.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{v.type}</h4>
                      <span className="font-mono text-xs text-orange-400 font-bold">
                        {v.capacityTonnes}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                      {v.popularModels}
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                      <div>Dimensions: <span className="text-slate-200">{v.deckDimensions}</span></div>
                      <div>Volume: <span className="text-slate-200">{v.volumeCft}</span></div>
                      <div>Body: <span className="text-slate-200">{v.bodyType}</span></div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">{v.suitableFor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: DRIVERS */}
          {activeTab === 'drivers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">
                  Commercial Drivers Directory
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Verified commercial transport pilots with valid heavy vehicle endorsements and clean background checks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {[
                  { name: 'Baldev Singh', id: 'DRV-102', license: 'Heavy Transport (HMV)', exp: '14 Years', rating: '4.95', vehicle: 'HR-55-AB-9821' },
                  { name: 'Murugan Selvam', id: 'DRV-108', license: 'HMV + Hazardous Endorsement', exp: '11 Years', rating: '4.90', vehicle: 'KA-04-ER-6210' },
                  { name: 'Dattatray Shinde', id: 'DRV-115', license: 'HMV Goods Carrier', exp: '9 Years', rating: '4.88', vehicle: 'MH-14-GH-4112' },
                  { name: 'Somen Ghosh', id: 'DRV-122', license: 'Articulated Multi-Axle', exp: '16 Years', rating: '4.98', vehicle: 'WB-19-JK-5544' },
                  { name: 'Rameshwar Lal', id: 'DRV-130', license: 'LMV / ICV Commercial', exp: '8 Years', rating: '4.85', vehicle: 'RJ-14-TC-1982' },
                ].map((d, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{d.name}</span>
                      <span className="font-mono text-emerald-400 font-semibold">{d.id}</span>
                    </div>
                    <div className="text-slate-400">{d.license}</div>
                    <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800 text-[11px]">
                      <span>Experience: {d.exp}</span>
                      <span>Assigned: <strong className="font-mono text-orange-400">{d.vehicle}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">
                  SLA &amp; Compliance Audit Reports
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Quarterly transit accuracy metrics and carrier audit documentation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <h4 className="font-bold text-white text-sm">ISO 9001:2015 Audit Report</h4>
                  <p className="text-xs text-slate-400">Audited transit safety protocols and E-Way bill compliance.</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                    PASSED · 100%
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <h4 className="font-bold text-white text-sm">IBA Approval Carrier Certificate</h4>
                  <p className="text-xs text-slate-400">Indian Banks Association approved fleet operator status.</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                    ACTIVE · VALID
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <h4 className="font-bold text-white text-sm">Quarterly Turnaround Report</h4>
                  <p className="text-xs text-slate-400">Consolidated transit lead time index for Q3-Q4 2026.</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-400 font-bold border border-blue-800">
                    3.8 DAYS AVG TRANSIT
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">
                  Console Configuration
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage local state data and telematics telemetry thresholds.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">Reset Local Demo Storage</h4>
                  <p className="text-slate-400 mt-1">
                    Clear stored test quote submissions and simulated contact messages from browser local storage.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('outshipper_quotes');
                      localStorage.removeItem('outshipper_enquiries');
                      localStorage.removeItem('nancy_logistics_quotes');
                      localStorage.removeItem('nancy_logistics_enquiries');
                      alert('Local test submissions have been reset.');
                      window.location.reload();
                    }}
                    className="mt-3 px-4 py-2 bg-slate-800 hover:bg-rose-900/60 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Reset Test Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Shipment Add/Edit Modal */}
      <ShipmentModal
        isOpen={shipmentModalOpen}
        onClose={() => setShipmentModalOpen(false)}
        shipmentToEdit={shipmentToEdit}
        onSaveShipment={handleSaveShipment}
        onOpenDocumentUpload={handleOpenDocModalForShipment}
      />

      {/* Trip Add/Edit Modal */}
      <TripModal
        isOpen={tripModalOpen}
        onClose={() => setTripModalOpen(false)}
        tripToEdit={tripToEdit}
        shipments={shipments}
        onSaveTrip={handleSaveTrip}
        onOpenDocumentUpload={handleOpenDocModalForTrip}
      />

      {/* Document / POD Upload & Viewer Modal */}
      {documentTarget && (
        <DocumentUploadModal
          isOpen={documentModalOpen}
          onClose={() => {
            setDocumentModalOpen(false);
            setDocumentTarget(null);
          }}
          targetType={documentTarget.type}
          targetId={documentTarget.id}
          targetTitle={documentTarget.title}
          existingDocuments={documentTarget.docs}
          onDocumentUploaded={handleDocumentUploaded}
          onDocumentDeleted={handleDocumentDeleted}
        />
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-white">Permanently Delete Record?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to delete <strong className="text-white">{itemToDelete.label}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
