import apiClient from '../lib/api-client';
import type {
  Review,
  PaginatedResponse,
  ApiResponse,
  CreateReviewForm,
} from '../types';

// Toggle this to switch between mock and real API
const USE_MOCK_DATA = true;

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: 'review-1',
    experienceId: '1',
    userId: 'user-1',
    bookingId: 'booking-1',
    rating: 5,
    comment: 'Amazing food tour! Maria was so knowledgeable and the food was incredible. Highly recommend!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'review-2',
    experienceId: '1',
    userId: 'user-2',
    bookingId: 'booking-2',
    rating: 4,
    comment: 'Great experience, loved learning about the history of the neighborhoods.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const reviewService = {
  async createReview(data: CreateReviewForm): Promise<ApiResponse<Review>> {
    if (USE_MOCK_DATA) {
      const newReview: Review = {
        id: `review-${Date.now()}`,
        experienceId: data.experienceId,
        userId: 'mock-user',
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockReviews.push(newReview);
      return Promise.resolve({
        success: true,
        message: 'Review created successfully',
        data: newReview,
      });
    }
    return apiClient.post<ApiResponse<Review>>('/reviews', data);
  },

  async getExperienceReviews(experienceId: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    if (USE_MOCK_DATA) {
      const filtered = mockReviews.filter(r => r.experienceId === experienceId);
      return Promise.resolve({
        success: true,
        message: 'Reviews fetched successfully',
        data: filtered,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
        },
      });
    }
    return apiClient.get<PaginatedResponse<Review>>(
      `/reviews/experience/${experienceId}?page=${page}&limit=${limit}`
    );
  },

  async getMyReviews(): Promise<PaginatedResponse<Review>> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        success: true,
        message: 'Reviews fetched successfully',
        data: mockReviews,
        pagination: {
          page: 1,
          limit: 20,
          total: mockReviews.length,
          totalPages: 1,
        },
      });
    }
    return apiClient.get<PaginatedResponse<Review>>('/reviews/my');
  },

  async getReviewsAboutMe(): Promise<PaginatedResponse<Review>> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        success: true,
        message: 'Reviews fetched successfully',
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      });
    }
    return apiClient.get<PaginatedResponse<Review>>('/reviews/about-me');
  },

  async updateReview(id: string, data: { rating: number; comment: string }): Promise<ApiResponse<Review>> {
    if (USE_MOCK_DATA) {
      const review = mockReviews.find(r => r.id === id);
      if (!review) {
        return Promise.reject({ response: { data: { message: 'Review not found' } } });
      }
      review.rating = data.rating;
      review.comment = data.comment;
      return Promise.resolve({
        success: true,
        message: 'Review updated successfully',
        data: review,
      });
    }
    return apiClient.put<ApiResponse<Review>>(`/reviews/${id}`, data);
  },

  async deleteReview(id: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      const index = mockReviews.findIndex(r => r.id === id);
      if (index === -1) {
        return Promise.reject({ response: { data: { message: 'Review not found' } } });
      }
      mockReviews.splice(index, 1);
      return Promise.resolve({
        success: true,
        message: 'Review deleted successfully',
        data: null,
      });
    }
    return apiClient.delete<ApiResponse>(`/reviews/${id}`);
  },

  async respondToReview(id: string, response: string): Promise<ApiResponse<Review>> {
    if (USE_MOCK_DATA) {
      const review = mockReviews.find(r => r.id === id);
      if (!review) {
        return Promise.reject({ response: { data: { message: 'Review not found' } } });
      }
      review.hostResponse = response;
      review.hostRespondedAt = new Date().toISOString();
      return Promise.resolve({
        success: true,
        message: 'Response added successfully',
        data: review,
      });
    }
    return apiClient.patch<ApiResponse<Review>>(`/reviews/${id}/respond`, { response });
  },
};
