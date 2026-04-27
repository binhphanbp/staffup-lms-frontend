import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizService } from '@/services/quiz.service';
import type { QuizAttemptAdminListParams, QuizStartPayload, QuizResponsePayload } from '@/types';

// ============================================================
// React Query Hooks — Quiz Attempts
// ============================================================

export function useQuizAttemptDetail(attemptId: string | null) {
  return useQuery({
    queryKey: ['quiz-attempt', attemptId],
    queryFn: () => quizService.getDetail(attemptId!),
    enabled: !!attemptId,
  });
}

export function useQuizHistory(params?: { enrollmentId?: string; quizId?: string }) {
  return useQuery({
    queryKey: ['quiz-history', params],
    queryFn: () => quizService.getHistory(params),
    enabled: !!(params?.enrollmentId || params?.quizId),
  });
}

export function useStartQuiz() {
  return useMutation({
    mutationFn: (payload: QuizStartPayload) => quizService.start(payload),
  });
}

export function useSaveQuizResponse() {
  return useMutation({
    mutationFn: (payload: QuizResponsePayload) => quizService.saveResponse(payload),
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) => quizService.submit(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-history'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-progress'] });
    },
  });
}

/**
 * Admin/trainer-scoped listing of quiz attempts (server-side filter + pagination).
 * Keys on the params object so filter/pagination changes refetch automatically.
 */
export function useAllQuizAttempts(params: QuizAttemptAdminListParams = {}) {
  return useQuery({
    queryKey: ['quiz-attempts-all', params],
    queryFn: () => quizService.getAllAttemptsAdmin(params),
    placeholderData: (prev) => prev,
  });
}

export function useManualGradeResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      responseId,
      awardedPoints,
      feedback,
    }: {
      responseId: string;
      awardedPoints: number;
      feedback?: string;
    }) => quizService.manualGradeResponse(responseId, { awardedPoints, feedback }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts-all'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-attempt'] });
    },
  });
}

export function useFinalizeGrading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) => quizService.finalizeGrading(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts-all'] });
    },
  });
}

// ============================================================
// AI Grading Hooks
// ============================================================

/** Grade a single essay question via AI */
export function useAiGradeEssay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attemptQuestionId: string) => quizService.aiGradeEssay(attemptQuestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempt'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts-all'] });
    },
  });
}

/** Grade all essay questions in a quiz attempt via AI */
export function useAiGradeQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quizAttemptId: string) => quizService.aiGradeQuiz(quizAttemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempt'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts-all'] });
    },
  });
}
