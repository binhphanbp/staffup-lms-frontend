import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

// ============================================================
// Risk Assessment API Service
// Backend: src/routes/v1/risk-assessment.routes.ts
// ============================================================

const API_BASE = '/risk-assessments';

// ----- Types -----

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Shape returned by list endpoint (list/latest only, no deep fields)
export interface RiskAssessmentListItem {
  id: string;
  enrollmentId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  modelVersion: string | null;
  calculatedAt: string;
  expiresAt: string | null;
  enrollment: {
    id: string;
    user: {
      id: string;
      fullName: string;
      email: string;
    };
    course: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

// Shape returned by "latest per enrollment" endpoint (includes deep fields)
export interface RiskAssessmentDetail {
  id: string;
  enrollmentId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  modelVersion: string | null;
  reasons: unknown; // JSON (shape varies; render defensively)
  recommendations: string | null;
  interventions: string | null; // Gemini JSON string: { summary, actions[] }
  calculatedAt: string;
  expiresAt: string | null;
}

export interface RiskAssessmentHistoryItem {
  id: string;
  riskScore: number;
  riskLevel: RiskLevel;
  modelVersion: string | null;
  calculatedAt: string;
  expiresAt: string | null;
}

// Gemini intervention JSON shape (parse from RiskAssessmentDetail.interventions)
export type InterventionType =
  | 'email'
  | 'meeting'
  | 'mentoring'
  | 'content_adjust'
  | 'deadline_extend'
  | 'reminder';

export type InterventionPriority = 'urgent' | 'high' | 'medium';

export interface InterventionAction {
  type: InterventionType | string;
  priority: InterventionPriority | string;
  description: string;
}

export interface InterventionPlan {
  summary: string;
  actions: InterventionAction[];
}

// Signal data derived from RiskAssessmentDetail.reasons (best-effort)
export interface RiskSignals {
  engagement?: {
    daysInactive?: number;
    lessonCompletionRate?: number;
    watchTimeRatio?: number;
  };
  performance?: {
    averageQuizScore?: number;
    failRate?: number;
    scoreVsClassAvg?: number;
    quizScoreTrend?: number;
  };
  deadline?: {
    timeElapsedRatio?: number;
    progressGap?: number;
    daysRemaining?: number | null;
    hasDeadline?: boolean;
  };
  componentScores?: {
    engagement?: number;
    performance?: number;
    deadline?: number;
  };
}

// ----- Filter query types -----

export interface ListRiskAssessmentsQuery {
  riskLevel?: RiskLevel;
  enrollmentId?: string;
  userId?: string;
  courseId?: string;
  latestOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface BatchCalculationResult {
  processed: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  errors: number;
  details: Array<{
    enrollmentId: string;
    riskScore: number;
    riskLevel: string;
    error?: string;
  }>;
}

export interface SingleCalculationResult {
  riskScore: number;
  riskLevel: RiskLevel;
  signals: RiskSignals;
  interventions: string | null;
}

// ----- Service -----

export const riskService = {
  list: async (
    query: ListRiskAssessmentsQuery = {},
  ): Promise<{ assessments: RiskAssessmentListItem[]; pagination: RiskPagination }> => {
    const params: Record<string, string> = {};
    if (query.riskLevel) params.riskLevel = query.riskLevel;
    if (query.enrollmentId) params.enrollmentId = query.enrollmentId;
    if (query.userId) params.userId = query.userId;
    if (query.courseId) params.courseId = query.courseId;
    if (query.latestOnly) params.latestOnly = 'true';
    if (query.page) params.page = String(query.page);
    if (query.limit) params.limit = String(query.limit);

    const { data } = await api.get<
      ApiResponse<{ assessments: RiskAssessmentListItem[]; pagination: RiskPagination }>
    >(API_BASE, { params });
    return data.data;
  },

  getLatest: async (enrollmentId: string): Promise<RiskAssessmentDetail> => {
    const { data } = await api.get<ApiResponse<RiskAssessmentDetail>>(
      `${API_BASE}/enrollment/${enrollmentId}/latest`,
    );
    return data.data;
  },

  getHistory: async (
    enrollmentId: string,
    page = 1,
    limit = 10,
  ): Promise<{ assessments: RiskAssessmentHistoryItem[]; pagination: RiskPagination }> => {
    const { data } = await api.get<
      ApiResponse<{ assessments: RiskAssessmentHistoryItem[]; pagination: RiskPagination }>
    >(`${API_BASE}/enrollment/${enrollmentId}/history`, {
      params: { page: String(page), limit: String(limit) },
    });
    return data.data;
  },

  calculate: async (enrollmentId: string): Promise<SingleCalculationResult> => {
    const { data } = await api.post<ApiResponse<SingleCalculationResult>>(
      `${API_BASE}/calculate/${enrollmentId}`,
    );
    return data.data;
  },

  calculateBatch: async (): Promise<BatchCalculationResult> => {
    const { data } = await api.post<ApiResponse<BatchCalculationResult>>(
      `${API_BASE}/calculate-batch`,
    );
    return data.data;
  },
};

// ----- Helpers -----

/** Safely parse Gemini intervention JSON. Returns null on parse failure. */
export function parseInterventionPlan(raw: string | null | undefined): InterventionPlan | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.summary === 'string' &&
      Array.isArray(parsed.actions)
    ) {
      return parsed as InterventionPlan;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extract structured signals from the reasons JSON. Reasons may be the raw
 * RiskSignals object stored by calculateRiskScore, or null if ingested externally.
 */
export function extractSignals(reasons: unknown): RiskSignals | null {
  if (!reasons || typeof reasons !== 'object') return null;
  return reasons as RiskSignals;
}
