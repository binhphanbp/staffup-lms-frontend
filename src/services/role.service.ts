import api from '@/lib/axios';
import type {
  ApiResponse,
  Role,
  RoleListParams,
  CreateRolePayload,
  UpdateRolePayload,
  PaginatedResponse,
} from '@/types';

const API_BASE = '/roles';

export const roleService = {
  list: async (params?: RoleListParams): Promise<PaginatedResponse<Role>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Role>>>(API_BASE, { params });
    return data.data;
  },

  getById: async (id: string): Promise<Role> => {
    const { data } = await api.get<ApiResponse<Role>>(`${API_BASE}/${id}`);
    return data.data;
  },

  create: async (payload: CreateRolePayload): Promise<Role> => {
    const { data } = await api.post<ApiResponse<Role>>(API_BASE, payload);
    return data.data;
  },

  update: async (id: string, payload: UpdateRolePayload): Promise<Role> => {
    const { data } = await api.put<ApiResponse<Role>>(`${API_BASE}/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },
};
