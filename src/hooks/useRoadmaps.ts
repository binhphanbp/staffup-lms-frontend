import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapService, type RoadmapListParams } from '@/services/roadmap.service';
import type { RoadmapAssignmentListParams } from '@/types';

// ============================================================
// React Query Hooks — Roadmaps & Assignments
// ============================================================

export function useAllRoadmaps(params?: RoadmapListParams) {
  return useQuery({
    queryKey: ['roadmaps-all', params],
    queryFn: () => roadmapService.list(params),
  });
}

export function useRoadmapAssignments(params?: RoadmapAssignmentListParams) {
  return useQuery({
    queryKey: ['roadmap-assignments', params],
    queryFn: () => roadmapService.getAssignments(params),
    enabled: !!params?.userId,
  });
}

export function useRoadmapDetail(id: string | null) {
  return useQuery({
    queryKey: ['roadmap-detail', id],
    queryFn: () => roadmapService.getDetail(id!),
    enabled: !!id,
  });
}

export function useUpdateAssignmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, status }: { assignmentId: string; status: string }) =>
      roadmapService.updateAssignmentStatus(assignmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-assignments'] });
    },
  });
}
