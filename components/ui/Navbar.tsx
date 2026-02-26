'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BadhoSaLogo from './BadhoSaLogo';
import CustomLink from '../CustomLink';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-gradient-to-t from-gray-50 to-white h-16 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left side */}
          <div className="flex items-center ml-2">
            <CustomLink href="/" className="flex items-center">
              <BadhoSaLogo size="lg" />
            </CustomLink>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2 sm:space-x-4 mr-2 sm:mr-4">
            {/* Become a host - Hidden on small screens */}
            <a 
              href="https://host.badhosa.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Become a host
            </a>
            
            {/* Globe icon */}
            <button className="text-gray-600 hover:text-gray-900 transition-all duration-200 p-1 sm:p-2 rounded-full hover:bg-gray-200 hover:shadow-sm border border-gray-300 hover:border-white">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-gray-600 hover:text-gray-900 transition-all duration-200 flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-full hover:bg-gray-200 hover:shadow-sm border border-gray-300 hover:border-white"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {user ? (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 transform transition-all duration-200 ease-in-out">
            {user ? (
                    // Logged in user menu
                    <>
                      {/* User Profile Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="px-2 py-1">
                        <CustomLink 
                          href="/dashboard" 
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                          </svg>
                          Dashboard
                        </CustomLink>
                        
                        <CustomLink 
                          href="/profile" 
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile Settings
                        </CustomLink>
                        
                        <CustomLink 
                          href="/bookings" 
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Bookings
                        </CustomLink>
                        
                        <CustomLink 
                          href="/vehicles" 
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Browse Vehicles
                        </CustomLink>
                      </div>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      {/* Support Links */}
                      <div className="px-2 py-1">
                        <CustomLink 
                          href="/about" 
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          About Us
                        </CustomLink>
                        
                        <CustomLink 
                          href="/faq" 
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          FAQ
                        </CustomLink>
                      </div>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      {/* Logout */}
                      <div className="px-2 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
              </>
            ) : (
                    // Not logged in user menu
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Welcome to BadhoSa</p>
                        <p className="text-xs text-gray-500">Sign in to access your account</p>
                      </div>
                      
                      <div className="px-2 py-1">
                        <CustomLink 
                          href="/auth" 
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Login
                        </CustomLink>
                        
                        <CustomLink 
                          href="/auth?mode=signup" 
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          Sign Up
                        </CustomLink>
                      </div>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <div className="px-2 py-1">
                        <CustomLink 
                          href="/about" 
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          About Us
                        </CustomLink>
                      </div>
              </>
            )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </nav>
  );
}
