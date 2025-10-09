'use client';

import { useQuery } from '@apollo/client';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  LoadingSpinner
} from '../../components/ui';
import BookingForm from '../../components/booking/BookingForm';
import PaymentForm from '../../components/payment/PaymentForm';
import Navbar from '../../components/ui/Navbar';
import { Vehicle } from '../../types';
import { GET_VEHICLE } from '../../lib/graphql';
import { useAuth } from '../../contexts/AuthContext';
import { usePageTransition } from '../../contexts/PageTransitionContext';

interface BookingData {
  id: string;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    type: string;
  };
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  duration: number;
}

interface PaymentData {
  id: string;
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'CASH';
  amount: number;
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vehicleId = searchParams.get('vehicleId');
  const { user, isLoading: authLoading } = useAuth();
  const { endTransition } = usePageTransition();
  
  const { loading, error, data } = useQuery(GET_VEHICLE, {
    variables: { id: vehicleId },
    skip: !vehicleId,
  });

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [currentStep, setCurrentStep] = useState<'booking' | 'payment'>('booking');
  
  const vehicle: Vehicle = data?.vehicle;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/auth?redirect=/booking' + (vehicleId ? `?vehicleId=${vehicleId}` : '');
    }
  }, [user, authLoading, vehicleId]);

  // End loading transition when data is ready
  useEffect(() => {
    if (!authLoading && !loading) {
      endTransition();
    }
  }, [authLoading, loading, endTransition]);

  // Debug: Check authentication status
  useEffect(() => {
    console.log('Booking Page - Auth Status:', {
      user: user ? 'Logged in' : 'Not logged in',
      authLoading,
      token: typeof window !== 'undefined' ? localStorage.getItem('token') ? 'Token exists' : 'No token' : 'SSR'
    });
  }, [user, authLoading]);

  const handleBookingSubmit = (data: BookingData) => {
    setBookingData(data);
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = (paymentData: PaymentData) => {
    console.log('Payment successful:', paymentData);
    // Use Next.js router for proper navigation without losing auth state
    router.push('/bookings');
  };

  const handlePaymentCancel = () => {
    setCurrentStep('booking');
  };

  if (authLoading || loading) {
    return (
      <LoadingSpinner 
        isLoading={true} 
        message="Loading booking details..." 
        size="lg"
        variant="car"
      />
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Authentication Required
              </h2>
              <p className="text-gray-500 mb-4">
                Please log in to book a vehicle.
              </p>
              <Button onClick={() => window.location.href = '/auth'} className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                Go to Login
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Error Loading Vehicle
              </h2>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <Button onClick={() => window.history.back()} className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                Go Back
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Vehicle Not Found
              </h2>
              <p className="text-gray-500 mb-4">
                The vehicle you&apos;re trying to book doesn&apos;t exist.
              </p>
              <Button onClick={() => window.history.back()} className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                Go Back
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (vehicle.availabilityStatus !== 'AVAILABLE') {
    return (
      <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Vehicle Not Available
              </h2>
              <p className="text-gray-500 mb-4">
                This vehicle is currently not available for booking.
              </p>
              <Button onClick={() => window.history.back()} className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                Go Back
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep === 'booking' ? 'text-indigo-600' : currentStep === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 'booking' ? 'bg-indigo-900 text-white' : 
                currentStep === 'payment' ? 'bg-green-600 text-white' : 
                'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Booking Details</span>
            </div>
            <div className={`w-16 h-1 ${currentStep === 'payment' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <nav className="mb-4">
            <ol className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/vehicles" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Vehicles</Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/vehicles/${vehicle.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  {vehicle.brand} {vehicle.model}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">
                {currentStep === 'booking' ? 'Book' : 'Payment'}
              </li>
            </ol>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentStep === 'booking' ? 'Book Your Vehicle' : 'Complete Payment'}
          </h1>
          <p className="text-lg text-gray-600">
            {currentStep === 'booking' 
              ? `Complete your booking for the ${vehicle.brand} ${vehicle.model}`
              : 'Secure payment for your booking'
            }
          </p>
        </div>

        {/* Content */}
        {currentStep === 'booking' ? (
          <BookingForm
            vehicle={vehicle}
            onClose={() => window.history.back()}
            onSubmit={(data) => handleBookingSubmit(data)}
          />
        ) : bookingData ? (
          <PaymentForm
            bookingId={bookingData.id}
            bookingData={bookingData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentCancel={handlePaymentCancel}
          />
        ) : null}
      </div>
    </div>
  );
}
