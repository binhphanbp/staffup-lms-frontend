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

export interface DepartmentPayload {
  name: string;
  isActive?: boolean;
  managerUserId?: string | null;
}

export const departmentService = {
  list: async (): Promise<Department[]> => {
    const { data } = await api.get<ApiResponse<Department[]>>('/departments');
    return data.data;
  },

  create: async (payload: DepartmentPayload): Promise<Department> => {
    const { data } = await api.post<ApiResponse<Department>>('/departments', payload);
    return data.data;
  },

  update: async (id: string, payload: Partial<DepartmentPayload>): Promise<Department> => {
    const { data } = await api.put<ApiResponse<Department>>(`/departments/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },
};
