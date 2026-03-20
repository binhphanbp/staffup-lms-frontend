import { QueryClient } from '@tanstack/react-query';

// ============================================================
// TanStack Query Client — Staffup LMS
// Centralized configuration for data fetching defaults
// ============================================================

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data considered fresh for 60 seconds
        staleTime: 60 * 1000,
        // Cache data for 5 minutes after becoming unused
        gcTime: 5 * 60 * 1000,
        // Retry failed requests up to 2 times
        retry: 2,
        // Disable automatic refetch on window focus for better UX
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
      },
    },
  });
}

// Browser-side singleton
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  // Server: always create a new client to avoid cross-request leaks
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }

  // Browser: reuse the same client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
