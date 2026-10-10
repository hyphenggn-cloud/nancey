import { QuoteRequestData } from '../components/QuoteSection';
import { ContactEnquiryData } from '../components/ContactSection';
import { COMPANY_CONFIG } from '../data/config';

// Outshipper Private Limited Owner WhatsApp number: +91 80009 45818
export const OWNER_WHATSAPP_RAW = '918000945818';
export const OWNER_WHATSAPP_DISPLAY = '+91 80009 45818';

/**
 * Clean phone number to digits only (e.g. 918000945818)
 */
export function sanitizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits || OWNER_WHATSAPP_RAW;
}

/**
 * Format complete customer quote request details for Owner WhatsApp
 */
export function formatQuoteWhatsAppMessage(quote: QuoteRequestData): string {
  return [
    `🚚 *NEW TRANSPORTATION QUOTE REQUEST - OUTSHIPPER* 🚚`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 *Reference ID:* #${quote.id}`,
    `🏢 *Company:* ${quote.companyName}`,
    `👤 *Contact Person:* ${quote.contactPerson}`,
    `📞 *Phone / Mobile:* ${quote.mobileNumber}`,
    `✉️ *Email:* ${quote.email}`,
    ``,
    `📍 *Pickup Location (Origin):* ${quote.pickupLocation}`,
    `🏁 *Delivery Location (Destination):* ${quote.deliveryLocation}`,
    `📦 *Material / Cargo:* ${quote.materialType}`,
    `⚖️ *Approximate Weight:* ${quote.approximateWeight}`,
    `🚛 *Vehicle Class:* ${quote.vehicleRequirement}`,
    `📅 *Target Pickup Date:* ${quote.pickupDate}`,
    quote.additionalRequirements
      ? `📝 *Special Requirements:* ${quote.additionalRequirements}`
      : `📝 *Requirements:* Standard commercial road transit`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `⏰ *Submitted At:* ${quote.submittedAt}`,
    `🌐 *Sent via Outshipper Private Limited Portal*`
  ].join('\n');
}

/**
 * Format customer contact form message for Owner WhatsApp
 */
export function formatEnquiryWhatsAppMessage(enquiry: ContactEnquiryData): string {
  return [
    `📩 *NEW ENQUIRY - OUTSHIPPER PRIVATE LIMITED* 📩`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 *Enquiry ID:* #${enquiry.id}`,
    `👤 *Client Name:* ${enquiry.name}`,
    `🏢 *Company Name:* ${enquiry.company}`,
    `📞 *Contact Number:* ${enquiry.phone}`,
    `✉️ *Email Address:* ${enquiry.email}`,
    ``,
    `📝 *Customer Message / Requirement:*`,
    `"${enquiry.message}"`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `⏰ *Logged At:* ${enquiry.submittedAt}`,
    `🌐 *Sent via Outshipper Dispatch Desk*`
  ].join('\n');
}

/**
 * Format AI Smart Logistics Analysis for Owner WhatsApp
 */
export function formatSmartAnalysisWhatsAppMessage(data: {
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  vehicle: string;
  priority?: string;
  distanceKm?: number;
}): string {
  return [
    `🤖 *TRANSPORTATION FREIGHT ESTIMATE - OUTSHIPPER* 🤖`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📍 *Pickup Origin:* ${data.origin}`,
    `🏁 *Delivery Destination:* ${data.destination}`,
    `📦 *Cargo Category:* ${data.cargo}`,
    `⚖️ *Weight:* ${data.weight} kg`,
    `🚛 *Recommended Vehicle:* ${data.vehicle}`,
    data.priority ? `⚡ *Transit Priority:* ${data.priority}` : '',
    data.distanceKm ? `🛣️ *Estimated Distance:* ~${data.distanceKm} KM` : '',
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `💬 *Customer Request:* Please provide official road transportation rate and vehicle placement availability.`,
    `🌐 *Source: Outshipper Route & Logistics Calculator*`
  ].filter(Boolean).join('\n');
}

/**
 * Generate universal WhatsApp web & mobile link
 */
export function getWhatsAppUrl(message: string, recipientPhone: string = OWNER_WHATSAPP_RAW): string {
  const cleanPhone = sanitizePhoneForWhatsApp(recipientPhone);
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

/**
 * Format owner reply to a customer's quote
 */
export function formatOwnerQuoteReplyMessage(quote: QuoteRequestData): string {
  return [
    `Hello ${quote.contactPerson},`,
    `Greetings from Outshipper Private Limited!`,
    ``,
    `Thank you for requesting a transportation quote (Ref: #${quote.id}) for your shipment:`,
    `• Route: ${quote.pickupLocation} ➔ ${quote.deliveryLocation}`,
    `• Cargo: ${quote.materialType} (${quote.approximateWeight})`,
    `• Vehicle: ${quote.vehicleRequirement}`,
    ``,
    `Our operations team has reviewed your requirements. Please let us know your preferred vehicle placement schedule or any questions.`,
    ``,
    `Best regards,`,
    `Outshipper Private Limited Operations Team`,
    `📞 +91 92123 99003 | ✉️ connect@outshipper.in | 💬 WhatsApp: +91 80009 45818`
  ].join('\n');
}

/**
 * Open WhatsApp directly in new window / tab
 */
export function openWhatsAppDirect(message: string, recipientPhone: string = OWNER_WHATSAPP_RAW): void {
  const url = getWhatsAppUrl(message, recipientPhone);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
