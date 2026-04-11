import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService, type EnrollmentListParams } from '@/services/enrollment.service';
import type { LessonProgressUpdate } from '@/types';

// ============================================================
// React Query Hooks — Enrollments & Progress
// ============================================================

export function useEnrollments(params?: EnrollmentListParams) {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: () => enrollmentService.list(params),
  });
}

export function useEnrollmentDetail(id: string | null) {
  return useQuery({
    queryKey: ['enrollment-detail', id],
    queryFn: () => enrollmentService.getDetail(id!),
    enabled: !!id,
  });
}

export function useEnrollmentProgress(enrollmentId: string | null) {
  return useQuery({
    queryKey: ['enrollment-progress', enrollmentId],
    queryFn: () => enrollmentService.getProgress(enrollmentId!),
    enabled: !!enrollmentId,
  });
}

export function useEnrollUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, userIds }: { courseId: string; userIds: string[] }) =>
      enrollmentService.enroll(courseId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

export function useStartLesson() {
  return useMutation({
    mutationFn: ({ enrollmentId, lessonId }: { enrollmentId: string; lessonId: string }) =>
      enrollmentService.startLesson(enrollmentId, lessonId),
  });
}

export function useUpdateLessonProgress() {
  return useMutation({
    mutationFn: ({
      enrollmentId,
      lessonId,
      payload,
    }: {
      enrollmentId: string;
      lessonId: string;
      payload: LessonProgressUpdate;
    }) => enrollmentService.updateLessonProgress(enrollmentId, lessonId, payload),
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, lessonId }: { enrollmentId: string; lessonId: string }) =>
      enrollmentService.completeLesson(enrollmentId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['enrollment-progress', variables.enrollmentId],
      });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}
