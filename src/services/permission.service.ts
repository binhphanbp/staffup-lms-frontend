import api from '@/lib/axios';
import type { ApiResponse, Permission, PermissionListParams, PaginatedResponse } from '@/types';

const API_BASE = '/permissions';

export const permissionService = {
  list: async (params?: PermissionListParams): Promise<PaginatedResponse<Permission>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Permission>>>(API_BASE, {
      params,
    });
    return data.data;
  },

  getById: async (id: string): Promise<Permission> => {
    const { data } = await api.get<ApiResponse<Permission>>(`${API_BASE}/${id}`);
    return data.data;
  },
};
