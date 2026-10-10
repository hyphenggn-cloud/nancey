import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { INITIAL_SHIPMENTS, ShipmentRecord, ShipmentStatus, ShipmentDocument } from '../data/shipmentsData';
import { INITIAL_TRIPS, TripRecord } from '../data/tripsData';
import { QuoteRequestData } from '../components/QuoteSection';
import { ContactEnquiryData } from '../components/ContactSection';
import {
  cacheShipmentsLocally,
  getCachedShipments,
  deleteCachedShipment,
  cacheTripsLocally,
  getCachedTrips,
  deleteCachedTrip
} from './offlineSyncService';

const SHIPMENTS_COLLECTION = 'shipments';
const TRIPS_COLLECTION = 'trips';
const QUOTES_COLLECTION = 'quotes';
const ENQUIRIES_COLLECTION = 'enquiries';

// 1. Initialize / Seed Shipments into Firestore if empty
export async function seedInitialShipmentsIfEmpty() {
  try {
    const snap = await getDocs(collection(db, SHIPMENTS_COLLECTION));
    if (snap.empty) {
      for (const s of INITIAL_SHIPMENTS) {
        await setDoc(doc(db, SHIPMENTS_COLLECTION, s.trackingId), {
          ...s,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (err) {
    console.warn('Could not seed initial shipments to Firestore:', err);
  }
}

// 2. Fetch Single Shipment
export async function fetchShipmentFromFirestore(trackingId: string): Promise<ShipmentRecord | null> {
  const cleanId = trackingId.trim().toUpperCase();
  const path = `${SHIPMENTS_COLLECTION}/${cleanId}`;
  try {
    const docRef = doc(db, SHIPMENTS_COLLECTION, cleanId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ShipmentRecord;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

// 3. Listen to all shipments (Live real-time updates)
export function subscribeToShipments(callback: (shipments: ShipmentRecord[]) => void) {
  try {
    return onSnapshot(collection(db, SHIPMENTS_COLLECTION), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data() as ShipmentRecord);
        cacheShipmentsLocally(items);
        callback(items);
      } else {
        const cached = getCachedShipments();
        callback(cached.length > 0 ? cached : INITIAL_SHIPMENTS);
      }
    }, (error) => {
      console.warn('Shipments snapshot listener error, falling back to local data:', error);
      const cached = getCachedShipments();
      callback(cached.length > 0 ? cached : INITIAL_SHIPMENTS);
    });
  } catch (err) {
    console.warn('Could not attach snapshot listener:', err);
    const cached = getCachedShipments();
    callback(cached.length > 0 ? cached : INITIAL_SHIPMENTS);
    return () => {};
  }
}

// 4. Update Shipment Status in Firestore
export async function updateShipmentStatusInFirestore(trackingId: string, status: ShipmentStatus) {
  const path = `${SHIPMENTS_COLLECTION}/${trackingId}`;
  try {
    const docRef = doc(db, SHIPMENTS_COLLECTION, trackingId);
    await updateDoc(docRef, {
      status,
      lastUpdated: 'Just now (Updated by Dispatch Admin)',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// 4b. Add New Shipment
export async function addShipmentToFirestore(shipment: ShipmentRecord): Promise<ShipmentRecord> {
  const path = `${SHIPMENTS_COLLECTION}/${shipment.trackingId}`;
  const now = new Date().toISOString();
  const payload: ShipmentRecord = {
    ...shipment,
    trackingId: shipment.trackingId.trim().toUpperCase(),
    lastUpdated: 'Just created by Dispatch Admin',
  };

  try {
    await setDoc(doc(db, SHIPMENTS_COLLECTION, payload.trackingId), {
      ...payload,
      createdAt: now,
      updatedAt: now
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }

  // Update offline local cache
  const cached = getCachedShipments();
  cacheShipmentsLocally([payload, ...cached.filter((s) => s.trackingId !== payload.trackingId)]);
  return payload;
}

// 4c. Update Entire Shipment Consignment Record
export async function updateShipmentInFirestore(trackingId: string, updates: Partial<ShipmentRecord>): Promise<void> {
  const cleanId = trackingId.trim().toUpperCase();
  const path = `${SHIPMENTS_COLLECTION}/${cleanId}`;
  const now = new Date().toISOString();

  try {
    const docRef = doc(db, SHIPMENTS_COLLECTION, cleanId);
    await updateDoc(docRef, {
      ...updates,
      lastUpdated: 'Just now (Edited by Dispatch Owner)',
      updatedAt: now
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }

  // Update local cache
  const cached = getCachedShipments();
  const updatedList = cached.map((s) => (s.trackingId === cleanId ? { ...s, ...updates, updatedAt: now } : s));
  cacheShipmentsLocally(updatedList);
}

// 4d. Delete Shipment Record
export async function deleteShipmentFromFirestore(trackingId: string): Promise<void> {
  const cleanId = trackingId.trim().toUpperCase();
  const path = `${SHIPMENTS_COLLECTION}/${cleanId}`;

  try {
    const docRef = doc(db, SHIPMENTS_COLLECTION, cleanId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }

  deleteCachedShipment(cleanId);
}

// 4e. Upload or Attach Document / POD to Shipment
export async function uploadShipmentDocument(trackingId: string, document: ShipmentDocument): Promise<void> {
  const cleanId = trackingId.trim().toUpperCase();
  const current = (await fetchShipmentFromFirestore(cleanId)) || getCachedShipments().find((s) => s.trackingId === cleanId);
  const existingDocs = current?.documents || [];
  const updatedDocs = [document, ...existingDocs.filter((d) => d.id !== document.id)];

  await updateShipmentInFirestore(cleanId, {
    documents: updatedDocs,
    status: document.type === 'POD' ? 'Delivered' : current?.status,
  });
}

// 4f. Delete Document from Shipment
export async function deleteShipmentDocument(trackingId: string, documentId: string): Promise<void> {
  const cleanId = trackingId.trim().toUpperCase();
  const current = (await fetchShipmentFromFirestore(cleanId)) || getCachedShipments().find((s) => s.trackingId === cleanId);
  if (!current) return;
  const updatedDocs = (current.documents || []).filter((d) => d.id !== documentId);
  await updateShipmentInFirestore(cleanId, { documents: updatedDocs });
}

// --- TRIPS MANAGEMENT ---

// 5. Initialize / Seed Trips into Firestore
export async function seedInitialTripsIfEmpty() {
  try {
    const snap = await getDocs(collection(db, TRIPS_COLLECTION));
    if (snap.empty) {
      for (const t of INITIAL_TRIPS) {
        await setDoc(doc(db, TRIPS_COLLECTION, t.id), {
          ...t,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (err) {
    console.warn('Could not seed initial trips to Firestore:', err);
  }
}

// 6. Listen to all trips (Live real-time updates)
export function subscribeToTrips(callback: (trips: TripRecord[]) => void) {
  try {
    return onSnapshot(collection(db, TRIPS_COLLECTION), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data() as TripRecord);
        cacheTripsLocally(items);
        callback(items);
      } else {
        const cached = getCachedTrips();
        callback(cached.length > 0 ? cached : INITIAL_TRIPS);
      }
    }, (error) => {
      console.warn('Trips snapshot listener error, falling back to local:', error);
      const cached = getCachedTrips();
      callback(cached.length > 0 ? cached : INITIAL_TRIPS);
    });
  } catch (err) {
    console.warn('Could not attach trips snapshot listener:', err);
    const cached = getCachedTrips();
    callback(cached.length > 0 ? cached : INITIAL_TRIPS);
    return () => {};
  }
}

// 7. Add New Trip
export async function addTripToFirestore(trip: TripRecord): Promise<TripRecord> {
  const path = `${TRIPS_COLLECTION}/${trip.id}`;
  const now = new Date().toISOString();
  const payload: TripRecord = {
    ...trip,
    createdAt: now,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, TRIPS_COLLECTION, payload.id), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }

  const cached = getCachedTrips();
  cacheTripsLocally([payload, ...cached.filter((t) => t.id !== payload.id)]);
  return payload;
}

// 8. Update Trip
export async function updateTripInFirestore(tripId: string, updates: Partial<TripRecord>): Promise<void> {
  const path = `${TRIPS_COLLECTION}/${tripId}`;
  const now = new Date().toISOString();

  try {
    const docRef = doc(db, TRIPS_COLLECTION, tripId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: now
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }

  const cached = getCachedTrips();
  const updatedList = cached.map((t) => (t.id === tripId ? { ...t, ...updates, updatedAt: now } : t));
  cacheTripsLocally(updatedList);
}

// 9. Delete Trip
export async function deleteTripFromFirestore(tripId: string): Promise<void> {
  const path = `${TRIPS_COLLECTION}/${tripId}`;

  try {
    const docRef = doc(db, TRIPS_COLLECTION, tripId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }

  deleteCachedTrip(tripId);
}

// 10. Upload or Attach Document / POD to Trip
export async function uploadTripDocument(tripId: string, document: ShipmentDocument): Promise<void> {
  const cached = getCachedTrips();
  const trip = cached.find((t) => t.id === tripId);
  const existingDocs = trip?.documents || [];
  const updatedDocs = [document, ...existingDocs.filter((d) => d.id !== document.id)];

  await updateTripInFirestore(tripId, {
    documents: updatedDocs,
    podUploaded: document.type === 'POD' ? true : trip?.podUploaded,
  });
}

// 11. Delete Document from Trip
export async function deleteTripDocument(tripId: string, documentId: string): Promise<void> {
  const cached = getCachedTrips();
  const trip = cached.find((t) => t.id === tripId);
  if (!trip) return;
  const updatedDocs = (trip.documents || []).filter((d) => d.id !== documentId);
  const hasPod = updatedDocs.some((d) => d.type === 'POD');
  await updateTripInFirestore(tripId, {
    documents: updatedDocs,
    podUploaded: hasPod
  });
}

// --- QUOTES & ENQUIRIES ---

// 12. Submit Quote to Firestore
export async function submitQuoteToFirestore(quote: QuoteRequestData, userId?: string) {
  const path = `${QUOTES_COLLECTION}/${quote.id}`;
  try {
    const quotePayload = {
      ...quote,
      userId: userId || 'guest',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, QUOTES_COLLECTION, quote.id), quotePayload);
    return quotePayload;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 13. Listen to Quotes
export function subscribeToQuotes(userId: string | undefined, isAdmin: boolean, callback: (quotes: QuoteRequestData[]) => void) {
  try {
    const colRef = collection(db, QUOTES_COLLECTION);
    const q = isAdmin || !userId ? colRef : query(colRef, where('userId', '==', userId));

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as QuoteRequestData);
      callback(items);
    }, (err) => {
      console.warn('Quotes snapshot error:', err);
    });
  } catch (err) {
    console.warn('Error subscribing to quotes:', err);
    return () => {};
  }
}

// 14. Submit Contact Enquiry to Firestore
export async function submitEnquiryToFirestore(enquiry: ContactEnquiryData, userId?: string) {
  const path = `${ENQUIRIES_COLLECTION}/${enquiry.id}`;
  try {
    const enquiryPayload = {
      ...enquiry,
      userId: userId || 'guest',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, ENQUIRIES_COLLECTION, enquiry.id), enquiryPayload);
    return enquiryPayload;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 15. Listen to Enquiries (Admin)
export function subscribeToEnquiries(callback: (enquiries: ContactEnquiryData[]) => void) {
  try {
    return onSnapshot(collection(db, ENQUIRIES_COLLECTION), (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as ContactEnquiryData);
      callback(items);
    }, (err) => {
      console.warn('Enquiries snapshot error:', err);
    });
  } catch (err) {
    console.warn('Error subscribing to enquiries:', err);
    return () => {};
  }
}
