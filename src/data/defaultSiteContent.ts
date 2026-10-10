import { COMPANY_CONFIG } from './config';
import { SERVICES_DATA } from './servicesData';
import { FLEET_DATA } from './fleetData';

export interface SiteHeroContent {
  badge: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineSuffix: string;
  subheading: string;
  quoteBtnText: string;
  trackBtnText: string;
  telematicsPill: string;
}

export interface SiteAboutContent {
  badge: string;
  heading: string;
  subheading: string;
  content: string;
  mission: string;
  vision: string;
  closingStatement: string;
  features: {
    id: string;
    title: string;
    description: string;
  }[];
  locations: string[];
}

export interface SiteStatsContent {
  yearsExperience: string;
  yearsLabel: string;
  shipmentsDelivered: string;
  shipmentsLabel: string;
  businessClients: string;
  clientsLabel: string;
  onTimeRate: string;
  onTimeLabel: string;
}

export interface SiteWhyChooseUsContent {
  title: string;
  subtitle: string;
  cards: {
    id: string;
    title: string;
    description: string;
  }[];
}

export interface SiteContactContent {
  heading: string;
  subtitle: string;
  phoneDisplay: string;
  phoneRaw: string;
  dispatchHotline: string;
  whatsappDisplay: string;
  whatsappRaw: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  cin: string;
  workingHoursDesk: string;
  workingHoursOffice: string;
}

export interface SiteCompanyContent {
  name: string;
  legalName: string;
  cin: string;
  incorporationDate: string;
  tagline: string;
  subTagline: string;
  slogan: string;
  closingSlogan: string;
  positioning: string;
}

export interface SiteContentData {
  id: string;
  updatedAt?: string;
  updatedBy?: string;
  company: SiteCompanyContent;
  hero: SiteHeroContent;
  about: SiteAboutContent;
  stats: SiteStatsContent;
  whyChooseUs: SiteWhyChooseUsContent;
  contact: SiteContactContent;
  services: {
    id: string;
    name: string;
    shortDescription: string;
    idealFor: string;
    transitTime: string;
  }[];
  fleet: {
    id: string;
    type: string;
    popularModels: string;
    capacityTonnes: string;
    suitableFor: string;
    deckDimensions: string;
  }[];
}

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  id: 'homepage',
  company: {
    name: COMPANY_CONFIG.name,
    legalName: COMPANY_CONFIG.legalName,
    cin: COMPANY_CONFIG.cin,
    incorporationDate: COMPANY_CONFIG.incorporationDate,
    tagline: COMPANY_CONFIG.tagline,
    subTagline: COMPANY_CONFIG.subTagline,
    slogan: COMPANY_CONFIG.slogan,
    closingSlogan: COMPANY_CONFIG.closingSlogan,
    positioning: COMPANY_CONFIG.positioning,
  },
  hero: {
    badge: 'Outshipper Private Limited · Road Transportation & Logistics Solutions',
    headlinePrefix: 'Moving Businesses ',
    headlineHighlight: 'Forward',
    headlineSuffix: '.',
    subheading:
      'Reliable Logistics. Smarter Transportation. Stronger Connections. Outshipper is focused on helping businesses move goods efficiently through dependable road transportation and logistics solutions.',
    quoteBtnText: 'Request Transportation Quote',
    trackBtnText: 'Track Consignment',
    telematicsPill: 'Connecting Businesses Through Logistics',
  },
  about: {
    badge: 'About Outshipper Private Limited',
    heading: 'Moving Businesses Forward',
    subheading: 'Reliable Logistics. Smarter Transportation. Stronger Connections.',
    content:
      'Outshipper Private Limited is an Indian private limited company incorporated on 23 December 2020. The company operates in the transport and logistics sector, with a focus on road transportation.\n\nOur approach is built around operational efficiency, reliable coordination, transparent communication and long-term business relationships. We aim to help businesses manage transportation requirements with greater convenience and confidence.\n\nWe aim to simplify transportation operations, strengthen connections between businesses and transport partners, and support smoother movement of goods through practical, technology-enabled logistics solutions.',
    mission:
      'To make transportation and logistics simpler, more efficient and more accessible for businesses through dependable service and continuous improvement.',
    vision:
      'To build a trusted logistics brand that connects businesses, transportation partners and markets through efficient operations and technology-driven solutions.',
    closingStatement: 'Outshipper — Connecting Businesses Through Logistics.',
    features: [
      {
        id: 'feat-1',
        title: 'Business-Focused Logistics',
        description: 'Solutions tailored to the practical operational needs of businesses and commercial shipments.',
      },
      {
        id: 'feat-2',
        title: 'Reliable Coordination',
        description: 'Emphasis on proactive coordination between businesses, transport partners and delivery operations.',
      },
      {
        id: 'feat-3',
        title: 'Transparent Communication',
        description: 'Clear, professional communication and dependable milestone updates throughout every transit stage.',
      },
      {
        id: 'feat-4',
        title: 'Long-Term Relationships',
        description: 'Committed to building lasting partnerships with customers and verified transport fleet partners.',
      },
    ],
    locations: [
      'Gurugram, Haryana',
      'Faridabad, Haryana',
      'Sonipat, Haryana',
      'Noida, Uttar Pradesh',
    ],
  },
  stats: {
    yearsExperience: 'Dec 2020',
    yearsLabel: 'Incorporated',
    shipmentsDelivered: '10,000+',
    shipmentsLabel: 'Consignments Coordinated',
    businessClients: '800+',
    clientsLabel: 'Business Clients',
    onTimeRate: '99.4%',
    onTimeLabel: 'On-Time Performance',
  },
  whyChooseUs: {
    title: 'Why Choose Outshipper?',
    subtitle:
      'Our approach is built around operational efficiency, reliable coordination, transparent communication and long-term business relationships.',
    cards: [
      {
        id: 'why-1',
        title: 'Business-Focused Approach',
        description: 'A dedicated, business-focused approach to logistics that prioritizes your commercial timelines.',
      },
      {
        id: 'why-2',
        title: 'Emphasis on Reliable Coordination',
        description: 'Active coordination between shippers, transport partners, and consignees for smooth transit.',
      },
      {
        id: 'why-3',
        title: 'Practical Transportation Solutions',
        description: 'Realistic, dependable road transportation solutions engineered to solve real-world freight needs.',
      },
      {
        id: 'why-4',
        title: 'Clear & Professional Communication',
        description: 'Direct communication, transparent documentation, and prompt status updates at every milestone.',
      },
      {
        id: 'why-5',
        title: 'Commitment to Continuous Improvement',
        description: 'Constantly refining workflows, leveraging technology, and adopting better transport practices.',
      },
      {
        id: 'why-6',
        title: 'Long-Term Partnerships',
        description: 'Building enduring, trustworthy relationships with customers and verified transport network partners.',
      },
    ],
  },
  services: SERVICES_DATA.map((s) => ({
    id: s.id,
    name: s.name,
    shortDescription: s.shortDescription,
    idealFor: s.idealFor,
    transitTime: s.transitTime,
  })),
  fleet: FLEET_DATA.map((v) => ({
    id: v.id,
    type: v.type,
    popularModels: v.popularModels,
    capacityTonnes: v.capacityTonnes,
    suitableFor: v.suitableFor,
    deckDimensions: v.deckDimensions,
  })),
  contact: {
    heading: 'Contact Outshipper Private Limited',
    subtitle:
      'For transportation enquiries, business partnerships and logistics requirements, contact our team through the verified contact details published on our website.',
    phoneDisplay: COMPANY_CONFIG.phoneDisplay,
    phoneRaw: COMPANY_CONFIG.phone,
    dispatchHotline: COMPANY_CONFIG.dispatchHotline,
    whatsappDisplay: COMPANY_CONFIG.whatsappDisplay,
    whatsappRaw: COMPANY_CONFIG.whatsapp,
    email: COMPANY_CONFIG.email,
    addressLine1: COMPANY_CONFIG.address.line1,
    addressLine2: COMPANY_CONFIG.address.line2,
    city: COMPANY_CONFIG.address.city,
    state: COMPANY_CONFIG.address.state,
    pincode: COMPANY_CONFIG.address.pincode,
    cin: COMPANY_CONFIG.cin,
    workingHoursDesk: COMPANY_CONFIG.businessHours.dispatchDesk,
    workingHoursOffice: COMPANY_CONFIG.businessHours.office,
  },
};
