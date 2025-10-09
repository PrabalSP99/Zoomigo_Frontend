'use client';

import { useQuery } from '@apollo/client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CustomLink from '../components/CustomLink';
import { useNavigationWithLoading } from '../contexts/PageTransitionContext';
import { usePageTransition } from '../contexts/PageTransitionContext';
import { 
  LoadingSpinner
} from '../components/ui';
import Navbar from '../components/ui/Navbar';
import { Vehicle } from '../types';
import { GET_FEATURED_VEHICLES } from '../lib/graphql';

export default function Home() {
  const { loading: featuredLoading, data: featuredData, error: featuredError } = useQuery(GET_FEATURED_VEHICLES);
  const { navigateWithLoading } = useNavigationWithLoading();
  const { endTransition } = usePageTransition();
  
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '',
  });

  const [activeField, setActiveField] = useState<string | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCheckInDropdown, setShowCheckInDropdown] = useState(false);
  const [showCheckOutDropdown, setShowCheckOutDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const featuredVehicles = featuredData?.vehicles || [];

  // End loading transition when data is ready
  useEffect(() => {
    if (!featuredLoading) {
      endTransition();
    }
  }, [featuredLoading, endTransition]);

  const popularCities = [
    { name: 'Mumbai', icon: '/Mumbai.svg' },
    { name: 'Delhi-NCR', icon: '/Delhi_NCR.svg' },
    { name: 'Bengaluru', icon: '/Banglore.svg' },
    { name: 'Agra', icon: '/Agra.svg' },
    { name: 'Chandigarh', icon: '/Chandigarh.svg' },
    { name: 'Ahmedabad', icon: '/Ahemdabad.svg' },
    { name: 'Pune', icon: '/Pune.svg' },
    { name: 'Kolkata', icon: '/Kolkata (1).svg' },
    { name: 'Kochi', icon: '/Kochi.svg' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
        setShowCheckInDropdown(false);
        setShowCheckOutDropdown(false);
        setShowGuestsDropdown(false);
        setActiveField(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFieldClick = (field: string) => {
    setActiveField(field);
    if (field === 'location') {
      setShowLocationDropdown(true);
      setShowCheckInDropdown(false);
      setShowCheckOutDropdown(false);
      setShowGuestsDropdown(false);
    } else if (field === 'checkIn') {
      setShowLocationDropdown(false);
      setShowCheckInDropdown(true);
      setShowCheckOutDropdown(false);
      setShowGuestsDropdown(false);
    } else if (field === 'checkOut') {
      setShowLocationDropdown(false);
      setShowCheckInDropdown(false);
      setShowCheckOutDropdown(true);
      setShowGuestsDropdown(false);
    } else if (field === 'guests') {
      setShowLocationDropdown(false);
      setShowCheckInDropdown(false);
      setShowCheckOutDropdown(false);
      setShowGuestsDropdown(true);
    }
  };

  const handleLocationSelect = (city: string) => {
    setSearchFilters({ ...searchFilters, location: city });
    setShowLocationDropdown(false);
    setActiveField(null);
  };

  const handleDateSelect = (type: 'checkIn' | 'checkOut', value: string) => {
    setSearchFilters({ ...searchFilters, [type]: value });
  };


  const handleQuickSearch = () => {
    // Navigate to search results with filters
    const params = new URLSearchParams({
      location: searchFilters.location,
      startDate: searchFilters.checkIn,
      endDate: searchFilters.checkOut,
    });
    navigateWithLoading(`/search?${params.toString()}`);
  };

  if (featuredLoading) {
  return (
      <LoadingSpinner 
        isLoading={true} 
        message="Finding the perfect vehicles for you..." 
        size="lg"
        variant="car"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Search and Navbar Partition */}
      <section className="bg-gradient-to-t from-gray-100 to-gray-50">
      <Navbar />
      
      {/* Hero Section with Search Bar */}
        <div className="relative py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Search Bar */}
            <div ref={searchRef} className="flex items-center bg-white rounded-full shadow-md hover:shadow-lg px-6 py-3 max-w-4xl mx-auto relative ">
              {/* Where Field */}
              <div 
                className={`flex-1 text-sm font-medium text-gray-700 px-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-stone-100 hover:rounded-full hover:scale-105 hover:shadow-sm ${
                  activeField === 'location' ? 'bg-stone-100 rounded-full scale-105 shadow-sm' : ''
                }`}
                onClick={() => handleFieldClick('location')}
                style={{ backgroundColor: activeField === 'location' ? 'oklch(0.869 0.005 56.366)' : undefined }}
              >
                <div className="mb-1  hover:text-gray-900">Where</div>
                <div className="text-gray-500  hover:text-gray-700">
                  {searchFilters.location || 'Search destinations'}
                </div>
              </div>
              <div className="border-r border-gray-200 h-8 "></div>
              
              {/* Check in Field */}
              <div 
                className={`flex-1 text-sm font-medium text-gray-700 px-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-stone-100 hover:rounded-full hover:scale-105 hover:shadow-sm ${
                  activeField === 'checkIn' ? 'bg-stone-100 rounded-full scale-105 shadow-sm' : ''
                }`}
                onClick={() => handleFieldClick('checkIn')}
                style={{ backgroundColor: activeField === 'checkIn' ? 'oklch(0.869 0.005 56.366)' : undefined }}
              >
                <div className="mb-1  hover:text-gray-900">Check in</div>
                <div className="text-gray-500  hover:text-gray-700">
                  {searchFilters.checkIn || 'Add dates'}
                </div>
              </div>
              <div className="border-r border-gray-200 h-8 "></div>
              
              {/* Check out Field */}
              <div 
                className={`flex-1 text-sm font-medium text-gray-700 px-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-stone-100 hover:rounded-full hover:scale-105 hover:shadow-sm ${
                  activeField === 'checkOut' ? 'bg-stone-100 rounded-full scale-105 shadow-sm' : ''
                }`}
                onClick={() => handleFieldClick('checkOut')}
                style={{ backgroundColor: activeField === 'checkOut' ? 'oklch(0.869 0.005 56.366)' : undefined }}
              >
                <div className="mb-1  hover:text-gray-900">Check out</div>
                <div className="text-gray-500  hover:text-gray-700">
                  {searchFilters.checkOut || 'Add dates'}
                </div>
              </div>
              <div className="border-r border-gray-200 h-8 "></div>
              
              {/* Who Field */}
              <div 
                className={`flex-1 text-sm font-medium text-gray-700 px-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-stone-100 hover:rounded-full hover:scale-105 hover:shadow-sm ${
                  activeField === 'guests' ? 'bg-stone-100 rounded-full scale-105 shadow-sm' : ''
                }`}
                onClick={() => handleFieldClick('guests')}
                style={{ backgroundColor: activeField === 'guests' ? 'oklch(0.869 0.005 56.366)' : undefined }}
              >
                <div className="mb-1  hover:text-gray-900">Who</div>
                <div className="text-gray-500  hover:text-gray-700">
                  {searchFilters.guests || 'Add guests'}
                </div>
              </div>
              
              <button
                onClick={handleQuickSearch}
                className="bg-indigo-900 text-white p-3 rounded-full hover:bg-indigo-800 "
              >
                <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
              </button>

              {/* Location Dropdown */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ">
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">Search destinations</h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Search for cities..."
                        value={searchFilters.location}
                        onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500  text-sm"
                      />
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <h4 className="font-medium text-gray-700 mb-2 text-xs">Popular destinations</h4>
                      <div className="grid grid-cols-3 gap-1 max-h-32 overflow-y-auto">
                        {popularCities.slice(0, 6).map((city, index) => (
                          <button
                            key={index}
                            onClick={() => handleLocationSelect(city.name)}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 "
                          >
                            <Image
                              src={city.icon}
                              alt={city.name}
                              width={16}
                              height={16}
                              className="grayscale "
                            />
                            <span className="text-xs font-medium  hover:text-gray-900">{city.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Check In Dropdown */}
              {showCheckInDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Select check-in date</h3>
                    <div className="mb-4">
                      <input
                        type="date"
                        value={searchFilters.checkIn}
                        onChange={(e) => handleDateSelect('checkIn', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500  text-lg"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowCheckInDropdown(false)}
                        className="px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800 "
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Check Out Dropdown */}
              {showCheckOutDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Select check-out date</h3>
                    <div className="mb-4">
                      <input
                        type="date"
                        value={searchFilters.checkOut}
                        onChange={(e) => handleDateSelect('checkOut', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500  text-lg"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowCheckOutDropdown(false)}
                        className="px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800 "
                      >
                        Done
                      </button>
              </div>
            </div>
          </div>
              )}

              {/* Guests Dropdown */}
              {showGuestsDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Number of guests</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Adults</span>
                        <div className="flex items-center space-x-3">
                          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 ">-</button>
                          <span className="w-8 text-center ">1</span>
                          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 ">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Children</span>
                        <div className="flex items-center space-x-3">
                          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 ">-</button>
                          <span className="w-8 text-center ">0</span>
                          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 ">+</button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setShowGuestsDropdown(false)}
                        className="px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800 "
                      >
                        Done
            </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="mt-6 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Detect my location above upper line */}
          <div className="flex items-center space-x-2 text-indigo-700 font-medium text-sm mb-4 ml-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Detect my location</span>
          </div>
          
          {/* Upper line - spans from leftmost to rightmost city */}
          <div className="flex justify-center mb-4">
            <div className="border-t-2 border-black" style={{ width: 'calc(100% - 4rem)' }}></div>
          </div>
          
          {/* Popular Cities Title */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Popular Cities</h2>
          </div>
          
          <div className="flex justify-center">
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {popularCities.map((city, index) => (
              <div key={index} className="flex-shrink-0 text-center">
                  <div className="w-20 h-20 flex items-center justify-center mb-2 mx-auto">
                    <Image
                      src={city.icon}
                      alt={city.name}
                      width={40}
                      height={40}
                      className="grayscale"
                    />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{city.name}</p>
                </div>
              ))}
              </div>
          </div>
          
          {/* View All Cities link */}
          <div className="text-center mt-4">
            <CustomLink href="/search" className="text-indigo-700 text-sm font-semibold hover:underline transition duration-200 ease-in-out hover:scale-105 hover:shadow-md">
              View All Cities
            </CustomLink>
          </div>
          
          {/* Lower line - spans from leftmost to rightmost city */}
          <div className="flex justify-center mt-4">
            <div className="border-b-2 border-black" style={{ width: 'calc(100% - 4rem)' }}></div>
        </div>
          
          {/* Explore below lower line */}
          <div className="flex items-center space-x-2 text-indigo-700 font-medium text-sm mt-4 ml-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Explore</span>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Cars in Jaipur this weekend</h2>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {featuredError ? (
            <div className="text-center py-8">
              <div className="text-red-600 text-lg font-medium mb-2">
                Error loading vehicles
              </div>
              <p className="text-gray-600 mb-4">{featuredError.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-900 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
              {featuredVehicles.slice(0, 10).map((vehicle: Vehicle) => (
                <FeaturedVehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Vehicles Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Explore Our Complete Fleet
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover all available vehicles with detailed specifications, pricing, and availability status.
            </p>
            <CustomLink href="/vehicles">
              <button className="bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-4 text-lg font-semibold rounded-bl-lg rounded-tr-lg  hover:shadow-lg border-2 border-indigo-900 relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center">
                  View All Vehicles
                  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
              </button>
            </CustomLink>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Trust and safety
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re here to help, day and night. Talk with our support team from anywhere in the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
                <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Get help anytime, anywhere. We&apos;re here to support you with any questions or issues.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
                <h3 className="text-xl font-semibold mb-3">Verified Vehicles</h3>
              <p className="text-gray-600">
                Every vehicle is verified and inspected to ensure quality and safety standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
                <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Your payments are protected with bank-level security and encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-white bg-gradient-to-r from-indigo-900 via-indigo-900 to-indigo-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who trust BadhoSa for their vehicle rentals.
          </p>
          <button
            onClick={() => navigateWithLoading('/search')}
            className="bg-white text-indigo-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-bl-lg rounded-tr-lg  hover:shadow-lg border-2 border-white relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center">
              Start exploring
              <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-pulse"></div>
          </button>
        </div>
      </section>
    </div>
  );
}

function FeaturedVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const primaryImage = vehicle.images.find(img => img.isPrimary) || vehicle.images[0];

  return (
    <CustomLink href={`/vehicles/${vehicle.id}`}>
      <div className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition duration-300 cursor-pointer">
        <div className="relative">
        <div className="w-full h-48 bg-gray-200">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || `${vehicle.brand} ${vehicle.model}`}
            fill
              className="object-cover"
          />
        )}
        </div>
        
        {/* Guest favourite tag */}
        <div className="absolute top-2 left-2">
          <div className="bg-white px-2 py-1 text-xs rounded-md shadow">
            Guest favourite
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="font-semibold text-gray-800 mt-2">
          {vehicle.brand} {vehicle.model} {vehicle.year}
            </h3>
        <p className="text-gray-600 text-sm">
          Rs {vehicle.pricing?.perDay || 1800} for 24 hrs
        </p>
        <div className="flex items-center text-sm text-gray-700 mt-1">
          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          4.5
        </div>
        </div>
      </div>
    </CustomLink>
  );
}
