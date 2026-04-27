import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { skillGapService } from '@/services/skill-gap.service';

export const SKILL_GAP_KEYS = {
  all: ['skill-gap'] as const,
  skills: (filters?: { category?: string; q?: string; isActive?: boolean }) =>
    [...SKILL_GAP_KEYS.all, 'skills', filters ?? {}] as const,
  positions: () => [...SKILL_GAP_KEYS.all, 'positions'] as const,
  positionSkills: (title: string) => [...SKILL_GAP_KEYS.all, 'position-skills', title] as const,
  myProfile: () => [...SKILL_GAP_KEYS.all, 'my-profile'] as const,
  myGap: () => [...SKILL_GAP_KEYS.all, 'my-gap'] as const,
  myAssessments: (filters?: { skillId?: string; source?: string }) =>
    [...SKILL_GAP_KEYS.all, 'my-assessments', filters ?? {}] as const,
  userGap: (userId: string) => [...SKILL_GAP_KEYS.all, 'user-gap', userId] as const,
  teamRollUp: (departmentId: string) =>
    [...SKILL_GAP_KEYS.all, 'team-roll-up', departmentId] as const,
  recommendations: (skillId: string) =>
    [...SKILL_GAP_KEYS.all, 'recommendations', skillId] as const,
};

export function useSkills(filters?: { category?: string; q?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: SKILL_GAP_KEYS.skills(filters),
    queryFn: () => skillGapService.listSkills(filters),
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: skillGapService.createSkill,
    onSuccess: () => qc.invalidateQueries({ queryKey: SKILL_GAP_KEYS.all }),
  });
}

export function useUpdateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: { name?: string; description?: string; category?: string; isActive?: boolean };
    }) => skillGapService.updateSkill(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: SKILL_GAP_KEYS.all }),
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: skillGapService.deleteSkill,
    onSuccess: () => qc.invalidateQueries({ queryKey: SKILL_GAP_KEYS.all }),
  });
}

export function usePositionTitles() {
  return useQuery({
    queryKey: SKILL_GAP_KEYS.positions(),
    queryFn: () => skillGapService.listPositionTitles(),
  });
}

export function usePositionSkills(positionTitle: string | null) {
  return useQuery({
    queryKey: SKILL_GAP_KEYS.positionSkills(positionTitle ?? ''),
    queryFn: () => skillGapService.listPositionSkills(positionTitle ?? ''),
    enabled: Boolean(positionTitle),
  });
}

export function useUpsertPositionSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: skillGapService.upsertPositionSkill,
    onSuccess: () => qc.invalidateQueries({ queryKey: SKILL_GAP_KEYS.all }),
  });
}

export function useDeletePositionSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: skillGapService.deletePositionSkill,
    onSuccess: () => qc.invalidateQueries({ queryKey: SKILL_GAP_KEYS.all }),
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: SKILL_GAP_KEYS.myProfile(),
    queryFn: () => skillGapService.getMyProfile(),
  });
}

export function useMyGap() {
  return useQuery({
    queryKey: SKILL_GAP_KEYS.myGap(),
    queryFn: () => skillGapService.getMyGap(),
  });
}

export function useMyAssessmentHistory(filters?: {
  skillId?: string;
  source?: 'self' | 'manager' | 'auto';
}) {
  return useQuery({
    queryKey: SKILL_GAP_KEYS.myAssessments(filters),
    queryFn: () => skillGapService.listMyAssessmentHistory(filters),
  });
}

export function useSetMySkillLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ skillId, level, notes }: { skillId: string; level: number; notes?: string }) =>
      skillGapService.setMySkillLevel(skillId, level, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SKILL_GAP_KEYS.myProfile() });
      qc.invalidateQueries({ queryKey: SKILL_GAP_KEYS.myGap() });
    },
  });
}

export function useTeamRollUp(departmentId: string | null) {
  return useQuery({
    queryKey: SKILL_GAP_KEYS.teamRollUp(departmentId ?? ''),
    queryFn: () => skillGapService.getTeamRollUp(departmentId!),
    enabled: Boolean(departmentId),
  });
}

export function useUserGap(userId: string | null) {
  return useQuery({
    queryKey: SKILL_GAP_KEYS.userGap(userId ?? ''),
    queryFn: () => skillGapService.getUserGap(userId!),
    enabled: Boolean(userId),
  });
}

export function useManagerAssess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: skillGapService.managerAssess,
    onSuccess: () => qc.invalidateQueries({ queryKey: SKILL_GAP_KEYS.all }),
  });
}

export function useAiSuggestSkills() {
  return useMutation({
    mutationFn: skillGapService.aiSuggestSkills,
  });
}

export function useSkillRecommendations(skillId: string | null) {
  return useQuery({
    queryKey: SKILL_GAP_KEYS.recommendations(skillId ?? ''),
    queryFn: () => skillGapService.listSkillRecommendations(skillId!),
    enabled: Boolean(skillId),
  });
}
