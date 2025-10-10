import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { CHECK_AVAILABILITY } from '../lib/graphql';
import { toast } from 'react-toastify';
import { useTokenValidation } from './useTokenValidation';

interface AvailabilityResult {
  available: boolean;
  conflictingBookings: Array<{
    id: string;
    startTime: string;
    endTime: string;
  }>;
}

export const useAvailability = () => {
  const [checkAvailability, { loading }] = useLazyQuery(CHECK_AVAILABILITY);
  const [isChecking, setIsChecking] = useState(false);
  const { executeWithTokenValidation } = useTokenValidation();

  const checkVehicleAvailability = async (
    vehicleId: string,
    startTime: string,
    endTime: string,
    showToast: boolean = true
  ): Promise<boolean> => {
    const result = await executeWithTokenValidation(async () => {
      setIsChecking(true);
      
      try {
      const { data } = await checkAvailability({
        variables: {
          vehicleId,
          startTime,
          endTime
        }
      });

      const result: AvailabilityResult = data.checkVehicleAvailability;
      
      if (!result.available) {
        if (showToast) {
          // Show error toast with conflicting booking details
          const conflictingBooking = result.conflictingBookings[0];
          if (conflictingBooking) {
            const conflictStart = new Date(conflictingBooking.startTime).toLocaleDateString();
            const conflictEnd = new Date(conflictingBooking.endTime).toLocaleDateString();
            
            toast.error(
              `🚫 Vehicle is not available for the selected dates. 
              Conflicting booking: ${conflictStart} to ${conflictEnd}`,
              {
                position: "top-center",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          } else {
            toast.error(
              '🚫 Vehicle is not available for the selected dates. Please choose different dates.',
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }
        }
        return false;
      }

      if (showToast) {
        // Show success toast
        toast.success(
          '✅ Vehicle is available for the selected dates!',
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      
      return true;
    } catch (error) {
      console.error('Availability check failed:', error);
      if (showToast) {
        toast.error(
          '❌ Failed to check vehicle availability. Please try again.',
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      return false;
    } finally {
      setIsChecking(false);
    }
    });
    
    return result ?? false;
  };

  return {
    checkVehicleAvailability,
    loading: loading || isChecking
  };
};
