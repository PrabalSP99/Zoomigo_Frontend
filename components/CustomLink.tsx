'use client';

import React from 'react';
import Link from 'next/link';
import { usePageTransition } from '../contexts/PageTransitionContext';

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
}

export default function CustomLink({ 
  href, 
  children, 
  className, 
  onClick, 
  replace = false,
  scroll = true,
  prefetch = true
}: CustomLinkProps) {
  const { startTransition } = usePageTransition();

  const handleClick = () => {
    // Call the original onClick if provided
    if (onClick) {
      onClick();
    }
    
    // Start the loading transition
    startTransition();
  };

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
