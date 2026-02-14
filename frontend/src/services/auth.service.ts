import apiClient from '../lib/api-client';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ApiResponse,
  User,
} from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  async logout(): Promise<ApiResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return apiClient.post<ApiResponse>('/auth/logout', { refreshToken });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>('/auth/me');
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>('/auth/profile', data);
  },
};
