import apiClient from '../lib/api-client';
import type {
  Booking,
  BookingFilters,
  PaginatedResponse,
  ApiResponse,
  CreateBookingForm,
} from '../types';
import { mockExperiences } from '../data/mockExperiences';

// Toggle this to switch between mock and real API
const USE_MOCK_DATA = true;

// Mock bookings storage
const mockBookings: Booking[] = [];

export const bookingService = {
  async createBooking(data: CreateBookingForm): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_DATA) {
      const experience = mockExperiences.find(e => e.id === data.experienceId);
      if (!experience) {
        return Promise.reject({ response: { data: { message: 'Experience not found' } } });
      }
      
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        experienceId: data.experienceId,
        experience,
        userId: 'mock-user',
        bookingDate: data.bookingDate,
        numberOfGuests: data.numberOfGuests,
        totalPrice: experience.pricePerPerson * data.numberOfGuests,
        status: 'CONFIRMED',
        specialRequests: data.specialRequests,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockBookings.push(newBooking);
      
      return Promise.resolve({
        success: true,
        message: 'Booking created successfully',
        data: newBooking,
      });
    }
    return apiClient.post<ApiResponse<Booking>>('/bookings', data);
  },

  async getUserBookings(filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        success: true,
        message: 'Bookings fetched successfully',
        data: mockBookings,
        pagination: {
          page: 1,
          limit: 20,
          total: mockBookings.length,
          totalPages: 1,
        },
      });
    }
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get<PaginatedResponse<Booking>>(`/bookings/my?${params.toString()}`);
  },

  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_DATA) {
      const booking = mockBookings.find(b => b.id === id);
      if (!booking) {
        return Promise.reject({ response: { data: { message: 'Booking not found' } } });
      }
      return Promise.resolve({
        success: true,
        message: 'Booking fetched successfully',
        data: booking,
      });
    }
    return apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
  },

  async updateBookingStatus(id: string, status: string): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_DATA) {
      const booking = mockBookings.find(b => b.id === id);
      if (!booking) {
        return Promise.reject({ response: { data: { message: 'Booking not found' } } });
      }
      booking.status = status as any;
      return Promise.resolve({
        success: true,
        message: 'Booking updated successfully',
        data: booking,
      });
    }
    return apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
  },

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_DATA) {
      const booking = mockBookings.find(b => b.id === id);
      if (!booking) {
        return Promise.reject({ response: { data: { message: 'Booking not found' } } });
      }
      booking.status = 'CANCELLED';
      return Promise.resolve({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      });
    }
    return apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
  },

  async getExperienceBookings(experienceId: string): Promise<PaginatedResponse<Booking>> {
    if (USE_MOCK_DATA) {
      const filtered = mockBookings.filter(b => b.experienceId === experienceId);
      return Promise.resolve({
        success: true,
        message: 'Bookings fetched successfully',
        data: filtered,
        pagination: {
          page: 1,
          limit: 20,
          total: filtered.length,
          totalPages: 1,
        },
      });
    }
    return apiClient.get<PaginatedResponse<Booking>>(`/experiences/${experienceId}/bookings`);
  },

  async getAvailability(
    experienceId: string,
    date: string
  ): Promise<ApiResponse<{ available: boolean; spotsLeft: number }>> {
    if (USE_MOCK_DATA) {
      const experience = mockExperiences.find(e => e.id === experienceId);
      return Promise.resolve({
        success: true,
        message: 'Availability checked',
        data: {
          available: true,
          spotsLeft: experience?.maxGroupSize || 10,
        },
      });
    }
    return apiClient.get<ApiResponse<{ available: boolean; spotsLeft: number }>>(
      `/experiences/${experienceId}/availability?date=${date}`
    );
  },
};
