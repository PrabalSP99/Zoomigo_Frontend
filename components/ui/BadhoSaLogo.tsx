import React from 'react';

interface BadhoSaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const BadhoSaLogo: React.FC<BadhoSaLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`font-bold tracking-tight transition-all duration-300 ease-in-out hover:scale-105 justify-start ${sizeClasses[size]} ${className}`}>
      <span className="relative inline-block">
        <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-sm">
          Ba
        </span>
        <span className="text-gray-900 drop-shadow-sm">
          dhoSa
        </span>
      </span>
    </div>
  );
};

export default BadhoSaLogo;
