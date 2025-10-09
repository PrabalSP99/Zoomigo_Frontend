import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BOOKING } from '../lib/graphql';
import { useTokenValidation } from './useTokenValidation';

interface BookingInput {
  vehicleId: string;
  startTime: string;
  endTime: string;
  locationDetail: {
    city: string;
    address: string;
    state?: string;
    country?: string;
  };
}

interface BookingResult {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    type: string;
  };
  locationDetail: {
    city: string;
    address: string;
  };
}

export const useBooking = () => {
  const [createBooking, { loading, error }] = useMutation(CREATE_BOOKING);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const { executeWithTokenValidation } = useTokenValidation();

  const bookVehicle = async (input: BookingInput) => {
    return executeWithTokenValidation(async () => {
      try {
        // Debug: Check if token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        console.log('useBooking - Token exists:', token ? 'Yes' : 'No');
        console.log('useBooking - Booking input:', input);
        
        const { data } = await createBooking({
          variables: { input }
          // Apollo client authLink handles authentication automatically
        });
        
        setBookingResult(data.createBooking);
        return data.createBooking;
      } catch (err) {
        console.error('Booking error:', err);
        throw err;
      }
    });
  };

  const resetBooking = () => {
    setBookingResult(null);
  };

  return {
    bookVehicle,
    loading,
    error,
    bookingResult,
    resetBooking
  };
};
