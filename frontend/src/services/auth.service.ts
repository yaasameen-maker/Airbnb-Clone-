import apiClient from '../lib/api-client';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ApiResponse,
  User,
} from '../types';

// Toggle this to switch between mock and real API
const USE_MOCK_AUTH = true;

// Mock user storage (simulates database)
const mockUsers: Map<string, { user: User; password: string }> = new Map();

// Generate mock tokens
const generateMockToken = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      // Check mock users
      const storedUser = mockUsers.get(data.email);
      if (storedUser && storedUser.password === data.password) {
        return Promise.resolve({
          success: true,
          message: 'Login successful',
          data: {
            user: storedUser.user,
            accessToken: generateMockToken(),
            refreshToken: generateMockToken(),
          },
        });
      }
      
      // Demo account for testing
      if (data.email === 'demo@example.com' && data.password === 'Demo1234') {
        const demoUser: User = {
          id: 'demo-user',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'USER',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return Promise.resolve({
          success: true,
          message: 'Login successful',
          data: {
            user: demoUser,
            accessToken: generateMockToken(),
            refreshToken: generateMockToken(),
          },
        });
      }
      
      return Promise.reject({ response: { data: { message: 'Invalid email or password' } } });
    }
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      // Check if user already exists
      if (mockUsers.has(data.email)) {
        return Promise.reject({ response: { data: { message: 'User with this email already exists' } } });
      }
      
      // Create new mock user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'USER',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store in mock database
      mockUsers.set(data.email, { user: newUser, password: data.password });
      
      return Promise.resolve({
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser,
          accessToken: generateMockToken(),
          refreshToken: generateMockToken(),
        },
      });
    }
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  async logout(): Promise<ApiResponse> {
    if (USE_MOCK_AUTH) {
      return Promise.resolve({
        success: true,
        message: 'Logged out successfully',
        data: null,
      });
    }
    const refreshToken = localStorage.getItem('refreshToken');
    return apiClient.post<ApiResponse>('/auth/logout', { refreshToken });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      return Promise.reject({ response: { data: { message: 'Mock refresh not supported' } } });
    }
    return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (USE_MOCK_AUTH) {
      return Promise.reject({ response: { data: { message: 'Not authenticated' } } });
    }
    return apiClient.get<ApiResponse<User>>('/auth/me');
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    if (USE_MOCK_AUTH) {
      return Promise.reject({ response: { data: { message: 'Mock update not supported' } } });
    }
    return apiClient.put<ApiResponse<User>>('/auth/profile', data);
  },
};
