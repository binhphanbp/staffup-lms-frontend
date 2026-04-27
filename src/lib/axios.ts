import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// ============================================================
// Axios Instance — Staffup LMS
// Configured with JWT interceptors for authentication
// ============================================================

// Shared base URL — also used by non-axios callers (SSE streaming via fetch).
// Keep a single source of truth so localhost fallbacks don't drift.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for httpOnly refresh token cookie
});

// Track whether a token refresh is already in progress
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

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

// ----- Response Interceptor: Handle 401 with token refresh -----
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and not on auth endpoints themselves
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh — httpOnly cookie sent automatically
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = data.data.token;
        const newUser = data.data.user;

        // Update store with new token and user
        useAuthStore.getState().login(newUser, newToken);

        // Update cookie for proxy.ts
        if (typeof document !== 'undefined') {
          document.cookie = `staffup-auth-token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }

        processQueue(null, newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh failed — clear auth state and redirect to login
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
