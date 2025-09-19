'use client';

import React from 'react';
import { usePageTransition } from '../contexts/PageTransitionContext';
import LoadingSpinner from './ui/LoadingSpinner';

export default function PageTransitionLoader() {
  const { isLoading } = usePageTransition();

  return (
    <LoadingSpinner 
      isLoading={isLoading} 
      message="Navigating to your destination..." 
      size="lg"
      variant="car"
    />
  );
}
