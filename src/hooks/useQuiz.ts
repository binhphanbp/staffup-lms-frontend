import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizService } from '@/services/quiz.service';
import type { QuizStartPayload, QuizResponsePayload } from '@/types';

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

// Alias for better naming
export const useQuizAttemptHistory = useQuizHistory;

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
