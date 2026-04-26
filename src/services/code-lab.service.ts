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

export const codeLabService = {
  evaluate: async (payload: EvaluateCodePayload): Promise<CodeLabEvaluationResult> => {
    const { data } = await api.post<ApiResponse<CodeLabEvaluationResult>>(
      '/code-lab/evaluate',
      payload,
    );
    return data.data;
  },
};
