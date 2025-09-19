// Vehicle Types
export interface Vehicle {
  id: string;
  type: 'CAR' | 'BIKE';
  brand: string;
  model: string;
  year: number;
  engineSpec: {
    displacement: string;
    topSpeed: string;
    fuelCapacity: string;
    seats: number;
    mileage: string;
    kerbWeight?: string;
    driveMode: 'MANUAL' | 'AUTOMATIC';
    fuelType: string;
  };
  licensePlate: string;
  location: {
    city: string;
    lat?: number;
    lon?: number;
    address: string;
    state?: string;
    country?: string;
  };
  pricing: {
    perHour: number;
    perDay: number;
    perWeek: number;
    perKm?: number;
  };
  availabilityStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
  images: Array<{
    url: string;
    altText: string;
    isPrimary: boolean;
  }>;
  createdAt: string;
}

// Search Types
export interface SearchFilters {
  location: string;
  vehicleType: 'ALL' | 'CAR' | 'BIKE';
  priceRange: {
    min: number;
    max: number;
  };
  availability: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  DOB?: string;
  createdAt: string;
}

// Booking Types
export interface Booking {
  id: string;
  vehicle: Vehicle;
  user: User;
  locationDetail: {
    city: string;
    lat?: number;
    lon?: number;
    address: string;
    state?: string;
    country?: string;
  };
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalAmount: number;
  createdAt: string;
}

// Payment Types
export interface Payment {
  id: string;
  booking: Booking;
  transactionId?: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  method?: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'CASH';
  createdAt: string;
}

// Review Types
export interface Review {
  id: string;
  booking: Booking;
  user: User;
  rating: number;
  comment?: string;
  createdAt: string;
}
