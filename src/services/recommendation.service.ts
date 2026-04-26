import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

// ============================================================
// AI Personalized Course Recommendations
// ============================================================

export type RecommendationPriority = 'high' | 'medium' | 'low';

export interface RecommendationCourseSummary {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  estimatedDurationMinutes: number | null;
  category: { id: string; name: string } | null;
  status: 'published';
}

export interface RecommendationItem {
  course: RecommendationCourseSummary;
  priority: RecommendationPriority;
  reasoning: string;
  suggestedOrder: number;
  basedOn: string[];
}

export interface RecommendationLearnerSnapshot {
  fullName: string;
  positionTitle: string | null;
  departmentName: string | null;
  enrolledCount: number;
  inProgressCount: number;
  completedCount: number;
  averageQuizScore: number | null;
  averageQuizScoreLabel: string;
  latestRiskLevel: 'low' | 'medium' | 'high' | null;
  isNewLearner: boolean;
}

export interface RecommendationsResult {
  recommendations: RecommendationItem[];
  context: {
    learner: RecommendationLearnerSnapshot;
    completed: Array<{
      id: string;
      title: string;
      averageQuizScore: number | null;
      completedAt: string | null;
      progressPercent: number;
    }>;
    inProgress: Array<{
      id: string;
      title: string;
      progressPercent: number;
      daysSinceLastActivity: number | null;
    }>;
    candidateCount: number;
  };
  model: string;
  generatedAt: string;
}

export interface GetMyRecommendationsParams {
  limit?: number;
  language?: 'vi' | 'en';
}

export const recommendationService = {
  getMyRecommendations: async (
    params?: GetMyRecommendationsParams,
  ): Promise<RecommendationsResult> => {
    const { data } = await api.get<ApiResponse<RecommendationsResult>>('/recommendations/me', {
      params,
    });
    return data.data;
  },
};
