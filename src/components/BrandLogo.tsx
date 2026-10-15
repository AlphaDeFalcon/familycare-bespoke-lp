/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandLogoProps {
  variant?: 'color' | 'white';
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'color',
  className = '',
  showTagline = true,
  size = 'md'
}) => {
  const isWhite = variant === 'white';

  const greenColor = isWhite ? '#FFFFFF' : '#00A859';
  const blueColor = isWhite ? '#FFFFFF' : '#3A55A3';
  const greyColor = isWhite ? '#E4E4E7' : '#52525B';

  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-[13px]'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Authentic FamilyCare Tree-of-Life Icon */}
      <div className={`relative shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Base Open Book / Foundation */}
          <path
            d="M10 82C25 76 42 77 50 84C58 77 75 76 90 82C90 77 75 70 50 77C25 70 10 77 10 82Z"
            fill={greenColor}
          />
          {/* Central Trunk - Stylized Human Figure */}
          <path
            d="M45 76C45 68 47 60 49 53C47 50 44 45 42 40C40 35 41 30 45 28C48 26 52 26 55 28C59 30 60 35 58 40C56 45 53 50 51 53C53 60 55 68 55 76C52 74 48 74 45 76Z"
            fill={greenColor}
          />
          {/* Central Head */}
          <circle cx="50" cy="22" r="5" fill={greenColor} />

          {/* Left Branch / Supporting Figures */}
          <path
            d="M47 54C41 53 32 48 25 38C22 33 21 27 24 22C27 18 33 19 37 23C42 28 44 38 47 54Z"
            fill={greenColor}
          />
          <circle cx="27" cy="18" r="4.2" fill={greenColor} />

          {/* Right Branch / Supporting Figures */}
          <path
            d="M53 54C59 53 68 48 75 38C78 33 79 27 76 22C73 18 67 19 63 23C58 28 56 38 53 54Z"
            fill={greenColor}
          />
          <circle cx="73" cy="18" r="4.2" fill={greenColor} />

          {/* Upper Outer Canopy Figures - Left */}
          <path
            d="M32 40C25 41 17 38 12 32C8 27 8 21 12 17C16 14 22 16 26 21C30 26 31 33 32 40Z"
            fill={greenColor}
            opacity="0.9"
          />
          <circle cx="14" cy="14" r="3.6" fill={greenColor} />

          {/* Upper Outer Canopy Figures - Right */}
          <path
            d="M68 40C75 41 83 38 88 32C92 27 92 21 88 17C84 14 78 16 74 21C70 26 69 33 68 40Z"
            fill={greenColor}
            opacity="0.9"
          />
          <circle cx="86" cy="14" r="3.6" fill={greenColor} />

          {/* Heart Emblem & Canopy Foliage Nodes */}
          <path
            d="M50 36C47 31 43 31 41 33C39 35 39 39 42 42L50 49L58 42C61 39 61 35 59 33C57 31 53 31 50 36Z"
            fill={isWhite ? '#FFFFFF' : '#3A55A3'}
            opacity="0.95"
          />
          <circle cx="38" cy="10" r="3" fill={greenColor} />
          <circle cx="62" cy="10" r="3" fill={greenColor} />
          <circle cx="50" cy="8" r="3" fill={greenColor} />
        </svg>
      </div>

      {/* Brand Typography Lockup */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline tracking-tight leading-none">
          {/* "family" in flowing editorial script with subtle flourish */}
          <span
            className="font-script italic pr-1 font-semibold text-[1.25em]"
            style={{ color: greenColor }}
          >
            family
          </span>
          {/* "Care" in modern bold sans */}
          <span
            className="font-bold tracking-tight"
            style={{ color: greenColor, fontSize: '1.05em' }}
          >
            Care
          </span>
        </div>

        {/* "Funeral Trust" in authoritative Cobalt Blue */}
        <div
          className="font-extrabold tracking-wide uppercase leading-tight -mt-0.5"
          style={{ color: blueColor, fontSize: '0.85em', letterSpacing: '0.04em' }}
        >
          Funeral Trust
        </div>

        {/* Brand Tagline */}
        {showTagline && (
          <div
            className={`font-medium tracking-tight mt-0.5 whitespace-nowrap ${taglineSizes[size]}`}
            style={{ color: greyColor }}
          >
            Today’s Wisdom, Tomorrow’s Peace of Mind
          </div>
        )}
      </div>
    </div>
  );
};
