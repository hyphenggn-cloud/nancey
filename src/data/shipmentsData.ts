export type ShipmentStatus =
  | 'Booking Confirmed'
  | 'Pickup Scheduled'
  | 'Shipment Picked Up'
  | 'In Transit'
  | 'Reached Destination Hub'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface TimelineCheckpoint {
  step: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  notes?: string;
}

export type DocumentType = 'POD' | 'E-Way Bill' | 'Consignment Note' | 'Invoice' | 'Inspection Report';

export interface ShipmentDocument {
  id: string;
  name: string;
  type: DocumentType;
  fileName: string;
  fileSize?: string;
  fileUrl: string; // Base64 data URL or external storage URL
  uploadedAt: string;
  uploadedBy?: string;
  verified?: boolean;
  referenceNumber?: string; // e.g. Invoice #, POD Serial #
  invoiceAmountINR?: string; // e.g. ₹76,440 (for invoices)
  receiverName?: string; // Receiver who stamped/signed POD
  receiverPhone?: string; // Contact of receiving party
  notes?: string; // Special delivery condition remarks
  mimeType?: string; // e.g. image/png, application/pdf
}

export const SAMPLE_POD_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="560" height="360" rx="12" fill="white" stroke="%23cbd5e1" stroke-width="2"/><text x="50" y="60" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230f172a">OUTSHIPPER - PROOF OF DELIVERY (POD)</text><text x="50" y="90" font-family="sans-serif" font-size="12" fill="%2364748b">Pan-India Freight Consignment Delivery Receipt</text><line x1="50" y1="105" x2="550" y2="105" stroke="%23e2e8f0" stroke-width="2"/><text x="50" y="140" font-family="sans-serif" font-size="14" fill="%23334155">Tracking ID: <tspan font-weight="bold" fill="%23f97316">NL123456789</tspan></text><text x="320" y="140" font-family="sans-serif" font-size="14" fill="%23334155">Date: <tspan font-weight="bold">08-Oct-2026</tspan></text><text x="50" y="170" font-family="sans-serif" font-size="14" fill="%23334155">Consignee: <tspan font-weight="bold">Apex Electronics Pvt Ltd</tspan></text><text x="320" y="170" font-family="sans-serif" font-size="14" fill="%23334155">Destination: <tspan font-weight="bold">Bhiwandi Hub, Mumbai</tspan></text><text x="50" y="200" font-family="sans-serif" font-size="14" fill="%23334155">Vehicle: <tspan font-weight="bold">HR-55-AB-9821</tspan></text><text x="320" y="200" font-family="sans-serif" font-size="14" fill="%23334155">Driver: <tspan font-weight="bold">Baldev Singh</tspan></text><rect x="50" y="240" width="220" height="100" rx="8" fill="%23f1f5f9" stroke="%23cbd5e1"/><text x="65" y="270" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23475569">Receiver Stamp &amp; Signature:</text><text x="65" y="300" font-family="sans-serif" font-size="16" font-style="italic" fill="%230284c7">Received in Good Condition %E2%9C%93</text><text x="65" y="325" font-family="sans-serif" font-size="11" fill="%2364748b">Verified by Warehouse Manager</text><circle cx="450" cy="285" r="45" fill="%23dcfce7" stroke="%2322c55e" stroke-width="3"/><text x="450" y="280" font-family="sans-serif" font-size="14" font-weight="bold" fill="%2315803d" text-anchor="middle">DELIVERED</text><text x="450" y="300" font-family="sans-serif" font-size="10" font-weight="bold" fill="%2315803d" text-anchor="middle">VERIFIED POD</text></svg>`;

export const SAMPLE_INVOICE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="560" height="380" rx="12" fill="white" stroke="%23cbd5e1" stroke-width="2"/><text x="50" y="60" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230f172a">OUTSHIPPER - TAX INVOICE</text><text x="50" y="85" font-family="sans-serif" font-size="12" fill="%2364748b">Freight Transportation Services · Official GST B2B Invoice</text><line x1="50" y1="100" x2="550" y2="100" stroke="%23e2e8f0" stroke-width="2"/><text x="50" y="135" font-family="sans-serif" font-size="13" fill="%23334155">Invoice No: <tspan font-weight="bold" fill="%230284c7">NL-INV-2026-894</tspan></text><text x="320" y="135" font-family="sans-serif" font-size="13" fill="%23334155">Date: <tspan font-weight="bold">07-Oct-2026</tspan></text><text x="50" y="170" font-family="sans-serif" font-size="13" fill="%23334155">Billed To: <tspan font-weight="bold">Client Corporate Account</tspan></text><text x="320" y="170" font-family="sans-serif" font-size="13" fill="%23334155">GSTIN: <tspan font-weight="bold">06AABCN9921D1Z4</tspan></text><rect x="50" y="195" width="500" height="110" rx="6" fill="%23f8fafc" stroke="%23e2e8f0"/><text x="65" y="225" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23475569">Description: Full Truckload (FTL) Multi-Axle Line-Haul</text><text x="65" y="255" font-family="sans-serif" font-size="12" fill="%23334155">Freight Base Charges: ₹68,000 | Tolls &amp; Fastag: ₹4,800</text><text x="65" y="285" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230f172a">Total Amount Payable (incl 5% GST): ₹76,440</text><circle cx="480" cy="335" r="35" fill="%23e0f2fe" stroke="%230284c7" stroke-width="2"/><text x="480" y="332" font-family="sans-serif" font-size="11" font-weight="bold" fill="%230369a1" text-anchor="middle">PAID</text><text x="480" y="348" font-family="sans-serif" font-size="9" font-weight="bold" fill="%230369a1" text-anchor="middle">GST TAX INVOICE</text></svg>`;

export const SAMPLE_EWAY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="560" height="360" rx="12" fill="white" stroke="%23cbd5e1" stroke-width="2"/><text x="50" y="60" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230f172a">GOVERNMENT OF INDIA - E-WAY BILL</text><text x="50" y="90" font-family="sans-serif" font-size="12" fill="%2364748b">GST Transport Electronic Transit Permit - Part A &amp; B</text><line x1="50" y1="105" x2="550" y2="105" stroke="%23e2e8f0" stroke-width="2"/><text x="50" y="140" font-family="sans-serif" font-size="14" fill="%23334155">E-Way Bill No: <tspan font-weight="bold" font-family="monospace" fill="%230284c7">2910-4829-1092</tspan></text><text x="340" y="140" font-family="sans-serif" font-size="14" fill="%23334155">GSTIN: <tspan font-weight="bold">07AABCN1234F1Z9</tspan></text><text x="50" y="175" font-family="sans-serif" font-size="14" fill="%23334155">From: <tspan font-weight="bold">Gurugram, Haryana</tspan></text><text x="340" y="175" font-family="sans-serif" font-size="14" fill="%23334155">To: <tspan font-weight="bold">Bhiwandi, Mumbai</tspan></text><text x="50" y="210" font-family="sans-serif" font-size="14" fill="%23334155">Commodity: <tspan font-weight="bold">Industrial Electronics</tspan></text><text x="340" y="210" font-family="sans-serif" font-size="14" fill="%23334155">Gross Weight: <tspan font-weight="bold">16.50 MT</tspan></text><text x="50" y="245" font-family="sans-serif" font-size="14" fill="%23334155">Vehicle: <tspan font-weight="bold">HR-55-AB-9821</tspan></text><text x="340" y="245" font-family="sans-serif" font-size="14" fill="%23334155">Valid Until: <tspan font-weight="bold">12-Oct-2026</tspan></text><rect x="50" y="280" width="500" height="60" rx="8" fill="%23f0fdf4" stroke="%2386efac"/><text x="70" y="315" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23166534">%E2%9C%93 Digital E-Way Bill Active &amp; NHAI Toll Registered</text></svg>`;

export interface ShipmentRecord {
  trackingId: string;
  customerName: string;
  companyName: string;
  origin: string;
  originAddress: string;
  destination: string;
  destinationAddress: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  status: ShipmentStatus;
  currentLocation: string;
  estimatedDelivery: string;
  lastUpdated: string;
  materialType: string;
  weight: string;
  eWayBillNo: string;
  temperatureControlled?: boolean;
  gpsSpeed?: string;
  batteryStatus?: string;
  tripId?: string;
  documents?: ShipmentDocument[];
  timeline: TimelineCheckpoint[];
}

export const TRACKING_STAGES = [
  'Booking Confirmed',
  'Pickup Scheduled',
  'Shipment Picked Up',
  'In Transit',
  'Reached Destination Hub',
  'Out for Delivery',
  'Delivered'
] as const;

export const INITIAL_SHIPMENTS: ShipmentRecord[] = [
  {
    trackingId: 'NL123456789',
    customerName: 'Rajesh Malhotra',
    companyName: 'Apex Electronics Pvt. Ltd.',
    origin: 'Delhi NCR Hub (Gurugram)',
    originAddress: 'Sector 18, Udyog Vihar, Gurugram, Haryana',
    destination: 'Mumbai Port Hub (Bhiwandi)',
    destinationAddress: 'Mankoli Logistics Park, Bhiwandi, Maharashtra',
    vehicleNumber: 'HR-55-AB-9821',
    vehicleType: '32 Ft Multi-Axle Container (BharatBenz 2823R)',
    driverName: 'Baldev Singh (Verified Driver)',
    driverPhone: '+91 98721 44556',
    status: 'In Transit',
    currentLocation: 'Ratlam Expressway Junction, Madhya Pradesh (NH-48)',
    estimatedDelivery: 'Oct 08, 2026, 04:30 PM IST',
    lastUpdated: '18 minutes ago (Live GPS Ping)',
    materialType: 'High-Density Consumer Electronics & Spares',
    weight: '16.5 MT',
    eWayBillNo: 'EWB-2910-4829-1092',
    gpsSpeed: '64 km/h',
    timeline: [
      {
        step: 'Booking Confirmed',
        location: 'Outshipper Dispatch Center, Gurugram',
        timestamp: 'Oct 04, 2026 - 10:15 AM',
        completed: true,
        current: false,
        notes: 'Commercial consignment note issued & verified.'
      },
      {
        step: 'Pickup Scheduled',
        location: 'Client Warehouse, Manesar Industrial Estate',
        timestamp: 'Oct 04, 2026 - 02:30 PM',
        completed: true,
        current: false,
        notes: 'Vehicle inspection completed and assigned.'
      },
      {
        step: 'Shipment Picked Up',
        location: 'Manesar Logistics Bay 4',
        timestamp: 'Oct 04, 2026 - 06:45 PM',
        completed: true,
        current: false,
        notes: '16.5 MT electronics loaded; security e-seal locked.'
      },
      {
        step: 'In Transit',
        location: 'Western Dedicated Freight Corridor (En route to Bhiwandi)',
        timestamp: 'Oct 05, 2026 - 08:30 PM',
        completed: true,
        current: true,
        notes: 'Vehicle moving along NH-48 safely. GPS speed: 64 km/h.'
      },
      {
        step: 'Reached Destination Hub',
        location: 'Outshipper Central Hub, Bhiwandi, Mumbai',
        timestamp: 'Expected Oct 07, 2026 - 11:00 PM',
        completed: false,
        current: false,
        notes: 'Inbound dock 12 pre-assigned for priority unloading.'
      },
      {
        step: 'Out for Delivery',
        location: 'Mumbai Regional Logistics Terminal',
        timestamp: 'Scheduled Oct 08, 2026 - 09:00 AM',
        completed: false,
        current: false,
        notes: 'Final mile dispatch team notified.'
      },
      {
        step: 'Delivered',
        location: 'Client Receiver Terminal, Nhava Sheva',
        timestamp: 'Expected Oct 08, 2026 - 04:30 PM',
        completed: false,
        current: false,
        notes: 'Digital Proof of Delivery (e-POD) OTP pending.'
      }
    ]
  },
  {
    trackingId: 'NL987654321',
    customerName: 'Ananya Deshmukh',
    companyName: 'Varun Auto Ancillaries',
    origin: 'Bengaluru Hub (Peenya)',
    originAddress: 'Peenya Industrial Area Phase II, Bengaluru',
    destination: 'Chennai Automotive Corridor (Sriperumbudur)',
    destinationAddress: 'SIPCOT Industrial Park, Sriperumbudur, Tamil Nadu',
    vehicleNumber: 'KA-04-ER-6210',
    vehicleType: '20 Ft Medium Commercial (Eicher Pro 3015)',
    driverName: 'Murugan Selvam',
    driverPhone: '+91 94432 11988',
    status: 'Out for Delivery',
    currentLocation: 'Sriperumbudur Toll Plaza, entering Industrial Belt',
    estimatedDelivery: 'Today by 01:15 PM IST',
    lastUpdated: '5 minutes ago (Live GPS Ping)',
    materialType: 'Precision Automotive Castings & Fasteners',
    weight: '7.8 MT',
    eWayBillNo: 'EWB-5501-9923-4100',
    gpsSpeed: '38 km/h',
    timeline: [
      {
        step: 'Booking Confirmed',
        location: 'Bengaluru Operations Desk',
        timestamp: 'Oct 05, 2026 - 09:00 AM',
        completed: true,
        current: false
      },
      {
        step: 'Pickup Scheduled',
        location: 'Peenya Hub Dock 3',
        timestamp: 'Oct 05, 2026 - 11:30 AM',
        completed: true,
        current: false
      },
      {
        step: 'Shipment Picked Up',
        location: 'Peenya Facility Gate',
        timestamp: 'Oct 05, 2026 - 01:15 PM',
        completed: true,
        current: false
      },
      {
        step: 'In Transit',
        location: 'Bengaluru-Chennai Expressway (NH-44 / NH-48)',
        timestamp: 'Oct 05, 2026 - 04:00 PM',
        completed: true,
        current: false
      },
      {
        step: 'Reached Destination Hub',
        location: 'Chennai Sriperumbudur Logistics Park',
        timestamp: 'Oct 06, 2026 - 05:40 AM',
        completed: true,
        current: false
      },
      {
        step: 'Out for Delivery',
        location: 'Approaching SIPCOT Gate 2',
        timestamp: 'Oct 06, 2026 - 09:30 AM',
        completed: true,
        current: true,
        notes: 'Delivery vehicle en-route to consignee warehouse.'
      },
      {
        step: 'Delivered',
        location: 'Consignee Bay',
        timestamp: 'Expected Oct 06, 2026 - 01:15 PM',
        completed: false,
        current: false
      }
    ]
  },
  {
    trackingId: 'NL554433221',
    customerName: 'Sunil Mehta',
    companyName: 'Gujarat Polychem Industries',
    origin: 'Pune (Chakan MIDC)',
    originAddress: 'Chakan Industrial Zone Phase IV, Pune, Maharashtra',
    destination: 'Ahmedabad (Sanand GIDC)',
    destinationAddress: 'Sanand Engineering Zone, Ahmedabad, Gujarat',
    vehicleNumber: 'MH-14-GH-4112',
    vehicleType: '17 Ft Commercial Truck (Tata 709)',
    driverName: 'Dattatray Shinde',
    driverPhone: '+91 97654 32110',
    status: 'Delivered',
    currentLocation: 'Sanand Consignee Yard (Delivered & Verified)',
    estimatedDelivery: 'Oct 05, 2026 - Completed',
    lastUpdated: 'Delivered successfully at 03:22 PM',
    materialType: 'Industrial Polymers & Additives',
    weight: '5.4 MT',
    eWayBillNo: 'EWB-8812-4019-3381',
    timeline: [
      { step: 'Booking Confirmed', location: 'Chakan Depot', timestamp: 'Oct 03, 2026 - 11:00 AM', completed: true, current: false },
      { step: 'Pickup Scheduled', location: 'Plant 2 Loading', timestamp: 'Oct 03, 2026 - 03:00 PM', completed: true, current: false },
      { step: 'Shipment Picked Up', location: 'Chakan Gate', timestamp: 'Oct 03, 2026 - 05:30 PM', completed: true, current: false },
      { step: 'In Transit', location: 'NH-48 Golden Quadrilateral', timestamp: 'Oct 04, 2026 - 07:00 AM', completed: true, current: false },
      { step: 'Reached Destination Hub', location: 'Ahmedabad Ring Road Hub', timestamp: 'Oct 05, 2026 - 09:10 AM', completed: true, current: false },
      { step: 'Out for Delivery', location: 'Sanand Arterial Road', timestamp: 'Oct 05, 2026 - 12:45 PM', completed: true, current: false },
      { step: 'Delivered', location: 'Sanand Factory Bay 1', timestamp: 'Oct 05, 2026 - 03:22 PM', completed: true, current: true, notes: 'Consignee signed digital POD. Receiver OTP: 789123.' }
    ]
  },
  {
    trackingId: 'NL889900112',
    customerName: 'Bikramjit Sen',
    companyName: 'Eastern Consumer Packaged Goods',
    origin: 'Kolkata Hub (Dankuni)',
    originAddress: 'Dankuni Freight Terminal, Hooghly, West Bengal',
    destination: 'Hyderabad (Shamshabad)',
    destinationAddress: 'Aerospace & Cargo Logistics Zone, Shamshabad, Telangana',
    vehicleNumber: 'WB-19-JK-5544',
    vehicleType: '32 Ft Multi-Axle Container (Tata Signa 2823.K)',
    driverName: 'Somen Ghosh',
    driverPhone: '+91 98311 20909',
    status: 'Reached Destination Hub',
    currentLocation: 'Outshipper South Hub, Shamshabad, Hyderabad',
    estimatedDelivery: 'Oct 07, 2026 - 10:00 AM IST',
    lastUpdated: '34 minutes ago (Hub Inward Scan)',
    materialType: 'FMCG Consumer Goods & Tea Cases',
    weight: '14.2 MT',
    eWayBillNo: 'EWB-3341-9981-6712',
    timeline: [
      { step: 'Booking Confirmed', location: 'Dankuni Booking Office', timestamp: 'Oct 02, 2026 - 02:00 PM', completed: true, current: false },
      { step: 'Pickup Scheduled', location: 'Dankuni Warehouse', timestamp: 'Oct 02, 2026 - 05:00 PM', completed: true, current: false },
      { step: 'Shipment Picked Up', location: 'Dankuni Terminal', timestamp: 'Oct 02, 2026 - 09:15 PM', completed: true, current: false },
      { step: 'In Transit', location: 'NH-16 Coastal Corridor', timestamp: 'Oct 03, 2026 - 08:00 AM', completed: true, current: false },
      { step: 'Reached Destination Hub', location: 'Outshipper Hub Shamshabad', timestamp: 'Oct 06, 2026 - 04:30 AM', completed: true, current: true, notes: 'Vehicle docked. Scheduled for local distribution route.' },
      { step: 'Out for Delivery', location: 'Shamshabad Distribution Bay', timestamp: 'Scheduled Oct 07, 2026 - 07:00 AM', completed: false, current: false },
      { step: 'Delivered', location: 'Hyderabad Super Stockist', timestamp: 'Expected Oct 07, 2026 - 10:00 AM', completed: false, current: false }
    ]
  },
  {
    trackingId: 'NL332211445',
    customerName: 'Kailash Soni',
    companyName: 'Jaipur Textile Mills',
    origin: 'Jaipur (Sitapura)',
    originAddress: 'Sitapura Industrial Area, Jaipur, Rajasthan',
    destination: 'Ludhiana (Focal Point)',
    destinationAddress: 'Phase VIII, Focal Point, Ludhiana, Punjab',
    vehicleNumber: 'RJ-14-TC-1982',
    vehicleType: '14 Ft ICV (Eicher Pro 2049)',
    driverName: 'Rameshwar Lal',
    driverPhone: '+91 94140 88213',
    status: 'Pickup Scheduled',
    currentLocation: 'Jaipur Transport Nagar (Vehicle En Route to Shipper)',
    estimatedDelivery: 'Oct 08, 2026 - 06:00 PM IST',
    lastUpdated: '1 hour ago',
    materialType: 'Garments & Handloom Export Rolls',
    weight: '3.8 MT',
    eWayBillNo: 'EWB-1123-5561-9023',
    timeline: [
      { step: 'Booking Confirmed', location: 'Jaipur Freight Desk', timestamp: 'Oct 06, 2026 - 08:30 AM', completed: true, current: false },
      { step: 'Pickup Scheduled', location: 'Sitapura Export Zone Gate 1', timestamp: 'Oct 06, 2026 - 11:30 AM', completed: true, current: true, notes: 'Driver assigned, expected at factory gate by 01:00 PM.' },
      { step: 'Shipment Picked Up', location: 'Sitapura Loading Bay', timestamp: 'Expected Oct 06, 2026 - 02:00 PM', completed: false, current: false },
      { step: 'In Transit', location: 'Western Ring Expressway to NH-44', timestamp: 'Pending', completed: false, current: false },
      { step: 'Reached Destination Hub', location: 'Ludhiana GT Road Terminal', timestamp: 'Expected Oct 07, 2026 - 08:00 PM', completed: false, current: false },
      { step: 'Out for Delivery', location: 'Ludhiana City Hub', timestamp: 'Expected Oct 08, 2026 - 11:00 AM', completed: false, current: false },
      { step: 'Delivered', location: 'Focal Point Warehouse', timestamp: 'Expected Oct 08, 2026 - 06:00 PM', completed: false, current: false }
    ]
  }
];

export function getShipmentByTrackingId(id: string): ShipmentRecord | undefined {
  const cleanId = id.trim().toUpperCase();
  return INITIAL_SHIPMENTS.find(s => s.trackingId.toUpperCase() === cleanId);
}
