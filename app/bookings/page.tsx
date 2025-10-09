'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import { usePageTransition } from '../../contexts/PageTransitionContext';
import { Card, CardBody, Button, Badge, LoadingSpinner } from '../../components/ui';
import Navbar from '../../components/ui/Navbar';
import { GET_BOOKINGS } from '../../lib/graphql';

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  totalAmount: number;
  createdAt: string;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    type: string;
    images: Array<{
      url: string;
      altText: string;
      isPrimary: boolean;
    }>;
  };
  locationDetail: {
    city: string;
    address: string;
    state: string;
    country: string;
  };
}

export default function BookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { endTransition } = usePageTransition();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Fetch bookings from GraphQL
  const { data, loading, error, refetch } = useQuery(GET_BOOKINGS, {
    skip: !user, // Only fetch when user is authenticated
    errorPolicy: 'all', // Show partial data even if there are errors
  });

  const bookings: Booking[] = data?.bookings || [];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // End loading transition when data is ready
  useEffect(() => {
    if (!authLoading && !loading) {
      endTransition();
    }
  }, [authLoading, loading, endTransition]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'ACTIVE':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmed';
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const startDate = new Date(booking.startTime);
    const isUpcoming = startDate > new Date();
    return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
  });

  if (authLoading || loading) {
    return (
      <LoadingSpinner 
        isLoading={true} 
        message="Loading your bookings..." 
        size="lg"
        variant="car"
      />
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-white border-0 shadow-sm">
            <CardBody className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Bookings
              </h3>
              <p className="text-gray-600 mb-6">
                {error.message || 'Something went wrong while loading your bookings.'}
              </p>
              <Button onClick={() => refetch()} className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                Try Again
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage your vehicle reservations and view booking history
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-indigo-900 text-white'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Upcoming ({bookings.filter(b => new Date(b.startTime) > new Date()).length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-indigo-900 text-white'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Past ({bookings.filter(b => new Date(b.startTime) <= new Date()).length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardBody className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {bookings.length === 0 
                  ? "No booking history" 
                  : `No ${activeTab} bookings`
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {bookings.length === 0 
                  ? "You haven't created any bookings yet. Start exploring our vehicles and make your first reservation!"
                  : activeTab === 'upcoming' 
                    ? "You don't have any upcoming bookings. Start exploring vehicles!"
                    : "You don't have any past bookings yet."
                }
              </p>
              {(bookings.length === 0 || activeTab === 'upcoming') && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => router.push('/vehicles')} 
                    className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
                  >
                    Browse Vehicles
                  </Button>
                  <Button 
                    onClick={() => router.push('/search')} 
                    variant="outline"
                    className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200 py-3 px-6 rounded-lg"
                  >
                    Search Vehicles
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 flex-shrink-0 relative">
                      <Image
                        src={booking.vehicle.images.find(img => img.isPrimary)?.url || booking.vehicle.images[0]?.url || '/placeholder-vehicle.jpg'}
                        alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.vehicle.brand} {booking.vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.startTime).toLocaleDateString()} - {new Date(booking.endTime).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{booking.totalAmount}
                          </p>
                          <Badge variant={getStatusColor(booking.status)} className="mt-1">
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {booking.vehicle.type}
                        </span>
                        <span>Booking #{booking.id}</span>
                      </div>
                      
                      <div className="flex space-x-3">
                        {booking.status === 'CONFIRMED' && (
                          <>
                            <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200">
                              Modify Booking
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200">
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'COMPLETED' && (
                          <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200">
                            Book Again
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
