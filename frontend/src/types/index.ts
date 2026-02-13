// User types
export const UserRole = {
  USER: 'USER',
  HOST: 'HOST',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePhoto?: string;
  phoneNumber?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Experience types
export const ExperienceCategory = {
  OUTDOOR_ADVENTURE: 'OUTDOOR_ADVENTURE',
  FOOD_DRINK: 'FOOD_DRINK',
  ART_CULTURE: 'ART_CULTURE',
  SPORTS_FITNESS: 'SPORTS_FITNESS',
  WELLNESS: 'WELLNESS',
  ENTERTAINMENT: 'ENTERTAINMENT',
} as const;

export type ExperienceCategory = typeof ExperienceCategory[keyof typeof ExperienceCategory];

export const ExperienceStatus = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
} as const;

export type ExperienceStatus = typeof ExperienceStatus[keyof typeof ExperienceStatus];

export interface Experience {
  id: string;
  title: string;
  description: string;
  category: ExperienceCategory;
  city: string;
  country: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  pricePerPerson: number;
  duration: number;
  maxGroupSize: number;
  photos: string[];
  status: ExperienceStatus;
  averageRating: number;
  totalReviews: number;
  hostId: string;
  host?: User;
  createdAt: string;
  updatedAt: string;
}

// Booking types
export const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export interface Booking {
  id: string;
  experienceId: string;
  experience?: Experience;
  userId: string;
  user?: User;
  bookingDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  experienceId: string;
  experience?: Experience;
  userId: string;
  user?: User;
  bookingId: string;
  rating: number;
  comment: string;
  hostResponse?: string;
  hostRespondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and Search types
export interface ExperienceFilters {
  city?: string;
  country?: string;
  category?: ExperienceCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BookingFilters {
  status?: BookingStatus;
  experienceId?: string;
  page?: number;
  limit?: number;
}

// Form types
export interface CreateExperienceForm {
  title: string;
  description: string;
  category: ExperienceCategory;
  city: string;
  country: string;
  address?: string;
  pricePerPerson: number;
  duration: number;
  maxGroupSize: number;
  photos: File[];
}

export interface CreateBookingForm {
  experienceId: string;
  bookingDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface CreateReviewForm {
  experienceId: string;
  bookingId: string;
  rating: number;
  comment: string;
}

// Admin types
export interface PlatformStats {
  totalUsers: number;
  activeHosts: number;
  totalExperiences: number;
  approvedExperiences: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  topCategories: {
    category: ExperienceCategory;
    count: number;
  }[];
}

export interface UserWithStats extends User {
  stats?: {
    hostedExperiences?: number;
    totalBookings?: number;
    totalReviews?: number;
    averageRating?: number;
  };
}
