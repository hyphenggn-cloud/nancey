/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrackingSection } from './components/TrackingSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { FleetSection } from './components/FleetSection';
import { SmartLogisticsAnalysis } from './components/SmartLogisticsAnalysis';
import { TestimonialsSection } from './components/TestimonialsSection';
import { QuoteSection, QuoteRequestData } from './components/QuoteSection';
import { ContactSection, ContactEnquiryData } from './components/ContactSection';
import { AIAssistant } from './components/AIAssistant';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { LegalModal } from './components/LegalModals';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OwnerControlBar } from './components/OwnerControlBar';
import { OwnerContentEditorModal } from './components/OwnerContentEditorModal';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { AuthProvider } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { seedInitialShipmentsIfEmpty } from './services/firestoreService';
import { cacheShipmentsLocally, syncPendingOfflineData } from './services/offlineSyncService';
import { INITIAL_SHIPMENTS } from './data/shipmentsData';

function MainApp() {
  const [activeSection, setActiveSection] = useState('home');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [selectedVehicleForQuote, setSelectedVehicleForQuote] = useState('');
  const [analysisPrefill, setAnalysisPrefill] = useState<{
    origin?: string;
    destination?: string;
    cargo?: string;
    weight?: string;
    vehicle?: string;
  } | null>(null);
  const [activeTrackingId, setActiveTrackingId] = useState('NL123456789');
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Seed Firestore & local cache on startup
  useEffect(() => {
    seedInitialShipmentsIfEmpty();
    cacheShipmentsLocally(INITIAL_SHIPMENTS);

    // Initial sync check
    if (navigator.onLine) {
      syncPendingOfflineData();
    }
  }, []);

  // Smooth scroll handler
  const scrollToSection = (sectionId: string) => {
    if (isDashboardOpen) {
      setIsDashboardOpen(false);
    }

    setActiveSection(sectionId);

    // Give DOM a frame if closing dashboard
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  // Scroll spy to update active section in navbar
  useEffect(() => {
    if (isDashboardOpen) return;

    const sections = ['home', 'tracking', 'services', 'about', 'fleet', 'analysis', 'quote', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDashboardOpen]);

  // Handle vehicle request from Fleet section
  const handleRequestVehicle = (vehicleType: string) => {
    setSelectedVehicleForQuote(vehicleType);
    scrollToSection('quote');
  };

  // Handle service request from Services section
  const handleSelectServiceForQuote = (serviceName: string) => {
    setSelectedVehicleForQuote(`Service: ${serviceName}`);
    scrollToSection('quote');
  };

  // Handle apply analysis to quote
  const handleApplyAnalysisToQuote = (details: {
    origin: string;
    destination: string;
    cargo: string;
    weight: string;
    vehicle: string;
  }) => {
    setAnalysisPrefill(details);
    setSelectedVehicleForQuote(details.vehicle);
    scrollToSection('quote');
  };

  // Handle direct track request
  const handleTrackConsignment = (trackingId?: string) => {
    if (trackingId) {
      setActiveTrackingId(trackingId);
    }
    scrollToSection('tracking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070F1E] text-slate-100 selection:bg-[#E60023] selection:text-white">
      {/* 0. Top Owner Control Bar (Strictly shown for verified owner) */}
      <OwnerControlBar />

      {/* If in Operations Dashboard mode, render full console */}
      {isDashboardOpen ? (
        <DashboardView
          onBackToWebsite={() => setIsDashboardOpen(false)}
          onTrackShipment={(id) => {
            setIsDashboardOpen(false);
            setActiveTrackingId(id);
            scrollToSection('tracking');
          }}
        />
      ) : (
        <>
          {/* Top Navigation */}
          <Navbar
            activeSection={activeSection}
            onNavigate={scrollToSection}
            onOpenDashboard={() => setIsDashboardOpen(true)}
            isDashboardOpen={isDashboardOpen}
          />

          {/* Main Website Flow */}
          <main className="flex-1">
            {/* 1. Hero Section */}
            <div id="home">
              <HeroSection
                onQuoteClick={() => scrollToSection('quote')}
                onTrackClick={() => scrollToSection('tracking')}
                onServicesClick={() => scrollToSection('services')}
              />
            </div>

            {/* 2. Quick Tracking Section */}
            <TrackingSection initialTrackingId={activeTrackingId} />

            {/* 3. Services Section */}
            <ServicesSection onSelectServiceForQuote={handleSelectServiceForQuote} />

            {/* 4. About Outshipper Private Limited */}
            <AboutSection />

            {/* 5. Why Choose Outshipper */}
            <WhyChooseUsSection />

            {/* 6. Fleet Section */}
            <FleetSection onRequestVehicle={handleRequestVehicle} />

            {/* 7. Smart Logistics Analysis */}
            <SmartLogisticsAnalysis onApplyToQuote={handleApplyAnalysisToQuote} />

            {/* 8. Client Testimonials Slider */}
            <TestimonialsSection onQuoteClick={() => scrollToSection('quote')} />

            {/* 9. Get a Quote Form */}
            <QuoteSection
              initialVehicle={selectedVehicleForQuote}
              prefillData={analysisPrefill}
            />

            {/* 10. Contact Us & Enquiry Form */}
            <ContactSection />
          </main>

          {/* Footer */}
          <Footer
            onNavigate={scrollToSection}
            onOpenLegal={(type) => setLegalModalType(type)}
            onOpenDashboard={() => setIsDashboardOpen(true)}
          />

          {/* AI Logistics Assistant Floating Widget */}
          <AIAssistant
            onNavigateToQuote={() => scrollToSection('quote')}
            onNavigateToTrack={handleTrackConsignment}
            onNavigateToFleet={() => scrollToSection('fleet')}
            onNavigateToServices={() => scrollToSection('services')}
          />

          {/* Floating WhatsApp Action Button for Outshipper Support */}
          <FloatingWhatsAppButton />

          {/* Legal Modals (Privacy Policy / Terms) */}
          <LegalModal
            type={legalModalType}
            onClose={() => setLegalModalType(null)}
          />

          {/* Owner Full Website CMS Editor Modal (Only owner can trigger) */}
          <OwnerContentEditorModal />

          {/* Owner Security Login & Passcode Modal */}
          <OwnerLoginModal />
        </>
      )}

      {/* Offline Mode & Network Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <MainApp />
      </SiteContentProvider>
    </AuthProvider>
  );
}
