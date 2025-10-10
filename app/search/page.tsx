'use client';

import { useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Input,
  Select
} from '../../components/ui';
import Navbar from '../../components/ui/Navbar';
import { Vehicle } from '../../types';
import { GET_VEHICLES } from '../../lib/graphql';

interface SearchFilters {
  location: string;
  vehicleType: string;
  brand: string;
  priceRange: { min: number; max: number };
  fuelType: string;
  driveMode: string;
  seats: number;
  startDate: string;
  endDate: string;
  sortBy: string;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    vehicleType: searchParams.get('type') || 'ALL',
    brand: '',
    priceRange: { 
      min: parseInt(searchParams.get('minPrice') || '0'), 
      max: parseInt(searchParams.get('maxPrice') || '10000') 
    },
    fuelType: '',
    driveMode: '',
    seats: 0,
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    sortBy: 'PRICE_LOW_TO_HIGH'
  });

  const { loading, error, data } = useQuery(GET_VEHICLES, {
    variables: {
      filters: {
        type: filters.vehicleType === 'ALL' ? null : filters.vehicleType,
        brand: filters.brand || null,
        city: filters.location || null,
        minPrice: filters.priceRange.min || null,
        maxPrice: filters.priceRange.max || null,
        fuelType: filters.fuelType || null,
        driveMode: filters.driveMode || null,
        seats: filters.seats || null,
        availability: filters.startDate && filters.endDate ? {
          startTime: filters.startDate,
          endTime: filters.endDate
        } : null,
        sortBy: filters.sortBy || null,
        first: 50
      }
    }
  });

  const vehicles = data?.vehicles || [];

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | { min: number; max: number }) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      vehicleType: 'ALL',
      brand: '',
      priceRange: { min: 0, max: 10000 },
      fuelType: '',
      driveMode: '',
      seats: 0,
      startDate: '',
      endDate: '',
      sortBy: 'PRICE_LOW_TO_HIGH'
    });
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    window.location.href = `/vehicles/${vehicle.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">Search Results</li>
            </ol>
          </nav>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Stays in {filters.location || 'all locations'}
              </h1>
              <p className="text-gray-600">
                {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} available
                {filters.startDate && filters.endDate && ` • ${filters.startDate} - ${filters.endDate}`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-lg shadow-sm border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-l-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-indigo-900 text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-indigo-900 text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-r-lg transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-indigo-900 text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                    >
                      Clear all
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="space-y-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter city or address"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <Select
                      options={[
                        { value: 'ALL', label: 'All Vehicles' },
                        { value: 'CAR', label: 'Cars' },
                        { value: 'BIKE', label: 'Bikes' }
                      ]}
                      value={filters.vehicleType}
                      onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <Select
                      options={[
                        { value: '', label: 'All Brands' },
                        { value: 'Hyundai', label: 'Hyundai' },
                        { value: 'Kia', label: 'Kia' },
                        { value: 'Tata', label: 'Tata' },
                        { value: 'Maruti Suzuki', label: 'Maruti Suzuki' },
                        { value: 'Mahindra', label: 'Mahindra' },
                        { value: 'Toyota', label: 'Toyota' },
                        { value: 'MG', label: 'MG' },
                        { value: 'Honda', label: 'Honda' },
                        { value: 'BMW', label: 'BMW' },
                        { value: 'Mercedes', label: 'Mercedes' }
                      ]}
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range (per day)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange.min.toString()}
                        onChange={(e) => handleFilterChange('priceRange', {
                          ...filters.priceRange,
                          min: parseInt(e.target.value) || 0
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max.toString()}
                        onChange={(e) => handleFilterChange('priceRange', {
                          ...filters.priceRange,
                          max: parseInt(e.target.value) || 10000
                        })}
                      />
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Type
                    </label>
                    <Select
                      options={[
                        { value: '', label: 'All Fuel Types' },
                        { value: 'Petrol', label: 'Petrol' },
                        { value: 'Diesel', label: 'Diesel' },
                        { value: 'Electric', label: 'Electric' },
                        { value: 'Hybrid', label: 'Hybrid' }
                      ]}
                      value={filters.fuelType}
                      onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    />
                  </div>

                  {/* Drive Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transmission
                    </label>
                    <Select
                      options={[
                        { value: '', label: 'All Transmissions' },
                        { value: 'MANUAL', label: 'Manual' },
                        { value: 'AUTOMATIC', label: 'Automatic' }
                      ]}
                      value={filters.driveMode}
                      onChange={(e) => handleFilterChange('driveMode', e.target.value)}
                    />
                  </div>

                  {/* Seats */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Seats
                    </label>
                    <Select
                      options={[
                        { value: '0', label: 'Any' },
                        { value: '2', label: '2 Seats' },
                        { value: '4', label: '4 Seats' },
                        { value: '5', label: '5 Seats' },
                        { value: '7', label: '7+ Seats' }
                      ]}
                      value={filters.seats.toString()}
                      onChange={(e) => handleFilterChange('seats', parseInt(e.target.value))}
                    />
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Dates
                    </label>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        placeholder="Start Date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      />
                      <Input
                        type="date"
                        placeholder="End Date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <Select
                      options={[
                        { value: 'PRICE_LOW_TO_HIGH', label: 'Price: Low to High' },
                        { value: 'PRICE_HIGH_TO_LOW', label: 'Price: High to Low' },
                        { value: 'RATING_HIGH_TO_LOW', label: 'Rating: High to Low' },
                        { value: 'DISTANCE_NEAREST', label: 'Distance: Nearest' }
                      ]}
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardBody className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardBody>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">
                      Error Loading Vehicles
                    </h3>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                      Try Again
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : vehicles.length === 0 ? (
              <Card>
                <CardBody>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Vehicles Found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your filters or search criteria
                    </p>
                    <Button onClick={clearFilters} className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                      Clear Filters
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : viewMode === 'map' ? (
              <Card>
                <CardBody>
                  <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map view coming soon!</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {vehicles.map((vehicle: Vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    viewMode={viewMode}
                    onSelect={handleVehicleSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VehicleCard({ 
  vehicle, 
  viewMode, 
  onSelect 
}: { 
  vehicle: Vehicle; 
  viewMode: 'grid' | 'list'; 
  onSelect: (vehicle: Vehicle) => void;
}) {
  const primaryImage = vehicle.images.find(img => img.isPrimary) || vehicle.images[0];

  if (viewMode === 'list') {
    return (
      <Card className="flex hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm"
            onClick={() => onSelect(vehicle)}>
        <div className="w-48 h-32 flex-shrink-0 relative">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || `${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover rounded-l-lg"
            />
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-gray-500 text-sm">{vehicle.location.city}, {vehicle.location.state}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ₹{vehicle.pricing.perDay}
              </div>
              <div className="text-sm text-gray-500">per day</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span>{vehicle.engineSpec.seats} seats</span>
            <span>•</span>
            <span>{vehicle.engineSpec.driveMode}</span>
            <span>•</span>
            <span>{vehicle.engineSpec.fuelType}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={vehicle.type === 'CAR' ? 'primary' : 'success'} className="bg-gray-100 text-gray-700">
                {vehicle.type}
              </Badge>
              <Badge variant={vehicle.availabilityStatus === 'AVAILABLE' ? 'success' : 'error'}>
                {vehicle.availabilityStatus}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelect(vehicle)}
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200"
              >
                View
              </Button>
              <Button
                size="sm"
                disabled={vehicle.availabilityStatus !== 'AVAILABLE'}
                onClick={() => {
                  window.location.href = `/booking?vehicleId=${vehicle.id}`;
                }}
                className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                Book
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border-0 overflow-hidden"
          onClick={() => onSelect(vehicle)}>
      <div className="relative h-64 overflow-hidden">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || `${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-4 left-4">
          <Badge variant="primary" className="bg-white text-gray-900 font-semibold">
            {vehicle.type}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant={vehicle.availabilityStatus === 'AVAILABLE' ? 'success' : 'error'}>
            {vehicle.availabilityStatus}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm font-semibold text-gray-900">⭐ 4.8</span>
          </div>
        </div>
      </div>
      
      <CardBody className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-gray-500 text-sm">{vehicle.location.city}, {vehicle.location.state}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ₹{vehicle.pricing.perDay}
            </div>
            <div className="text-sm text-gray-500">per day</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>{vehicle.engineSpec.seats} seats</span>
          <span>•</span>
          <span>{vehicle.engineSpec.driveMode}</span>
          <span>•</span>
          <span>{vehicle.engineSpec.fuelType}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            fullWidth
            onClick={() => onSelect(vehicle)}
            className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200"
          >
            View Details
          </Button>
          <Button
            fullWidth
            disabled={vehicle.availabilityStatus !== 'AVAILABLE'}
            onClick={() => {
              window.location.href = `/booking?vehicleId=${vehicle.id}`;
            }}
            className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {vehicle.availabilityStatus === 'AVAILABLE' ? 'Book Now' : 'Not Available'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
