'use client';

import Image from 'next/image';
import { Vehicle } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  const primaryImage = vehicle.images.find(img => img.isPrimary) || vehicle.images[0];
  
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleIcon = (type: string) => {
    return type === 'CAR' ? '🚗' : '🏍️';
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to booking page with vehicle ID
    window.location.href = `/booking?vehicleId=${vehicle.id}`;
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(vehicle);
    } else {
      // Default behavior - navigate to vehicle details
      window.location.href = `/vehicles/${vehicle.id}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-4xl">{getVehicleIcon(vehicle.type)}</span>
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(vehicle.availabilityStatus)}`}>
            {vehicle.availabilityStatus}
          </span>
        </div>

        {/* Vehicle Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {vehicle.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className="text-sm text-gray-500">{vehicle.year}</span>
        </div>

        {/* Specs */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Engine:</span>
            <span className="text-gray-900">{vehicle.engineSpec.displacement}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Seats:</span>
            <span className="text-gray-900">{vehicle.engineSpec.seats}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Transmission:</span>
            <span className="text-gray-900">{vehicle.engineSpec.driveMode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fuel:</span>
            <span className="text-gray-900">{vehicle.engineSpec.fuelType}</span>
          </div>
        </div>

        {/* Location */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-1">📍</span>
            <span>{vehicle.location.city}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-green-600">
              ₹{vehicle.pricing.perDay}
            </span>
            <span className="text-sm text-gray-500">per day</span>
          </div>
          
          <div className="flex gap-2 text-xs text-gray-500">
            <span>₹{vehicle.pricing.perHour}/hr</span>
            <span>•</span>
            <span>₹{vehicle.pricing.perWeek}/week</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleCardClick}
            className="flex-1 py-2 px-4 rounded-md font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={handleBookClick}
            disabled={vehicle.availabilityStatus !== 'AVAILABLE'}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              vehicle.availabilityStatus === 'AVAILABLE'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {vehicle.availabilityStatus === 'AVAILABLE' ? 'Book Now' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  );
}
