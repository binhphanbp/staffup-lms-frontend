import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

// ============================================================
// React Query Hooks — Dashboard
// ============================================================

export function useEmployeeDashboard() {
  return useQuery({
    queryKey: ['dashboard-employee'],
    queryFn: () => dashboardService.getEmployeeStats(),
  });
}
