import api from '@/lib/axios';
import type {
  ApiResponse,
  EmployeeDashboardStats,
  AdminDashboardStats,
  TrainerDashboardStats,
  AIInsightsResponse,
} from '@/types';

// ============================================================
// Dashboard Service — role-based dashboard stats
// ============================================================

const API_BASE = '/dashboard';

export const dashboardService = {
  getEmployeeStats: async (): Promise<EmployeeDashboardStats> => {
    const { data } = await api.get<ApiResponse<EmployeeDashboardStats>>(`${API_BASE}/employee`);
    return data.data;
  },

  getAdminStats: async (): Promise<AdminDashboardStats> => {
    const { data } = await api.get<ApiResponse<AdminDashboardStats>>(API_BASE);
    return data.data;
  },

  getTrainerStats: async (): Promise<TrainerDashboardStats> => {
    const { data } = await api.get<ApiResponse<TrainerDashboardStats>>(`${API_BASE}/trainer`);
    return data.data;
  },

  getManagerStats: async () => {
    const { data } = await api.get<ApiResponse<unknown>>(`${API_BASE}/manager`);
    return data.data;
  },

  /**
   * Fetch AI-generated dashboard insights (auto-scoped by auth role).
   * @param refresh — if true, bypass server-side 1-hour cache
   */
  getAiInsights: async (refresh = false): Promise<AIInsightsResponse> => {
    const { data } = await api.get<ApiResponse<AIInsightsResponse>>(`${API_BASE}/ai-insights`, {
      params: refresh ? { refresh: 'true' } : undefined,
    });
    return data.data;
  },
};
