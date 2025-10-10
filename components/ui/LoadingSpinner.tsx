'use client';

interface LoadingSpinnerProps {
  isLoading: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'car' | 'bike' | 'simple';
}

interface InlineLoadingProps {
  isLoading: boolean;
  message?: string;
  size?: 'sm' | 'md';
}

export function InlineLoading({ 
  isLoading, 
  message = "Loading...", 
  size = 'md' 
}: InlineLoadingProps) {
  if (!isLoading) return null;


  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm'
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-8">
      {/* Compact Loading Animation */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer Circle */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
        
        {/* Inner Circle */}
        <div className="absolute inset-1 rounded-full border border-gray-300"></div>
        
        {/* Road Surface */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
        
        {/* Animated Car */}
        <div className="absolute inset-0 animate-spin" style={{animationDuration: '1.5s'}}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-0.5">
            <svg 
              width="16" 
              height="10" 
              viewBox="0 0 16 10" 
              className="drop-shadow-sm"
            >
              <rect x="1" y="3" width="14" height="5" rx="1" fill="#3B82F6" />
              <rect x="3" y="1" width="10" height="3" rx="0.5" fill="#2563EB" />
              <rect x="3" y="1" width="5" height="3" fill="#60A5FA" opacity="0.8" />
              <rect x="8" y="1" width="5" height="3" fill="#60A5FA" opacity="0.8" />
              <circle cx="4" cy="8" r="1.2" fill="#1F2937" />
              <circle cx="12" cy="8" r="1.2" fill="#1F2937" />
              <circle cx="4" cy="8" r="0.5" fill="#6B7280" />
              <circle cx="12" cy="8" r="0.5" fill="#6B7280" />
              <circle cx="1" cy="5" r="0.5" fill="#FEF3C7" />
              <circle cx="15" cy="5" r="0.5" fill="#FEF3C7" />
            </svg>
          </div>
        </div>
        
        {/* Speed Lines */}
        <div className="absolute inset-0 animate-spin" style={{animationDuration: '0.8s'}}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
            <div className="w-0.5 h-2 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60"></div>
          </div>
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
            <div className="w-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
            <div className="w-0.5 h-2 bg-gradient-to-t from-transparent via-blue-400 to-transparent opacity-60"></div>
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
            <div className="w-2 h-0.5 bg-gradient-to-l from-transparent via-blue-400 to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
      
      {/* Loading Text */}
      <p className={`font-medium text-gray-600 ${textSizeClasses[size]} animate-pulse`}>
        {message}
      </p>
      
      {/* Loading Dots */}
      <div className="flex items-center space-x-1">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
}

export default function LoadingSpinner({ 
  isLoading, 
  message = "Finding you the perfect ride..."
}: LoadingSpinnerProps) {
  if (!isLoading) return null;


  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        {/* Animated Circular Icon Container */}
        <div className="relative w-32 h-32">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-8 border-transparent rounded-full animate-spin-slow" 
               style={{borderTopColor: '#312e81', borderRightColor: '#312e81', borderBottomColor: '#4f46e5', borderLeftColor: '#4f46e5'}}></div>
          
          {/* Inner spinning ring (reverse direction) */}
          <div className="absolute inset-4 border-4 border-transparent rounded-full animate-spin-slow" 
               style={{animationDirection: 'reverse', borderTopColor: '#4338ca', borderRightColor: '#4338ca', borderBottomColor: '#6366f1', borderLeftColor: '#6366f1'}}></div>
          
          {/* Car icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path d="M19 17h2v-5H3v5h2m2-12l2-7h10l2 7H7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="w-full max-w-xs">
          <div className="w-full bg-indigo-900/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 h-2 rounded-full progress-bar"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-900">
            {message}
          </h3>
          <p className="text-indigo-900/70 text-sm">
            Please wait while we prepare your experience.
          </p>
        </div>
      </div>
    </div>
  );
}