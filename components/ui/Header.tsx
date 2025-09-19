'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import BadhoSaLogo from './BadhoSaLogo';

interface HeaderProps {
  currentPage?: 'dashboard' | 'profile';
}

export default function Header({ currentPage }: HeaderProps = {}) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <BadhoSaLogo size="lg" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/" className="text-gray-700 hover:text-white hover:bg-indigo-900 transition-all duration-200 font-medium px-3 py-2 rounded-full">
              Home
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-white hover:bg-indigo-900 transition-all duration-200 font-medium px-3 py-2 rounded-full">
              Search
            </Link>
            {user && (
              <>
                {currentPage === 'dashboard' ? (
                  <Link href="/profile" className="text-gray-700 hover:text-white hover:bg-indigo-900 transition-all duration-200 font-medium px-3 py-2 rounded-full">
                    Profile
                  </Link>
                ) : (
                  <Link href="/dashboard" className="text-gray-700 hover:text-white hover:bg-indigo-900 transition-all duration-200 font-medium px-3 py-2 rounded-full">
                    Dashboard
                  </Link>
                )}
                <Link href="/bookings" className="text-gray-700 hover:text-white hover:bg-indigo-900 transition-all duration-200 font-medium px-3 py-2 rounded-full">
                  My Bookings
                </Link>
              </>
            )}
            <Link href="/about" className="text-gray-700 hover:text-white hover:bg-indigo-900 transition-all duration-200 font-medium px-3 py-2 rounded-full">
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Profile Link */}
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-white hover:bg-red-800 transition-all duration-200 font-medium px-3 py-2 rounded-full"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                  Login
                </Link>
                <Link 
                  href="/auth?mode=signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
