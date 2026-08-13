import React from "react";

// Premium Neural Nexus Logo - Centralized branding asset
export const NeuralNexusLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nexusGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFB547" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="nexusGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFB547" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.5" />
      </linearGradient>
      <filter id="nexusGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="nodeGlow">
        <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Outer orbital ring */}
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#nexusGrad1)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(-30 18 18)" />
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#nexusGrad2)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(30 18 18)" />
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="#FF7A00" strokeWidth="0.5" strokeOpacity="0.3" />
    {/* Neural nodes */}
    <circle cx="18" cy="10" r="2.5" fill="#FF7A00" filter="url(#nodeGlow)" />
    <circle cx="24" cy="15" r="2" fill="#FFB547" filter="url(#nodeGlow)" />
    <circle cx="22" cy="22" r="2" fill="#FF7A00" filter="url(#nodeGlow)" />
    <circle cx="14" cy="22" r="2" fill="#FFB547" filter="url(#nodeGlow)" />
    <circle cx="12" cy="15" r="2" fill="#FF7A00" filter="url(#nodeGlow)" />
    <circle cx="18" cy="18" r="3" fill="#FF7A00" filter="url(#nexusGlow)" />
    {/* Connection lines */}
    <path d="M18 10L24 15M24 15L22 22M22 22L14 22M14 22L12 15M12 15L18 10" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
    <path d="M18 10L18 18M24 15L18 18M22 22L18 18M14 22L18 18M12 15L18 18" stroke="#FFB547" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    {/* Orbital electrons */}
    <circle cx="28" cy="12" r="1" fill="#FF7A00" opacity="0.7" />
    <circle cx="10" cy="26" r="1" fill="#FFB547" opacity="0.7" />
    <circle cx="8" cy="10" r="0.8" fill="#FF7A00" opacity="0.5" />
  </svg>
);

// Logo with fallback: tries image.png first, falls back to SVG
interface BrandLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export function BrandLogo({ className, style }: BrandLogoProps) {
  return (
    <img 
      src="/image.png" 
      alt="SCI-FORGE AI Logo" 
      className={className}
      style={style}
      onError={(e) => {
        // Fallback to SVG when image fails to load
        const target = e.currentTarget;
        const fallbackSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        fallbackSvg.setAttribute("viewBox", "0 0 36 36");
        fallbackSvg.setAttribute("fill", "none");
        fallbackSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        fallbackSvg.classList.add(className || "");
        fallbackSvg.innerHTML = `
          <defs>
            <linearGradient id="nexusGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFB547" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="nexusGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFB547" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.5" />
            </linearGradient>
            <filter id="nexusGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#nexusGrad1)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(-30 18 18)" />
          <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#nexusGrad2)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(30 18 18)" />
          <ellipse cx="18" cy="18" rx="15" ry="6" stroke="#FF7A00" strokeWidth="0.5" strokeOpacity="0.3" />
          <circle cx="18" cy="10" r="2.5" fill="#FF7A00" filter="url(#nodeGlow)" />
          <circle cx="24" cy="15" r="2" fill="#FFB547" filter="url(#nodeGlow)" />
          <circle cx="22" cy="22" r="2" fill="#FF7A00" filter="url(#nodeGlow)" />
          <circle cx="14" cy="22" r="2" fill="#FFB547" filter="url(#nodeGlow)" />
          <circle cx="12" cy="15" r="2" fill="#FF7A00" filter="url(#nodeGlow)" />
          <circle cx="18" cy="18" r="3" fill="#FF7A00" filter="url(#nexusGlow)" />
          <path d="M18 10L24 15M24 15L22 22M22 22L14 22M14 22L12 15M12 15L18 10" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
          <path d="M18 10L18 18M24 15L18 18M22 22L18 18M14 22L18 18M12 15L18 18" stroke="#FFB547" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
          <circle cx="28" cy="12" r="1" fill="#FF7A00" opacity="0.7" />
          <circle cx="10" cy="26" r="1" fill="#FFB547" opacity="0.7" />
          <circle cx="8" cy="10" r="0.8" fill="#FF7A00" opacity="0.5" />
        `;
        // Copy styles
        if (style) {
          Object.assign(fallbackSvg.style, style);
        }
        // Replace img with svg
        target.parentNode?.replaceChild(fallbackSvg, target);
      }}
    />
  );
}