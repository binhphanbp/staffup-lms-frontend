import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleplayService } from '@/services/roleplay.service';

export const ROLEPLAY_KEYS = {
  scenarios: ['roleplay', 'scenarios'] as const,
  scenario: (id: string) => ['roleplay', 'scenario', id] as const,
  mySessions: (scenarioId?: string) =>
    scenarioId
      ? (['roleplay', 'sessions', scenarioId] as const)
      : (['roleplay', 'sessions', 'all'] as const),
  session: (id: string) => ['roleplay', 'session', id] as const,
};

export function useRoleplayScenarios() {
  return useQuery({
    queryKey: ROLEPLAY_KEYS.scenarios,
    queryFn: () => roleplayService.listScenarios(),
    staleTime: 60 * 1000,
  });
}

export function useRoleplayScenario(id: string | null | undefined) {
  return useQuery({
    queryKey: ROLEPLAY_KEYS.scenario(id ?? ''),
    queryFn: () => roleplayService.getScenario(id!),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useRoleplaySession(id: string | null | undefined) {
  return useQuery({
    queryKey: ROLEPLAY_KEYS.session(id ?? ''),
    queryFn: () => roleplayService.getSession(id!),
    enabled: Boolean(id),
    staleTime: 0,
  });
}

export function useMyRoleplaySessions(scenarioId?: string) {
  return useQuery({
    queryKey: ROLEPLAY_KEYS.mySessions(scenarioId),
    queryFn: () => roleplayService.listMySessions(scenarioId),
    staleTime: 30 * 1000,
  });
}

export function useStartRoleplaySession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scenarioId: string) => roleplayService.startSession(scenarioId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROLEPLAY_KEYS.scenarios });
    },
  });
}

export function useSendRoleplayTurn(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => roleplayService.sendTurn(sessionId, message),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROLEPLAY_KEYS.session(sessionId) });
    },
  });
}

export function useEndRoleplaySession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => roleplayService.endSession(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROLEPLAY_KEYS.session(sessionId) });
      qc.invalidateQueries({ queryKey: ['roleplay', 'sessions'] });
      qc.invalidateQueries({ queryKey: ROLEPLAY_KEYS.scenarios });
    },
  });
}

export function useAbandonRoleplaySession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => roleplayService.abandonSession(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROLEPLAY_KEYS.session(sessionId) });
      qc.invalidateQueries({ queryKey: ['roleplay', 'sessions'] });
    },
  });
}
