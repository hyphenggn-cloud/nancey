import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  MapPin,
  TrendingUp,
  Award,
  Play,
  Pause,
  ArrowRight,
  MessageCircle,
  Truck
} from 'lucide-react';
import { openWhatsAppDirect } from '../lib/whatsapp';

export interface B2BReview {
  id: string;
  clientName: string;
  designation: string;
  companyName: string;
  location: string;
  industry: 'FMCG' | 'Automotive' | 'Heavy Engineering' | 'Pharma' | 'E-Commerce' | 'Agro';
  avatarInitials: string;
  avatarBg: string;
  routeCorridor: string;
  materialType: string;
  rating: number;
  highlightMetric: string;
  reviewTitle: string;
  reviewText: string;
  contractDuration: string;
  verifiedB2B: boolean;
}

const TESTIMONIALS_DATA: B2BReview[] = [
  {
    id: 'rev-1',
    clientName: 'Sunil Mehta',
    designation: 'VP of Supply Chain & Distribution',
    companyName: 'Vanguard Consumer Products Ltd.',
    location: 'Gurugram & Delhi NCR Hub',
    industry: 'FMCG',
    avatarInitials: 'SM',
    avatarBg: 'from-amber-600 to-red-600',
    routeCorridor: 'Delhi NCR ➔ Mumbai & Pune Western Corridor',
    materialType: 'Packaged Food & Beverage Cartons',
    rating: 5,
    highlightMetric: '40% Lower Dock Detention',
    reviewTitle: 'Exemplary fleet discipline and zero demurrage delays',
    reviewText:
      'Outshipper has been our primary logistics partner for over two years, handling 45+ containerized 32ft MX trailers every month. Their dispatch punctuality, transparent electronic proof-of-delivery (POD) cycle, and proactive driver allocation have brought down warehouse dock detention by nearly 40%. Highly dependable road transportation team.',
    contractDuration: '2.5 Years Corporate Partner',
    verifiedB2B: true,
  },
  {
    id: 'rev-2',
    clientName: 'Pooja Agarwal',
    designation: 'Head of Plant Logistics & Dispatch',
    companyName: 'Apex Precision Auto Components Ltd.',
    location: 'Manesar Industrial Belt',
    industry: 'Automotive',
    avatarInitials: 'PA',
    avatarBg: 'from-blue-600 to-indigo-700',
    routeCorridor: 'Manesar ➔ Bengaluru & Chennai Auto Clusters',
    materialType: 'Tier-1 High-Tolerance Automotive Stampings',
    rating: 5,
    highlightMetric: 'Zero Transit Breakage across 200+ Loads',
    reviewTitle: 'Flawless precision transport for sensitive industrial cargo',
    reviewText:
      'Moving calibrated automotive tooling and stamped body parts requires zero transit vibration and rigid adherence to OEM assembly line delivery slots. Outshipper Private Limited consistently places vetted, containerized multi-axle trucks on schedule. Their 24/7 dispatch desk communicates directly with our plant coordinators without any friction.',
    contractDuration: '3+ Years Dedicated Carrier',
    verifiedB2B: true,
  },
  {
    id: 'rev-3',
    clientName: 'Rajesh K. Singhania',
    designation: 'Commercial Director',
    companyName: 'Shree Balaji Heavy Engineering & Infra',
    location: 'Ahmedabad & Hazira Port Corridor',
    industry: 'Heavy Engineering',
    avatarInitials: 'RS',
    avatarBg: 'from-slate-700 to-slate-900',
    routeCorridor: 'Gujarat Heavy Hubs ➔ Telangana & Karnataka Projects',
    materialType: 'Structural Steel Girders & Fabricated Boilers',
    rating: 5,
    highlightMetric: '100% On-Time Project Site Placement',
    reviewTitle: 'Smooth multi-axle heavy haulage with complete statutory compliance',
    reviewText:
      'For oversized industrial cargo and open heavy-axle haulage, finding transport operators with strict e-way bill compliance, verified transit insurance, and honest pricing is rare. Outshipper structured transparent line-haul contracts with zero unexpected en-route surcharges. Our project sites receive steel consignments right on time.',
    contractDuration: '18 Months Project Haulage',
    verifiedB2B: true,
  },
  {
    id: 'rev-4',
    clientName: 'Dr. Arvind Deshmukh',
    designation: 'Director of Supply Chain Logistics',
    companyName: 'BioVanguard Health & Formulations',
    location: 'Baddi Formulation Zone & Hyderabad',
    industry: 'Pharma',
    avatarInitials: 'AD',
    avatarBg: 'from-teal-600 to-emerald-700',
    routeCorridor: 'Baddi Hub ➔ Central Distribution Centers Nationwide',
    materialType: 'Essential Healthcare & Finished Formulations',
    rating: 5,
    highlightMetric: '100% Dry Container Hygiene SOP Compliance',
    reviewTitle: 'Spotless enclosed containers and disciplined transit protocol',
    reviewText:
      'Pharmaceutical shipments demand pristine enclosed HQ containers with absolute moisture protection and rigorous hygiene protocols. Outshipper assigns only rigorously inspected containerized vehicles with trained long-haul drivers. Their digital live tracking provides complete chain-of-custody assurance to our quality control teams.',
    contractDuration: '2 Years Contracted Transporter',
    verifiedB2B: true,
  },
  {
    id: 'rev-5',
    clientName: 'Ananya Verma',
    designation: 'National Fulfillment & Freight Lead',
    companyName: 'UrbanKart Retail Logistics Network',
    location: 'Bhiwandi Mega Logistics Park',
    industry: 'E-Commerce',
    avatarInitials: 'AV',
    avatarBg: 'from-purple-600 to-pink-600',
    routeCorridor: 'Bhiwandi Mega Hub ➔ North India Sorting Hubs',
    materialType: 'Palletized Retail Merchandise & Consumer Electronics',
    rating: 5,
    highlightMetric: 'Guaranteed Capacity during Peak Festive Rush',
    reviewTitle: 'Invaluable surge capacity when freight markets get congested',
    reviewText:
      'During festive sale peaks like Diwali and Big Billion days, capacity crunches spike line-haul freight rates across India. Outshipper locked our agreed capacity in advance and deployed backup drivers without extortionate premiums. They act not as a mere middleman or broker, but as an indispensable operational partner for our supply chain.',
    contractDuration: '2+ Years Core Linehaul Partner',
    verifiedB2B: true,
  },
  {
    id: 'rev-6',
    clientName: 'Harish N. Rao',
    designation: 'Procurement & Operations Manager',
    companyName: 'Evergreen Agro Commodities Export Pvt Ltd',
    location: 'Central India (Indore) & Mundra Terminal',
    industry: 'Agro',
    avatarInitials: 'HR',
    avatarBg: 'from-emerald-700 to-amber-700',
    routeCorridor: 'Indore Processing Mills ➔ Mundra & Kandla Export Docks',
    materialType: 'Processed Agro Commodities & Export Shipments',
    rating: 5,
    highlightMetric: '100% Vessel Cutoff Compliance',
    reviewTitle: 'Excellence in container movement for export port cutoffs',
    reviewText:
      'Missing a shipping line vessel cutoff at Mundra Port costs millions in demurrage and customer penalties. Outshipper coordinates round-the-clock driver relays to make sure our export containers reach the terminal gates comfortably before the cutoff deadline. We trust them blindly with our time-critical port consignments.',
    contractDuration: '3 Years Preferred Carrier',
    verifiedB2B: true,
  },
];

interface TestimonialsSectionProps {
  onQuoteClick?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onQuoteClick }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Filtered reviews
  const filteredReviews = selectedIndustry === 'ALL'
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter((r) => r.industry === selectedIndustry);

  // Keep index within bounds if filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedIndustry]);

  const totalReviews = filteredReviews.length;
  const currentReview = filteredReviews[currentIndex] || filteredReviews[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  }, [totalReviews]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  }, [totalReviews]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoPlaying || isPaused || totalReviews <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isPaused, totalReviews, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // Swiped left -> Next
      handleNext();
    } else if (distance < -50) {
      // Swiped right -> Prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleWhatsAppEnquiry = () => {
    const message = `Hello Outshipper Support Team,\n\nI reviewed your B2B Client Testimonials on the website and would like to discuss freight contracts and transportation solutions for our enterprise.\n\nPlease connect me with your dedicated logistics manager.`;
    openWhatsAppDirect(message);
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-[#070F1E] border-b border-slate-800 relative overflow-hidden"
      aria-label="Client Testimonials"
    >
      {/* Decorative background grid subtle accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-800/70 text-red-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E60023]" />
            <span>Verified B2B Client Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Enterprise Shippers & Supply Chain Leaders
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Read verified feedback from plant heads, dispatch managers, and procurement leaders across India who rely on Outshipper Private Limited for mission-critical road logistics.
          </p>

          {/* Industry Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'ALL', label: 'All Reviews' },
              { id: 'FMCG', label: 'FMCG & Consumer' },
              { id: 'Automotive', label: 'Auto Components' },
              { id: 'Heavy Engineering', label: 'Heavy Engineering' },
              { id: 'Pharma', label: 'Pharmaceuticals' },
              { id: 'E-Commerce', label: 'E-Commerce & Retail' },
              { id: 'Agro', label: 'Agro & Export' },
            ].map((pill) => {
              const isActive = selectedIndustry === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedIndustry(pill.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#E60023] text-white shadow-sm ring-2 ring-red-500'
                      : 'bg-[#0D1B2E] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Testimonials Main Slider Card */}
        <div
          className="bg-[#0D1B2E] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden transition-all duration-300 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Slider Status & Controls Bar */}
          <div className="bg-[#0A1526] text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Verified Commercial Consignments
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Corridor: <span className="text-slate-200 font-medium">{currentReview.routeCorridor}</span>
              </span>
            </div>

            {/* Slider Counter & Navigation Buttons */}
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs font-mono text-slate-400 tracking-wider">
                <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(totalReviews).padStart(2, '0')}
              </span>

              {/* Autoplay Pause/Play toggle */}
              <button
                onClick={() => setIsAutoPlaying((v) => !v)}
                title={isAutoPlaying ? 'Pause automatic slider' : 'Resume automatic slider'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label={isAutoPlaying ? 'Pause slider' : 'Play slider'}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Testimonial Content Body */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Quote text & metrics (7 cols on desktop) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Rating Stars & Metric Tag */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(currentReview.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-white font-mono">5.0 / 5.0</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentReview.highlightMetric}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0A1526] text-slate-300 border border-slate-800 text-xs font-medium">
                    <Truck className="w-3.5 h-3.5 text-orange-400" />
                    <span>{currentReview.materialType}</span>
                  </span>
                </div>

                {/* Review Headline */}
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  “{currentReview.reviewTitle}”
                </h3>

                {/* Main Review Quote */}
                <div className="relative">
                  <Quote className="absolute -top-3 -left-3 w-10 h-10 text-slate-800/80 -z-10 rotate-180" />
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed italic relative z-10">
                    "{currentReview.reviewText}"
                  </p>
                </div>

                {/* Corridor detail for mobile */}
                <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 sm:hidden">
                  <MapPin className="w-3.5 h-3.5 text-[#E60023] shrink-0" />
                  <span>Route: {currentReview.routeCorridor}</span>
                </div>
              </div>

              {/* Right Column: Reviewer Card & Verification Meta (4 cols on desktop) */}
              <div className="lg:col-span-4 bg-[#0A1526] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex items-start gap-4">
                  {/* Initials Avatar */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${currentReview.avatarBg} text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0`}
                  >
                    {currentReview.avatarInitials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-bold text-white truncate">
                        {currentReview.clientName}
                      </h4>
                      {currentReview.verifiedB2B && (
                        <span title="Verified B2B Client Consignment" className="inline-flex">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-400 leading-tight mt-0.5">
                      {currentReview.designation}
                    </p>
                    <p className="text-xs font-semibold text-[#E60023] mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{currentReview.companyName}</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Facility / Hub:</span>
                    <span className="font-medium text-white text-right">{currentReview.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Partnership Tenure:</span>
                    <span className="font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded text-right">
                      {currentReview.contractDuration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Service Category:</span>
                    <span className="font-semibold text-white">{currentReview.industry} Logistics</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onQuoteClick}
                    className="w-full py-2.5 px-3 bg-[#E60023] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-950/40"
                  >
                    <span>Request Corporate Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Pagination Dots & Quick Client Thumbnails Bar */}
          <div className="bg-[#0A1526] border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {filteredReviews.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-200 rounded-full cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 h-2.5 bg-[#E60023]'
                      : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${item.clientName}`}
                />
              ))}
            </div>

            {/* Quick reviewer list on larger screens */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto">
              {filteredReviews.map((item, idx) => {
                const isSelected = currentIndex === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-800 text-white shadow-sm border border-slate-700 ring-1 ring-slate-600 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-[#E60023]' : 'bg-slate-600'
                      }`}
                    />
                    <span className="truncate max-w-[130px]">{item.companyName.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Direct WhatsApp connect */}
            <button
              onClick={handleWhatsAppEnquiry}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Discuss Corporate Contract via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* B2B Trust Verification Metrics Banner */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#0D1B2E] p-5 rounded-xl border border-slate-800 shadow-xl text-center">
            <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-900/60 text-[#E60023] mx-auto flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">4.9 / 5.0</div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Enterprise Satisfaction Index</p>
            <p className="text-[11px] text-slate-400 mt-0.5">From 450+ verified shippers</p>
          </div>

          <div className="bg-[#0D1B2E] p-5 rounded-xl border border-slate-800 shadow-xl text-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-900/60 text-emerald-400 mx-auto flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">99.4%</div>
            <p className="text-xs text-slate-300 mt-1 font-medium">On-Time Transit SLA</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across major Indian freight corridors</p>
          </div>

          <div className="bg-[#0D1B2E] p-5 rounded-xl border border-slate-800 shadow-xl text-center">
            <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-900/60 text-blue-400 mx-auto flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">140,000+ MT</div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Commercial Cargo Handled</p>
            <p className="text-[11px] text-slate-400 mt-0.5">FTL, Containerized & Heavy Freight</p>
          </div>

          <div className="bg-[#0D1B2E] p-5 rounded-xl border border-slate-800 shadow-xl text-center">
            <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-900/60 text-purple-400 mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Statutory & E-Way Bill Compliance</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Clean GST invoices & verified transit</p>
          </div>
        </div>
      </div>
    </section>
  );
};
