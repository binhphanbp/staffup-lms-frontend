import api from '@/lib/axios';
import type { ApiResponse, Tag } from '@/types';

// ============================================================
// Tag Service — fetch tags for filters
// ============================================================

export const tagService = {
  list: async (): Promise<Tag[]> => {
    const { data } = await api.get<ApiResponse<Tag[]>>('/tags');
    return data.data;
  },
};
