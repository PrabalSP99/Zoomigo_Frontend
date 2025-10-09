'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface PageTransitionContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startTransition: () => void;
  endTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const startTransition = () => {
    setIsLoading(true);
  };

  const endTransition = () => {
    setIsLoading(false);
  };

  return (
    <PageTransitionContext.Provider value={{ 
      isLoading, 
      setIsLoading, 
      startTransition, 
      endTransition 
    }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
}

// Hook for automatic navigation with loading
export function useNavigationWithLoading() {
  const router = useRouter();
  const { startTransition } = usePageTransition();

  const navigateWithLoading = (href: string) => {
    startTransition();
    router.push(href);
  };

  const replaceWithLoading = (href: string) => {
    startTransition();
    router.replace(href);
  };

  const backWithLoading = () => {
    startTransition();
    router.back();
  };

  return {
    navigateWithLoading,
    replaceWithLoading,
    backWithLoading
  };
}
