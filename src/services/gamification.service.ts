import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export interface GamificationStats {
  userId: string;
  totalXp: number;
  currentLevel: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progressToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  badgesEarned: number;
  badgesTotal: number;
}

export interface BadgeDto {
  id: string;
  code: string;
  name: string;
  description: string;
  iconName: string;
  tier: string;
  earnedAt: string | null;
}

export interface BadgesResponse {
  earned: BadgeDto[];
  locked: BadgeDto[];
}

export interface XpTransaction {
  id: string;
  amount: number;
  source: string;
  referenceId: string | null;
  description: string | null;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  departmentId: string | null;
  departmentName: string | null;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  badgesEarned: number;
}

export type LeaderboardScope = 'global' | 'department';

export const gamificationService = {
  async getMyStats(): Promise<GamificationStats> {
    const { data } = await api.get<ApiResponse<GamificationStats>>('/gamification/me');
    return data.data!;
  },
  async getMyBadges(): Promise<BadgesResponse> {
    const { data } = await api.get<ApiResponse<BadgesResponse>>('/gamification/me/badges');
    return data.data!;
  },
  async getMyTransactions(limit = 20): Promise<XpTransaction[]> {
    const { data } = await api.get<ApiResponse<XpTransaction[]>>(
      `/gamification/me/transactions?limit=${limit}`,
    );
    return data.data ?? [];
  },
  async getLeaderboard(
    scope: LeaderboardScope = 'global',
    limit = 20,
  ): Promise<LeaderboardEntry[]> {
    const { data } = await api.get<ApiResponse<LeaderboardEntry[]>>(
      `/gamification/leaderboard?scope=${scope}&limit=${limit}`,
    );
    return data.data ?? [];
  },
};
