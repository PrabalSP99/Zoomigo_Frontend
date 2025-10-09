'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { usePageTransition } from '../../contexts/PageTransitionContext';
import { LoadingSpinner } from '../../components/ui';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { endTransition } = usePageTransition();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isUserMenuOpen && !target.closest('[data-dropdown]')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // End loading transition when data is ready
  useEffect(() => {
    if (!authLoading) {
      endTransition();
    }
  }, [authLoading, endTransition]);

  if (authLoading) {
    return (
      <LoadingSpinner 
        isLoading={true} 
        message="Loading your dashboard..." 
        size="lg"
        variant="car"
      />
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-gray-100 to-gray-50" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div className="flex h-full grow">
        {/* Sidebar */}
        <aside className="w-80 flex-col bg-white p-4 shadow-lg hidden lg:flex">
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-8">
              {/* User Profile */}
              <div className="flex items-center gap-3 p-2">
                <div className="size-12 rounded-full bg-gradient-to-br from-indigo-700 to-indigo-900 p-1">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
        </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-gray-900 text-base font-bold">
                    {user.name || 'User'}
                  </h1>
                  <p className="text-gray-500 text-sm">Joined in 2024</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="flex flex-col gap-2">
                <a className="flex items-center gap-3 rounded-full bg-indigo-900 px-4 py-3 text-white shadow-md hover:bg-gradient-to-br hover:from-indigo-700 hover:to-indigo-900" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 21H4C3.44772 21 3 20.5523 3 20V12.4142C3 12.149 3.10536 11.8946 3.29289 11.7071L11.2929 3.70711C11.6834 3.31658 12.3166 3.31658 12.7071 3.70711L20.7071 11.7071C20.8946 11.8946 21 12.149 21 12.4142V20C21 20.5523 20.5523 21 20 21H15M9 21H15M9 21V15C9 14.4477 9.44772 14 10 14H14C14.5523 14 15 14.4477 15 15V21" stroke="currentColor" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span className="text-sm font-semibold">Home</span>
                </a>
                <a className="flex items-center gap-3 rounded-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-900" href="#" onClick={() => router.push('/bookings')}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.39 20.59H7.7M3.89 20.59H1.5V13.91l.69-4.13a1.92 1.92 0 0 1 1.88-1.6H15.39A1.91 1.91 0 0 1 17.2 9.49l1.48 4.42 3.82 1.91v4.77H18.2M16.3 20.59a1.91 1.91 0 1 0 0-3.82 1.91 1.91 0 0 0 0 3.82zM5.8 20.59a1.91 1.91 0 1 0 0-3.82 1.91 1.91 0 0 0 0 3.82zM18.68 13.91H4.36M12.95 10.09v3.82M7.23 10.09v3.82M5.32 1.5h8.59a2.86 2.86 0 0 1 2.86 2.86v1a0 0 0 0 1 0 0H2.45a0 0 0 0 1 0 0v-1A2.86 2.86 0 0 1 5.32 1.5zM5.32 5.32v2.86M13.91 5.32v2.86" stroke="currentColor" strokeWidth="1.91" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span className="text-sm font-medium">Bookings</span>
                </a>
                <a className="flex items-center gap-3 rounded-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-900" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 12H7.26393C8.02148 12 8.714 12.428 9.05279 13.1056L9.44721 13.8944C9.786 14.572 10.4785 15 11.2361 15H12.9296C13.5983 15 14.2228 14.6658 14.5937 14.1094L15.4063 12.8906C15.7772 12.3342 16.4017 12 17.0704 12H21M3 12V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V12M3 12L5.51334 5.29775C5.80607 4.51715 6.55231 4 7.386 4H16.614C17.4477 4 18.1939 4.51715 18.4867 5.29775L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span className="text-sm font-medium">Inbox</span>
                </a>
                <a className="flex items-center gap-3 rounded-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-900" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span className="text-sm font-medium">Trips</span>
                </a>
                <a className="flex items-center gap-3 rounded-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-900" href="#" onClick={() => router.push('/profile')}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M334,2011 C337.785,2011 340.958,2013.214 341.784,2017 L326.216,2017 C327.042,2013.214 330.215,2011 334,2011 M330,2005 C330,2002.794 331.794,2001 334,2001 C336.206,2001 338,2002.794 338,2005 C338,2007.206 336.206,2009 334,2009 C331.794,2009 330,2007.206 330,2005 M337.758,2009.673 C339.124,2008.574 340,2006.89 340,2005 C340,2001.686 337.314,1999 334,1999 C330.686,1999 328,2001.686 328,2005 C328,2006.89 328.876,2008.574 330.242,2009.673 C326.583,2011.048 324,2014.445 324,2019 L344,2019 C344,2014.445 341.417,2011.048 337.758,2009.673" transform="translate(-324, -1999)" fill="currentColor"/>
                  </svg>
                  <span className="text-sm font-medium">Profile</span>
                </a>
              </nav>
                </div>
              </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-4xl">
            {/* Welcome Section */}
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name || 'User'}</h1>
              <div className="relative" data-dropdown>
                <button 
                  className="flex items-center gap-2 rounded-full bg-white p-2 shadow-sm" 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="size-10 rounded-full bg-gradient-to-br from-indigo-700 to-indigo-900 p-0.5">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>
                
                {/* User Menu Dropdown */}
                <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white/80 backdrop-blur-md shadow-lg ring-1 ring-black/10 focus:outline-none transition-all duration-200 ease-in-out transform ${
                  isUserMenuOpen 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`} role="menu">
                    <div className="py-1" role="none">
                      <a className="block px-4 py-2 text-sm text-gray-700 bg-gradient-to-r from-indigo-100 to-transparent font-semibold text-indigo-900 rounded-lg mx-2" href="#" role="menuitem">Dashboard</a>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-900 hover:text-white" href="#" onClick={() => router.push('/profile')} role="menuitem">My Profile</a>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-900 hover:text-white" href="#" onClick={() => router.push('/bookings')} role="menuitem">My Bookings</a>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-900 hover:text-white" href="#" onClick={() => router.push('/vehicles')} role="menuitem">Browse Vehicles</a>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-900 hover:text-white" href="#" role="menuitem">About Us</a>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-900 hover:text-white" href="#" role="menuitem">FAQ</a>
                      <button 
                        className="block w-full px-4 py-3 text-left text-sm font-semibold text-red-800 hover:bg-red-50" 
                        onClick={handleLogout}
                        role="menuitem"
                      >
                        Logout
                      </button>
                </div>
                </div>
              </div>
        </div>

            {/* Your Activity Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your activity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm">
                  <p className="text-base font-medium text-gray-600">Trips</p>
                  <p className="text-4xl font-bold text-gray-900">12</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm">
                  <p className="text-base font-medium text-gray-600">Bookings</p>
                  <p className="text-4xl font-bold text-gray-900">8</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm">
                  <p className="text-base font-medium text-gray-600">Reviews</p>
                  <p className="text-4xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </section>

            {/* Upcoming Bookings Section */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming bookings</h2>
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-[360px] rounded-xl">
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <div className="text-6xl">🚗</div>
                    </div>
        </div>
                  <div className="max-w-[480px]">
                    <p className="text-lg font-bold text-gray-900">No upcoming bookings</p>
                    <p className="text-sm text-gray-600 mt-1">You don&apos;t have any upcoming bookings. Start planning your next trip!</p>
                </div>
                  <button 
                    className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-indigo-700 to-indigo-900 px-6 py-3 text-sm font-bold text-white shadow-lg hover:scale-105"
                    onClick={() => router.push('/vehicles')}
                  >
                    <span>Explore cars</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Security</h2>
              <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-indigo-800 p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex flex-col gap-4 md:w-1/2">
                    <div>
                      <p className="text-sm font-medium text-indigo-300">Account security</p>
                      <p className="text-xl font-bold leading-tight mt-1">Secure your account</p>
                      <p className="text-sm text-indigo-200 mt-2">Add a phone number and verify your identity to keep your account secure.</p>
                    </div>
                    <button className="flex w-fit cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 shadow-md hover:scale-105">
                      <span>Secure account</span>
                    </button>
                  </div>
                  <div className="md:w-1/2 w-full">
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <div className="text-6xl">🛡️</div>
                    </div>
                </div>
                </div>
              </div>
            </section>

            {/* Your Reviews Section */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your reviews</h2>
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-[360px] rounded-xl">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <div className="text-6xl">⭐</div>
                    </div>
                  </div>
                  <div className="max-w-[480px]">
                    <p className="text-lg font-bold text-gray-900">No reviews yet</p>
                    <p className="text-sm text-gray-600 mt-1">You haven&apos;t left any reviews. Share your experiences after your next trip!</p>
                </div>
                  <button 
                    className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-indigo-700 to-indigo-900 px-6 py-3 text-sm font-bold text-white shadow-lg hover:scale-105"
                    onClick={() => router.push('/vehicles')}
                  >
                    <span>Find cars</span>
                  </button>
                </div>
              </div>
            </section>
            </div>
        </main>
      </div>
    </div>
  );
}