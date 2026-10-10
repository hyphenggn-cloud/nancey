import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteContentData, DEFAULT_SITE_CONTENT } from '../data/defaultSiteContent';
import {
  subscribeToSiteContent,
  saveSiteContentToFirestore,
  resetSiteContentToDefaults,
  getLocalCachedSiteContent,
} from '../services/siteContentService';
import { useAuth } from './AuthContext';

interface SiteContentContextType {
  content: SiteContentData;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  isSaving: boolean;
  lastSavedAt: string | null;
  editorModalOpen: boolean;
  activeEditorTab: string;
  openEditor: (tab?: string) => void;
  closeEditor: () => void;
  updateCompanyContent: (data: Partial<SiteContentData['company']>) => void;
  updateHeroContent: (data: Partial<SiteContentData['hero']>) => void;
  updateAboutContent: (data: Partial<SiteContentData['about']>) => void;
  updateStatsContent: (data: Partial<SiteContentData['stats']>) => void;
  updateWhyChooseUsContent: (data: Partial<SiteContentData['whyChooseUs']>) => void;
  updateContactContent: (data: Partial<SiteContentData['contact']>) => void;
  updateServiceItem: (id: string, data: Partial<SiteContentData['services'][0]>) => void;
  updateFleetItem: (id: string, data: Partial<SiteContentData['fleet'][0]>) => void;
  saveChanges: (newContent?: SiteContentData) => Promise<boolean>;
  resetToBrandDefaults: () => Promise<boolean>;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: DEFAULT_SITE_CONTENT,
  isEditMode: false,
  setIsEditMode: () => {},
  isSaving: false,
  lastSavedAt: null,
  editorModalOpen: false,
  activeEditorTab: 'hero',
  openEditor: () => {},
  closeEditor: () => {},
  updateCompanyContent: () => {},
  updateHeroContent: () => {},
  updateAboutContent: () => {},
  updateStatsContent: () => {},
  updateWhyChooseUsContent: () => {},
  updateContactContent: () => {},
  updateServiceItem: () => {},
  updateFleetItem: () => {},
  saveChanges: async () => false,
  resetToBrandDefaults: async () => false,
});

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [content, setContent] = useState<SiteContentData>(() => getLocalCachedSiteContent());
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState('hero');

  // If user is logged out or not admin, ensure edit mode is turned off
  useEffect(() => {
    if (!isAdmin) {
      setIsEditMode(false);
      setEditorModalOpen(false);
    }
  }, [isAdmin]);

  // Real-time synchronization from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToSiteContent((liveContent) => {
      setContent(liveContent);
      if (liveContent.updatedAt) {
        setLastSavedAt(new Date(liveContent.updatedAt).toLocaleTimeString());
      }
    });
    return () => unsubscribe();
  }, []);

  const openEditor = (tab: string = 'hero') => {
    if (!isAdmin) return;
    setActiveEditorTab(tab);
    setEditorModalOpen(true);
  };

  const closeEditor = () => {
    setEditorModalOpen(false);
  };

  const updateCompanyContent = (data: Partial<SiteContentData['company']>) => {
    setContent((prev) => ({
      ...prev,
      company: { ...prev.company, ...data },
    }));
  };

  const updateHeroContent = (data: Partial<SiteContentData['hero']>) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...data },
    }));
  };

  const updateAboutContent = (data: Partial<SiteContentData['about']>) => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, ...data },
    }));
  };

  const updateStatsContent = (data: Partial<SiteContentData['stats']>) => {
    setContent((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...data },
    }));
  };

  const updateWhyChooseUsContent = (data: Partial<SiteContentData['whyChooseUs']>) => {
    setContent((prev) => ({
      ...prev,
      whyChooseUs: { ...prev.whyChooseUs, ...data },
    }));
  };

  const updateContactContent = (data: Partial<SiteContentData['contact']>) => {
    setContent((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...data },
    }));
  };

  const updateServiceItem = (id: string, data: Partial<SiteContentData['services'][0]>) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
  };

  const updateFleetItem = (id: string, data: Partial<SiteContentData['fleet'][0]>) => {
    setContent((prev) => ({
      ...prev,
      fleet: prev.fleet.map((v) => (v.id === id ? { ...v, ...data } : v)),
    }));
  };

  const saveChanges = async (newContentToSave?: SiteContentData): Promise<boolean> => {
    if (!isAdmin) return false;
    const target = newContentToSave || content;
    setIsSaving(true);
    try {
      await saveSiteContentToFirestore(target, user?.email || undefined);
      setLastSavedAt(new Date().toLocaleTimeString());
      return true;
    } catch (e) {
      console.error('Failed to save site content to Firestore:', e);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToBrandDefaults = async (): Promise<boolean> => {
    if (!isAdmin) return false;
    setIsSaving(true);
    try {
      const reset = await resetSiteContentToDefaults(user?.email || undefined);
      setContent(reset);
      setLastSavedAt(new Date().toLocaleTimeString());
      return true;
    } catch (e) {
      console.error('Failed to reset site content:', e);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        isEditMode: isAdmin ? isEditMode : false,
        setIsEditMode: (val) => {
          if (isAdmin) setIsEditMode(val);
        },
        isSaving,
        lastSavedAt,
        editorModalOpen,
        activeEditorTab,
        openEditor,
        closeEditor,
        updateCompanyContent,
        updateHeroContent,
        updateAboutContent,
        updateStatsContent,
        updateWhyChooseUsContent,
        updateContactContent,
        updateServiceItem,
        updateFleetItem,
        saveChanges,
        resetToBrandDefaults,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
