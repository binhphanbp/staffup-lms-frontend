import { useQuery } from '@tanstack/react-query';
import {
  departmentAnalyticsService,
  type AnalyticsRange,
  type DepartmentAnalyticsResponse,
} from '@/services/department-analytics.service';

export const DEPT_ANALYTICS_KEY = (range: AnalyticsRange, deptId?: string) =>
  ['manager', 'department-analytics', range, deptId ?? 'self'] as const;

export function useDepartmentAnalytics(range: AnalyticsRange = 30, departmentId?: string) {
  return useQuery<DepartmentAnalyticsResponse>({
    queryKey: DEPT_ANALYTICS_KEY(range, departmentId),
    queryFn: () => departmentAnalyticsService.get(range, departmentId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}
