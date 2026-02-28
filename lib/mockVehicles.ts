import { Vehicle } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    type: 'CAR',
    brand: 'Skoda',
    model: 'Slavia',
    year: 2023,
    licensePlate: 'RJ 14 TF 4675',
    engineSpec: {
      displacement: '1.5L',
      topSpeed: '190 km/h',
      fuelCapacity: '45L',
      seats: 5,
      mileage: '18 km/l',
      kerbWeight: '1180 kg',
      driveMode: 'AUTOMATIC',
      fuelType: 'Petrol'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'Malviya Nagar',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 700,
      perDay: 3200,
      perWeek: 18000
    },
    availabilityStatus: 'AVAILABLE',
    featured: true,
    images: [
      {
        url: '/cars/skoda.webp',
        altText: 'Skoda Slavia',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    type: 'CAR',
    brand: 'Hyundai',
    model: 'Venue',
    year: 2023,
    licensePlate: 'RJ 14 TG 1227',
    engineSpec: {
      displacement: '1.0L',
      topSpeed: '165 km/h',
      fuelCapacity: '45L',
      seats: 5,
      mileage: '20 km/l',
      kerbWeight: '1100 kg',
      driveMode: 'MANUAL',
      fuelType: 'Petrol'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'C-Scheme',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 600,
      perDay: 2800,
      perWeek: 16000
    },
    availabilityStatus: 'AVAILABLE',
    featured: true,
    images: [
      {
        url: '/cars/venue3.webp',
        altText: 'Hyundai Venue',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    type: 'CAR',
    brand: 'Maruti Suzuki',
    model: 'Fronx',
    year: 2023,
    licensePlate: 'RJ 60 CC 7142',
    engineSpec: {
      displacement: '1.2L',
      topSpeed: '170 km/h',
      fuelCapacity: '37L',
      seats: 5,
      mileage: '22 km/l',
      kerbWeight: '1050 kg',
      driveMode: 'MANUAL',
      fuelType: 'Petrol'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'Vaishali Nagar',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 550,
      perDay: 2500,
      perWeek: 14000
    },
    availabilityStatus: 'AVAILABLE',
    featured: false,
    images: [
      {
        url: '/cars/Venue.webp',
        altText: 'Maruti Suzuki Fronx',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Innova Crysta',
    year: 2022,
    licensePlate: 'RJ 14 TF 1107',
    engineSpec: {
      displacement: '2.4L',
      topSpeed: '180 km/h',
      fuelCapacity: '50L',
      seats: 7,
      mileage: '14 km/l',
      kerbWeight: '1850 kg',
      driveMode: 'AUTOMATIC',
      fuelType: 'Diesel'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'Mansarovar',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 1000,
      perDay: 4500,
      perWeek: 25000
    },
    availabilityStatus: 'AVAILABLE',
    featured: true,
    images: [
      {
        url: '/cars/innova.webp',
        altText: 'Toyota Innova Crysta',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-18T10:00:00Z'
  },
  {
    id: '5',
    type: 'CAR',
    brand: 'Mahindra',
    model: 'Scorpio Classic',
    year: 2023,
    licensePlate: 'RJ 14 UH 9583',
    engineSpec: {
      displacement: '2.2L',
      topSpeed: '170 km/h',
      fuelCapacity: '60L',
      seats: 7,
      mileage: '13 km/l',
      kerbWeight: '1950 kg',
      driveMode: 'MANUAL',
      fuelType: 'Diesel'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'Tonk Road',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 900,
      perDay: 4000,
      perWeek: 22000
    },
    availabilityStatus: 'AVAILABLE',
    featured: true,
    images: [
      {
        url: '/cars/Scorpio.webp',
        altText: 'Mahindra Scorpio Classic',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-19T10:00:00Z'
  },
  {
    id: '6',
    type: 'CAR',
    brand: 'Hyundai',
    model: 'Creta',
    year: 2023,
    licensePlate: 'RJ 45 CT 4037',
    engineSpec: {
      displacement: '1.5L',
      topSpeed: '180 km/h',
      fuelCapacity: '50L',
      seats: 5,
      mileage: '17 km/l',
      kerbWeight: '1280 kg',
      driveMode: 'AUTOMATIC',
      fuelType: 'Petrol'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'Bani Park',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 800,
      perDay: 3500,
      perWeek: 20000
    },
    availabilityStatus: 'AVAILABLE',
    featured: true,
    images: [
      {
        url: '/cars/venue2.webp',
        altText: 'Hyundai Creta',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '7',
    type: 'CAR',
    brand: 'Maruti Suzuki',
    model: 'Vitara Brezza',
    year: 2022,
    licensePlate: 'RJ 44 CA 5511',
    engineSpec: {
      displacement: '1.5L',
      topSpeed: '170 km/h',
      fuelCapacity: '48L',
      seats: 5,
      mileage: '19 km/l',
      kerbWeight: '1150 kg',
      driveMode: 'MANUAL',
      fuelType: 'Petrol'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'Jagatpura',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 600,
      perDay: 2500,
      perWeek: 14000
    },
    availabilityStatus: 'AVAILABLE',
    featured: false,
    images: [
      {
        url: '/cars/Venue.webp',
        altText: 'Maruti Suzuki Vitara Brezza',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-21T10:00:00Z'
  },
  {
    id: '8',
    type: 'CAR',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: 2023,
    licensePlate: 'RJ 14 TH 1783',
    engineSpec: {
      displacement: '1.2L',
      topSpeed: '165 km/h',
      fuelCapacity: '37L',
      seats: 5,
      mileage: '23 km/l',
      kerbWeight: '900 kg',
      driveMode: 'MANUAL',
      fuelType: 'Petrol'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'Raja Park',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 500,
      perDay: 2200,
      perWeek: 12000
    },
    availabilityStatus: 'AVAILABLE',
    featured: true,
    images: [
      {
        url: '/cars/car1.webp',
        altText: 'Maruti Suzuki Swift',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-22T10:00:00Z'
  },
  {
    id: '9',
    type: 'CAR',
    brand: 'Hyundai',
    model: 'Verna',
    year: 2023,
    licensePlate: 'RJ 14 TL 2320',
    engineSpec: {
      displacement: '1.5L',
      topSpeed: '185 km/h',
      fuelCapacity: '45L',
      seats: 5,
      mileage: '18 km/l',
      kerbWeight: '1150 kg',
      driveMode: 'AUTOMATIC',
      fuelType: 'Petrol'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'MI Road',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 750,
      perDay: 3300,
      perWeek: 19000
    },
    availabilityStatus: 'AVAILABLE',
    featured: true,
    images: [
      {
        url: '/cars/verna.webp',
        altText: 'Hyundai Verna',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-23T10:00:00Z'
  },
  {
    id: '10',
    type: 'CAR',
    brand: 'Mahindra',
    model: 'XUV700',
    year: 2023,
    licensePlate: 'RJ 14 TG 3705',
    engineSpec: {
      displacement: '2.0L',
      topSpeed: '200 km/h',
      fuelCapacity: '60L',
      seats: 7,
      mileage: '14 km/l',
      kerbWeight: '1900 kg',
      driveMode: 'AUTOMATIC',
      fuelType: 'Diesel'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'Ajmer Road',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 1100,
      perDay: 5000,
      perWeek: 28000
    },
    availabilityStatus: 'AVAILABLE',
    featured: true,
    images: [
      {
        url: '/cars/car3.webp',
        altText: 'Mahindra XUV700',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-24T10:00:00Z'
  },
  {
    id: '11',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Fortuner',
    year: 2022,
    licensePlate: 'RJ 14 TF 2011',
    engineSpec: {
      displacement: '2.8L',
      topSpeed: '200 km/h',
      fuelCapacity: '80L',
      seats: 7,
      mileage: '12 km/l',
      kerbWeight: '2100 kg',
      driveMode: 'AUTOMATIC',
      fuelType: 'Diesel'
    },
    location: {
      city: 'Jaipur',
      lat: 26.9124,
      lon: 75.7873,
      address: 'JLN Marg',
      state: 'Rajasthan',
      country: 'India'
    },
    pricing: {
      perHour: 1200,
      perDay: 5500,
      perWeek: 30000
    },
    availabilityStatus: 'AVAILABLE',
    featured: true,
    images: [
      {
        url: '/cars/Fortuner.webp',
        altText: 'Toyota Fortuner',
        isPrimary: true
      }
    ],
    createdAt: '2024-01-25T10:00:00Z'
  }
];

export const getMockVehicles = () => mockVehicles;

export const getMockVehicleById = (id: string) => {
  return mockVehicles.find(v => v.id === id);
};
