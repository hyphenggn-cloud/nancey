export interface CompanyConfig {
  name: string;
  legalName: string;
  cin: string;
  incorporationDate: string;
  tagline: string;
  subTagline: string;
  slogan: string;
  closingSlogan: string;
  positioning: string;
  phone: string;
  phoneDisplay: string;
  dispatchHotline: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  dispatchEmail: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    full: string;
    mapsUrl: string;
  };
  locations: string[];
  businessHours: {
    dispatchDesk: string;
    office: string;
    days: string;
  };
  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  stats: {
    yearsExperience: string;
    shipmentsDelivered: string;
    businessClients: string;
    onTimeRate: string;
    fleetSize: string;
    panIndiaCities: string;
  };
  certifications: string[];
}

export const COMPANY_CONFIG: CompanyConfig = {
  name: "OUTSHIPPER",
  legalName: "Outshipper Private Limited",
  cin: "U60200HR2020PTC091790",
  incorporationDate: "23 December 2020",
  tagline: "Moving Businesses Forward",
  subTagline: "Reliable Logistics. Smarter Transportation. Stronger Connections.",
  slogan: "ON TIME EVERY TIME",
  closingSlogan: "Outshipper — Connecting Businesses Through Logistics.",
  positioning:
    "Outshipper is a logistics and transportation brand focused on helping businesses move goods efficiently through dependable road transportation and logistics solutions.",
  phone: "+919212399003",
  phoneDisplay: "+91 92123 99003",
  dispatchHotline: "+91 92123 99003",
  whatsapp: "+918000945818",
  whatsappDisplay: "+91 80009 45818",
  email: "connect@outshipper.in",
  dispatchEmail: "connect@outshipper.in",
  address: {
    line1: "1st Floor, Ranbir House, Behind Tawa Tandoor Hotel",
    line2: "Bilaspur Chowk, Bilaspur, Bhorakalan",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122413",
    country: "India",
    full: "1st Floor, Ranbir House, Behind Tawa Tandoor Hotel, Bilaspur Chowk, Bilaspur, Bhorakalan, Haryana – 122413, India.",
    mapsUrl: "https://maps.google.com/?q=Bilaspur+Chowk+Haryana+122413",
  },
  locations: [
    "Gurugram, Haryana",
    "Faridabad, Haryana",
    "Sonipat, Haryana",
    "Noida, Uttar Pradesh",
  ],
  businessHours: {
    dispatchDesk: "24x7 Real-Time Freight Coordination & Consignment Control",
    office: "9:00 AM – 7:00 PM (IST)",
    days: "Monday through Saturday",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/outshipper",
    twitter: "https://twitter.com/outshipper",
    facebook: "https://facebook.com/outshipper",
  },
  stats: {
    yearsExperience: "5+",
    shipmentsDelivered: "10,000+",
    businessClients: "800+",
    onTimeRate: "99.4%",
    fleetSize: "400+",
    panIndiaCities: "Confirmed Service Corridors",
  },
  certifications: [
    "Incorporated Pvt. Ltd. (CIN: U60200HR2020PTC091790)",
    "GST Compliant E-Invoicing & E-Way Bill Operations",
    "Pan-India Verified Transport Partner Network",
    "Technology-Enabled Road Transportation",
  ],
};
