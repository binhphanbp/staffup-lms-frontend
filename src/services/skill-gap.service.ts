import api from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type {
  AiSuggestionsResponse,
  MyGap,
  PositionSkillEntry,
  Skill,
  SkillRecommendationEntry,
  TeamRollUp,
  UserGap,
  UserSkillEntry,
} from '@/types/skill-gap';

export const skillGapService = {
  // Catalog
  listSkills: async (params?: {
    category?: string;
    q?: string;
    isActive?: boolean;
  }): Promise<Skill[]> => {
    const search = new URLSearchParams();
    if (params?.category) search.set('category', params.category);
    if (params?.q) search.set('q', params.q);
    if (params?.isActive !== undefined) search.set('isActive', String(params.isActive));
    const qs = search.toString();
    const { data } = await api.get<ApiResponse<Skill[]>>(`/skill-gap/skills${qs ? `?${qs}` : ''}`);
    return data.data;
  },
  createSkill: async (input: {
    name: string;
    description?: string;
    category?: string;
  }): Promise<Skill> => {
    const { data } = await api.post<ApiResponse<Skill>>('/skill-gap/skills', input);
    return data.data;
  },
  updateSkill: async (
    id: string,
    input: { name?: string; description?: string; category?: string; isActive?: boolean },
  ): Promise<Skill> => {
    const { data } = await api.patch<ApiResponse<Skill>>(`/skill-gap/skills/${id}`, input);
    return data.data;
  },
  deleteSkill: async (id: string): Promise<void> => {
    await api.delete(`/skill-gap/skills/${id}`);
  },

  // Position
  listPositionTitles: async (): Promise<string[]> => {
    const { data } = await api.get<ApiResponse<string[]>>('/skill-gap/positions');
    return data.data;
  },
  listPositionSkills: async (positionTitle: string): Promise<PositionSkillEntry[]> => {
    const { data } = await api.get<ApiResponse<PositionSkillEntry[]>>(
      `/skill-gap/position-skills?positionTitle=${encodeURIComponent(positionTitle)}`,
    );
    return data.data;
  },
  upsertPositionSkill: async (input: {
    positionTitle: string;
    skillId: string;
    targetLevel: number;
    weight?: number;
    isCore?: boolean;
  }): Promise<PositionSkillEntry> => {
    const { data } = await api.post<ApiResponse<PositionSkillEntry>>(
      '/skill-gap/position-skills',
      input,
    );
    return data.data;
  },
  deletePositionSkill: async (id: string): Promise<void> => {
    await api.delete(`/skill-gap/position-skills/${id}`);
  },

  // Self
  getMyProfile: async (): Promise<{
    positionTitle: string | null;
    skills: UserSkillEntry[];
  }> => {
    const { data } =
      await api.get<ApiResponse<{ positionTitle: string | null; skills: UserSkillEntry[] }>>(
        '/skill-gap/my-profile',
      );
    return data.data;
  },
  setMySkillLevel: async (
    skillId: string,
    level: number,
    notes?: string,
  ): Promise<UserSkillEntry> => {
    const { data } = await api.put<ApiResponse<UserSkillEntry>>(
      `/skill-gap/my-profile/${skillId}`,
      { level, notes },
    );
    return data.data;
  },
  getMyGap: async (): Promise<MyGap> => {
    const { data } = await api.get<ApiResponse<MyGap>>('/skill-gap/my-gap');
    return data.data;
  },

  // Manager
  managerAssess: async (input: {
    userId: string;
    skillId: string;
    level: number;
    notes?: string;
  }): Promise<UserSkillEntry> => {
    const { data } = await api.post<ApiResponse<UserSkillEntry>>(
      '/skill-gap/manager-assess',
      input,
    );
    return data.data;
  },
  getUserGap: async (userId: string): Promise<UserGap> => {
    const { data } = await api.get<ApiResponse<UserGap>>(`/skill-gap/users/${userId}/gap`);
    return data.data;
  },
  getTeamRollUp: async (departmentId: string): Promise<TeamRollUp> => {
    const { data } = await api.get<ApiResponse<TeamRollUp>>(
      `/skill-gap/team/${departmentId}/roll-up`,
    );
    return data.data;
  },

  // AI
  aiSuggestSkills: async (input: {
    positionTitle: string;
    context?: string;
  }): Promise<AiSuggestionsResponse> => {
    const { data } = await api.post<ApiResponse<AiSuggestionsResponse>>(
      '/skill-gap/ai/suggest-skills',
      input,
    );
    return data.data;
  },

  // Course recommendations
  listSkillRecommendations: async (skillId: string): Promise<SkillRecommendationEntry[]> => {
    const { data } = await api.get<ApiResponse<SkillRecommendationEntry[]>>(
      `/skill-gap/skills/${skillId}/courses`,
    );
    return data.data;
  },
  setSkillRecommendation: async (
    skillId: string,
    input: { courseId: string; minLevel?: number; maxLevel?: number; priority?: number },
  ): Promise<{ id: string }> => {
    const { data } = await api.post<ApiResponse<{ id: string }>>(
      `/skill-gap/skills/${skillId}/courses`,
      input,
    );
    return data.data;
  },
  removeSkillRecommendation: async (skillId: string, courseId: string): Promise<void> => {
    await api.delete(`/skill-gap/skills/${skillId}/courses/${courseId}`);
  },
};
