import api from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type {
  AdaptiveAdminBank,
  AdaptiveAdminBankDetail,
  AdaptiveAutoStrategy,
  AdaptiveBank,
  AdaptiveSession,
  AdaptiveSessionSummary,
  BulkSetDifficultyInput,
  StartAdaptiveSessionInput,
  SubmitAdaptiveAnswerInput,
} from '@/types/adaptive-quiz';

export const adaptiveQuizService = {
  listBanks: async (): Promise<AdaptiveBank[]> => {
    const { data } = await api.get<ApiResponse<AdaptiveBank[]>>('/adaptive-quiz/banks');
    return data.data;
  },

  listMySessions: async (params?: {
    status?: string;
    questionBankId?: string;
  }): Promise<AdaptiveSessionSummary[]> => {
    const { data } = await api.get<ApiResponse<AdaptiveSessionSummary[]>>(
      '/adaptive-quiz/sessions',
      { params },
    );
    return data.data;
  },

  startSession: async (input: StartAdaptiveSessionInput): Promise<AdaptiveSession> => {
    const { data } = await api.post<ApiResponse<AdaptiveSession>>(
      '/adaptive-quiz/sessions/start',
      input,
    );
    return data.data;
  },

  getSession: async (sessionId: string): Promise<AdaptiveSession> => {
    const { data } = await api.get<ApiResponse<AdaptiveSession>>(
      `/adaptive-quiz/sessions/${sessionId}`,
    );
    return data.data;
  },

  submitAnswer: async (
    sessionId: string,
    input: SubmitAdaptiveAnswerInput,
  ): Promise<AdaptiveSession> => {
    const { data } = await api.post<ApiResponse<AdaptiveSession>>(
      `/adaptive-quiz/sessions/${sessionId}/answer`,
      input,
    );
    return data.data;
  },

  endSession: async (sessionId: string): Promise<AdaptiveSession> => {
    const { data } = await api.post<ApiResponse<AdaptiveSession>>(
      `/adaptive-quiz/sessions/${sessionId}/end`,
    );
    return data.data;
  },

  abandonSession: async (sessionId: string): Promise<AdaptiveSession> => {
    const { data } = await api.post<ApiResponse<AdaptiveSession>>(
      `/adaptive-quiz/sessions/${sessionId}/abandon`,
    );
    return data.data;
  },
};

// ---------- Admin endpoints ----------

export const adaptiveQuizAdminService = {
  listBanks: async (): Promise<AdaptiveAdminBank[]> => {
    const { data } = await api.get<ApiResponse<AdaptiveAdminBank[]>>('/adaptive-quiz/admin/banks');
    return data.data;
  },
  getBank: async (id: string): Promise<AdaptiveAdminBankDetail> => {
    const { data } = await api.get<ApiResponse<AdaptiveAdminBankDetail>>(
      `/adaptive-quiz/admin/banks/${id}`,
    );
    return data.data;
  },
  bulkSetDifficulty: async (input: BulkSetDifficultyInput): Promise<{ updated: number }> => {
    const { data } = await api.patch<ApiResponse<{ updated: number }>>(
      '/adaptive-quiz/admin/questions/bulk-difficulty',
      input,
    );
    return data.data;
  },
  autoTune: async (
    bankId: string,
    strategy: AdaptiveAutoStrategy,
  ): Promise<{ updated: number; strategy: AdaptiveAutoStrategy }> => {
    const { data } = await api.post<
      ApiResponse<{ updated: number; strategy: AdaptiveAutoStrategy }>
    >(`/adaptive-quiz/admin/banks/${bankId}/auto-tune`, { strategy });
    return data.data;
  },
};
