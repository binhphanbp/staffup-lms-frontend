import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export interface VideoSummaryChapter {
  startSec: number;
  endSec: number;
  title: string;
  summary: string;
}

export interface VideoSummaryFlashcard {
  front: string;
  back: string;
}

export interface VideoLessonSummary {
  id: string;
  lessonId: string;
  transcript: string;
  chapters: VideoSummaryChapter[];
  keyPoints: string[];
  flashcards: VideoSummaryFlashcard[];
  source: string;
  model: string | null;
  generatedAt: string;
  updatedAt: string;
}

export interface GenerateVideoSummaryPayload {
  transcriptHint?: string;
  language?: 'vi' | 'en';
  flashcardCount?: number;
  chapterCount?: number;
  focusKeyPoints?: boolean;
  regenerate?: boolean;
}

const BASE = '/lesson-summaries';

export const videoSummaryService = {
  async get(lessonId: string): Promise<VideoLessonSummary | null> {
    const { data } = await api.get<ApiResponse<VideoLessonSummary | null>>(`${BASE}/${lessonId}`);
    return data.data ?? null;
  },

  async generate(
    lessonId: string,
    payload: GenerateVideoSummaryPayload = {},
  ): Promise<VideoLessonSummary> {
    const { data } = await api.post<ApiResponse<VideoLessonSummary>>(
      `${BASE}/${lessonId}/generate`,
      payload,
    );
    return data.data as VideoLessonSummary;
  },

  async delete(lessonId: string): Promise<void> {
    await api.delete(`${BASE}/${lessonId}`);
  },
};
