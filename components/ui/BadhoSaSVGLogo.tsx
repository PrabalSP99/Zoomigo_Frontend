import React from 'react';

interface BadhoSaSVGLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const BadhoSaSVGLogo: React.FC<BadhoSaSVGLogoProps> = ({ 
  width = 120, 
  height = 40, 
  className = '' 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 120 40" 
      className={`transition-all duration-300 ease-in-out hover:scale-105 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="badhoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#2B2D8A', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FF6B61', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.1"/>
        </filter>
      </defs>
      
      {/* BadhoSa Text */}
      <text 
        x="10" 
        y="28" 
        fontFamily="Inter, system-ui, sans-serif" 
        fontSize="24" 
        fontWeight="700" 
        letterSpacing="-0.5"
        fill="url(#badhoGradient)"
        filter="url(#shadow)"
      >
        BadhoSa
      </text>
      
      {/* Subtle highlight overlay for first two letters */}
      <text 
        x="10" 
        y="28" 
        fontFamily="Inter, system-ui, sans-serif" 
        fontSize="24" 
        fontWeight="700" 
        letterSpacing="-0.5"
        fill="url(#badhoGradient)"
        opacity="0.3"
      >
        Ba
      </text>
    </svg>
  );
};

export default BadhoSaSVGLogo;
