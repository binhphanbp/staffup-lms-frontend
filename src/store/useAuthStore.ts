import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, RoleCode } from '@/types';

// ============================================================
// Auth Store — Zustand (with localStorage persistence)
// Manages user authentication state, JWT token, and user roles
// ============================================================

interface AuthStore {
  // ----- State -----
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  // ----- Actions -----
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  hasRole: (roleCode: RoleCode) => boolean;
  _setHasHydrated: (flag: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ----- Initial State -----
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      // ----- Actions -----
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () => {
        // Clear the JS cookie used by proxy.ts
        if (typeof document !== 'undefined') {
          document.cookie = 'staffup-auth-token=; path=/; max-age=0';
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      hasRole: (roleCode) => {
        const currentUser = get().user;
        return currentUser?.roleCodes?.includes(roleCode) ?? false;
      },

      _setHasHydrated: (flag) => set({ _hasHydrated: flag }),
    }),
    {
      name: 'staffup-auth-storage',
      // Only persist user and token; isAuthenticated is derived
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    },
  ),
);
