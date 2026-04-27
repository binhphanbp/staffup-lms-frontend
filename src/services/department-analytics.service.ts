import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export interface TrendPoint {
  date: string;
  count: number;
}

export interface DepartmentAnalyticsSummary {
  totalLearners: number;
  activeLast7Days: number;
  activeLast30Days: number;
  averageProgressPercent: number;
  completionRate: number;
  atRiskRate: number;
  benchmark: {
    averageProgressPercent: number;
    completionRate: number;
    atRiskRate: number;
    deltaAverageProgressPercent: number;
    deltaCompletionRate: number;
    deltaAtRiskRate: number;
  };
}

export interface PerformerEntry {
  userId: string;
  fullName: string;
  email: string;
  positionTitle: string | null;
  totalProgressPercent: number;
  completedCount: number;
  totalEnrollments: number;
  totalXp: number;
  daysSinceLastActivity: number | null;
}

export interface CourseDistribution {
  courseId: string;
  title: string;
  totalEnrollments: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  averageProgressPercent: number;
}

export interface SkillDistribution {
  skillId: string;
  skillName: string;
  category: string | null;
  averageCurrentLevel: number;
  averageTargetLevel: number;
  gapPercent: number;
  learnersCovered: number;
}

export interface DepartmentAnalyticsResponse {
  department: { id: string; name: string };
  rangeDays: number;
  generatedAt: string;
  summary: DepartmentAnalyticsSummary;
  trends: {
    enrollmentsByDay: TrendPoint[];
    completionsByDay: TrendPoint[];
    activeLearnersByDay: TrendPoint[];
  };
  topPerformers: PerformerEntry[];
  bottomPerformers: PerformerEntry[];
  courseDistribution: CourseDistribution[];
  skillDistribution: SkillDistribution[];
}

export type AnalyticsRange = 7 | 30 | 60 | 90;

export const departmentAnalyticsService = {
  async get(
    range: AnalyticsRange = 30,
    departmentId?: string,
  ): Promise<DepartmentAnalyticsResponse> {
    const params = new URLSearchParams({ days: String(range) });
    if (departmentId) params.set('departmentId', departmentId);
    const { data } = await api.get<ApiResponse<DepartmentAnalyticsResponse>>(
      `/manager/department-analytics?${params.toString()}`,
    );
    return data.data!;
  },
};
