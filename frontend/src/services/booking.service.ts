import apiClient from '../lib/api-client';
import type {
  Booking,
  BookingFilters,
  PaginatedResponse,
  ApiResponse,
  CreateBookingForm,
} from '../types';

export const bookingService = {
  async createBooking(data: CreateBookingForm): Promise<ApiResponse<Booking>> {
    return apiClient.post<ApiResponse<Booking>>('/bookings', data);
  },

  async getUserBookings(filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
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
    return apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
  },

  async updateBookingStatus(id: string, status: string): Promise<ApiResponse<Booking>> {
    return apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
  },

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
  },

  async getExperienceBookings(experienceId: string): Promise<PaginatedResponse<Booking>> {
    return apiClient.get<PaginatedResponse<Booking>>(`/experiences/${experienceId}/bookings`);
  },

  async getAvailability(
    experienceId: string,
    date: string
  ): Promise<ApiResponse<{ available: boolean; spotsLeft: number }>> {
    return apiClient.get<ApiResponse<{ available: boolean; spotsLeft: number }>>(
      `/experiences/${experienceId}/availability?date=${date}`
    );
  },
};
