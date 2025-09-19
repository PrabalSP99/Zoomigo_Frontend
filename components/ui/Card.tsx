'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hover = false,
}) => {
  const baseClasses = `
    rounded-lg
    transition-all duration-200 ease-in-out
    ${onClick ? 'cursor-pointer' : ''}
    ${hover ? 'hover:shadow-lg hover:scale-[1.02]' : ''}
  `;

  const variantClasses = {
    default: 'bg-white shadow-md border border-gray-200',
    elevated: 'bg-white shadow-xl border-0',
    outlined: 'bg-white border-2 border-gray-300 shadow-none',
    flat: 'bg-gray-50 border border-gray-200 shadow-none',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${className}
  `;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

// Card Header Component
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`pb-4 ${className}`}>
    {children}
  </div>
);

// Card Body Component
interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

// Card Footer Component
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

export default Card;
