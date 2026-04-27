export type AdaptiveSessionStatus = 'in_progress' | 'completed' | 'abandoned';

export interface AdaptiveBank {
  id: string;
  title: string;
  description: string | null;
  questionCount: number;
  difficultyCoverage: number[];
  category: { id: string; name: string } | null;
}

export interface AdaptiveQuestionOption {
  id: string;
  content: string;
  orderIndex: number;
}

export interface AdaptiveCurrentQuestion {
  id: string;
  content: string;
  difficulty: number;
  questionType: string;
  options: AdaptiveQuestionOption[];
}

export interface AdaptiveAnsweredQuestion {
  id: string;
  content: string;
  explanation: string | null;
  options: Array<{
    id: string;
    content: string;
    isCorrect: boolean;
    orderIndex: number;
  }>;
}

export interface AdaptiveAnsweredItem {
  id: string;
  orderIndex: number;
  difficulty: number;
  isCorrect: boolean;
  abilityBefore: number;
  abilityAfter: number;
  selectedOptionIds: string[];
  question: AdaptiveAnsweredQuestion;
}

export interface AdaptiveCurrentItem {
  itemId: string;
  orderIndex: number;
  question: AdaptiveCurrentQuestion;
}

export interface AdaptiveSession {
  id: string;
  questionBankId: string;
  questionBankTitle: string;
  status: AdaptiveSessionStatus;
  maxQuestions: number;
  answeredCount: number;
  correctCount: number;
  abilityScore: number;
  currentDifficulty: number;
  band: string;
  startedAt: string;
  completedAt: string | null;
  currentItem: AdaptiveCurrentItem | null;
  answeredItems: AdaptiveAnsweredItem[];
}

export interface AdaptiveSessionSummary {
  id: string;
  questionBankId: string;
  questionBankTitle: string;
  status: AdaptiveSessionStatus;
  abilityScore: number;
  band: string;
  correctCount: number;
  answeredCount: number;
  maxQuestions: number;
  startedAt: string;
  completedAt: string | null;
}

export interface StartAdaptiveSessionInput {
  questionBankId: string;
  maxQuestions?: number;
}

export interface SubmitAdaptiveAnswerInput {
  itemId: string;
  selectedOptionIds: string[];
  timeSpentMs?: number;
}

// ---------- Admin types ----------

export type DifficultyDistribution = Record<'1' | '2' | '3' | '4' | '5', number>;

export interface AdaptiveAdminBank {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  category: { id: string; name: string } | null;
  totalQuestions: number;
  eligibleQuestions: number;
  difficultyDistribution: DifficultyDistribution;
  isEligibleForAdaptive: boolean;
  updatedAt: string;
}

export interface AdaptiveAdminBankDetail extends AdaptiveAdminBank {
  questions: Array<{
    id: string;
    content: string;
    questionType: string;
    difficulty: number;
    isActive: boolean;
    optionsCount: number;
    correctOptionsCount: number;
  }>;
}

export interface BulkSetDifficultyInput {
  questionIds: string[];
  difficulty: number;
}

export type AdaptiveAutoStrategy = 'spread' | 'reset';

export interface AdaptiveLeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  positionTitle: string | null;
  department: { id: string; name: string } | null;
  bestAbility: number;
  bestBand: string | null;
  completedSessions: number;
  totalAnswered: number;
  totalCorrect: number;
  accuracyPct: number;
  lastCompletedAt: string | null;
}
