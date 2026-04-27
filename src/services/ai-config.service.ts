import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export type AiProvider = 'gemini' | 'openai' | 'claude';

export interface AiModuleFlags {
  chatbot: boolean;
  dropoutPrediction: boolean;
  autoGrader: boolean;
  questionGenerator: boolean;
}

export interface AiPromptSet {
  systemPrompt: string;
  learningSystemPrompt: string;
  gradingSystemPrompt: string;
  questionGenerationSystemPrompt: string;
  courseOutlineSystemPrompt: string;
  lessonContentSystemPrompt: string;
  learningRecommendationSystemPrompt: string;
  codeLabReviewSystemPrompt: string;
}

export interface AiConfigDto {
  provider: AiProvider;
  chatModel: string;
  embeddingModel: string;
  topKResults: number;
  maxMessagesPerMinute: number;
  temperature: number;
  modules: AiModuleFlags;
  prompts: AiPromptSet;
  updatedAt: string;
}

export type AiPromptOverridePayload = Partial<{
  [K in keyof AiPromptSet]: string | null;
}>;

export interface UpdateAiConfigPayload {
  provider?: AiProvider;
  chatModel?: string;
  embeddingModel?: string;
  topKResults?: number;
  maxMessagesPerMinute?: number;
  temperature?: number;
  modules?: Partial<AiModuleFlags>;
  prompts?: AiPromptOverridePayload;
}

const BASE = '/admin/ai-config';

export const aiConfigService = {
  async get(): Promise<AiConfigDto> {
    const { data } = await api.get<ApiResponse<AiConfigDto>>(BASE);
    return data.data as AiConfigDto;
  },

  async update(payload: UpdateAiConfigPayload): Promise<AiConfigDto> {
    const { data } = await api.patch<ApiResponse<AiConfigDto>>(BASE, payload);
    return data.data as AiConfigDto;
  },

  async reset(): Promise<AiConfigDto> {
    const { data } = await api.post<ApiResponse<AiConfigDto>>(`${BASE}/reset`);
    return data.data as AiConfigDto;
  },
};
