import { DocumentType, ShipmentDocument, SAMPLE_POD_SVG, SAMPLE_EWAY_SVG } from './shipmentsData';

export type TripStatus =
  | 'Scheduled'
  | 'Loading'
  | 'On Route'
  | 'Completed'
  | 'Delayed'
  | 'Cancelled';

export interface TripRecord {
  id: string; // e.g. TRIP-701
  tripNumber: string;
  shipmentId: string; // Linked shipment tracking ID
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  originHub: string;
  destinationHub: string;
  startDateTime: string;
  expectedArrival: string;
  status: TripStatus;
  currentKm: number;
  totalKm: number;
  tollCheckpointsPassed: number;
  fastagDeductionINR: string;
  fuelExpenseINR: string;
  podUploaded: boolean;
  documents?: ShipmentDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_TRIPS: TripRecord[] = [
  {
    id: 'TRIP-701',
    tripNumber: 'TRP-2026-0891',
    shipmentId: 'NL123456789',
    vehicleNumber: 'HR-55-AB-9821',
    vehicleType: '32 Ft Multi-Axle Container (BharatBenz 2823R)',
    driverName: 'Baldev Singh',
    driverPhone: '+91 98721 44556',
    originHub: 'Delhi NCR Hub (Gurugram)',
    destinationHub: 'Mumbai Port Hub (Bhiwandi)',
    startDateTime: 'Oct 04, 2026 - 06:45 PM',
    expectedArrival: 'Oct 08, 2026 - 04:30 PM',
    status: 'On Route',
    currentKm: 980,
    totalKm: 1420,
    tollCheckpointsPassed: 14,
    fastagDeductionINR: '₹4,820',
    fuelExpenseINR: '₹26,400',
    podUploaded: false,
    documents: [
      {
        id: 'doc-ewb-01',
        name: 'GST E-Way Bill Permit',
        type: 'E-Way Bill',
        fileName: 'EWB-2910-4829-1092.pdf',
        fileSize: '142 KB',
        fileUrl: SAMPLE_EWAY_SVG,
        uploadedAt: 'Oct 04, 2026, 05:30 PM',
        verified: true,
      },
    ],
    notes: 'Priority line-haul corridor via NH-48. Dual drivers deployed.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'TRIP-702',
    tripNumber: 'TRP-2026-0902',
    shipmentId: 'NL987654321',
    vehicleNumber: 'KA-04-ER-6210',
    vehicleType: '20 Ft Medium Commercial (Eicher Pro 3015)',
    driverName: 'Murugan Selvam',
    driverPhone: '+91 94432 11988',
    originHub: 'Bengaluru Hub (Peenya)',
    destinationHub: 'Chennai Automotive Hub (Sriperumbudur)',
    startDateTime: 'Oct 05, 2026 - 04:30 PM',
    expectedArrival: 'Oct 07, 2026 - 01:15 PM',
    status: 'On Route',
    currentKm: 310,
    totalKm: 340,
    tollCheckpointsPassed: 5,
    fastagDeductionINR: '₹1,240',
    fuelExpenseINR: '₹6,800',
    podUploaded: false,
    documents: [
      {
        id: 'doc-lr-02',
        name: 'Consignment Note (Lorry Receipt / Bilty)',
        type: 'Consignment Note',
        fileName: 'LR-NL-9876-BENG.pdf',
        fileSize: '98 KB',
        fileUrl: SAMPLE_EWAY_SVG,
        uploadedAt: 'Oct 05, 2026, 03:00 PM',
        verified: true,
      },
    ],
    notes: 'Direct industrial delivery to SIPCOT automotive line.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'TRIP-703',
    tripNumber: 'TRP-2026-0870',
    shipmentId: 'NL555666777',
    vehicleNumber: 'MH-12-PQ-4419',
    vehicleType: '17 Ft Commercial Truck (Tata Ultra 1518)',
    driverName: 'Sanjay Shinde',
    driverPhone: '+91 98220 33411',
    originHub: 'Pune Industrial Area (Chakan)',
    destinationHub: 'Ahmedabad (Sanand)',
    startDateTime: 'Oct 03, 2026 - 05:30 PM',
    expectedArrival: 'Oct 05, 2026 - 03:22 PM',
    status: 'Completed',
    currentKm: 650,
    totalKm: 650,
    tollCheckpointsPassed: 9,
    fastagDeductionINR: '₹2,680',
    fuelExpenseINR: '₹12,400',
    podUploaded: true,
    documents: [
      {
        id: 'doc-pod-03',
        name: 'Signed Proof of Delivery (POD)',
        type: 'POD',
        fileName: 'POD_NL555666777_Sanand_Signed.jpg',
        fileSize: '245 KB',
        fileUrl: SAMPLE_POD_SVG,
        uploadedAt: 'Oct 05, 2026, 03:25 PM',
        verified: true,
      },
      {
        id: 'doc-ewb-03',
        name: 'GST E-Way Bill Copy',
        type: 'E-Way Bill',
        fileName: 'EWB-8812-4019-3381.pdf',
        fileSize: '135 KB',
        fileUrl: SAMPLE_EWAY_SVG,
        uploadedAt: 'Oct 03, 2026, 04:00 PM',
        verified: true,
      },
    ],
    notes: 'Consignee received 5.4 MT polymers. Gate pass verified.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
