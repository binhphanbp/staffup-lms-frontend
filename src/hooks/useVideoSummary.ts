import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  videoSummaryService,
  type GenerateVideoSummaryPayload,
} from '@/services/video-summary.service';

export const videoSummaryKeys = {
  all: ['video-summary'] as const,
  detail: (lessonId: string) => ['video-summary', lessonId] as const,
};

export function useVideoSummary(lessonId: string | null | undefined) {
  return useQuery({
    queryKey: videoSummaryKeys.detail(lessonId ?? ''),
    queryFn: () => videoSummaryService.get(lessonId as string),
    enabled: Boolean(lessonId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useGenerateVideoSummary(lessonId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateVideoSummaryPayload = {}) => {
      if (!lessonId) {
        throw new Error('Lesson id is required to generate summary');
      }
      return videoSummaryService.generate(lessonId, payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(videoSummaryKeys.detail(data.lessonId), data);
    },
  });
}

export function useDeleteVideoSummary(lessonId: string | null | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      if (!lessonId) throw new Error('Lesson id is required');
      return videoSummaryService.delete(lessonId);
    },
    onSuccess: () => {
      if (lessonId) {
        queryClient.setQueryData(videoSummaryKeys.detail(lessonId), null);
      }
    },
  });
}
