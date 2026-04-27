export type RoleplayDifficulty = 'easy' | 'medium' | 'hard';
export type RoleplayCategory =
  | 'communication'
  | 'sales'
  | 'leadership'
  | 'conflict'
  | 'interview'
  | 'support';

export type RoleplaySessionStatus = 'in_progress' | 'completed' | 'abandoned';
export type RoleplayTurnRole = 'user' | 'assistant' | 'system';
export type RoleplayBand = 'excellent' | 'good' | 'needs_improvement' | 'poor';

export interface RubricCriterion {
  key: string;
  label: string;
  description: string;
  weight: number;
}

export interface RoleplayScenario {
  id: string;
  slug: string;
  title: string;
  description: string;
  personaName: string;
  personaRole: string;
  personaTone: string;
  difficulty: RoleplayDifficulty;
  category: RoleplayCategory;
  estimatedMinutes: number;
  maxTurns: number;
  language: string;
  voiceHint: string | null;
  objectives: string[];
  rubric: RubricCriterion[];
  isActive: boolean;
}

export interface RoleplayScenarioListItem extends RoleplayScenario {
  attemptCount: number;
  bestScore: number | null;
}

export interface RoleplayScenarioDetail extends RoleplayScenario {
  context: string;
  openingLine: string;
}

export interface RoleplayTurn {
  id: string;
  role: RoleplayTurnRole;
  content: string;
  orderIndex: number;
  createdAt: string;
}

export interface RoleplayCriterionScore {
  key: string;
  label: string;
  score: number;
  max: number;
  feedback: string;
}

export interface RoleplayEvaluation {
  id: string;
  sessionId: string;
  overallScore: number;
  band: RoleplayBand;
  criterionScores: RoleplayCriterionScore[];
  strengths: string[];
  improvements: string[];
  summary: string;
  createdAt: string;
}

export interface RoleplaySessionSummary {
  id: string;
  scenarioId: string;
  status: RoleplaySessionStatus;
  startedAt: string;
  endedAt: string | null;
  scenario: RoleplayScenario;
  turnCount: number;
  evaluation: RoleplayEvaluation | null;
}

export interface RoleplaySessionDetail extends RoleplaySessionSummary {
  turns: RoleplayTurn[];
}

export interface RoleplayTurnResponse {
  turn: RoleplayTurn;
  shouldEnd: boolean;
  remainingTurns: number;
}

export interface StartRoleplaySessionResponse {
  session: RoleplaySessionSummary;
  openingTurn: RoleplayTurn;
}

export interface EndRoleplaySessionResponse {
  session: RoleplaySessionDetail;
  evaluation: RoleplayEvaluation;
}

export interface RoleplayLeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  positionTitle: string | null;
  department: { id: string; name: string } | null;
  bestScore: number;
  averageScore: number;
  bestBand: string | null;
  completedSessions: number;
  lastCompletedAt: string | null;
}
