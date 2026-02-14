import apiClient from '../lib/api-client';
import type {
  Experience,
  ExperienceFilters,
  PaginatedResponse,
  ApiResponse,
} from '../types';
import { mockExperiences } from '../data/mockExperiences';

// Toggle this to switch between mock and real API
const USE_MOCK_DATA = true;

export const experienceService = {
  async getExperiences(filters?: ExperienceFilters): Promise<PaginatedResponse<Experience>> {
    if (USE_MOCK_DATA) {
      // Filter mock data based on filters
      let filtered = [...mockExperiences];
      
      if (filters?.city) {
        filtered = filtered.filter(exp => 
          exp.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters?.category) {
        filtered = filtered.filter(exp => exp.category === filters.category);
      }
      if (filters?.minPrice) {
        filtered = filtered.filter(exp => exp.pricePerPerson >= filters.minPrice!);
      }
      if (filters?.maxPrice) {
        filtered = filtered.filter(exp => exp.pricePerPerson <= filters.maxPrice!);
      }
      
      return Promise.resolve({
        success: true,
        message: 'Experiences fetched successfully',
        data: filtered,
        pagination: {
          total: filtered.length,
          page: 1,
          limit: 20,
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
    return apiClient.get<PaginatedResponse<Experience>>(`/experiences?${params.toString()}`);
  },

  async getExperienceById(id: string): Promise<ApiResponse<Experience>> {
    if (USE_MOCK_DATA) {
      const experience = mockExperiences.find(exp => exp.id === id);
      if (!experience) {
        return Promise.reject({ response: { data: { message: 'Experience not found' } } });
      }
      return Promise.resolve({
        success: true,
        data: experience,
        message: 'Experience retrieved successfully',
      });
    }
    
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
