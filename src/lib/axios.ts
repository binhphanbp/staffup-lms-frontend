import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// ============================================================
// Axios Instance — Staffup LMS
// Configured with JWT interceptors for authentication
// ============================================================

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----- Request Interceptor: Attach JWT Token -----
api.interceptors.request.use(
  (config) => {
    // Access Zustand store outside of React components
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ----- Response Interceptor: Handle 401 Errors -----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized response
      useAuthStore.getState().logout();

      // Redirect to login page (client-side only)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
