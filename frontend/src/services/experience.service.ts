import apiClient from '../lib/api-client';
import type {
  Experience,
  ExperienceFilters,
  PaginatedResponse,
  ApiResponse,
} from '../types';

export const experienceService = {
  async getExperiences(filters?: ExperienceFilters): Promise<PaginatedResponse<Experience>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get<PaginatedResponse<Experience>>(`/experiences?${params.toString()}`);
  },

  async getExperienceById(id: string): Promise<ApiResponse<Experience>> {
    return apiClient.get<ApiResponse<Experience>>(`/experiences/${id}`);
  },

  async createExperience(data: FormData): Promise<ApiResponse<Experience>> {
    return apiClient.post<ApiResponse<Experience>>('/experiences', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updateExperience(id: string, data: FormData): Promise<ApiResponse<Experience>> {
    return apiClient.put<ApiResponse<Experience>>(`/experiences/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteExperience(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/experiences/${id}`);
  },

  async getMyExperiences(): Promise<PaginatedResponse<Experience>> {
    return apiClient.get<PaginatedResponse<Experience>>('/experiences/my');
  },

  async searchExperiences(query: string, filters?: ExperienceFilters): Promise<PaginatedResponse<Experience>> {
    const params = new URLSearchParams({ ...filters, search: query } as any);
    return apiClient.get<PaginatedResponse<Experience>>(`/experiences/search?${params.toString()}`);
  },
};
