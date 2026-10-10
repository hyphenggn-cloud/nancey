import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle, PhoneCall, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getPendingOfflineCount, syncPendingOfflineData } from '../services/offlineSyncService';
import { COMPANY_CONFIG } from '../data/config';
import { useAuth } from '../context/AuthContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { user } = useAuth();
  const [wasOffline, setWasOffline] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [syncedStats, setSyncedStats] = useState<{ quotesCount: number; enquiriesCount: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Update pending count
  useEffect(() => {
    setPendingCount(getPendingOfflineCount());
    const interval = setInterval(() => {
      setPendingCount(getPendingOfflineCount());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Detect reconnection and trigger automatic sync
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setIsDismissed(false);
    } else if (wasOffline && isOnline) {
      // Reconnected!
      handleManualSync();
    }
  }, [isOnline, wasOffline]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const stats = await syncPendingOfflineData(user?.uid);
      if (stats.quotesCount > 0 || stats.enquiriesCount > 0) {
        setSyncedStats(stats);
        setShowSyncSuccess(true);
        setTimeout(() => setShowSyncSuccess(false), 5000);
      }
      setPendingCount(getPendingOfflineCount());
    } finally {
      setIsSyncing(false);
    }
  };

  // Reconnection success banner
  if (showSyncSuccess && syncedStats) {
    return (
      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500 text-sm animate-bounce">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <div>
          <div className="font-bold">Online Again! Data Synchronized</div>
          <div className="text-xs text-emerald-100">
            {syncedStats.quotesCount > 0 && `${syncedStats.quotesCount} quote(s)`}
            {syncedStats.quotesCount > 0 && syncedStats.enquiriesCount > 0 && ' & '}
            {syncedStats.enquiriesCount > 0 && `${syncedStats.enquiriesCount} enquiry(ies)`} dispatched to central operations.
          </div>
        </div>
        <button
          onClick={() => setShowSyncSuccess(false)}
          className="ml-2 text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // If online and no notification, don't show anything
  if (isOnline || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-4 sm:left-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto">
      <div className="bg-slate-900 border-2 border-amber-500/80 text-white rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Banner Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-600/90 to-amber-700/90 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <div className="flex items-center gap-1.5 font-bold text-sm tracking-wide">
              <WifiOff className="w-4 h-4" />
              <span>Offline Mode Active</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-white/80 hover:text-white rounded hover:bg-black/10 transition"
              title={isExpanded ? 'Collapse' : 'Show details'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-white/80 hover:text-white rounded hover:bg-black/10 transition"
              title="Dismiss for now"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner Content */}
        <div className="p-3.5 sm:p-4 text-xs sm:text-sm text-slate-200 space-y-2.5">
          <p className="leading-relaxed">
            Network connection is unavailable or weak. Outshipper is serving cached data so you can continue working smoothly.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 bg-slate-800/80 rounded border border-slate-700/80">
              <span className="font-semibold text-amber-400 block mb-0.5">✓ Ready Offline</span>
              <span className="text-slate-300">Shipment tracking, fleet specs & IB-approved docs</span>
            </div>
            <div className="p-2 bg-slate-800/80 rounded border border-slate-700/80">
              <span className="font-semibold text-emerald-400 block mb-0.5">✓ Outbox Queue</span>
              <span className="text-slate-300">
                {pendingCount > 0 ? `${pendingCount} item(s) pending sync` : 'Quotes & queries auto-sync'}
              </span>
            </div>
          </div>

          {isExpanded && (
            <div className="pt-2 border-t border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span>Emergency 24/7 Dispatch Hotline:</span>
                <a
                  href={`tel:${COMPANY_CONFIG.dispatchHotline}`}
                  className="font-bold text-orange-400 hover:underline flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  {COMPANY_CONFIG.dispatchHotline}
                </a>
              </div>
              <p className="text-[11px] text-slate-400">
                Any quotes or enquiries you submit while offline will be held in your local secure storage and automatically synced as soon as internet connection returns.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Checking...' : 'Check Connection'}</span>
            </button>

            <span className="text-[11px] text-slate-400">
              Service Worker Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
