import { QuoteRequestData } from '../components/QuoteSection';
import { ContactEnquiryData } from '../components/ContactSection';
import { submitQuoteToFirestore, submitEnquiryToFirestore } from './firestoreService';
import { ShipmentRecord, INITIAL_SHIPMENTS } from '../data/shipmentsData';
import { TripRecord, INITIAL_TRIPS } from '../data/tripsData';

const OFFLINE_QUOTES_KEY = 'outshipper_offline_quotes_queue';
const OFFLINE_ENQUIRIES_KEY = 'outshipper_offline_enquiries_queue';
const OFFLINE_SHIPMENTS_CACHE_KEY = 'outshipper_offline_shipments_cache';
const OFFLINE_TRIPS_CACHE_KEY = 'outshipper_offline_trips_cache';

// Seed or update offline shipment cache
export function cacheShipmentsLocally(shipments: ShipmentRecord[]) {
  try {
    const existing = getCachedShipments();
    const map = new Map<string, ShipmentRecord>();
    INITIAL_SHIPMENTS.forEach((s) => map.set(s.trackingId, s));
    existing.forEach((s) => map.set(s.trackingId, s));
    shipments.forEach((s) => map.set(s.trackingId, s));
    localStorage.setItem(OFFLINE_SHIPMENTS_CACHE_KEY, JSON.stringify(Array.from(map.values())));
  } catch (e) {
    console.warn('Could not cache shipments locally:', e);
  }
}

export function deleteCachedShipment(trackingId: string) {
  try {
    const cached = getCachedShipments().filter((s) => s.trackingId.toUpperCase() !== trackingId.toUpperCase());
    localStorage.setItem(OFFLINE_SHIPMENTS_CACHE_KEY, JSON.stringify(cached));
  } catch (e) {
    console.warn('Could not remove cached shipment:', e);
  }
}

export function getCachedShipments(): ShipmentRecord[] {
  try {
    const data = localStorage.getItem(OFFLINE_SHIPMENTS_CACHE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Could not read cached shipments:', e);
  }
  return INITIAL_SHIPMENTS;
}

export function getCachedShipmentById(trackingId: string): ShipmentRecord | null {
  const clean = trackingId.trim().toUpperCase();
  const cached = getCachedShipments();
  const found = cached.find((s) => s.trackingId.toUpperCase() === clean);
  if (found) return found;
  return INITIAL_SHIPMENTS.find((s) => s.trackingId.toUpperCase() === clean) || null;
}

// Trip Caching
export function cacheTripsLocally(trips: TripRecord[]) {
  try {
    const existing = getCachedTrips();
    const map = new Map<string, TripRecord>();
    INITIAL_TRIPS.forEach((t) => map.set(t.id, t));
    existing.forEach((t) => map.set(t.id, t));
    trips.forEach((t) => map.set(t.id, t));
    localStorage.setItem(OFFLINE_TRIPS_CACHE_KEY, JSON.stringify(Array.from(map.values())));
  } catch (e) {
    console.warn('Could not cache trips locally:', e);
  }
}

export function getCachedTrips(): TripRecord[] {
  try {
    const data = localStorage.getItem(OFFLINE_TRIPS_CACHE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Could not read cached trips:', e);
  }
  return INITIAL_TRIPS;
}

export function deleteCachedTrip(tripId: string) {
  try {
    const cached = getCachedTrips().filter((t) => t.id !== tripId && t.tripNumber !== tripId);
    localStorage.setItem(OFFLINE_TRIPS_CACHE_KEY, JSON.stringify(cached));
  } catch (e) {
    console.warn('Could not remove cached trip:', e);
  }
}

// Queue offline quote
export function queueOfflineQuote(quote: QuoteRequestData): void {
  try {
    const existing = getOfflineQuotes();
    existing.push(quote);
    localStorage.setItem(OFFLINE_QUOTES_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to queue offline quote:', e);
  }
}

export function getOfflineQuotes(): QuoteRequestData[] {
  try {
    const data = localStorage.getItem(OFFLINE_QUOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Queue offline contact enquiry
export function queueOfflineEnquiry(enquiry: ContactEnquiryData): void {
  try {
    const existing = getOfflineEnquiries();
    existing.push(enquiry);
    localStorage.setItem(OFFLINE_ENQUIRIES_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to queue offline enquiry:', e);
  }
}

export function getOfflineEnquiries(): ContactEnquiryData[] {
  try {
    const data = localStorage.getItem(OFFLINE_ENQUIRIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getPendingOfflineCount(): number {
  return getOfflineQuotes().length + getOfflineEnquiries().length;
}

// Synchronize all pending items to Firestore once online
export async function syncPendingOfflineData(userId?: string): Promise<{ quotesCount: number; enquiriesCount: number }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { quotesCount: 0, enquiriesCount: 0 };
  }

  const quotes = getOfflineQuotes();
  const enquiries = getOfflineEnquiries();
  let quotesSynced = 0;
  let enquiriesSynced = 0;

  if (quotes.length > 0) {
    const remainingQuotes: QuoteRequestData[] = [];
    for (const q of quotes) {
      try {
        await submitQuoteToFirestore(q, userId);
        quotesSynced++;
      } catch (err) {
        console.warn('Failed to sync offline quote, keeping in queue:', err);
        remainingQuotes.push(q);
      }
    }
    localStorage.setItem(OFFLINE_QUOTES_KEY, JSON.stringify(remainingQuotes));
  }

  if (enquiries.length > 0) {
    const remainingEnquiries: ContactEnquiryData[] = [];
    for (const enq of enquiries) {
      try {
        await submitEnquiryToFirestore(enq, userId);
        enquiriesSynced++;
      } catch (err) {
        console.warn('Failed to sync offline enquiry, keeping in queue:', err);
        remainingEnquiries.push(enq);
      }
    }
    localStorage.setItem(OFFLINE_ENQUIRIES_KEY, JSON.stringify(remainingEnquiries));
  }

  return { quotesCount: quotesSynced, enquiriesCount: enquiriesSynced };
}
