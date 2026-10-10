import React, { useState } from 'react';
import { openWhatsAppDirect, OWNER_WHATSAPP_DISPLAY } from '../lib/whatsapp';
import { useSiteContent } from '../context/SiteContentContext';

interface FloatingWhatsAppButtonProps {
  customMessage?: string;
  className?: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  customMessage,
  className = '',
}) => {
  const { content } = useSiteContent();
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    const message =
      customMessage ||
      `Hello Outshipper Support Team, I would like to enquire about road freight and transportation services for my business.`;

    const targetPhone = content?.contact?.whatsappRaw;
    openWhatsAppDirect(message, targetPhone || undefined);
  };

  return (
    <div
      className={`fixed bottom-4 sm:bottom-5 right-4 sm:right-5 z-40 flex items-center gap-2 group ${className}`}
    >
      {/* Expanded Hover Pill / Tooltip */}
      <div
        className={`hidden md:flex items-center gap-2 bg-slate-900/95 text-white px-3.5 py-2 rounded-full shadow-xl border border-slate-700/80 text-xs backdrop-blur-md transition-all duration-300 pointer-events-none select-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-100">Chat with Support</span>
        <span className="text-slate-400 font-mono text-[11px]">
          ({content?.contact?.whatsappDisplay || OWNER_WHATSAPP_DISPLAY})
        </span>
      </div>

      {/* Main Floating Action Button */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white shadow-xl shadow-emerald-900/30 hover:shadow-2xl hover:shadow-emerald-600/40 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
        aria-label="Chat with Outshipper Support Team on WhatsApp"
        title={`Chat with Outshipper Support Team (${content?.contact?.whatsappDisplay || OWNER_WHATSAPP_DISPLAY})`}
      >
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 group-hover:opacity-40" />

        {/* Online Indicator Badge */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs" />

        {/* Authentic WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-xs"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
    </div>
  );
};
