import React from 'react';

interface LanternProps {
  className?: string;
  delay?: string;
}

export const Lantern: React.FC<LanternProps> = ({ className, delay }) => {
  return (
    <div className={`absolute pointer-events-none animate-float ${className}`} style={{ animationDelay: delay }}>
      <svg
        width="100"
        height="180"
        viewBox="0 0 100 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_15px_rgba(255,215,0,0.3)]"
      >
        {/* String */}
        <line x1="50" y1="0" x2="50" y2="40" stroke="#FCD34D" strokeWidth="2" />
        
        {/* Top Ring */}
        <circle cx="50" cy="40" r="6" fill="#FCD34D" />
        
        {/* Top Dome */}
        <path d="M30 60 C30 50, 70 50, 70 60 L80 80 H20 L30 60Z" fill="#B45309" stroke="#FCD34D" strokeWidth="1" />
        
        {/* Main Body */}
        <path d="M20 80 L25 140 H75 L80 80 H20Z" fill="url(#lanternGradient)" stroke="#FCD34D" strokeWidth="1.5" />
        
        {/* Inner Light */}
        <path d="M35 90 L38 130 H62 L65 90 H35Z" fill="#FEF3C7" opacity="0.8" className="animate-pulse" />
        
        {/* Bottom */}
        <path d="M25 140 L35 160 H65 L75 140 H25Z" fill="#B45309" stroke="#FCD34D" strokeWidth="1" />
        
        {/* Tassel */}
        <path d="M50 160 L50 180" stroke="#FCD34D" strokeWidth="2" />
        
        <defs>
          <linearGradient id="lanternGradient" x1="50" y1="80" x2="50" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#92400E" />
            <stop offset="0.5" stopColor="#D97706" />
            <stop offset="1" stopColor="#92400E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};