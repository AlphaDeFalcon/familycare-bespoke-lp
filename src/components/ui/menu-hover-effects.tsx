/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NavMenuLinkProps {
  href: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Animated nav link: top/bottom borders settle into place while a
 * brand-green background fill rises from the top. The label stays ink
 * (dark) on the green fill so hover text keeps WCAG AA contrast.
 */
export const NavMenuLink: React.FC<NavMenuLinkProps> = ({ href, onClick, className, children }) => {
  return (
    <a href={href} onClick={onClick} className={`relative inline-block group ${className ?? ''}`}>
      {/* Link text */}
      <span className="relative z-10 block uppercase font-sans font-semibold transition-colors duration-300 py-2 px-3">
        {children}
      </span>
      {/* Top & bottom border animation */}
      <span
        className="absolute inset-0 border-t-2 border-b-2 border-accent
          transform scale-y-[2] opacity-0
          transition-all duration-300 origin-center
          group-hover:scale-y-100 group-hover:opacity-100"
        aria-hidden="true"
      />
      {/* Background fill animation */}
      <span
        className="absolute top-[2px] left-0 w-full h-full bg-accent
          transform scale-0 opacity-0
          transition-all duration-300 origin-top
          group-hover:scale-100 group-hover:opacity-100"
        aria-hidden="true"
      />
    </a>
  );
};
