'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody,
  Button,
  Badge,
  Rating,
  Skeleton,
  ImageCarousel
} from '@/components/ui';
import Navbar from '@/components/ui/Navbar';
import { Vehicle } from '@/types';
import { getMockVehicleById } from '@/lib/mockVehicles';


export default function VehicleDetailsPage() {
  const params = useParams();
  const vehicleId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | undefined>();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const foundVehicle = getMockVehicleById(vehicleId);
      setVehicle(foundVehicle);
      setLoading(false);
    }, 300);
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton variant="rectangular" height={400} />
            <div className="space-y-4">
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </div>
          </div>
        </div>
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
                The vehicle you&apos;re looking for doesn&apos;t exist.
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

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'UNAVAILABLE':
        return 'error';
      case 'MAINTENANCE':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/vehicles" className="hover:text-gray-900">Vehicles</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{vehicle.brand} {vehicle.model}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div>
            <ImageCarousel
              images={vehicle.images}
              height="500px"
              showArrows={true}
              showDots={true}
              autoPlay={false}
            />
          </div>

          {/* Vehicle Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="primary" size="lg" className="bg-gray-100 text-gray-700">
                  {vehicle.type}
                </Badge>
                <Badge variant={getAvailabilityColor(vehicle.availabilityStatus)}>
                  {vehicle.availabilityStatus}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {vehicle.year} • {vehicle.licensePlate}
              </p>
              <div className="flex items-center gap-4">
                <Rating value={4.5} readonly showValue />
                <span className="text-sm text-gray-500">
                  (24 reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <Card variant="elevated" className="border-0 shadow-lg">
              <CardHeader className="border-b">
                <h3 className="text-xl font-semibold">Pricing</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      ₹{vehicle.pricing.perDay}
                    </div>
                    <div className="text-sm text-gray-500">per day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      ₹{vehicle.pricing.perHour}
                    </div>
                    <div className="text-sm text-gray-500">per hour</div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="text-lg font-semibold text-gray-700">
                    ₹{vehicle.pricing.perWeek} per week
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Specifications</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Engine</span>
                    <p className="font-medium">{vehicle.engineSpec.displacement}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Top Speed</span>
                    <p className="font-medium">{vehicle.engineSpec.topSpeed}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Seats</span>
                    <p className="font-medium">{vehicle.engineSpec.seats}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Transmission</span>
                    <p className="font-medium">{vehicle.engineSpec.driveMode}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Fuel Type</span>
                    <p className="font-medium">{vehicle.engineSpec.fuelType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Mileage</span>
                    <p className="font-medium">{vehicle.engineSpec.mileage}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Location</h3>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-medium">{vehicle.location.city}</p>
                    <p className="text-sm text-gray-500">{vehicle.location.address}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Customer Reviews */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Customer Reviews</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {[
                    { id: '1', user: 'Rajesh Kumar', rating: 5, comment: 'Excellent vehicle! Very clean and well maintained. The pickup process was smooth and the staff was helpful.', date: '2024-01-15' },
                    { id: '2', user: 'Priya Sharma', rating: 4, comment: 'Good experience overall. Vehicle was as described and the booking process was easy.', date: '2024-01-10' },
                    { id: '3', user: 'Amit Singh', rating: 5, comment: 'Great service and vehicle quality. Would definitely recommend to others.', date: '2024-01-05' },
                    { id: '4', user: 'Sneha Patel', rating: 4, comment: 'Nice car, comfortable ride. The pricing was reasonable for the quality provided.', date: '2024-01-02' },
                    { id: '5', user: 'Vikram Reddy', rating: 5, comment: 'Outstanding experience! The vehicle was in perfect condition and the customer service was top-notch.', date: '2023-12-28' }
                  ].map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          <Rating value={review.rating} readonly size="sm" />
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                fullWidth
                disabled={vehicle.availabilityStatus !== 'AVAILABLE'}
                onClick={() => window.location.href = `/booking?vehicleId=${vehicle.id}`}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold h-14"
              >
                {vehicle.availabilityStatus === 'AVAILABLE' 
                  ? 'Reserve' 
                  : 'Not available'
                }
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="border-2 hover:bg-gray-900 hover:text-white h-14"
              >
                Back to Search
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
