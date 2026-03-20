import api from '@/lib/axios';
import type { ApiResponse, AuthResponse, LoginCredentials, RegisterPayload } from '@/types';

// ============================================================
// Auth Service — API calls for authentication
// ============================================================

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return data.data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return data.data;
  },

  getProfile: async () => {
    const { data } = await api.get<ApiResponse<AuthResponse['user']>>('/auth/me');
    return data.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },
};
