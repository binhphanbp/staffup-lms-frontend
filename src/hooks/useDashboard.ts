import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { useAuthStore } from '@/store/useAuthStore';

// ============================================================
// React Query Hooks — Dashboard
// ============================================================

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard-admin'],
    queryFn: () => dashboardService.getAdminStats(),
  });
}

export function useTrainerDashboard() {
  return useQuery({
    queryKey: ['dashboard-trainer'],
    queryFn: () => dashboardService.getTrainerStats(),
  });
}

export function useEmployeeDashboard() {
  const hasRole = useAuthStore((s) => s.hasRole);
  const isEmployee = hasRole('employee');
  return useQuery({
    queryKey: ['dashboard-employee'],
    queryFn: () => dashboardService.getEmployeeStats(),
    enabled: isEmployee,
    retry: false,
  });
}

/**
 * Fetch AI-generated dashboard insights.
 * - Auto-scoped on the backend by the user's role (admin/manager/trainer).
 * - Cached server-side for 1 hour. Use `refetch()` with `refresh=true` to force.
 * - staleTime 5 min + refetchOnWindowFocus off → avoids unnecessary re-fetches.
 */
export function useAiInsights(enabled = true) {
  return useQuery({
    queryKey: ['dashboard-ai-insights'],
    queryFn: () => dashboardService.getAiInsights(false),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes — server already caches 1h
    refetchOnWindowFocus: false,
  });
}
