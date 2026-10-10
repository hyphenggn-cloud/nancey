import React, { useState } from 'react';
import {
  ShieldAlert,
  Edit3,
  Eye,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';

export const OwnerControlBar: React.FC = () => {
  const { user, isAdmin, ownerEmail, exitOwnerMode } = useAuth();
  const {
    isEditMode,
    setIsEditMode,
    isSaving,
    lastSavedAt,
    openEditor,
    saveChanges,
    resetToBrandDefaults,
  } = useSiteContent();

  const [savedToast, setSavedToast] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Strictly only show for verified admin/owner
  if (!isAdmin) {
    return null;
  }

  const handleSave = async () => {
    const ok = await saveChanges();
    if (ok) {
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    }
  };

  const handleReset = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 5000);
      return;
    }
    await resetToBrandDefaults();
    setResetConfirm(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b-2 border-orange-500 shadow-xl px-4 py-2.5 sm:px-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Owner Verification Identity Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-950/80 border border-orange-500/50 text-orange-400 font-bold uppercase tracking-wider text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
            <span>Owner Mode Active</span>
          </div>
          <span className="text-slate-400 hidden md:inline truncate max-w-[200px]" title={user?.email || ownerEmail}>
            {user?.email || ownerEmail}
          </span>
          {lastSavedAt && (
            <span className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Synced {lastSavedAt}</span>
            </span>
          )}
        </div>

        {/* Right: Controls & CMS Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Visual Edit Mode Switch */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              isEditMode
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 ring-2 ring-orange-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isEditMode ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Visual Edit: ON</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Preview As Visitor</span>
              </>
            )}
          </button>

          {/* Edit Page Drawer Button */}
          <button
            onClick={() => openEditor('hero')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-orange-400" />
            <span>Edit Full Website (CMS)</span>
          </button>

          {/* Save Live Changes */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-colors shadow-sm cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Publishing...' : 'Publish Live'}</span>
          </button>

          {/* Reset to Defaults */}
          <button
            onClick={handleReset}
            disabled={isSaving}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              resetConfirm
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
            title="Reset site text to original brand template"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{resetConfirm ? 'Click to confirm' : 'Reset Defaults'}</span>
          </button>

          {/* Exit Owner Mode */}
          <button
            onClick={exitOwnerMode}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 transition-colors cursor-pointer"
            title="Exit owner editing mode"
          >
            <LogOut className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">Exit Owner</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedToast && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xl border border-emerald-500 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website updated and published to cloud Firestore in real-time!</span>
        </div>
      )}
    </div>
  );
};
