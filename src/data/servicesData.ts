export interface LogisticsService {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  keyFeatures: string[];
  idealFor: string;
  transitTime: string;
  coverage: string;
}

export const SERVICES_DATA: LogisticsService[] = [
  {
    id: "road-transportation",
    name: "Road Transportation",
    shortDescription: "Transportation solutions designed to support the movement of goods between business locations.",
    fullDescription: "Transportation solutions designed to support the movement of goods between business locations with dependable road carrier operations, scheduled dispatch, and disciplined handling.",
    iconName: "Truck",
    keyFeatures: [
      "Point-to-point business road transportation",
      "Scheduled transit corridors and arterial route coverage",
      "Vetted commercial vehicles with dedicated capacity",
      "Full compliance with GST and transit regulations"
    ],
    idealFor: "Commercial goods, raw materials, industrial inventory, finished products",
    transitTime: "Direct scheduled transit",
    coverage: "Gurugram, Faridabad, Sonipat, Noida & Key Corridors"
  },
  {
    id: "logistics-coordination",
    name: "Logistics Coordination",
    shortDescription: "Coordination between businesses, transport partners and delivery operations to support smooth shipment movement.",
    fullDescription: "Active operational coordination between businesses, transport partners, and delivery destinations to support smooth consignment flow, minimal turnaround time, and clear communication.",
    iconName: "Navigation",
    keyFeatures: [
      "Proactive dispatch desk coordination",
      "Seamless communication between consignor, carrier and consignee",
      "Milestone updates and delivery receipt management",
      "Problem resolution and turnaround monitoring"
    ],
    idealFor: "Corporate shippers, manufacturers, distributors requiring disciplined oversight",
    transitTime: "Continuous active coordination",
    coverage: "End-to-end consignment corridors"
  },
  {
    id: "business-transportation",
    name: "Business Transportation Solutions",
    shortDescription: "Transportation support tailored to the requirements of businesses and commercial shipments.",
    fullDescription: "Tailored commercial transportation frameworks built to meet the specific operational schedules, payload parameters, and volume commitments of businesses.",
    iconName: "Boxes",
    keyFeatures: [
      "Tailored transportation agreements for commercial enterprises",
      "Flexible sizing adapted to business cargo volume",
      "Predictable rate structures without hidden surcharges",
      "Long-term business relationship focus"
    ],
    idealFor: "Growing businesses, commercial trade, corporate distribution contracts",
    transitTime: "Scheduled commercial dispatch",
    coverage: "Business hubs and industrial sectors"
  },
  {
    id: "transport-partner-network",
    name: "Transport Partner Network",
    shortDescription: "Building connections between businesses and suitable transport partners to support logistics requirements.",
    fullDescription: "Connecting businesses with suitable, reliable transport partners to ensure consistent carrier availability, optimal fleet match, and seamless vehicle placement.",
    iconName: "Users",
    keyFeatures: [
      "Vetted, verified transport partner fleet operators",
      "Broad network of reliable commercial vehicle pilots",
      "Consistent vehicle placement for high-demand lanes",
      "Mutually beneficial long-term transport partnerships"
    ],
    idealFor: "Enterprises needing dependable access to diverse commercial vehicle categories",
    transitTime: "Rapid vehicle placement",
    coverage: "NCR & Regional Industrial Clusters"
  },
  {
    id: "technology-enabled-logistics",
    name: "Technology-Enabled Logistics",
    shortDescription: "Using digital tools and improved workflows to simplify logistics coordination and transportation management.",
    fullDescription: "Applying practical digital tools, automated tracking workflows, and centralized communications to simplify transportation management and give businesses confidence.",
    iconName: "Cpu",
    keyFeatures: [
      "Digital tracking and consignment milestone visibility",
      "Electronic consignment documentation & proof of delivery (POD)",
      "Instant WhatsApp & digital status coordination",
      "Optimized dispatch workflows and data transparency"
    ],
    idealFor: "Modern enterprises seeking transparency, speed, and paperless coordination",
    transitTime: "Real-time digital oversight",
    coverage: "All digital consignments"
  }
];
