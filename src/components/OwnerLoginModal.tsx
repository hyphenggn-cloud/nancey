import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, LogIn, AlertCircle, X, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const OwnerLoginModal: React.FC = () => {
  const {
    ownerModalOpen,
    closeOwnerModal,
    verifyOwnerPasscode,
    signInWithGoogle,
    ownerEmail,
    isAdmin
  } = useAuth();

  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!ownerModalOpen) return null;

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!passcode.trim()) {
      setErrorMsg('Please enter the owner passkey.');
      return;
    }

    const verified = verifyOwnerPasscode(passcode);
    if (verified) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeOwnerModal();
      }, 1200);
    } else {
      setErrorMsg('Invalid owner passkey. Access denied.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeOwnerModal();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Google authentication failed or was cancelled.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-display text-base text-white">Owner Portal Verification</h3>
              <p className="text-xs text-slate-400">Only the owner can edit page content</p>
            </div>
          </div>
          <button
            onClick={closeOwnerModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {success ? (
            <div className="py-6 text-center space-y-2 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Owner Access Verified!</h4>
              <p className="text-xs text-slate-300">
                Full page visual editing unlocked. You can now edit any section across Outshipper Private Limited.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Owner Verification Notice:</span>
                  <p className="mt-0.5 text-slate-300">
                    Website content is strictly locked to prevent unauthorized changes. Authorized owner account:{' '}
                    <code className="text-red-300 font-mono text-[11px] font-semibold">{ownerEmail}</code>
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Method 1: Instant Owner Passkey */}
              <form onSubmit={handlePasscodeSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-red-400" />
                    <span>Enter Owner Security Passkey</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter passkey (e.g. outshipper or 9212399003)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Quick Key: <code className="text-slate-300 font-mono">9212399003</code>, <code className="text-slate-300 font-mono">8000945818</code>, or <code className="text-slate-300 font-mono">outshipper</code>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-950/30"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Unlock Owner Visual Editing</span>
                </button>
              </form>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider absolute">
                  Or
                </span>
              </div>

              {/* Method 2: Google Authentication */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-850 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 text-orange-400" />
                )}
                <span>Sign in with Google ({ownerEmail})</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
