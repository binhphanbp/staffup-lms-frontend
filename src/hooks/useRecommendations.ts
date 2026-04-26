import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  recommendationService,
  type GetMyRecommendationsParams,
  type RecommendationsResult,
} from '@/services/recommendation.service';

export const RECOMMENDATIONS_QUERY_KEY = ['recommendations', 'me'] as const;

export function useMyRecommendations(params?: GetMyRecommendationsParams) {
  return useQuery<RecommendationsResult>({
    queryKey: [...RECOMMENDATIONS_QUERY_KEY, params ?? {}],
    queryFn: () => recommendationService.getMyRecommendations(params),
    // Generations are expensive (~3-8s Gemini call) — cache aggressively but
    // let user trigger a fresh one via the refresh button.
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useRefreshRecommendations() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: RECOMMENDATIONS_QUERY_KEY });
}
