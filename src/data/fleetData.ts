export interface VehicleFleetItem {
  id: string;
  type: string;
  popularModels: string;
  capacityTonnes: string;
  capacityKg: number;
  deckDimensions: string;
  volumeCft: string;
  bodyType: string;
  suitableFor: string;
  highlights: string[];
  recommendedCargo: string[];
}

export const FLEET_DATA: VehicleFleetItem[] = [
  {
    id: "mini-truck",
    type: "Mini Truck",
    popularModels: "Tata Ace Gold / Mahindra Supro / Ashok Leyland Bada Dost",
    capacityTonnes: "0.8 - 1.2 MT",
    capacityKg: 1200,
    deckDimensions: "7.2 ft x 4.8 ft x 4.5 ft",
    volumeCft: "150 CFT",
    bodyType: "Open Deck / Closed Tarpaulin",
    suitableFor: "Intra-city distribution, FMCG retail replenishment, e-commerce parcel loads, light industrial spares",
    highlights: ["Accessible in narrow city lanes & non-entry zones", "Quick loading & rapid turnaround", "Cost-effective for small commercial loads"],
    recommendedCargo: ["E-commerce parcels", "Light machinery parts", "Packaged foods", "Retail inventory"]
  },
  {
    id: "pickup",
    type: "Pickup Truck",
    popularModels: "Mahindra Bolero Maxi Truck / Ashok Leyland Dost+",
    capacityTonnes: "1.5 - 2.5 MT",
    capacityKg: 2500,
    deckDimensions: "8.5 ft x 5.5 ft x 5.0 ft",
    volumeCft: "230 CFT",
    bodyType: "Heavy-duty Flatbed / High-deck",
    suitableFor: "Suburban transport, hardware & construction supplies, medium agricultural freight, factory-to-warehouse transfers",
    highlights: ["High ground clearance for rugged industrial roads", "Sturdy suspension for heavy hardware", "Reliable regional transit"],
    recommendedCargo: ["Hardware & pipes", "Agricultural produce", "Ceramic tiles", "Electrical appliances"]
  },
  {
    id: "14-ft-truck",
    type: "14 Ft Intermediate Commercial Vehicle (ICV)",
    popularModels: "Eicher Pro 2049 / Tata 407 Gold / Eicher Pro 2059",
    capacityTonnes: "3.5 - 4.5 MT",
    capacityKg: 4500,
    deckDimensions: "14.2 ft x 6.5 ft x 6.5 ft",
    volumeCft: "600 CFT",
    bodyType: "Fixed Side Deck / Closed Container Box",
    suitableFor: "Inter-city medium freight, pharmaceutical cartons, consumer electronics, garment consignments",
    highlights: ["Optimal balance of volume and payload", "Excellent fuel economy on national expressways", "Available in both open and containerized forms"],
    recommendedCargo: ["Consumer goods", "Pharmaceutical cartons", "Garments & textiles", "Paper reels"]
  },
  {
    id: "17-ft-truck",
    type: "17 Ft Commercial Truck",
    popularModels: "Eicher Pro 2095 / Tata 709g LPT / Ashok Leyland Boss 1115",
    capacityTonnes: "5.0 - 7.0 MT",
    capacityKg: 7000,
    deckDimensions: "17.5 ft x 7.0 ft x 7.0 ft",
    volumeCft: "850 CFT",
    bodyType: "High Side Deck / Weather-sealed Container",
    suitableFor: "Mid-heavy industrial raw materials, plastics, metal castings, auto-ancillary deliveries",
    highlights: ["Extended body length for voluminous cargo", "GPS telematics enabled", "Inter-state permit certified"],
    recommendedCargo: ["Plastic granules", "Auto parts", "Plywood & laminates", "Industrial paint drums"]
  },
  {
    id: "20-ft-truck",
    type: "20 Ft Medium Commercial Truck",
    popularModels: "Eicher Pro 3015 / Tata 1109 / BharatBenz 1217C",
    capacityTonnes: "7.5 - 10.0 MT",
    capacityKg: 10000,
    deckDimensions: "20.2 ft x 7.5 ft x 7.5 ft",
    volumeCft: "1,130 CFT",
    bodyType: "Multi-utility Open / High-deck Container",
    suitableFor: "Interstate industrial distribution, bulk FMCG carton distribution, machinery sub-assemblies",
    highlights: ["Heavy payload chassis for long interstate runs", "Reinforced flooring for palletized cargo", "Double-driver capability for fast transit"],
    recommendedCargo: ["Bulk FMCG products", "Packaging materials", "Electrical transformers", "Machinery components"]
  },
  {
    id: "32-ft-multi-axle",
    type: "32 Ft Multi-Axle Heavy Truck (SXL / MXL)",
    popularModels: "Tata Signa 2823.K / BharatBenz 2823R / Ashok Leyland 2820",
    capacityTonnes: "14.0 - 18.5 MT",
    capacityKg: 18500,
    deckDimensions: "32.0 ft x 8.0 ft x 8.0 ft",
    volumeCft: "2,040 CFT",
    bodyType: "Multi-Axle Heavy Container / High-cube Box",
    suitableFor: "Heavy bulk industrial shipments, white goods (refrigerators, ACs), high-volume FMCG, automotive sub-assemblies",
    highlights: ["Dual rear axles for balanced weight distribution", "High-cube volume capacity", "Lowest per-ton transport cost across long distances"],
    recommendedCargo: ["White goods & appliances", "Automotive components", "Textile bales", "Packaged consumer goods"]
  },
  {
    id: "container-truck",
    type: "Container Truck (32 Ft MX / 40 Ft HQ)",
    popularModels: "BharatBenz 3523R / Tata Signa 3525 / Ashok Leyland 3520",
    capacityTonnes: "18.0 - 25.0 MT",
    capacityKg: 25000,
    deckDimensions: "32 - 40 ft x 8.2 ft x 9.5 ft (High Cube)",
    volumeCft: "2,500 - 3,100 CFT",
    bodyType: "Corrugated Steel Secure ISO Container",
    suitableFor: "High-value electronics, pharmaceuticals requiring weather protection, export-import port transfers, tamper-evident cargo",
    highlights: ["100% Weatherproof & pilferage-proof steel container", "Digital seal & tamper-detection lock support", "Port and dry-dock compliant"],
    recommendedCargo: ["Export-import port cargo", "High-value electronics", "Cosmetics & pharma", "Precision machinery"]
  },
  {
    id: "trailer",
    type: "Heavy Commercial Trailer (Flatbed / Lowbed / Semi-Trailer)",
    popularModels: "Tata Prima 5530.S / BharatBenz 5528TT / Ashok Leyland 5525",
    capacityTonnes: "25.0 - 40.0 MT",
    capacityKg: 40000,
    deckDimensions: "40.0 - 50.0 ft x 8.5 ft Flatbed / Drop-deck",
    volumeCft: "Heavy Haul / Over-Dimensional",
    bodyType: "Articulated Flatbed / Hydraulic Low-bed",
    suitableFor: "Over-Dimensional Cargo (ODC), structural steel coils, heavy earthmoving equipment, prefabricated construction structures",
    highlights: ["Heavy-duty hydraulic suspension", "Special permit handling for Over-Dimensional Cargo (ODC)", "Escort-supported arterial route planning"],
    recommendedCargo: ["Steel coils & TMT bars", "Heavy transformers", "Earthmoving machines", "Bridge girders & infrastructure steel"]
  }
];
