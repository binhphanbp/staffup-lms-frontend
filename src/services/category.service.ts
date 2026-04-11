import api from '@/lib/axios';
import type { ApiResponse, Category } from '@/types';

// ============================================================
// Category Service — fetch categories for filters
// ============================================================

export const categoryService = {
  list: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return data.data;
  },
};
