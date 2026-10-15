/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface BrandLogoProps {
  variant?: 'color' | 'white';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'color', className }) => {
  const src = variant === 'white' ? '/logo-white.png' : '/logo.png';
  return <img src={src} alt="FamilyCare Funeral Trust" className={className} />;
};
