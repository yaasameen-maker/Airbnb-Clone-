import { z } from 'zod';

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const verifyPhoneSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
});

export const verifyCodeSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

// Experience validation schemas
export const createExperienceSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title too long'),
  tagline: z.string().max(200, 'Tagline too long').optional(),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.enum([
    'ARTS_CULTURE',
    'ENTERTAINMENT',
    'FOOD_DRINK',
    'SPORTS',
    'WELLNESS',
    'NATURE_OUTDOORS',
    'SIGHTSEEING',
    'SOCIAL_IMPACT',
    'ANIMALS',
    'CLASSES_WORKSHOPS',
  ]),
  type: z.enum(['IN_PERSON', 'ONLINE']).default('IN_PERSON'),
  duration: z.number().int().min(30, 'Duration must be at least 30 minutes'),
  maxGuests: z.number().int().min(1, 'Must allow at least 1 guest').max(100),
  language: z.string().min(1, 'Language is required'),
  skillLevel: z.string().optional(),
  fitnessLevel: z.string().optional(),
  accessibility: z.array(z.string()).default([]),
  address: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  meetingPoint: z.string().optional(),
  pricePerPerson: z.number().min(1, 'Price must be at least $1'),
  groupDiscount: z.number().min(0).max(50).optional(),
  requirements: z.array(z.string()).default([]),
  included: z.array(z.string()).default([]),
  toBring: z.array(z.string()).default([]),
  cancellationDeadlineHours: z.number().int().min(1).default(24),
  minimumNoticeHours: z.number().int().min(1).default(24),
  isInstantBook: z.boolean().default(false),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export const createScheduleSchema = z.object({
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime(),
  maxSpots: z.number().int().min(1),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
});

// Booking validation schemas
export const createBookingSchema = z.object({
  scheduleId: z.string().uuid('Invalid schedule ID'),
  guestCount: z.number().int().min(1, 'Must have at least 1 guest'),
  guestNames: z.array(z.string()).optional(),
  specialRequests: z.string().max(500, 'Special requests too long').optional(),
  messageToHost: z.string().max(500, 'Message too long').optional(),
});

export const searchExperiencesSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxGuests: z.number().int().optional(),
  type: z.enum(['IN_PERSON', 'ONLINE']).optional(),
  sortBy: z.enum(['price', 'rating', 'popular', 'recent']).default('popular'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Review validation schemas
export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review too long'),
  bookingId: z.string().uuid('Invalid booking ID'),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(1000).optional(),
});

export const getReviewsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
  sortBy: z.enum(['recent', 'rating', 'helpful']).default('recent'),
});

// Admin validation schemas
export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
  reason: z.string().min(1, 'Reason is required').max(500),
});

export const updateExperienceStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'REJECTED', 'ARCHIVED']),
  rejectionReason: z.string().max(500).optional(),
});

export const adminStatsSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Helper function to validate request body
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};
