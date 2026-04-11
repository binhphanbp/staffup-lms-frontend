import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { useAuthStore } from '@/store/useAuthStore';

// ============================================================
// React Query Hooks — Dashboard
// ============================================================

export function useEmployeeDashboard() {
  const user = useAuthStore((state) => state.user);
  const hasEmployeeRole = user?.roleCodes?.includes('employee') ?? false;
  
  return useQuery({
    queryKey: ['dashboard-employee', hasEmployeeRole],
    queryFn: async () => {
      // Double check role before calling API
      if (!hasEmployeeRole) {
        throw new Error('User does not have employee role');
      }
      return dashboardService.getEmployeeStats();
    },
    // Only fetch if user has employee role
    enabled: hasEmployeeRole && !!user,
    // Don't retry on 403 errors
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403 || error?.message?.includes('employee role')) {
        return false;
      }
      return failureCount < 2;
    },
    // Don't refetch on window focus for dashboard
    refetchOnWindowFocus: false,
    // Don't refetch on mount if data exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const hasAdminRole = user?.roleCodes?.includes('admin');
  
  return useQuery({
    queryKey: ['dashboard-admin'],
    queryFn: () => dashboardService.getAdminStats(),
    enabled: hasAdminRole,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}
