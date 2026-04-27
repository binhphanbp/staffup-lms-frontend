import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

// ============================================================
// AI Code Lab — types + service
// ============================================================

export const CODE_LAB_LANGUAGES = [
  'python',
  'javascript',
  'typescript',
  'java',
  'cpp',
  'c',
  'go',
  'csharp',
  'ruby',
  'sql',
] as const;

export type CodeLabLanguage = (typeof CODE_LAB_LANGUAGES)[number];

export type CodeLabOverallStatus = 'passed' | 'failed' | 'partial' | 'error';
export type CodeLabDiagnosticType = 'error' | 'warning' | 'suggestion';
export type CodeLabSeverity = 'high' | 'medium' | 'low';

export interface CodeLabTestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface CodeLabTestResult {
  testCaseIndex: number;
  input: string;
  expectedOutput: string;
  simulatedOutput: string;
  passed: boolean;
  explanation: string;
}

export interface CodeLabDiagnostic {
  type: CodeLabDiagnosticType;
  severity: CodeLabSeverity;
  title: string;
  description: string;
  lineHint: number | null;
}

export interface CodeLabEvaluationResult {
  overallStatus: CodeLabOverallStatus;
  score: number;
  summary: string;
  testResults: CodeLabTestResult[];
  diagnostics: CodeLabDiagnostic[];
  suggestions: string[];
  language: CodeLabLanguage;
  model: string;
  generatedAt: string;
}

export interface EvaluateCodePayload {
  language: CodeLabLanguage;
  code: string;
  problemStatement: string;
  testCases?: CodeLabTestCase[];
  lessonId?: string;
  language_response?: 'vi' | 'en';
}

export type CodeLabDifficulty = 'easy' | 'medium' | 'hard';

export interface CodeLabProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: CodeLabDifficulty;
  category: string;
  language: CodeLabLanguage;
  tags: string[];
  createdAt: string;
}

export interface CodeLabProblem extends CodeLabProblemSummary {
  problemStatement: string;
  starterCode: string;
  testCases: CodeLabTestCase[];
  updatedAt: string;
}

export interface CodeSubmissionSummary {
  id: string;
  problemId: string;
  problemSlug: string;
  problemTitle: string;
  problemDifficulty: CodeLabDifficulty;
  problemCategory: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  language: CodeLabLanguage;
  code: string;
  status: CodeLabOverallStatus;
  score: number;
  summary: string | null;
  evaluation: CodeLabEvaluationResult | null;
  model: string | null;
  createdAt: string;
}

export interface SubmitProblemPayload {
  language: CodeLabLanguage;
  code: string;
  language_response?: 'vi' | 'en';
}

export interface SubmitProblemResult {
  submissionId: string;
  submittedAt: string;
  problemSlug: string;
  evaluation: CodeLabEvaluationResult;
}

export interface ListProblemsQuery {
  language?: CodeLabLanguage;
  difficulty?: CodeLabDifficulty;
  q?: string;
}

export interface ListSubmissionsQuery {
  limit?: number;
  status?: CodeLabOverallStatus;
}

export const codeLabService = {
  evaluate: async (payload: EvaluateCodePayload): Promise<CodeLabEvaluationResult> => {
    const { data } = await api.post<ApiResponse<CodeLabEvaluationResult>>(
      '/code-lab/evaluate',
      payload,
    );
    return data.data;
  },

  listProblems: async (query: ListProblemsQuery = {}): Promise<CodeLabProblemSummary[]> => {
    const { data } = await api.get<ApiResponse<CodeLabProblemSummary[]>>('/code-lab/problems', {
      params: query,
    });
    return data.data;
  },

  getProblem: async (slug: string): Promise<CodeLabProblem> => {
    const { data } = await api.get<ApiResponse<CodeLabProblem>>(`/code-lab/problems/${slug}`);
    return data.data;
  },

  submit: async (slug: string, payload: SubmitProblemPayload): Promise<SubmitProblemResult> => {
    const { data } = await api.post<ApiResponse<SubmitProblemResult>>(
      `/code-lab/problems/${slug}/submit`,
      payload,
    );
    return data.data;
  },

  listMySubmissions: async (query: ListSubmissionsQuery = {}): Promise<CodeSubmissionSummary[]> => {
    const { data } = await api.get<ApiResponse<CodeSubmissionSummary[]>>(
      '/code-lab/submissions/me',
      { params: query },
    );
    return data.data;
  },

  listMySubmissionsForProblem: async (
    slug: string,
    query: ListSubmissionsQuery = {},
  ): Promise<CodeSubmissionSummary[]> => {
    const { data } = await api.get<ApiResponse<CodeSubmissionSummary[]>>(
      `/code-lab/problems/${slug}/submissions/me`,
      { params: query },
    );
    return data.data;
  },

  listProblemSubmissions: async (
    slug: string,
    query: ListSubmissionsQuery = {},
  ): Promise<CodeSubmissionSummary[]> => {
    const { data } = await api.get<ApiResponse<CodeSubmissionSummary[]>>(
      `/code-lab/problems/${slug}/submissions`,
      { params: query },
    );
    return data.data;
  },

  getSubmission: async (submissionId: string): Promise<CodeSubmissionSummary> => {
    const { data } = await api.get<ApiResponse<CodeSubmissionSummary>>(
      `/code-lab/submissions/${submissionId}`,
    );
    return data.data;
  },
};
