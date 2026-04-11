import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, QuestionBank, Question, QuestionOption } from '@/types';

// ============================================================
// Question Bank Service
// ============================================================

const API_BASE = '/question-banks';

export const questionBankService = {
  // Question Banks
  list: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    ownerTrainerId?: string;
    search?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<QuestionBank>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<QuestionBank>>>(API_BASE, {
      params,
    });
    return data.data;
  },

  getById: async (id: string): Promise<QuestionBank> => {
    const { data } = await api.get<ApiResponse<QuestionBank>>(`${API_BASE}/${id}`);
    return data.data;
  },

  create: async (payload: {
    title: string;
    description?: string;
    categoryId?: string;
    isActive?: boolean;
  }): Promise<QuestionBank> => {
    const { data } = await api.post<ApiResponse<QuestionBank>>(API_BASE, payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      categoryId?: string;
      isActive?: boolean;
    },
  ): Promise<QuestionBank> => {
    const { data } = await api.put<ApiResponse<QuestionBank>>(`${API_BASE}/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  // Questions
  listQuestions: async (bankId: string, params?: {
    page?: number;
    limit?: number;
    questionType?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Question>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Question>>>(
      `${API_BASE}/${bankId}/questions`,
      { params },
    );
    return data.data;
  },

  getQuestion: async (bankId: string, questionId: string): Promise<Question> => {
    const { data } = await api.get<ApiResponse<Question>>(
      `${API_BASE}/${bankId}/questions/${questionId}`,
    );
    return data.data;
  },

  createQuestion: async (
    bankId: string,
    payload: {
      questionText: string;
      questionType: string;
      explanation?: string;
      difficultyLevel?: 'easy' | 'medium' | 'hard';
      isActive?: boolean;
    },
  ): Promise<Question> => {
    const { data } = await api.post<ApiResponse<Question>>(
      `${API_BASE}/${bankId}/questions`,
      payload,
    );
    return data.data;
  },

  updateQuestion: async (
    bankId: string,
    questionId: string,
    payload: {
      questionText?: string;
      questionType?: string;
      explanation?: string;
      difficultyLevel?: 'easy' | 'medium' | 'hard';
      isActive?: boolean;
    },
  ): Promise<Question> => {
    const { data } = await api.put<ApiResponse<Question>>(
      `${API_BASE}/${bankId}/questions/${questionId}`,
      payload,
    );
    return data.data;
  },

  deactivateQuestion: async (bankId: string, questionId: string): Promise<void> => {
    await api.patch(`${API_BASE}/${bankId}/questions/${questionId}/deactivate`);
  },

  // Question Options
  createOption: async (
    bankId: string,
    questionId: string,
    payload: {
      optionText: string;
      isCorrect: boolean;
      orderIndex: number;
    },
  ): Promise<QuestionOption> => {
    const { data } = await api.post<ApiResponse<QuestionOption>>(
      `${API_BASE}/${bankId}/questions/${questionId}/options`,
      payload,
    );
    return data.data;
  },

  updateOption: async (
    bankId: string,
    questionId: string,
    optionId: string,
    payload: {
      optionText?: string;
      isCorrect?: boolean;
      orderIndex?: number;
    },
  ): Promise<QuestionOption> => {
    const { data } = await api.put<ApiResponse<QuestionOption>>(
      `${API_BASE}/${bankId}/questions/${questionId}/options/${optionId}`,
      payload,
    );
    return data.data;
  },

  deleteOption: async (bankId: string, questionId: string, optionId: string): Promise<void> => {
    await api.delete(`${API_BASE}/${bankId}/questions/${questionId}/options/${optionId}`);
  },
};
