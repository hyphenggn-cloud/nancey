import React, { useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  Truck,
  Phone,
  HelpCircle,
  Building2,
  BarChart3,
  CheckCircle2,
  Edit,
  ShieldCheck
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { SiteContentData } from '../data/defaultSiteContent';

export const OwnerContentEditorModal: React.FC = () => {
  const {
    content,
    editorModalOpen,
    activeEditorTab,
    closeEditor,
    saveChanges,
    resetToBrandDefaults,
    isSaving,
    openEditor,
  } = useSiteContent();

  const [currentTab, setCurrentTab] = useState(activeEditorTab || 'hero');
  const [formData, setFormData] = useState<SiteContentData>(content);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state whenever modal opens or content changes
  React.useEffect(() => {
    setFormData(content);
  }, [content, editorModalOpen]);

  React.useEffect(() => {
    if (activeEditorTab) {
      setCurrentTab(activeEditorTab);
    }
  }, [activeEditorTab]);

  if (!editorModalOpen) return null;

  const handleSave = async () => {
    const ok = await saveChanges(formData);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        closeEditor();
      }, 1500);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero & Banner', icon: <Layers className="w-4 h-4" /> },
    { id: 'about', label: 'About & Features', icon: <Award className="w-4 h-4" /> },
    { id: 'stats', label: 'Statistics (Counters)', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'services', label: 'Services (8)', icon: <Building2 className="w-4 h-4" /> },
    { id: 'fleet', label: 'Fleet Categories (8)', icon: <Truck className="w-4 h-4" /> },
    { id: 'why', label: 'Why Choose Us', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact & Office', icon: <Phone className="w-4 h-4" /> },
    { id: 'brand', label: 'Brand & Tagline', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                Outshipper Private Limited — Owner Visual Page Editor
              </h2>
              <p className="text-xs text-slate-400">
                Manage and customize live content across the entire website. Changes persist immediately to Cloud Firestore.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? 'Publishing...' : 'Save & Publish Live'}</span>
            </button>

            <button
              onClick={closeEditor}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Sidebar Tabs and Content Form */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Tabs Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-800 p-3 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1">
            <div className="hidden md:block px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Website Sections
            </div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors whitespace-nowrap cursor-pointer ${
                  currentTab === tab.id
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right Editing Form Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
            {saveSuccess && (
              <div className="p-3 bg-emerald-600/20 border border-emerald-500 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Changes successfully published live to Cloud Firestore!</span>
              </div>
            )}

            {/* TAB 1: HERO */}
            {currentTab === 'hero' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    1. Hero Section Content
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Controls the primary hero headline, banner kickers, and main call-to-action buttons.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Top Kicker Badge / Trust Announcement
                  </label>
                  <input
                    type="text"
                    value={formData.hero.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, badge: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Headline Prefix
                    </label>
                    <input
                      type="text"
                      value={formData.hero.headlinePrefix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, headlinePrefix: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-orange-400 mb-1">
                      Highlighted Word (Orange)
                    </label>
                    <input
                      type="text"
                      value={formData.hero.headlineHighlight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, headlineHighlight: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-orange-500/60 rounded-lg text-orange-400 font-bold focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Headline Suffix
                    </label>
                    <input
                      type="text"
                      value={formData.hero.headlineSuffix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, headlineSuffix: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Subheading / Company Value Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.hero.subheading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, subheading: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Primary Button Label
                    </label>
                    <input
                      type="text"
                      value={formData.hero.quoteBtnText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, quoteBtnText: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Secondary Button Label
                    </label>
                    <input
                      type="text"
                      value={formData.hero.trackBtnText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, trackBtnText: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Telematics Pill Label
                    </label>
                    <input
                      type="text"
                      value={formData.hero.telematicsPill}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, telematicsPill: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ABOUT */}
            {currentTab === 'about' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    2. About Outshipper & The 4 Pillars
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Customize the core company mission text and the 4 featured operational pillars.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Section Badge
                    </label>
                    <input
                      type="text"
                      value={formData.about.badge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, badge: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={formData.about.heading}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, heading: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    About Outshipper Main Text
                  </label>
                  <textarea
                    rows={4}
                    value={formData.about.content}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, content: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-slate-200 mb-3 text-xs uppercase tracking-wider font-mono">
                    The 4 Featured Pillars:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.about.features.map((feat, idx) => (
                      <div key={feat.id || idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <label className="block font-bold text-orange-400">
                          Pillar #{idx + 1} Title
                        </label>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const updated = [...formData.about.features];
                            updated[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              about: { ...formData.about, features: updated },
                            });
                          }}
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white font-medium focus:border-orange-500 focus:outline-none"
                        />
                        <label className="block text-slate-400 text-[11px]">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={feat.description}
                          onChange={(e) => {
                            const updated = [...formData.about.features];
                            updated[idx].description = e.target.value;
                            setFormData({
                              ...formData,
                              about: { ...formData.about, features: updated },
                            });
                          }}
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STATS */}
            {currentTab === 'stats' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    3. Editable Company Statistics
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Per the project requirements, all statistical metrics are 100% editable from this control panel.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Stat 1 */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-orange-400 uppercase font-bold">Counter 1</span>
                    <label className="block font-semibold text-slate-200">Value</label>
                    <input
                      type="text"
                      value={formData.stats.yearsExperience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, yearsExperience: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-orange-400 font-bold text-lg font-mono focus:border-orange-500 focus:outline-none"
                    />
                    <label className="block font-semibold text-slate-200">Label</label>
                    <input
                      type="text"
                      value={formData.stats.yearsLabel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, yearsLabel: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Stat 2 */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-orange-400 uppercase font-bold">Counter 2</span>
                    <label className="block font-semibold text-slate-200">Value</label>
                    <input
                      type="text"
                      value={formData.stats.shipmentsDelivered}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, shipmentsDelivered: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white font-bold text-lg font-mono focus:border-orange-500 focus:outline-none"
                    />
                    <label className="block font-semibold text-slate-200">Label</label>
                    <input
                      type="text"
                      value={formData.stats.shipmentsLabel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, shipmentsLabel: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Stat 3 */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-orange-400 uppercase font-bold">Counter 3</span>
                    <label className="block font-semibold text-slate-200">Value</label>
                    <input
                      type="text"
                      value={formData.stats.businessClients}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, businessClients: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white font-bold text-lg font-mono focus:border-orange-500 focus:outline-none"
                    />
                    <label className="block font-semibold text-slate-200">Label</label>
                    <input
                      type="text"
                      value={formData.stats.clientsLabel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, clientsLabel: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Stat 4 */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-orange-400 uppercase font-bold">Counter 4</span>
                    <label className="block font-semibold text-slate-200">Value</label>
                    <input
                      type="text"
                      value={formData.stats.onTimeRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, onTimeRate: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-emerald-400 font-bold text-lg font-mono focus:border-orange-500 focus:outline-none"
                    />
                    <label className="block font-semibold text-slate-200">Label</label>
                    <input
                      type="text"
                      value={formData.stats.onTimeLabel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stats: { ...formData.stats, onTimeLabel: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SERVICES */}
            {currentTab === 'services' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    4. Services Offerings (All 8 Cards)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Modify names, summaries, suitability, and transit times for all 8 service offerings.
                  </p>
                </div>

                <div className="space-y-4">
                  {formData.services.map((svc, idx) => (
                    <div key={svc.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-400 text-xs font-mono uppercase">
                          Service #{idx + 1}: {svc.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">ID: {svc.id}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Service Name</label>
                          <input
                            type="text"
                            value={svc.name}
                            onChange={(e) => {
                              const updated = [...formData.services];
                              updated[idx].name = e.target.value;
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Transit Time</label>
                          <input
                            type="text"
                            value={svc.transitTime}
                            onChange={(e) => {
                              const updated = [...formData.services];
                              updated[idx].transitTime = e.target.value;
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={svc.shortDescription}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[idx].shortDescription = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Ideal For / Cargo Fit</label>
                        <input
                          type="text"
                          value={svc.idealFor}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[idx].idealFor = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: FLEET */}
            {currentTab === 'fleet' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    5. Commercial Fleet Vehicle Specifications (All 8 Categories)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Per requirements, update vehicle categories, capacities, deck sizes, and suitability from this central panel.
                  </p>
                </div>

                <div className="space-y-4">
                  {formData.fleet.map((vehicle, idx) => (
                    <div key={vehicle.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-400 text-xs font-mono uppercase">
                          Vehicle #{idx + 1}: {vehicle.type}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">ID: {vehicle.id}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Category Type</label>
                          <input
                            type="text"
                            value={vehicle.type}
                            onChange={(e) => {
                              const updated = [...formData.fleet];
                              updated[idx].type = e.target.value;
                              setFormData({ ...formData, fleet: updated });
                            }}
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Approximate Capacity</label>
                          <input
                            type="text"
                            value={vehicle.capacityTonnes}
                            onChange={(e) => {
                              const updated = [...formData.fleet];
                              updated[idx].capacityTonnes = e.target.value;
                              setFormData({ ...formData, fleet: updated });
                            }}
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-orange-400 font-bold focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Deck Dimensions</label>
                          <input
                            type="text"
                            value={vehicle.deckDimensions}
                            onChange={(e) => {
                              const updated = [...formData.fleet];
                              updated[idx].deckDimensions = e.target.value;
                              setFormData({ ...formData, fleet: updated });
                            }}
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Popular Models</label>
                        <input
                          type="text"
                          value={vehicle.popularModels}
                          onChange={(e) => {
                            const updated = [...formData.fleet];
                            updated[idx].popularModels = e.target.value;
                            setFormData({ ...formData, fleet: updated });
                          }}
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Suitable For</label>
                        <textarea
                          rows={2}
                          value={vehicle.suitableFor}
                          onChange={(e) => {
                            const updated = [...formData.fleet];
                            updated[idx].suitableFor = e.target.value;
                            setFormData({ ...formData, fleet: updated });
                          }}
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: WHY CHOOSE US */}
            {currentTab === 'why' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    6. Why Choose Outshipper (6 Cards)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Customize the heading, subtitle, and the 6 key differentiator cards.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.whyChooseUs.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whyChooseUs: { ...formData.whyChooseUs, title: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Section Subtitle</label>
                  <textarea
                    rows={2}
                    value={formData.whyChooseUs.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whyChooseUs: { ...formData.whyChooseUs, subtitle: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.whyChooseUs.cards.map((card, idx) => (
                    <div key={card.id || idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                      <label className="block font-bold text-orange-400">Card #{idx + 1} Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = [...formData.whyChooseUs.cards];
                          updated[idx].title = e.target.value;
                          setFormData({
                            ...formData,
                            whyChooseUs: { ...formData.whyChooseUs, cards: updated },
                          });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-orange-500 focus:outline-none"
                      />
                      <label className="block text-slate-400 text-[11px]">Description</label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => {
                          const updated = [...formData.whyChooseUs.cards];
                          updated[idx].description = e.target.value;
                          setFormData({
                            ...formData,
                            whyChooseUs: { ...formData.whyChooseUs, cards: updated },
                          });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: CONTACT */}
            {currentTab === 'contact' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    7. Contact Numbers, Emergency Hotline & Addresses
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Update phone numbers, WhatsApp, emails, and address locations shown on the website and offline cache.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Section Heading</label>
                    <input
                      type="text"
                      value={formData.contact.heading}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, heading: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Corporate Email</label>
                    <input
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, email: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Phone (Display Format)</label>
                    <input
                      type="text"
                      value={formData.contact.phoneDisplay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, phoneDisplay: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-orange-400 mb-1">24/7 Dispatch Hotline</label>
                    <input
                      type="text"
                      value={formData.contact.dispatchHotline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, dispatchHotline: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-orange-500/60 rounded-lg text-orange-400 font-bold focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">WhatsApp Display</label>
                    <input
                      type="text"
                      value={formData.contact.whatsappDisplay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, whatsappDisplay: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={formData.contact.addressLine1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, addressLine1: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">City, State & Pincode</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.contact.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, city: e.target.value },
                          })
                        }
                        className="p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.contact.state}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, state: e.target.value },
                          })
                        }
                        className="p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={formData.contact.pincode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, pincode: e.target.value },
                          })
                        }
                        className="p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: BRAND */}
            {currentTab === 'brand' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    8. Brand Identity & Legal Name
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Controls company brand positioning, corporate legal name, and tagline.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={formData.company.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, name: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Legal Registered Name</label>
                    <input
                      type="text"
                      value={formData.company.legalName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, legalName: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Official Brand Tagline</label>
                  <input
                    type="text"
                    value={formData.company.tagline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, tagline: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Brand Positioning Statement</label>
                  <textarea
                    rows={3}
                    value={formData.company.positioning}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, positioning: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Cloud Firestore Connected</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={closeEditor}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              Cancel / Close
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-950/40"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
