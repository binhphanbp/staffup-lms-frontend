import api from '@/lib/axios';
import type { ApiResponse, QuizListItem, QuizListParams, PaginatedResponse } from '@/types';

const API_BASE = '/quizzes';

export const quizManagementService = {
  list: async (params?: QuizListParams): Promise<PaginatedResponse<QuizListItem>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<QuizListItem>>>(API_BASE, {
      params,
    });
    return data.data;
  },

  getById: async (id: string): Promise<QuizListItem> => {
    const { data } = await api.get<ApiResponse<QuizListItem>>(`${API_BASE}/${id}`);
    return data.data;
  },

  create: async (payload: Record<string, unknown>): Promise<QuizListItem> => {
    const { data } = await api.post<ApiResponse<QuizListItem>>(API_BASE, payload);
    return data.data;
  },

  update: async (id: string, payload: Record<string, unknown>): Promise<QuizListItem> => {
    const { data } = await api.put<ApiResponse<QuizListItem>>(`${API_BASE}/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },
};
