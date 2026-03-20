import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

// ============================================================
// Auth Store — Zustand (with localStorage persistence)
// Manages user authentication state, JWT token, and user roles
// ============================================================

interface AuthStore {
  // ----- State -----
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // ----- Actions -----
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ----- Initial State -----
      user: null,
      token: null,
      isAuthenticated: false,

      // ----- Actions -----
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      hasRole: (role) => {
        const currentUser = get().user;
        return currentUser?.role === role;
      },
    }),
    {
      name: 'staffup-auth-storage',
      // Only persist user and token; isAuthenticated is derived
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
