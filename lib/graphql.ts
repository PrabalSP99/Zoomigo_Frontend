// GraphQL Queries and Mutations for BadhoSa Frontend

import { gql } from '@apollo/client';

// ========================================
// QUERIES
// ========================================

// Get all vehicles with optional filters
export const GET_VEHICLES = gql`
  query GetVehicles($filters: VehicleFilters) {
    vehicles(filters: $filters) {
      id
      type
      brand
      model
      year
      licensePlate
      engineSpec {
        displacement
        topSpeed
        fuelCapacity
        seats
        mileage
        kerbWeight
        driveMode
        fuelType
      }
      location {
        city
        lat
        lon
        address
        state
        country
      }
      pricing {
        perHour
        perDay
        perWeek
      }
      availabilityStatus
      featured
      images {
        url
        altText
        isPrimary
      }
      createdAt
    }
  }
`;

// Get featured vehicles (for homepage)
export const GET_FEATURED_VEHICLES = gql`
  query GetFeaturedVehicles {
    vehicles {
      id
      type
      brand
      model
      year
      licensePlate
      availabilityStatus
      images {
        url
        altText
        isPrimary
      }
      location {
        city
        state
        country
      }
      pricing {
        perHour
        perDay
        perWeek
      }
      engineSpec {
        displacement
        topSpeed
        fuelCapacity
        seats
        mileage
        kerbWeight
        driveMode
        fuelType
      }
    }
  }
`;

// Get single vehicle details
export const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    vehicle(id: $id) {
      id
      type
      brand
      model
      year
      licensePlate
      engineSpec {
        displacement
        topSpeed
        fuelCapacity
        seats
        mileage
        kerbWeight
        driveMode
        fuelType
      }
      location {
        city
        state
        country
      }
      pricing {
        perHour
        perDay
        perWeek
      }
      availabilityStatus
      images {
        url
        altText
        isPrimary
      }
      createdAt
      reviews {
        id
        rating
        comment
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`;


// Get user's bookings
export const GET_USER_BOOKINGS = gql`
  query GetUserBookings($userId: ID!) {
    user(id: $userId) {
      id
      bookings {
        id
        startTime
        endTime
        status
        totalAmount
        createdAt
        vehicle {
          id
          brand
          model
        }
      }
    }
  }
`;

// Get all bookings for authenticated user
export const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
      id
      startTime
      endTime
      status
      totalAmount
      createdAt
      vehicle {
        id
        brand
        model
        year
        type
        images {
          url
          altText
          isPrimary
        }
      }
      locationDetail {
        city
        address
        state
        country
      }
      user {
        id
        name
        email
      }
    }
  }
`;


// Get user profile
export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
      phone
      DOB
      createdAt
     # bookings(first: 10) {
      # totalCount
      #}
    }
  }
`;

// Check vehicle availability
export const CHECK_AVAILABILITY = gql`
  query CheckAvailability($vehicleId: ID!, $startTime: DateTime!, $endTime: DateTime!) {
    checkVehicleAvailability(vehicleId: $vehicleId, startTime: $startTime, endTime: $endTime) {
      available
      conflictingBookings {
        id
        startTime
        endTime
      }
    }
  }
`;

// ========================================
// MUTATIONS
// ========================================

// User authentication
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser( email: $email, password: $password) {
      user {
        id
        name
        email
        phone
        DOB
        createdAt
      }
      token
      refreshToken
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
        id
        name
        email
        phone
        DOB
        createdAt
      }  
  }
`;

// Booking management
export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      startTime
      endTime
      status
      totalAmount
      createdAt
      vehicle {
        id
        brand
        model
        type
      }
      locationDetail {
        city
        address
      }
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $input: UpdateBookingInput!) {
    updateBooking(id: $id, input: $input) {
      id
      startTime
      endTime
      status
      totalAmount
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) {
      id
      status
    }
  }
`;

// Payment management
export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
      amount
      status
      method
      transactionId
      createdAt
    }
  }
`;

export const UPDATE_PAYMENT = gql`
  mutation UpdatePayment($id: ID!, $input: UpdatePaymentInput!) {
    updatePayment(id: $id, input: $input) {
      id
      status
      metadata
    }
  }
`;

// Review management
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      comment
      createdAt
      booking {
        id
        vehicle {
          brand
          model
        }
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: ID!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
      id
      rating
      comment
    }
  }
`;

// User profile management
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      phone
      DOB
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`;


// ========================================
// INPUT TYPES (for reference)
// ========================================

/*
Input types that need to be added to your schema:

input VehicleFilters {
  type: VehicleType
  brand: String
  priceRange: PriceRangeInput
  location: LocationInput
  availability: AvailabilityInput
  featured: Boolean
  first: Int
  after: String
}

input PriceRangeInput {
  min: Float
  max: Float
}

input LocationInput {
  city: String
  lat: Float
  lon: Float
  radius: Float
}

input AvailabilityInput {
  startTime: DateTime!
  endTime: DateTime!
}

input CreateUserInput {
  name: String!
  email: String!
  password: String!
  phone: String
  DOB: Date
}

input CreateBookingInput {
  vehicleId: ID!
  userId: ID!
  startTime: DateTime!
  endTime: DateTime!
  locationDetail: LocationInput!
  totalAmount: Float!
}

input UpdateBookingInput {
  startTime: DateTime
  endTime: DateTime
  locationDetail: LocationInput
  totalAmount: Float
}

input CreatePaymentInput {
  bookingId: ID!
  amount: Float!
  method: PaymentMethod!
  metadata: JSON
}

input UpdatePaymentInput {
  status: PaymentStatus
  metadata: JSON
}

input CreateReviewInput {
  bookingId: ID!
  userId: ID!
  rating: Float!
  comment: String
}

input UpdateReviewInput {
  rating: Float
  comment: String
}

input UpdateUserInput {
  name: String
  email: String
  phone: String
  DOB: Date
}

input ChangePasswordInput {
  userId: ID!
  currentPassword: String!
  newPassword: String!
}
*/
