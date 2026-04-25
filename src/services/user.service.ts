import api from '@/lib/axios';
import type {
  ApiResponse,
  UserListItem,
  UserListParams,
  CreateUserPayload,
  UpdateUserPayload,
  PaginatedResponse,
} from '@/types';

const API_BASE = '/users';

export const userService = {
  list: async (params?: UserListParams): Promise<PaginatedResponse<UserListItem>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<UserListItem>>>(API_BASE, {
      params,
    });
    return data.data;
  },

  getById: async (id: string): Promise<UserListItem> => {
    const { data } = await api.get<ApiResponse<UserListItem>>(`${API_BASE}/${id}`);
    return data.data;
  },

  create: async (payload: CreateUserPayload): Promise<UserListItem> => {
    const { data } = await api.post<ApiResponse<UserListItem>>(API_BASE, payload);
    return data.data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<UserListItem> => {
    const { data } = await api.patch<ApiResponse<UserListItem>>(`${API_BASE}/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  updateStatus: async (id: string, isActive: boolean): Promise<UserListItem> => {
    const { data } = await api.patch<ApiResponse<UserListItem>>(`/auth/users/${id}/status`, {
      isActive,
    });
    return data.data;
  },

  assignRoles: async (id: string, roleCodes: string[]): Promise<UserListItem> => {
    const { data } = await api.put<ApiResponse<UserListItem>>(`/auth/users/${id}/roles`, {
      roleCodes,
    });
    return data.data;
  },

  importExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<
      ApiResponse<{
        summary: {
          totalRows: number;
          successCount: number;
          errorCount: number;
          createdDepartmentCount: number;
        };
        createdDepartments: string[];
        createdUsers: Array<Record<string, unknown>>;
        errors: Array<{ row: number; email: string; reason: string }>;
        acceptedColumns: string[];
      }>
    >(`${API_BASE}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },
};
