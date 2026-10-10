import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  taglineText?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'white',
  size = 'md',
  showTagline = true,
  taglineText = 'ON TIME EVERY TIME',
}) => {
  const isDarkBg = variant === 'dark';

  const containerSizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const sloganSizes = {
    sm: 'text-[7.5px] tracking-[0.28em]',
    md: 'text-[9.5px] tracking-[0.32em]',
    lg: 'text-xs tracking-[0.35em]',
    xl: 'text-sm tracking-[0.38em]',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 select-none group transition-opacity hover:opacity-95 ${className}`}
      aria-label="OUTSHIPPER - Moving Businesses Forward"
    >
      {/* Brand Mark on Crisp Pure White Canvas */}
      <div className="flex flex-col items-start justify-center bg-white px-2.5 py-1.5 rounded-md shadow-xs border border-slate-200">
        <div className="flex items-center leading-none">
          {/* OUTSHI in Black Bold Sans */}
          <span
            className={`font-display font-black tracking-tighter text-black uppercase ${textSizes[size]}`}
            style={{ fontFamily: "'Plus Jakarta Sans', 'Arial Black', sans-serif" }}
          >
            OUTSHI
          </span>

          {/* First P in Black */}
          <span
            className={`font-display font-black text-black uppercase ${textSizes[size]}`}
            style={{ fontFamily: "'Plus Jakarta Sans', 'Arial Black', sans-serif" }}
          >
            P
          </span>

          {/* Stylized Red Accent for PPE */}
          <div className="relative inline-flex items-center mx-[0.5px]">
            {/* Red Graphic Badge */}
            <div className="bg-[#E60023] text-white font-black px-1 py-0.5 rounded-xs flex items-center justify-center leading-none">
              <span
                className={`font-display font-black tracking-tight uppercase text-white ${
                  size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'
                }`}
              >
                P
              </span>
              <span
                className={`font-display font-black tracking-tight uppercase text-white ml-0.5 ${
                  size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'
                }`}
              >
                E
              </span>
            </div>
          </div>

          {/* R in Black */}
          <span
            className={`font-display font-black text-black uppercase ${textSizes[size]}`}
            style={{ fontFamily: "'Plus Jakarta Sans', 'Arial Black', sans-serif" }}
          >
            R
          </span>
        </div>

        {/* Subtitle / Slogan */}
        {showTagline && (
          <span
            className={`font-mono font-bold text-black uppercase mt-1 leading-none ${sloganSizes[size]}`}
          >
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
};
