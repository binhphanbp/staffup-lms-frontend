import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export type EnrollmentStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ActionPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface LearnerSummary {
  id: string;
  fullName: string;
  email: string;
  positionTitle: string | null;
  isActive: boolean;
}

export interface EnrollmentSummary {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  positionTitle: string | null;
  courseId: string;
  courseTitle: string;
  status: EnrollmentStatus;
  progressPercent: number;
  dueAt: string | null;
  lastActivityAt: string | null;
  daysUntilDue: number | null;
}

export interface RiskLearnerSummary extends EnrollmentSummary {
  riskScore: number;
  riskLevel: RiskLevel;
  recommendations: string | null;
  interventions: string | null;
  calculatedAt: string;
}

export interface CourseLoadSummary {
  courseId: string;
  title: string;
  assigned: number;
  inProgress: number;
  completed: number;
  averageProgressPercent: number;
}

export interface ManagerCoachOverview {
  department: {
    id: string;
    name: string;
  };
  metrics: {
    totalLearners: number;
    activeLearners: number;
    inactiveLearners: number;
    totalEnrollments: number;
    byStatus: Record<EnrollmentStatus, number>;
    completionRate: number;
    averageProgressPercent: number;
    overdueCount: number;
    upcomingDeadlineCount: number;
    stalledLearnerCount: number;
    risk: Record<RiskLevel, number>;
  };
  learners: LearnerSummary[];
  atRiskLearners: RiskLearnerSummary[];
  upcomingDeadlines: EnrollmentSummary[];
  stalledLearners: EnrollmentSummary[];
  courseLoad: CourseLoadSummary[];
  generatedAt: string;
}

export interface ManagerCoachHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ManagerCoachAction {
  label: string;
  reason: string;
  priority: ActionPriority;
}

export interface ManagerCoachChatResponse {
  answer: string;
  suggestedActions: ManagerCoachAction[];
  focusAreas: string[];
  generatedAt: string;
}

export interface WeeklyBriefingResponse {
  title: string;
  markdown: string;
  highlights: string[];
  risks: string[];
  actions: ManagerCoachAction[];
  weekOf: string;
  generatedAt: string;
}

export const managerCoachService = {
  getTeamOverview: async (): Promise<ManagerCoachOverview> => {
    const { data } = await api.get<ApiResponse<ManagerCoachOverview>>(
      '/manager/coach/team-overview',
    );
    return data.data;
  },

  chat: async (
    message: string,
    history: ManagerCoachHistoryMessage[],
  ): Promise<ManagerCoachChatResponse> => {
    const { data } = await api.post<ApiResponse<ManagerCoachChatResponse>>('/manager/coach/chat', {
      message,
      history,
    });
    return data.data;
  },

  generateWeeklyBriefing: async (focus?: string): Promise<WeeklyBriefingResponse> => {
    const { data } = await api.post<ApiResponse<WeeklyBriefingResponse>>(
      '/manager/coach/weekly-briefing/generate',
      { focus },
    );
    return data.data;
  },
};
