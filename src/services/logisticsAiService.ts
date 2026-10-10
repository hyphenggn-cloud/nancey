import { FLEET_DATA } from '../data/fleetData';
import { SERVICES_DATA } from '../data/servicesData';
import { getShipmentByTrackingId, INITIAL_SHIPMENTS } from '../data/shipmentsData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  actionCta?: {
    label: string;
    action: string;
  };
  sources?: {
    title: string;
    uri: string;
  }[];
  modelUsed?: string;
}

export interface QueryOptions {
  model?: 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';
  enableSearch?: boolean;
}

export async function processLogisticsQuery(
  query: string,
  history: ChatMessage[] = [],
  options: QueryOptions = { model: 'gemini-3.5-flash', enableSearch: true }
): Promise<ChatMessage> {
  const trimmed = query.trim();

  // Attempt backend API if running with server proxy
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: trimmed,
        history: history.slice(-8),
        model: options.model || 'gemini-3.5-flash',
        enableSearch: options.enableSearch !== false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.reply) {
        return {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCta: data.actionCta,
          sources: data.sources || [],
          modelUsed: data.modelUsed || options.model || 'gemini-3.5-flash',
        };
      }
    }
  } catch {
    // Graceful fallback to client-side domain reasoning engine
  }

  // Client-side domain reasoning engine
  const lower = trimmed.toLowerCase();

  // 1. Tracking query pattern
  const trackingMatch = trimmed.match(/NL\d{9}/i);
  if (trackingMatch) {
    const trackingId = trackingMatch[0].toUpperCase();
    const shipment = getShipmentByTrackingId(trackingId);
    if (shipment) {
      return {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        text: `Shipment **${shipment.trackingId}** is currently **${shipment.status}**.\n\n` +
          `• **Origin**: ${shipment.origin}\n` +
          `• **Destination**: ${shipment.destination}\n` +
          `• **Assigned Vehicle**: ${shipment.vehicleNumber} (${shipment.vehicleType})\n` +
          `• **Current Location**: ${shipment.currentLocation}\n` +
          `• **Estimated Delivery**: ${shipment.estimatedDelivery}\n` +
          `• **Last Ping**: ${shipment.lastUpdated}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionCta: {
          label: `View Live Timeline for ${shipment.trackingId}`,
          action: `track:${shipment.trackingId}`
        }
      };
    } else {
      return {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        text: `I couldn't locate active tracking records for **${trackingId}**. Please verify the 11-character consignment ID (e.g. NL123456789) or contact our dispatch desk at +91 92123 99003.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }
  }

  // 2. Weight / Tonnage Analysis (e.g., "12 tons", "5 ton", "500 kg")
  const tonMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:tons?|tonnes?|t\b|mt\b)/);
  const kgMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?)/);
  let weightInTonnes: number | null = null;

  if (tonMatch) {
    weightInTonnes = parseFloat(tonMatch[1]);
  } else if (kgMatch) {
    weightInTonnes = parseFloat(kgMatch[1]) / 1000;
  }

  if (weightInTonnes !== null) {
    let recommendedVehicle = '';
    let description = '';

    if (weightInTonnes <= 1.2) {
      recommendedVehicle = 'Mini Truck (Tata Ace / Mahindra Bolero Maxi)';
      description = 'Ideal for intra-city point transfers, light pallets, or small commercial consignments.';
    } else if (weightInTonnes <= 2.5) {
      recommendedVehicle = 'Pickup Truck (Mahindra Bolero / Ashok Leyland Dost)';
      description = 'Well-suited for medium loads, hardware consignments, and regional suburban delivery.';
    } else if (weightInTonnes <= 4.5) {
      recommendedVehicle = '14 Ft ICV (Eicher Pro / Tata 407)';
      description = 'Optimal volume-to-weight balance for consumer goods, textiles, and medium commercial freight.';
    } else if (weightInTonnes <= 7.0) {
      recommendedVehicle = '17 Ft Commercial Truck (Eicher 1110 / Tata 709)';
      description = 'Reliable vehicle for manufacturing spares, packaging materials, and regional line-haul.';
    } else if (weightInTonnes <= 10.0) {
      recommendedVehicle = '20 Ft Medium Commercial Truck (Eicher 3015 / BharatBenz)';
      description = 'High volumetric capacity for industrial machinery, bulk FMCG cartons, and interstate delivery.';
    } else if (weightInTonnes <= 18.5) {
      recommendedVehicle = '32 Ft Multi-Axle Heavy Truck (Tata Signa 2823 / BharatBenz 2823R)';
      description = 'Engineered for heavy line-haul transit, white goods, and long-distance arterial corridors.';
    } else if (weightInTonnes <= 25.0) {
      recommendedVehicle = 'Container Truck (32 Ft MX / 40 Ft HQ Container)';
      description = 'Weatherproof, high-security sealed container ideal for export-import, electronics, and high-value cargo.';
    } else {
      recommendedVehicle = 'Heavy Commercial Trailer (40-50 Ft Flatbed / Lowbed)';
      description = 'Specialized for Over-Dimensional Cargo (ODC), structural steel coils, and heavy infrastructure machinery.';
    }

    return {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      text: `Based on your payload of approximately **${weightInTonnes} metric tonnes**, our recommendation is:\n\n` +
        `• **Recommended Vehicle**: ${recommendedVehicle}\n` +
        `• **Operational Note**: ${description}\n\n` +
        `To prepare an accurate freight dispatch plan, we need the pickup & delivery pincodes, material packaging type, and target loading date. Outshipper Private Limited does not quote automated estimates without assessing route toll corridors and vehicle availability.\n\n` +
        `Would you like to submit your requirement to our logistics team for a formal quote?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionCta: {
        label: 'Get an Official Freight Quote',
        action: 'nav:quote'
      }
    };
  }

  // 3. FTL vs PTL comparison
  if (lower.includes('ftl') || lower.includes('ptl') || lower.includes('part truck') || lower.includes('full truck')) {
    return {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      text: `Here is the operational distinction between **Full Truck Load (FTL)** and **Part Truck Load (PTL)** at Outshipper:\n\n` +
        `• **Full Truck Load (FTL)**: You reserve the complete truck exclusively for your cargo. The vehicle travels non-stop directly from your warehouse to the consignee destination, eliminating cross-docking and reducing transit time to the minimum.\n\n` +
        `• **Part Truck Load (PTL)**: For smaller consignments (500 kg to 5 MT) that do not warrant a full vehicle. Your cargo is consolidated through our regional hubs with barcoded tracking, offering significant cost savings.\n\n` +
        `Which model best matches your monthly shipment frequency?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionCta: {
        label: 'Explore Outshipper Services',
        action: 'nav:services'
      }
    };
  }

  // 4. Rate / Price Inquiry
  if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('charges') || lower.includes('tariff') || lower.includes('quote')) {
    return {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      text: `Freight rates at Outshipper Private Limited are structured transparently based on exact lane mileage, vehicle tonnage category, loading/unloading conditions, and seasonal diesel indices.\n\n` +
        `As an enterprise B2B carrier, we do not generate generic price estimates, as actual rates depend on route toll corridors and specific cargo handling.\n\n` +
        `Please use our **Request a Quote** form to provide your origin, destination, and material details. Our commercial dispatch desk will calculate the exact contract rate for you within hours.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionCta: {
        label: 'Fill Out Quotation Form',
        action: 'nav:quote'
      }
    };
  }

  // 5. Express Delivery / Time sensitive
  if (lower.includes('express') || lower.includes('urgent') || lower.includes('fast') || lower.includes('emergency') || lower.includes('same day')) {
    return {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      text: `For time-critical freight, **Outshipper Express Transportation** operates with:\n\n` +
        `• **Dual-Driver Operations**: Vehicles run continuously without driver rest stops along national corridors.\n` +
        `• **Green-Channel Hub Movement**: Priority staging and express transit docks.\n` +
        `• **Guaranteed Time Delivery SLAs**: Dedicated tracking manager assigned to oversee transit.\n\n` +
        `Contact our priority desk at **+91 92123 99003** or submit an express freight quote.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionCta: {
        label: 'Request Express Transit',
        action: 'nav:quote'
      }
    };
  }

  // 6. Fleet overview
  if (lower.includes('fleet') || lower.includes('vehicles') || lower.includes('truck types') || lower.includes('container') || lower.includes('trailer')) {
    return {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      text: `Outshipper coordinates a verified commercial fleet across 8 key vehicle classes:\n\n` +
        `1. **Mini Truck** (0.8 - 1.2 MT) – City distribution\n` +
        `2. **Pickup** (1.5 - 2.5 MT) – Suburban & hardware\n` +
        `3. **14 Ft ICV** (3.5 - 4.5 MT) – FMCG & consumer goods\n` +
        `4. **17 Ft Truck** (5.0 - 7.0 MT) – Industrial & raw materials\n` +
        `5. **20 Ft Truck** (7.5 - 10 MT) – Medium line-haul\n` +
        `6. **32 Ft Multi-Axle** (14 - 18.5 MT) – High-volume line-haul\n` +
        `7. **Container Truck** (18 - 25 MT) – High-security weather-sealed cargo\n` +
        `8. **Heavy Trailer** (25 - 40 MT) – ODC & structural steel\n\n` +
        `You can inspect detailed dimensions and payload specs on our Fleet page.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionCta: {
        label: 'View Full Fleet Specifications',
        action: 'nav:fleet'
      }
    };
  }

  // 7. General Assistant Greeting & fallback
  return {
    id: 'msg-' + Date.now(),
    sender: 'assistant',
    text: `Hello! I am the **Outshipper AI Assistant**.\n\n` +
      `I can help you with:\n` +
      `• Choosing the appropriate vehicle class for your payload tonnage\n` +
      `• Explaining commercial transport services (Road Transportation, Logistics Coordination)\n` +
      `• Checking real-time status of shipments (e.g. enter **NL123456789**)\n` +
      `• Guiding you through documentation (E-Way Bills, e-PODs, Transit safety)\n\n` +
      `What type of cargo and route are you planning today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
