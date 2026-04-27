import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  aiConfigService,
  type AiConfigDto,
  type UpdateAiConfigPayload,
} from '@/services/ai-config.service';

export const AI_CONFIG_QUERY_KEY = ['ai-config'] as const;

export function useAiConfig() {
  return useQuery<AiConfigDto>({
    queryKey: AI_CONFIG_QUERY_KEY,
    queryFn: () => aiConfigService.get(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateAiConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAiConfigPayload) => aiConfigService.update(payload),
    onSuccess: (data) => {
      qc.setQueryData(AI_CONFIG_QUERY_KEY, data);
    },
  });
}

export function useResetAiConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => aiConfigService.reset(),
    onSuccess: (data) => {
      qc.setQueryData(AI_CONFIG_QUERY_KEY, data);
    },
  });
}
