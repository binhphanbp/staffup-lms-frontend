import api from '@/lib/axios';
import type {
  ApiResponse,
  QuizAttemptDetailResponse,
  QuizStartPayload,
  QuizStartResponse,
  QuizResponsePayload,
  QuizAttemptHistoryItem,
  QuizSubmitResponse,
} from '@/types';

// ============================================================
// Quiz Service — quiz attempts, responses, submission
// ============================================================

const API_BASE = '/quiz-attempts';

export const quizService = {
  start: async (payload: QuizStartPayload): Promise<QuizStartResponse> => {
    const { data } = await api.post<ApiResponse<QuizStartResponse>>(`${API_BASE}/start`, payload);
    return data.data;
  },

  getDetail: async (attemptId: string): Promise<QuizAttemptDetailResponse> => {
    const { data } = await api.get<ApiResponse<QuizAttemptDetailResponse>>(
      `${API_BASE}/${attemptId}/detail`,
    );
    return data.data;
  },

  getHistory: async (params?: {
    enrollmentId?: string;
    quizId?: string;
  }): Promise<QuizAttemptHistoryItem[]> => {
    const { data } = await api.get<ApiResponse<QuizAttemptHistoryItem[]>>(`${API_BASE}/history`, {
      params,
    });
    return data.data;
  },

  saveResponse: async (payload: QuizResponsePayload): Promise<void> => {
    await api.post(`${API_BASE}/responses`, payload);
  },

  submit: async (attemptId: string): Promise<QuizSubmitResponse> => {
    const { data } = await api.post<ApiResponse<QuizSubmitResponse>>(
      `${API_BASE}/${attemptId}/submit`,
    );
    return data.data;
  },
};
