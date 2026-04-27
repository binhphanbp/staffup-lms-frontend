import { useQuery } from '@tanstack/react-query';
import {
  gamificationService,
  type BadgesResponse,
  type GamificationStats,
  type LeaderboardEntry,
  type LeaderboardScope,
  type XpTransaction,
} from '@/services/gamification.service';

export const GAMIFICATION_KEYS = {
  stats: ['gamification', 'me'] as const,
  badges: ['gamification', 'me', 'badges'] as const,
  transactions: (limit: number) => ['gamification', 'me', 'transactions', limit] as const,
  leaderboard: (scope: LeaderboardScope, limit: number) =>
    ['gamification', 'leaderboard', scope, limit] as const,
};

export function useMyGamification() {
  return useQuery<GamificationStats>({
    queryKey: GAMIFICATION_KEYS.stats,
    queryFn: () => gamificationService.getMyStats(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useMyBadges() {
  return useQuery<BadgesResponse>({
    queryKey: GAMIFICATION_KEYS.badges,
    queryFn: () => gamificationService.getMyBadges(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useMyXpTransactions(limit = 20) {
  return useQuery<XpTransaction[]>({
    queryKey: GAMIFICATION_KEYS.transactions(limit),
    queryFn: () => gamificationService.getMyTransactions(limit),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useLeaderboard(scope: LeaderboardScope = 'global', limit = 10) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: GAMIFICATION_KEYS.leaderboard(scope, limit),
    queryFn: () => gamificationService.getLeaderboard(scope, limit),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
