import api from '@/lib/axios';
import type {
  ApiResponse,
  QuestionBank,
  QuestionBankDetail,
  QuestionBankQuestion,
  QuestionBankListParams,
  PaginatedResponse,
} from '@/types';

const API_BASE = '/question-banks';

export const questionBankService = {
  list: async (params?: QuestionBankListParams): Promise<PaginatedResponse<QuestionBank>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<QuestionBank>>>(API_BASE, {
      params,
    });
    return data.data;
  },

  getById: async (id: string): Promise<QuestionBankDetail> => {
    const { data } = await api.get<ApiResponse<QuestionBankDetail>>(`${API_BASE}/${id}`);
    return data.data;
  },

  create: async (payload: { name: string; description?: string }): Promise<QuestionBank> => {
    const { data } = await api.post<ApiResponse<QuestionBank>>(API_BASE, payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: { name?: string; description?: string },
  ): Promise<QuestionBank> => {
    const { data } = await api.put<ApiResponse<QuestionBank>>(`${API_BASE}/${id}`, payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  // ----- Questions within a bank -----

  listQuestions: async (bankId: string): Promise<QuestionBankQuestion[]> => {
    const { data } = await api.get<ApiResponse<QuestionBankQuestion[]>>(
      `${API_BASE}/${bankId}/questions`,
    );
    return data.data;
  },

  createQuestion: async (
    bankId: string,
    payload: Record<string, unknown>,
  ): Promise<QuestionBankQuestion> => {
    const { data } = await api.post<ApiResponse<QuestionBankQuestion>>(
      `${API_BASE}/${bankId}/questions`,
      payload,
    );
    return data.data;
  },

  updateQuestion: async (
    bankId: string,
    questionId: string,
    payload: Record<string, unknown>,
  ): Promise<QuestionBankQuestion> => {
    const { data } = await api.put<ApiResponse<QuestionBankQuestion>>(
      `${API_BASE}/${bankId}/questions/${questionId}`,
      payload,
    );
    return data.data;
  },

  deactivateQuestion: async (bankId: string, questionId: string): Promise<void> => {
    await api.patch(`${API_BASE}/${bankId}/questions/${questionId}/deactivate`);
  },

  // ----- AI Question Generator -----

  generateAiQuestions: async (
    bankId: string,
    payload: GenerateAiQuestionsPayload,
  ): Promise<GenerateAiQuestionsResult> => {
    const { data } = await api.post<ApiResponse<GenerateAiQuestionsResult>>(
      `${API_BASE}/${bankId}/generate-ai`,
      payload,
    );
    return data.data;
  },

  saveAiQuestions: async (
    bankId: string,
    payload: { questions: AiDraftQuestion[] },
  ): Promise<SaveAiQuestionsResult> => {
    const { data } = await api.post<ApiResponse<SaveAiQuestionsResult>>(
      `${API_BASE}/${bankId}/save-ai-questions`,
      payload,
    );
    return data.data;
  },
};

// ----- AI Question Generator types -----

export type AiQuestionType = 'single_choice' | 'multiple_choice' | 'essay';
export type AiDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface GenerateAiQuestionsPayload {
  topic?: string;
  sourceContent?: string;
  count: number;
  difficulty: AiDifficulty;
  questionTypes: AiQuestionType[];
  language?: 'vi' | 'en';
}

export interface AiDraftOption {
  content: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface AiDraftQuestion {
  tempId?: string;
  questionType: AiQuestionType;
  content: string;
  explanation: string | null;
  defaultPoints: number;
  options?: AiDraftOption[];
}

export interface GenerateAiQuestionsResult {
  questions: AiDraftQuestion[];
  model: string;
  generatedAt: string;
}

export interface SaveAiQuestionsResult {
  createdCount: number;
  questions: unknown[];
}
