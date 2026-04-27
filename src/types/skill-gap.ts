export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  isActive: boolean;
}

export interface PositionSkillEntry {
  id: string;
  positionTitle: string;
  skillId: string;
  skill: Skill;
  targetLevel: number;
  weight: number;
  isCore: boolean;
}

export interface UserSkillEntry {
  id: string;
  skillId: string;
  skill: Skill;
  currentLevel: number;
  source: string;
  notes: string | null;
  lastAssessedAt: string;
}

export interface SkillGapEntry {
  skillId: string;
  skill: Skill;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  weight: number;
  isCore: boolean;
  weightedGap: number;
  recommendedCourses: Array<{ id: string; title: string; slug: string }>;
}

export interface MyGap {
  positionTitle: string | null;
  totalSkills: number;
  averageCurrent: number;
  averageTarget: number;
  totalGap: number;
  weightedGap: number;
  readiness: number;
  band: string;
  entries: SkillGapEntry[];
}

export interface UserGap extends MyGap {
  user: { id: string; fullName: string; positionTitle: string | null };
}

export interface TeamMemberGap {
  userId: string;
  fullName: string;
  positionTitle: string | null;
  readiness: number;
  band: string;
  totalGap: number;
  weightedGap: number;
  topGapSkills: Array<{ skillId: string; skillName: string; gap: number }>;
}

export interface TeamRollUp {
  departmentId: string;
  departmentName: string;
  totalMembers: number;
  averageReadiness: number;
  skillHeatmap: Array<{
    skillId: string;
    skillName: string;
    averageGap: number;
    affectedMembers: number;
  }>;
  members: TeamMemberGap[];
}

export interface AiSkillSuggestion {
  name: string;
  description: string;
  category: string;
  targetLevel: number;
  isCore: boolean;
  weight: number;
}

export interface AiSuggestionsResponse {
  suggestions: AiSkillSuggestion[];
  source: 'ai' | 'fallback';
}

export interface SkillRecommendationEntry {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  minLevel: number;
  maxLevel: number;
  priority: number;
}
