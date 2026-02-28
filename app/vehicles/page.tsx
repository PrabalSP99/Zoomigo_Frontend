'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Input,
  Select,
  LoadingSpinner
} from '../../components/ui';
import Navbar from '../../components/ui/Navbar';
import { Vehicle } from '../../types';
import { getMockVehicles } from '../../lib/mockVehicles';
import { useAuth } from '../../contexts/AuthContext';
import { usePageTransition } from '../../contexts/PageTransitionContext';

interface VehicleFilters {
  type: 'ALL' | 'CAR' | 'BIKE';
  brand: string;
  availabilityStatus: 'ALL' | 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
  priceRange: { min: number; max: number };
  driveMode: 'ALL' | 'MANUAL' | 'AUTOMATIC';
  fuelType: string;
  seats: number;
  sortBy: 'PRICE_LOW_TO_HIGH' | 'PRICE_HIGH_TO_LOW' | 'NEWEST' | 'OLDEST' | 'BRAND_A_Z';
}

export default function AllVehiclesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { endTransition } = usePageTransition();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState<VehicleFilters>({
    type: 'ALL',
    brand: '',
    availabilityStatus: 'ALL',
    priceRange: { min: 0, max: 10000 },
    driveMode: 'ALL',
    fuelType: '',
    seats: 0,
    sortBy: 'PRICE_LOW_TO_HIGH'
  });

  // Load mock vehicles
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVehicles(getMockVehicles());
      setLoading(false);
      endTransition();
    }, 300);
  }, [endTransition]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/auth?redirect=/vehicles';
    }
  }, [user, authLoading]);

  // Filter vehicles based on current filters
  const filteredVehicles = vehicles.filter((vehicle: Vehicle) => {
    if (filters.type !== 'ALL' && vehicle.type !== filters.type) return false;
    if (filters.brand && !vehicle.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
    if (filters.availabilityStatus !== 'ALL' && vehicle.availabilityStatus !== filters.availabilityStatus) return false;
    if (vehicle.pricing.perDay < filters.priceRange.min || vehicle.pricing.perDay > filters.priceRange.max) return false;
    if (filters.driveMode !== 'ALL' && vehicle.engineSpec.driveMode !== filters.driveMode) return false;
    if (filters.fuelType && !vehicle.engineSpec.fuelType.toLowerCase().includes(filters.fuelType.toLowerCase())) return false;
    if (filters.seats > 0 && vehicle.engineSpec.seats < filters.seats) return false;
    return true;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a: Vehicle, b: Vehicle) => {
    switch (filters.sortBy) {
      case 'PRICE_LOW_TO_HIGH':
        return a.pricing.perDay - b.pricing.perDay;
      case 'PRICE_HIGH_TO_LOW':
        return b.pricing.perDay - a.pricing.perDay;
      case 'NEWEST':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'OLDEST':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'BRAND_A_Z':
        return a.brand.localeCompare(b.brand);
      default:
        return 0;
    }
  });

  const handleFilterChange = (key: keyof VehicleFilters, value: string | number | { min: number; max: number }) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'ALL',
      brand: '',
      availabilityStatus: 'ALL',
      priceRange: { min: 0, max: 10000 },
      driveMode: 'ALL',
      fuelType: '',
      seats: 0,
      sortBy: 'PRICE_LOW_TO_HIGH'
    });
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    window.location.href = `/vehicles/${vehicle.id}`;
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'UNAVAILABLE':
        return 'error';
      case 'MAINTENANCE':
        return 'warning';
      default:
        return 'primary';
    }
  };


  if (authLoading || loading) {
    return (
      <LoadingSpinner 
        isLoading={true} 
        message="Finding you the perfect ride..." 
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
                Please log in to view vehicles.
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

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">All Vehicles</li>
            </ol>
          </nav>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                All Vehicles
              </h1>
              <p className="text-gray-600">
                {sortedVehicles.length} vehicle{sortedVehicles.length !== 1 ? 's' : ''} available
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
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-r-lg transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-indigo-900 text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-semibold">Filters</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <Select
                    options={[
                      { value: 'ALL', label: 'All Types' },
                      { value: 'CAR', label: 'Cars' },
                      { value: 'BIKE', label: 'Bikes' }
                    ]}
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <Input
                    type="text"
                    placeholder="Search brand..."
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <Select
                    options={[
                      { value: 'ALL', label: 'All Status' },
                      { value: 'AVAILABLE', label: 'Available' },
                      { value: 'UNAVAILABLE', label: 'Unavailable' },
                      { value: 'MAINTENANCE', label: 'Maintenance' }
                    ]}
                    value={filters.availabilityStatus}
                    onChange={(e) => handleFilterChange('availabilityStatus', e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drive Mode</label>
                  <Select
                    options={[
                      { value: 'ALL', label: 'All Modes' },
                      { value: 'MANUAL', label: 'Manual' },
                      { value: 'AUTOMATIC', label: 'Automatic' }
                    ]}
                    value={filters.driveMode}
                    onChange={(e) => handleFilterChange('driveMode', e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <Input
                    type="text"
                    placeholder="Search fuel type..."
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Seats</label>
                  <Input
                    type="number"
                    placeholder="Min seats"
                    value={filters.seats.toString()}
                    onChange={(e) => handleFilterChange('seats', parseInt(e.target.value) || 0)}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min.toString()}
                      onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: parseInt(e.target.value) || 0 })}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max.toString()}
                      onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: parseInt(e.target.value) || 10000 })}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <Select
                    options={[
                      { value: 'PRICE_LOW_TO_HIGH', label: 'Price: Low to High' },
                      { value: 'PRICE_HIGH_TO_LOW', label: 'Price: High to Low' },
                      { value: 'NEWEST', label: 'Newest First' },
                      { value: 'OLDEST', label: 'Oldest First' },
                      { value: 'BRAND_A_Z', label: 'Brand A-Z' }
                    ]}
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={clearFilters} variant="outline" className="mr-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200">
                  Clear Filters
                </Button>
                <Button onClick={() => setShowFilters(false)} className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                  Apply Filters
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Vehicles Display */}
        {viewMode === 'table' ? (
          <Card>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedVehicles.map((vehicle: Vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 relative">
                              {vehicle.images[0] && (
                                <Image
                                  src={vehicle.images[0].url}
                                  alt={vehicle.images[0].altText}
                                  fill
                                  className="rounded-lg object-cover"
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {vehicle.brand} {vehicle.model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {vehicle.year} • {vehicle.type}
                              </div>
                              <div className="text-xs text-gray-400">
                                {vehicle.licensePlate}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div>Engine: {vehicle.engineSpec.displacement}</div>
                            <div>Seats: {vehicle.engineSpec.seats}</div>
                            <div>Drive: {vehicle.engineSpec.driveMode}</div>
                            <div>Fuel: {vehicle.engineSpec.fuelType}</div>
                            <div>Mileage: {vehicle.engineSpec.mileage}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div>{vehicle.location.city}</div>
                            <div className="text-gray-500">{vehicle.location.state}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">₹{vehicle.pricing.perDay}/day</div>
                            <div className="text-gray-500">₹{vehicle.pricing.perHour}/hour</div>
                            <div className="text-gray-500">₹{vehicle.pricing.perWeek}/week</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getAvailabilityColor(vehicle.availabilityStatus)}>
                            {vehicle.availabilityStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            onClick={() => handleVehicleSelect(vehicle)}
                            size="sm"
                            disabled={vehicle.availabilityStatus !== 'AVAILABLE'}
                            className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {sortedVehicles.map((vehicle: Vehicle) => (
              <VehicleListCard key={vehicle.id} vehicle={vehicle} onSelect={handleVehicleSelect} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVehicles.map((vehicle: Vehicle) => (
              <VehicleGridCard key={vehicle.id} vehicle={vehicle} onSelect={handleVehicleSelect} />
            ))}
          </div>
        )}

        {/* No Results */}
        {sortedVehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg font-medium mb-2">
              No vehicles found
            </div>
            <p className="text-gray-400 mb-4">
              Try adjusting your filters or check back later for new vehicles.
            </p>
            <Button onClick={clearFilters} className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Vehicle Grid Card Component
function VehicleGridCard({ vehicle, onSelect }: { vehicle: Vehicle; onSelect: (vehicle: Vehicle) => void }) {
  const primaryImage = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images.find(img => img.isPrimary) || vehicle.images[0]
    : null;

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border-0 overflow-hidden"
          onClick={() => onSelect(vehicle)}>
      <div className="relative h-64 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || `${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
            <span className="text-4xl">{vehicle.type === 'CAR' ? '🚗' : '🏍️'}</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <Badge variant="primary" className="bg-white text-gray-900 font-semibold">
            {vehicle.type}
          </Badge>
        </div>
        
        <div className="absolute top-4 right-4">
          <Badge variant={getAvailabilityColor(vehicle.availabilityStatus)}>
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
            <p className="text-gray-500 text-sm">{vehicle.year} • {vehicle.licensePlate}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ₹{vehicle.pricing.perDay}
            </div>
            <div className="text-sm text-gray-500">per day</div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Engine:</span>
            <span className="text-gray-900">{vehicle.engineSpec.displacement}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Seats:</span>
            <span className="text-gray-900">{vehicle.engineSpec.seats}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Drive:</span>
            <span className="text-gray-900">{vehicle.engineSpec.driveMode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fuel:</span>
            <span className="text-gray-900">{vehicle.engineSpec.fuelType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Location:</span>
            <span className="text-gray-900">{vehicle.location.city}</span>
          </div>
        </div>

        <Button
          fullWidth
          disabled={vehicle.availabilityStatus !== 'AVAILABLE'}
          className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {vehicle.availabilityStatus === 'AVAILABLE' ? 'View Details' : 'Not Available'}
        </Button>
      </CardBody>
    </Card>
  );
}

// Vehicle List Card Component
function VehicleListCard({ vehicle, onSelect }: { vehicle: Vehicle; onSelect: (vehicle: Vehicle) => void }) {
  const primaryImage = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images.find(img => img.isPrimary) || vehicle.images[0]
    : null;

  return (
    <Card className="flex hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm"
          onClick={() => onSelect(vehicle)}>
      <div className="w-48 h-32 flex-shrink-0 relative">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || `${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover rounded-l-lg"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100 rounded-l-lg">
            <span className="text-2xl">{vehicle.type === 'CAR' ? '🚗' : '🏍️'}</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-gray-500">{vehicle.year} • {vehicle.type} • {vehicle.licensePlate}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              ₹{vehicle.pricing.perDay}
            </div>
            <div className="text-sm text-gray-500">per day</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-gray-600">Engine</div>
            <div className="text-sm text-gray-900">{vehicle.engineSpec.displacement}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Seats</div>
            <div className="text-sm text-gray-900">{vehicle.engineSpec.seats}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Drive Mode</div>
            <div className="text-sm text-gray-900">{vehicle.engineSpec.driveMode}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Fuel Type</div>
            <div className="text-sm text-gray-900">{vehicle.engineSpec.fuelType}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Mileage</div>
            <div className="text-sm text-gray-900">{vehicle.engineSpec.mileage}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Top Speed</div>
            <div className="text-sm text-gray-900">{vehicle.engineSpec.topSpeed}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Location</div>
            <div className="text-sm text-gray-900">{vehicle.location.city}, {vehicle.location.state}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Status</div>
            <Badge variant={getAvailabilityColor(vehicle.availabilityStatus)} className="text-xs">
              {vehicle.availabilityStatus}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="primary" className="bg-gray-100 text-gray-700">
              {vehicle.type}
            </Badge>
            <Badge variant={getAvailabilityColor(vehicle.availabilityStatus)}>
              {vehicle.availabilityStatus}
            </Badge>
          </div>
          
          <Button
            disabled={vehicle.availabilityStatus !== 'AVAILABLE'}
            className="bg-gradient-to-r from-indigo-900 to-indigo-700 hover:from-indigo-800 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {vehicle.availabilityStatus === 'AVAILABLE' ? 'View Details' : 'Not Available'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
function getAvailabilityColor(status: string) {
  switch (status) {
    case 'AVAILABLE':
      return 'success';
    case 'UNAVAILABLE':
      return 'error';
    case 'MAINTENANCE':
      return 'warning';
    default:
      return 'primary';
  }
}

