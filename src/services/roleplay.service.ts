import api from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type {
  EndRoleplaySessionResponse,
  RoleplayLeaderboardEntry,
  RoleplayScenarioDetail,
  RoleplayScenarioListItem,
  RoleplaySessionDetail,
  RoleplaySessionSummary,
  RoleplayTurnResponse,
  StartRoleplaySessionResponse,
} from '@/types/roleplay';

export const roleplayService = {
  listScenarios: async (): Promise<RoleplayScenarioListItem[]> => {
    const { data } = await api.get<ApiResponse<RoleplayScenarioListItem[]>>('/roleplay/scenarios');
    return data.data;
  },

  getScenario: async (id: string): Promise<RoleplayScenarioDetail> => {
    const { data } = await api.get<ApiResponse<RoleplayScenarioDetail>>(
      `/roleplay/scenarios/${id}`,
    );
    return data.data;
  },

  listMySessions: async (scenarioId?: string): Promise<RoleplaySessionSummary[]> => {
    const params = scenarioId ? { scenarioId } : undefined;
    const { data } = await api.get<ApiResponse<RoleplaySessionSummary[]>>('/roleplay/sessions', {
      params,
    });
    return data.data;
  },

  startSession: async (scenarioId: string): Promise<StartRoleplaySessionResponse> => {
    const { data } = await api.post<ApiResponse<StartRoleplaySessionResponse>>(
      '/roleplay/sessions/start',
      { scenarioId },
    );
    return data.data;
  },

  getSession: async (sessionId: string): Promise<RoleplaySessionDetail> => {
    const { data } = await api.get<ApiResponse<RoleplaySessionDetail>>(
      `/roleplay/sessions/${sessionId}`,
    );
    return data.data;
  },

  sendTurn: async (sessionId: string, message: string): Promise<RoleplayTurnResponse> => {
    const { data } = await api.post<ApiResponse<RoleplayTurnResponse>>(
      `/roleplay/sessions/${sessionId}/turn`,
      { message },
    );
    return data.data;
  },

  endSession: async (sessionId: string): Promise<EndRoleplaySessionResponse> => {
    const { data } = await api.post<ApiResponse<EndRoleplaySessionResponse>>(
      `/roleplay/sessions/${sessionId}/end`,
    );
    return data.data;
  },

  abandonSession: async (sessionId: string): Promise<RoleplaySessionDetail> => {
    const { data } = await api.post<ApiResponse<RoleplaySessionDetail>>(
      `/roleplay/sessions/${sessionId}/abandon`,
    );
    return data.data;
  },
};

export const roleplayLeaderboardService = {
  list: async (params?: {
    scope?: 'global' | 'department';
    limit?: number;
  }): Promise<RoleplayLeaderboardEntry[]> => {
    const { data } = await api.get<ApiResponse<RoleplayLeaderboardEntry[]>>(
      '/roleplay/leaderboard',
      { params },
    );
    return data.data;
  },
};
