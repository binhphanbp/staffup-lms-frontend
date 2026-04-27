import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adaptiveQuizService } from '@/services/adaptive-quiz.service';
import type { StartAdaptiveSessionInput, SubmitAdaptiveAnswerInput } from '@/types/adaptive-quiz';

export const ADAPTIVE_QUIZ_KEYS = {
  all: ['adaptive-quiz'] as const,
  banks: () => [...ADAPTIVE_QUIZ_KEYS.all, 'banks'] as const,
  sessions: () => [...ADAPTIVE_QUIZ_KEYS.all, 'sessions'] as const,
  session: (id: string) => [...ADAPTIVE_QUIZ_KEYS.sessions(), id] as const,
};

export function useAdaptiveBanks() {
  return useQuery({
    queryKey: ADAPTIVE_QUIZ_KEYS.banks(),
    queryFn: () => adaptiveQuizService.listBanks(),
  });
}

export function useMyAdaptiveSessions() {
  return useQuery({
    queryKey: ADAPTIVE_QUIZ_KEYS.sessions(),
    queryFn: () => adaptiveQuizService.listMySessions(),
  });
}

export function useAdaptiveSession(id: string | null | undefined) {
  return useQuery({
    queryKey: ADAPTIVE_QUIZ_KEYS.session(id ?? ''),
    queryFn: () => adaptiveQuizService.getSession(id as string),
    enabled: Boolean(id),
  });
}

export function useStartAdaptiveSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: StartAdaptiveSessionInput) => adaptiveQuizService.startSession(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADAPTIVE_QUIZ_KEYS.sessions() });
    },
  });
}

export function useSubmitAdaptiveAnswer(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitAdaptiveAnswerInput) =>
      adaptiveQuizService.submitAnswer(sessionId, input),
    onSuccess: (data) => {
      qc.setQueryData(ADAPTIVE_QUIZ_KEYS.session(sessionId), data);
      qc.invalidateQueries({ queryKey: ADAPTIVE_QUIZ_KEYS.sessions() });
    },
  });
}

export function useEndAdaptiveSession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adaptiveQuizService.endSession(sessionId),
    onSuccess: (data) => {
      qc.setQueryData(ADAPTIVE_QUIZ_KEYS.session(sessionId), data);
      qc.invalidateQueries({ queryKey: ADAPTIVE_QUIZ_KEYS.sessions() });
    },
  });
}

export function useAbandonAdaptiveSession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adaptiveQuizService.abandonSession(sessionId),
    onSuccess: (data) => {
      qc.setQueryData(ADAPTIVE_QUIZ_KEYS.session(sessionId), data);
      qc.invalidateQueries({ queryKey: ADAPTIVE_QUIZ_KEYS.sessions() });
    },
  });
}
