import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Check, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'button' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running inside standalone app, don't show prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // If not installable and not iOS (e.g. desktop firefox without PWA support or already prompted)
  // we still display the button if user wants instructions or we hide it gracefully
  if (!isInstallable && !isIOS) {
    return null;
  }

  if (installSuccess) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
        <Check className="w-4 h-4" />
        <span>Installed!</span>
      </div>
    );
  }

  return (
    <>
      {variant === 'navbar' ? (
        <button
          onClick={handleInstallClick}
          aria-label="Install Outshipper App"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 active:bg-red-600/30 text-red-600 border border-red-500/30 text-xs font-semibold transition cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-[#E60023]" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      ) : variant === 'compact' ? (
        <button
          onClick={handleInstallClick}
          aria-label="Install App"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs transition cursor-pointer ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#E60023]" />
          <span>App</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E60023] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-600/20 transition cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Install Web App</span>
        </button>
      )}

      {/* iOS Safari Installation Instruction Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">
              Install Outshipper on iOS
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Add the Outshipper app to your iPhone or iPad home screen for instant 1-tap offline tracking and dispatch access:
            </p>

            <div className="mt-4 space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                  1
                </div>
                <div className="text-slate-300">
                  Tap the <strong className="text-white inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-blue-400 inline" /> Share</strong> button located in your Safari bottom bar.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                  2
                </div>
                <div className="text-slate-300">
                  Scroll down the share sheet and tap <strong className="text-white inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> Add to Home Screen</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                  3
                </div>
                <div className="text-slate-300">
                  Tap <strong className="text-white">Add</strong> in the top-right corner.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 py-2.5 text-xs font-bold text-white transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
