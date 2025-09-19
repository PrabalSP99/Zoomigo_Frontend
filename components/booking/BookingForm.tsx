'use client';

import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Button,
  Input,
  Badge
} from '../ui'
import { Vehicle } from '../../types';
import { useBooking } from '../../hooks/useBooking';
import { useAvailability } from '../../hooks/useAvailability';

interface BookingFormProps {
  vehicle: Vehicle;
  onClose: () => void;
  onSubmit: (bookingData: BookingData) => void;
}

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

export default function BookingForm({ vehicle, onClose, onSubmit }: BookingFormProps) {
  const { bookVehicle, loading, error } = useBooking();
  const { checkVehicleAvailability, loading: availabilityLoading } = useAvailability();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    pickupLocation: vehicle.location.city,
    dropoffLocation: vehicle.location.city,
    bookingType: 'daily' as 'hourly' | 'daily' | 'weekly',
  });

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addOns = [
    { id: 'helmet', name: 'Helmet', price: 100, description: 'Safety helmet for bike rentals' },
    { id: 'insurance', name: 'Insurance', price: 250, description: 'Additional insurance coverage' },
    { id: 'gps', name: 'GPS Navigation', price: 150, description: 'GPS navigation system' },
    { id: 'child_seat', name: 'Child Seat', price: 200, description: 'Child safety seat' }
  ];

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (formData.bookingType === 'hourly') {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60)); // hours
    } else if (formData.bookingType === 'weekly') {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)); // weeks
    } else {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
    }
  };

  const calculateTotal = () => {
    const duration = calculateDuration();
    let baseAmount = 0;
    
    switch (formData.bookingType) {
      case 'hourly':
        baseAmount = duration * vehicle.pricing.perHour;
        break;
      case 'weekly':
        baseAmount = duration * vehicle.pricing.perWeek;
        break;
      default:
        baseAmount = duration * vehicle.pricing.perDay;
    }
    
    const addOnsAmount = selectedAddOns.reduce((total, addonId) => {
      const addon = addOns.find(a => a.id === addonId);
      return total + (addon ? addon.price : 0);
    }, 0);
    
    return baseAmount + addOnsAmount;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }

      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!formData.pickupLocation) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    if (!formData.dropoffLocation) {
      newErrors.dropoffLocation = 'Dropoff location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvailabilityCheck = async () => {
    if (!formData.startDate || !formData.endDate) {
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();
    
    // Show toast notifications when checking availability manually
    await checkVehicleAvailability(vehicle.id, startDateTime, endDateTime, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Check availability first (without showing toasts)
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();
      
      const isAvailable = await checkVehicleAvailability(vehicle.id, startDateTime, endDateTime, false);
      if (!isAvailable) {
        return; // Stop if vehicle is not available
      }

      // Create booking input for GraphQL mutation
      const bookingInput = {
        vehicleId: vehicle.id,
        startTime: startDateTime,
        endTime: endDateTime,
        locationDetail: {
          city: formData.pickupLocation,
          address: `${formData.pickupLocation}, ${vehicle.location.state || ''}`,
          state: vehicle.location.state,
          country: vehicle.location.country || 'India'
        }
      };

      // Create the booking
      const booking = await bookVehicle(bookingInput);
      
      // Prepare booking data for the parent component
      const bookingData: BookingData = {
        id: booking.id,
        vehicle: {
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.type
        },
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        totalAmount: booking.totalAmount,
        duration: calculateDuration(),
      };

      onSubmit(bookingData);
    } catch (err) {
      console.error('Booking failed:', err);
      // Error will be displayed in the UI
    }
  };

  const duration = calculateDuration();
  const totalAmount = calculateTotal();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Book {vehicle.brand} {vehicle.model}</h2>
          <Badge variant="primary">₹{vehicle.pricing.perDay}/day</Badge>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardBody className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Booking Failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error.message || 'An error occurred while creating your booking. Please try again.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Vehicle Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Type:</span>
                <p className="font-medium">{vehicle.type}</p>
              </div>
              <div>
                <span className="text-gray-500">Year:</span>
                <p className="font-medium">{vehicle.year}</p>
              </div>
              <div>
                <span className="text-gray-500">Seats:</span>
                <p className="font-medium">{vehicle.engineSpec.seats}</p>
              </div>
              <div>
                <span className="text-gray-500">Transmission:</span>
                <p className="font-medium">{vehicle.engineSpec.driveMode}</p>
              </div>
            </div>
          </div>

          {/* Booking Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Booking Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'hourly', label: 'Hourly', price: `₹${vehicle.pricing.perHour}/hr` },
                { value: 'daily', label: 'Daily', price: `₹${vehicle.pricing.perDay}/day` },
                { value: 'weekly', label: 'Weekly', price: `₹${vehicle.pricing.perWeek}/week` }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, bookingType: type.value as 'hourly' | 'daily' | 'weekly' })}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    formData.bookingType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              error={!!errors.startDate}
              errorMessage={errors.startDate}
              required
            />
            <Input
              type="date"
              label="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              error={!!errors.endDate}
              errorMessage={errors.endDate}
              required
            />
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="time"
              label="Pickup Time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
            <Input
              type="time"
              label="Return Time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>

          {/* Availability Check Button */}
          {formData.startDate && formData.endDate && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleAvailabilityCheck}
                disabled={availabilityLoading}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                {availabilityLoading ? 'Checking Availability...' : '🔍 Check Availability'}
              </Button>
            </div>
          )}

          {/* Location Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Pickup Location"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              error={!!errors.pickupLocation}
              errorMessage={errors.pickupLocation}
              required
            />
            <Input
              type="text"
              label="Dropoff Location"
              value={formData.dropoffLocation}
              onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
              error={!!errors.dropoffLocation}
              errorMessage={errors.dropoffLocation}
              required
            />
          </div>

          {/* Add-ons Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Available Add-ons</h3>
            <div className="space-y-3">
              {addOns.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={addon.id}
                      checked={selectedAddOns.includes(addon.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAddOns([...selectedAddOns, addon.id]);
                        } else {
                          setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id));
                        }
                      }}
                      className="w-4 h-4 text-indigo-900 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <label htmlFor={addon.id} className="font-medium cursor-pointer">
                        {addon.name}
                      </label>
                      <p className="text-sm text-gray-500">{addon.description}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">₹{addon.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          {duration > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {duration} {formData.bookingType === 'hourly' ? 'hour' : formData.bookingType === 'weekly' ? 'week' : 'day'}{duration !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rate per {formData.bookingType === 'hourly' ? 'hour' : formData.bookingType === 'weekly' ? 'week' : 'day'}:</span>
                  <span className="font-medium">
                    ₹{formData.bookingType === 'hourly' ? vehicle.pricing.perHour : formData.bookingType === 'weekly' ? vehicle.pricing.perWeek : vehicle.pricing.perDay}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Base amount:</span>
                  <span className="font-medium">
                    ₹{formData.bookingType === 'hourly' ? duration * vehicle.pricing.perHour : formData.bookingType === 'weekly' ? duration * vehicle.pricing.perWeek : duration * vehicle.pricing.perDay}
                  </span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between">
                    <span>Add-ons:</span>
                    <span className="font-medium">
                      ₹{selectedAddOns.reduce((total, addonId) => {
                        const addon = addOns.find(a => a.id === addonId);
                        return total + (addon ? addon.price : 0);
                      }, 0)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>

        <CardFooter>
          <div className="flex gap-3 w-full">
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={duration === 0 || loading || availabilityLoading}
            >
              {loading ? 'Creating Booking...' : 'Continue to Payment'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
