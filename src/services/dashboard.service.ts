import api from '@/lib/axios';
import type { ApiResponse, EmployeeDashboardStats } from '@/types';

// ============================================================
// Dashboard Service — role-based dashboard stats
// ============================================================

const API_BASE = '/dashboard';

export const dashboardService = {
  getEmployeeStats: async (): Promise<EmployeeDashboardStats> => {
    const { data } = await api.get<ApiResponse<EmployeeDashboardStats>>(`${API_BASE}/employee`);
    return data.data;
  },

  getAdminStats: async () => {
    const { data } = await api.get<ApiResponse<unknown>>(API_BASE);
    return data.data;
  },

  getTrainerStats: async () => {
    const { data } = await api.get<ApiResponse<unknown>>(`${API_BASE}/trainer`);
    return data.data;
  },

  getManagerStats: async () => {
    const { data } = await api.get<ApiResponse<unknown>>(`${API_BASE}/manager`);
    return data.data;
  },
};
