import apiClient from '../lib/api-client';
import type {
  Review,
  PaginatedResponse,
  ApiResponse,
  CreateReviewForm,
} from '../types';

export const reviewService = {
  async createReview(data: CreateReviewForm): Promise<ApiResponse<Review>> {
    return apiClient.post<ApiResponse<Review>>('/reviews', data);
  },

  async getExperienceReviews(experienceId: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    return apiClient.get<PaginatedResponse<Review>>(
      `/reviews/experience/${experienceId}?page=${page}&limit=${limit}`
    );
  },

  async getMyReviews(): Promise<PaginatedResponse<Review>> {
    return apiClient.get<PaginatedResponse<Review>>('/reviews/my');
  },

  async getReviewsAboutMe(): Promise<PaginatedResponse<Review>> {
    return apiClient.get<PaginatedResponse<Review>>('/reviews/about-me');
  },

  async updateReview(id: string, data: { rating: number; comment: string }): Promise<ApiResponse<Review>> {
    return apiClient.put<ApiResponse<Review>>(`/reviews/${id}`, data);
  },

  async deleteReview(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/reviews/${id}`);
  },

  async respondToReview(id: string, response: string): Promise<ApiResponse<Review>> {
    return apiClient.patch<ApiResponse<Review>>(`/reviews/${id}/respond`, { response });
  },
};
