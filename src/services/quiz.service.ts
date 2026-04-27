import api from '@/lib/axios';
import type {
  ApiResponse,
  QuizAttemptAdminListParams,
  QuizAttemptAdminListResponse,
  QuizAttemptDetailResponse,
  QuizAttemptHistoryItem,
  QuizResponsePayload,
  QuizStartPayload,
  QuizStartResponse,
  QuizSubmitResponse,
  AiGradeEssayResponse,
} from '@/types';

// ============================================================
// AI Grading Types — returned by backend
// ============================================================

export interface AiGradeQuizResponse {
  quizAttemptId: string;
  totalEssayQuestions: number;
  gradedCount: number;
  skippedCount: number;
  results: Array<{
    attemptQuestionId: string;
    questionContent: string;
    suggestedScore: number;
    maxScore: number;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
    rubricBreakdown: Array<{
      criterion: string;
      score: number;
      maxScore: number;
      comment: string;
    }>;
  }>;
}

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
    page?: number;
    limit?: number;
  }): Promise<QuizAttemptHistoryItem[]> => {
    const { data } = await api.get<ApiResponse<QuizAttemptHistoryItem[]>>(`${API_BASE}/history`, {
      params,
    });
    return data.data;
  },

  getAllAttemptsAdmin: async (
    params: QuizAttemptAdminListParams = {},
  ): Promise<QuizAttemptAdminListResponse> => {
    const { data } = await api.get<ApiResponse<QuizAttemptAdminListResponse>>(`${API_BASE}/admin`, {
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

  manualGradeResponse: async (
    responseId: string,
    payload: { awardedPoints: number; feedback?: string },
  ): Promise<void> => {
    await api.post(`${API_BASE}/responses/${responseId}/grade`, payload);
  },

  finalizeGrading: async (attemptId: string): Promise<void> => {
    await api.post(`${API_BASE}/${attemptId}/finalize`);
  },

  // ============================================================
  // AI Grading — essay auto-grading via Gemini
  // ============================================================

  /** Grade a single essay question using AI */
  aiGradeEssay: async (attemptQuestionId: string): Promise<AiGradeEssayResponse['data']> => {
    const { data } = await api.post<AiGradeEssayResponse>(
      `/ai-chat/grade-essay/${attemptQuestionId}`,
    );
    return data.data;
  },

  /** Grade all essay questions in a quiz attempt using AI */
  aiGradeQuiz: async (quizAttemptId: string): Promise<AiGradeQuizResponse> => {
    const { data } = await api.post<ApiResponse<AiGradeQuizResponse>>(
      `/ai-chat/grade-quiz/${quizAttemptId}`,
    );
    return data.data;
  },
};
