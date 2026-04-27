import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { riskService, type ListRiskAssessmentsQuery } from '@/services/risk.service';

// ============================================================
// Risk Assessment TanStack Query hooks
// ============================================================

export const RISK_LIST_QUERY_KEY = ['risk-assessments', 'list'] as const;
export const RISK_DETAIL_QUERY_KEY = ['risk-assessments', 'detail'] as const;
export const RISK_HISTORY_QUERY_KEY = ['risk-assessments', 'history'] as const;

export function useRiskList(query: ListRiskAssessmentsQuery) {
  return useQuery({
    queryKey: [...RISK_LIST_QUERY_KEY, query],
    queryFn: () => riskService.list(query),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useRiskDetail(enrollmentId: string | null) {
  return useQuery({
    queryKey: [...RISK_DETAIL_QUERY_KEY, enrollmentId],
    queryFn: () => riskService.getLatest(enrollmentId as string),
    enabled: !!enrollmentId,
    staleTime: 30 * 1000,
  });
}

export function useRiskHistory(enrollmentId: string | null, page = 1, limit = 10) {
  return useQuery({
    queryKey: [...RISK_HISTORY_QUERY_KEY, enrollmentId, page, limit],
    queryFn: () => riskService.getHistory(enrollmentId as string, page, limit),
    enabled: !!enrollmentId,
    staleTime: 30 * 1000,
  });
}

export function useCalculateRisk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => riskService.calculate(enrollmentId),
    onSuccess: (_data, enrollmentId) => {
      queryClient.invalidateQueries({ queryKey: RISK_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...RISK_DETAIL_QUERY_KEY, enrollmentId] });
      queryClient.invalidateQueries({ queryKey: [...RISK_HISTORY_QUERY_KEY, enrollmentId] });
    },
  });
}

export function useBatchCalculateRisk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => riskService.calculateBatch(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RISK_LIST_QUERY_KEY });
    },
  });
}
