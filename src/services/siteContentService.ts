import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { DEFAULT_SITE_CONTENT, SiteContentData } from '../data/defaultSiteContent';

const SITE_CONTENT_COLLECTION = 'site_content';
const SITE_CONTENT_DOC_ID = 'homepage';
const LOCAL_CACHE_KEY = 'outshipper_site_content_cache_v2';

// Helper to deeply merge loaded content with default structure so no field is ever undefined
function mergeWithDefaults(loaded: Partial<SiteContentData> | null | undefined): SiteContentData {
  if (!loaded) return DEFAULT_SITE_CONTENT;

  // If old brand was loaded (e.g. Nancy Logistics), migrate to Outshipper defaults
  const isOldBrand = loaded.company?.name?.includes('Nancy') || loaded.company?.legalName?.includes('Nancy');

  return {
    ...DEFAULT_SITE_CONTENT,
    ...loaded,
    company: isOldBrand
      ? DEFAULT_SITE_CONTENT.company
      : {
          ...DEFAULT_SITE_CONTENT.company,
          ...(loaded.company || {}),
        },
    hero: isOldBrand
      ? DEFAULT_SITE_CONTENT.hero
      : {
          ...DEFAULT_SITE_CONTENT.hero,
          ...(loaded.hero || {}),
        },
    about: isOldBrand
      ? DEFAULT_SITE_CONTENT.about
      : {
          ...DEFAULT_SITE_CONTENT.about,
          ...(loaded.about || {}),
          features: loaded.about?.features && loaded.about.features.length > 0
            ? loaded.about.features
            : DEFAULT_SITE_CONTENT.about.features,
        },
    stats: isOldBrand
      ? DEFAULT_SITE_CONTENT.stats
      : {
          ...DEFAULT_SITE_CONTENT.stats,
          ...(loaded.stats || {}),
        },
    whyChooseUs: isOldBrand
      ? DEFAULT_SITE_CONTENT.whyChooseUs
      : {
          ...DEFAULT_SITE_CONTENT.whyChooseUs,
          ...(loaded.whyChooseUs || {}),
          cards: loaded.whyChooseUs?.cards && loaded.whyChooseUs.cards.length > 0
            ? loaded.whyChooseUs.cards
            : DEFAULT_SITE_CONTENT.whyChooseUs.cards,
        },
    contact: isOldBrand
      ? DEFAULT_SITE_CONTENT.contact
      : {
          ...DEFAULT_SITE_CONTENT.contact,
          ...(loaded.contact || {}),
          phoneDisplay: (!loaded.contact?.phoneDisplay || loaded.contact.phoneDisplay.includes('80531') || loaded.contact.phoneDisplay.includes('489-7200'))
            ? DEFAULT_SITE_CONTENT.contact.phoneDisplay
            : loaded.contact.phoneDisplay,
          phoneRaw: (!loaded.contact?.phoneRaw || loaded.contact.phoneRaw.includes('80531') || loaded.contact.phoneRaw.includes('1244897200'))
            ? DEFAULT_SITE_CONTENT.contact.phoneRaw
            : loaded.contact.phoneRaw,
          dispatchHotline: (!loaded.contact?.dispatchHotline || loaded.contact.dispatchHotline.includes('80531'))
            ? DEFAULT_SITE_CONTENT.contact.dispatchHotline
            : loaded.contact.dispatchHotline,
          whatsappDisplay: (!loaded.contact?.whatsappDisplay || loaded.contact.whatsappDisplay.includes('80531'))
            ? DEFAULT_SITE_CONTENT.contact.whatsappDisplay
            : loaded.contact.whatsappDisplay,
          whatsappRaw: (!loaded.contact?.whatsappRaw || loaded.contact.whatsappRaw.includes('80531'))
            ? DEFAULT_SITE_CONTENT.contact.whatsappRaw
            : loaded.contact.whatsappRaw,
          email: (!loaded.contact?.email || loaded.contact.email.includes('nancy') || loaded.contact.email.includes('contact@nancylogistics.in'))
            ? DEFAULT_SITE_CONTENT.contact.email
            : loaded.contact.email,
        },
    services: (isOldBrand || !loaded.services || loaded.services.length !== 5)
      ? DEFAULT_SITE_CONTENT.services
      : loaded.services,
    fleet: loaded.fleet && loaded.fleet.length > 0
      ? loaded.fleet
      : DEFAULT_SITE_CONTENT.fleet,
  };
}

// 1. Get cached content from local storage
export function getLocalCachedSiteContent(): SiteContentData {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return mergeWithDefaults(parsed);
    }
  } catch (e) {
    console.warn('Could not read local site content cache:', e);
  }
  return DEFAULT_SITE_CONTENT;
}

// 2. Cache content to local storage
export function saveSiteContentLocally(content: SiteContentData) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(content));
  } catch (e) {
    console.warn('Could not save site content locally:', e);
  }
}

// 3. Subscribe to real-time site content updates from Firestore
export function subscribeToSiteContent(callback: (content: SiteContentData) => void) {
  try {
    const docRef = doc(db, SITE_CONTENT_COLLECTION, SITE_CONTENT_DOC_ID);

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const merged = mergeWithDefaults(snapshot.data() as Partial<SiteContentData>);
          saveSiteContentLocally(merged);
          callback(merged);
        } else {
          // Document not initialized in Firestore yet, serve cached or default
          const cached = getLocalCachedSiteContent();
          callback(cached);
        }
      },
      (error) => {
        console.warn('Site content snapshot error, falling back to local cache:', error);
        callback(getLocalCachedSiteContent());
      }
    );
  } catch (err) {
    console.warn('Could not attach site content listener:', err);
    callback(getLocalCachedSiteContent());
    return () => {};
  }
}

// 4. Save site content to Firestore (strictly restricted to owner/admin in security rules)
export async function saveSiteContentToFirestore(
  content: SiteContentData,
  editorEmail?: string
): Promise<SiteContentData> {
  const path = `${SITE_CONTENT_COLLECTION}/${SITE_CONTENT_DOC_ID}`;
  const payload: SiteContentData = {
    ...content,
    id: SITE_CONTENT_DOC_ID,
    updatedAt: new Date().toISOString(),
    updatedBy: editorEmail || 'Owner',
  };

  // Immediate optimistic local update
  saveSiteContentLocally(payload);

  try {
    const docRef = doc(db, SITE_CONTENT_COLLECTION, SITE_CONTENT_DOC_ID);
    await setDoc(docRef, payload);
    return payload;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 5. Reset site content to original defaults
export async function resetSiteContentToDefaults(editorEmail?: string): Promise<SiteContentData> {
  return saveSiteContentToFirestore(DEFAULT_SITE_CONTENT, editorEmail);
}
