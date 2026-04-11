import api from '@/lib/axios';
import type {
  ApiResponse,
  QuizListResponse,
  Quiz,
  QuizStartPayload,
  QuizStartResponse,
  QuizResponsePayload,
  QuizAttemptDetailResponse,
  QuizAttemptHistoryItem,
  QuizSubmitResponse,
} from '@/types';

// ============================================================
// Quiz Service
// ============================================================

const API_BASE = '/quizzes';

export const quizService = {
  list: async (params?: {
    courseId?: string;
    lessonId?: string;
    selectionMode?: 'fixed' | 'random_pool';
    page?: number;
    limit?: number;
  }): Promise<QuizListResponse> => {
    const { data } = await api.get<ApiResponse<QuizListResponse>>(API_BASE, { params });
    return data.data;
  },

  getById: async (id: string): Promise<Quiz> => {
    const { data } = await api.get<ApiResponse<Quiz>>(`${API_BASE}/${id}`);
    return data.data;
  },

  create: async (payload: {
    courseId: string;
    lessonId?: string;
    title: string;
    description?: string;
    selectionMode?: 'fixed' | 'random_pool';
    passScorePercent?: number;
    timeLimitMinutes?: number;
    maxAttempts?: number;
    questionsToPull?: number;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
  }): Promise<Quiz> => {
    const { data } = await api.post<ApiResponse<Quiz>>(API_BASE, payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      selectionMode?: 'fixed' | 'random_pool';
      passScorePercent?: number;
      timeLimitMinutes?: number;
      maxAttempts?: number;
      questionsToPull?: number;
      shuffleQuestions?: boolean;
      shuffleOptions?: boolean;
    },
  ): Promise<Quiz> => {
    const { data } = await api.put<ApiResponse<Quiz>>(`${API_BASE}/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  // Quiz Questions
  addQuestion: async (
    quizId: string,
    payload: {
      questionId: string;
      orderIndex?: number;
      points?: number;
      isRequired?: boolean;
    },
  ): Promise<void> => {
    await api.post(`${API_BASE}/${quizId}/questions`, payload);
  },

  updateQuestion: async (
    quizId: string,
    questionId: string,
    payload: {
      orderIndex?: number;
      points?: number;
      isRequired?: boolean;
    },
  ): Promise<void> => {
    await api.put(`${API_BASE}/${quizId}/questions/${questionId}`, payload);
  },

  removeQuestion: async (quizId: string, questionId: string): Promise<void> => {
    await api.delete(`${API_BASE}/${quizId}/questions/${questionId}`);
  },

  reorderQuestions: async (
    quizId: string,
    questionOrders: Array<{ questionId: string; orderIndex: number }>,
  ): Promise<void> => {
    await api.post(`${API_BASE}/${quizId}/questions/reorder`, { questionOrders });
  },

  // Quiz Attempts
  start: async (payload: QuizStartPayload): Promise<QuizStartResponse> => {
    const { data } = await api.post<ApiResponse<QuizStartResponse>>(
      `/quiz-attempts/start`,
      payload,
    );
    return data.data;
  },

  getDetail: async (attemptId: string): Promise<QuizAttemptDetailResponse> => {
    const { data } = await api.get<ApiResponse<QuizAttemptDetailResponse>>(
      `/quiz-attempts/${attemptId}`,
    );
    return data.data;
  },

  getHistory: async (params?: {
    enrollmentId?: string;
    quizId?: string;
  }): Promise<QuizAttemptHistoryItem[]> => {
    const { data } = await api.get<ApiResponse<QuizAttemptHistoryItem[]>>(
      `/quiz-attempts/history`,
      { params },
    );
    return data.data;
  },

  saveResponse: async (payload: QuizResponsePayload): Promise<void> => {
    await api.post(`/quiz-attempts/responses`, payload);
  },

  submit: async (attemptId: string): Promise<QuizSubmitResponse> => {
    const { data } = await api.post<ApiResponse<QuizSubmitResponse>>(
      `/quiz-attempts/${attemptId}/submit`,
    );
    return data.data;
  },
};
