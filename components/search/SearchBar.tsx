'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchFilters {
  location: string;
  vehicleType: 'ALL' | 'CAR' | 'BIKE';
  priceRange: { min: number; max: number };
  availability: string;
}

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  onClear?: () => void;
}

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    vehicleType: 'ALL',
    priceRange: { min: 0, max: 10000 },
    availability: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    // Build search URL with filters
    const searchParams = new URLSearchParams();
    
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.vehicleType !== 'ALL') searchParams.set('type', filters.vehicleType);
    if (filters.priceRange.min > 0) searchParams.set('minPrice', filters.priceRange.min.toString());
    if (filters.priceRange.max < 10000) searchParams.set('maxPrice', filters.priceRange.max.toString());
    if (filters.availability) searchParams.set('startDate', filters.availability);
    
    // Navigate to search page with filters
    router.push(`/search?${searchParams.toString()}`);
    
    // Also call the onSearch callback if provided
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleClear = () => {
    setFilters({
      location: '',
      vehicleType: 'ALL',
      priceRange: { min: 0, max: 10000 },
      availability: ''
    });
    
    // Navigate to search page without filters
    router.push('/search');
    
    // Also call the onClear callback if provided
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Location Search */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="Enter city or address"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Vehicle Type */}
        <div className="lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <select
            value={filters.vehicleType}
            onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value as 'ALL' | 'CAR' | 'BIKE' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Vehicles</option>
            <option value="CAR">Cars</option>
            <option value="BIKE">Bikes</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="lg:w-32">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            &nbsp;
          </label>
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (per day)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <input
                type="date"
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={handleClear}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
