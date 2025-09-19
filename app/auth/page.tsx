'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';
import SignupForm from '../../components/auth/SignupForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/');
      return;
    }

    // Check URL parameter for mode
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [router, searchParams]);

  const handleAuthSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* Floating Background Elements - Hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className={`absolute top-20 left-10 w-32 h-32 bg-white rounded-full opacity-5 transition-all duration-2000 ease-in-out ${
          isLogin ? 'transform translate-x-20 scale-110' : 'transform translate-x-0 scale-100'
        }`}></div>
        <div className={`absolute bottom-32 right-16 w-24 h-24 bg-white rounded-full opacity-3 transition-all duration-2500 ease-in-out ${
          !isLogin ? 'transform translate-x-16 scale-120' : 'transform translate-x-0 scale-100'
        }`}></div>
        <div className={`absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-4 transition-all duration-3000 ease-in-out ${
          isLogin ? 'transform translate-y-10 scale-90' : 'transform translate-y-0 scale-100'
        }`}></div>
      </div>

      {/* Left Half - Dynamic Content */}
      <div className={`w-full lg:w-1/2 transition-all duration-1200 ease-in-out ${
        isLogin 
          ? 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200' 
          : 'bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700'
      } flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative min-h-screen lg:min-h-0`}>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent"></div>
        </div>
        
        {/* Form Content */}
        <div className={`w-full max-w-md transition-all duration-800 ease-in-out ${
          isLogin ? 'opacity-100 transform translate-x-0 scale-100' : 'opacity-0 transform -translate-x-20 scale-95'
        }`}>
        {isLogin ? (
            <div className="transform transition-all duration-1000 ease-in-out hover:scale-105">
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignup={() => setIsLogin(false)}
          />
            </div>
          ) : null}
        </div>
        
         {/* Indigo Background Content */}
         <div className={`w-full max-w-md transition-all duration-800 ease-in-out ${
           !isLogin ? 'opacity-100 transform translate-x-0 scale-100' : 'opacity-0 transform translate-x-20 scale-95'
         }`}>
           {!isLogin ? (
             <div className="text-center text-white transform transition-all duration-1000 ease-in-out hover:scale-105">
               <div className="typewriter-container mb-6 sm:mb-8">
                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 typewriter-text">
                   <span className="text-red-400">DOMINATE</span> THE ROAD
                 </h1>
                 <p className="text-base sm:text-lg lg:text-xl opacity-90 typewriter-subtitle">
                   Every mile is a conquest. Every turn, a victory.
                 </p>
               </div>
               <div className="flex justify-center space-x-4 mt-8">
                 <div className="w-3 h-3 bg-red-400 rounded-full opacity-60 animate-pulse"></div>
                 <div className="w-3 h-3 bg-red-400 rounded-full opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                 <div className="w-3 h-3 bg-red-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
               </div>
             </div>
           ) : null}
         </div>
      </div>

      {/* Right Half - Dynamic Content */}
      <div className={`w-full lg:w-1/2 transition-all duration-1200 ease-in-out ${
        isLogin 
          ? 'bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700' 
          : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'
      } flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative min-h-screen lg:min-h-0`}>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-bl from-transparent via-white to-transparent"></div>
        </div>
        
        {/* Form Content */}
        <div className={`w-full max-w-md transition-all duration-800 ease-in-out ${
          !isLogin ? 'opacity-100 transform translate-x-0 scale-100' : 'opacity-0 transform translate-x-20 scale-95'
        }`}>
          {!isLogin ? (
            <div className="transform transition-all duration-1000 ease-in-out hover:scale-105">
          <SignupForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
            </div>
          ) : null}
        </div>
        
         {/* Indigo Background Content */}
         <div className={`w-full max-w-md transition-all duration-800 ease-in-out ${
           isLogin ? 'opacity-100 transform translate-x-0 scale-100' : 'opacity-0 transform -translate-x-20 scale-95'
         }`}>
           {isLogin ? (
             <div className="text-center text-white transform transition-all duration-1000 ease-in-out hover:scale-105">
               <div className="typewriter-container mb-6 sm:mb-8">
                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 typewriter-text">
                   <span className="text-red-400">UNLEASH</span> THE BEAST
                 </h1>
                 <p className="text-base sm:text-lg lg:text-xl opacity-90 typewriter-subtitle">
                   The road awaits your command. Time to conquer.
                 </p>
               </div>
               <div className="flex justify-center space-x-4 mt-8">
                 <div className="w-3 h-3 bg-red-400 rounded-full opacity-60 animate-pulse"></div>
                 <div className="w-3 h-3 bg-red-400 rounded-full opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                 <div className="w-3 h-3 bg-red-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
               </div>
             </div>
           ) : null}
         </div>
      </div>

      {/* Capsule Button Container - Responsive positioning */}
      <div className="absolute top-4 sm:top-8 lg:top-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gray-200 rounded-full p-1 flex shadow-xl backdrop-blur-sm">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all duration-500 ease-in-out transform text-sm sm:text-base ${
              isLogin 
                ? 'bg-white text-indigo-900 shadow-lg scale-110' 
                : 'bg-transparent text-gray-600 hover:text-gray-800 hover:scale-105'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all duration-500 ease-in-out transform text-sm sm:text-base ${
              !isLogin 
                ? 'bg-indigo-900 text-white shadow-lg scale-110' 
                : 'bg-transparent text-gray-600 hover:text-gray-800 hover:scale-105'
            }`}
          >
            Signup
          </button>
        </div>
      </div>
      
      {/* Typewriter CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .typewriter-text {
          overflow: hidden;
          border-right: 3px solid #ef4444;
          white-space: nowrap;
          margin: 0 auto;
          animation: typing 2.5s steps(40, end), blink-caret 0.75s step-end infinite 2.5s, hide-cursor 0.1s ease-in-out 2.5s forwards;
        }
        
        .typewriter-subtitle {
          overflow: hidden;
          border-right: 2px solid #ef4444;
          white-space: nowrap;
          margin: 0 auto;
          animation: typing-subtitle 2s steps(30, end) 2.5s forwards, blink-caret-subtitle 0.75s step-end infinite 4.5s, hide-cursor-subtitle 0.1s ease-in-out 4.5s forwards;
          opacity: 0;
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes typing-subtitle {
          from { width: 0; opacity: 0; }
          to { width: 100%; opacity: 0.9; }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: #ef4444; }
        }
        
        @keyframes blink-caret-subtitle {
          from, to { border-color: transparent; }
          50% { border-color: #ef4444; }
        }
        
        @keyframes hide-cursor {
          to { border-color: transparent; }
        }
        
        @keyframes hide-cursor-subtitle {
          to { border-color: transparent; }
        }
      ` }} />
    </div>
  );
}
