import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, LayoutDashboard, PhoneCall, ShieldCheck, LogIn, LogOut, User as UserIcon, Wifi, WifiOff } from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY_CONFIG } from '../data/config';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenDashboard?: () => void;
  isDashboardOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenDashboard,
  isDashboardOpen = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, openOwnerModal, signInWithGoogle, logout } = useAuth();
  const { content } = useSiteContent();
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'tracking', label: 'Track Shipment' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Top Utility Bar for B2B Trust & 24/7 Hotline */}
      <div className="bg-[#0B1528] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E60023]" />
              <span>Outshipper Private Limited · CIN: {COMPANY_CONFIG.cin}</span>
            </span>
            <span className="text-slate-600">|</span>
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Connecting Businesses Through Logistics</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Offline Mode (Cached Data)</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${content.contact.phoneRaw || COMPANY_CONFIG.phone}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-orange-400 transition-colors font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
              <span className="tabular-nums">{content.contact.phoneDisplay || COMPANY_CONFIG.phoneDisplay}</span>
            </a>

            {/* Owner Access Trigger Button (if not already admin) */}
            {!isAdmin && (
              <button
                onClick={openOwnerModal}
                className="flex items-center gap-1.5 text-[11px] font-bold text-red-200 hover:text-white px-2.5 py-0.5 rounded-full bg-red-950/70 hover:bg-[#E60023] border border-red-700/60 transition-colors cursor-pointer"
                title="Owner Login to Edit Website"
              >
                <ShieldCheck className="w-3 h-3 text-[#E60023] group-hover:text-white" />
                <span>Owner Portal</span>
              </button>
            )}

            {/* User Profile or Google Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  className="flex items-center gap-1.5 text-slate-200 hover:text-white font-medium cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-4 h-4 rounded-full border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-orange-400" />
                  )}
                  <span className="max-w-[120px] truncate">{user.displayName || user.email}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-orange-950 text-orange-400 border border-orange-800 font-bold">
                      Owner
                    </span>
                  )}
                </button>

                {authDropdownOpen && (
                  <div className="absolute right-0 top-6 z-50 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-2 text-xs space-y-1">
                    <div className="px-2 py-1 text-slate-400 text-[11px] border-b border-slate-800 truncate">
                      {user.email}
                    </div>
                    {onOpenDashboard && (
                      <button
                        onClick={() => {
                          setAuthDropdownOpen(false);
                          onOpenDashboard();
                        }}
                        className="w-full text-left px-2 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                      >
                        Operations Portal
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setAuthDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-2 py-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-1 text-slate-300 hover:text-orange-400 font-medium transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-orange-400" />
                <span>Google Sign-In</span>
              </button>
            )}

            {onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-1 text-slate-300 hover:text-orange-400 font-medium transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{isDashboardOpen ? 'Exit Portal' : 'Operations Portal'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Navigation Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-[#0A1526]/95 backdrop-blur-md shadow-md border-b border-slate-800 py-3'
            : 'bg-[#0A1526] border-b border-slate-800 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Single Brand Wordmark / Logo */}
          <div
            onClick={() => handleLinkClick('home')}
            className="cursor-pointer group focus-visible:outline-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleLinkClick('home')}
          >
            <Logo size="md" variant="white" />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-300">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id && !isDashboardOpen;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#E60023] font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E60023] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Quick Operations Toggle */}
          <div className="hidden sm:flex items-center gap-2.5">
            <PWAInstallButton variant="navbar" />

            <button
              onClick={() => handleLinkClick('tracking')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Track Consignment
            </button>

            <button
              onClick={() => handleLinkClick('quote')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#E60023] hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm shadow-red-950/40 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleLinkClick('quote')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#E60023] hover:bg-red-700 rounded-md sm:hidden cursor-pointer"
            >
              Quote
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md cursor-pointer focus-visible:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A1526] border-b border-slate-800 px-4 pt-3 pb-5 space-y-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {/* User status banner on mobile */}
            <div className="pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
              {user ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-200 truncate">{user.displayName || user.email}</span>
                  <button
                    onClick={() => logout()}
                    className="text-red-400 hover:underline text-[11px]"
                  >
                    (Sign Out)
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-orange-400" />
                  <span>Google Sign-In with Firebase</span>
                </button>
              )}
            </div>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-md transition-colors ${
                  activeSection === link.id
                    ? 'bg-red-950/60 text-[#E60023] border border-red-900/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <PWAInstallButton className="w-full justify-center" />

              <button
                onClick={() => handleLinkClick('quote')}
                className="w-full py-2.5 px-4 text-center text-sm font-bold text-white bg-[#E60023] hover:bg-red-700 rounded-md shadow-xs cursor-pointer"
              >
                Get a Commercial Quote
              </button>

              {onOpenDashboard && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full py-2 px-4 text-center text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isDashboardOpen ? 'Return to Main Website' : 'Open Operations Portal'}</span>
                </button>
              )}

              <div className="mt-2 text-center text-xs text-slate-500">
                24/7 Helpline:{' '}
                <a href={`tel:${content.contact.phoneRaw || COMPANY_CONFIG.phone}`} className="font-semibold text-slate-800">
                  {content.contact.phoneDisplay || COMPANY_CONFIG.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
