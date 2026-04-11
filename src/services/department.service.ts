import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

// ============================================================
// Department Service — API calls for departments
// ============================================================

export interface Department {
  id: string;
  name: string;
  isActive: boolean;
  manager: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export const departmentService = {
  list: async (): Promise<Department[]> => {
    const { data } = await api.get<ApiResponse<Department[]>>('/departments');
    return data.data;
  },
};
