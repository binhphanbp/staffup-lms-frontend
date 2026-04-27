import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  codeLabService,
  type CodeLabEvaluationResult,
  type CodeLabProblem,
  type CodeLabProblemSummary,
  type CodeSubmissionSummary,
  type EvaluateCodePayload,
  type ListProblemsQuery,
  type ListSubmissionsQuery,
  type SubmitProblemPayload,
  type SubmitProblemResult,
} from '@/services/code-lab.service';

// ============================================================
// Query keys
// ============================================================

export const codeLabKeys = {
  all: ['code-lab'] as const,
  problems: (query: ListProblemsQuery = {}) => ['code-lab', 'problems', query] as const,
  problem: (slug: string) => ['code-lab', 'problem', slug] as const,
  mySubmissions: (query: ListSubmissionsQuery = {}) =>
    ['code-lab', 'submissions', 'me', query] as const,
  myProblemSubmissions: (slug: string, query: ListSubmissionsQuery = {}) =>
    ['code-lab', 'problem', slug, 'submissions', 'me', query] as const,
  problemSubmissions: (slug: string, query: ListSubmissionsQuery = {}) =>
    ['code-lab', 'problem', slug, 'submissions', query] as const,
  submission: (submissionId: string) => ['code-lab', 'submission', submissionId] as const,
};

// ============================================================
// Mutations
// ============================================================

/** Legacy ad-hoc evaluate (used for free-form code editor / non-registry flows). */
export function useEvaluateCode() {
  return useMutation<CodeLabEvaluationResult, Error, EvaluateCodePayload>({
    mutationFn: (payload) => codeLabService.evaluate(payload),
  });
}

/** Submit code to a registered problem; persists CodeSubmission server-side. */
export function useSubmitProblem(slug: string | null | undefined) {
  const queryClient = useQueryClient();
  return useMutation<SubmitProblemResult, Error, SubmitProblemPayload>({
    mutationFn: (payload) => {
      if (!slug) throw new Error('Problem slug is required');
      return codeLabService.submit(slug, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code-lab', 'submissions', 'me'] });
      if (slug) {
        queryClient.invalidateQueries({
          queryKey: ['code-lab', 'problem', slug, 'submissions', 'me'],
        });
        queryClient.invalidateQueries({
          queryKey: ['code-lab', 'problem', slug, 'submissions'],
        });
      }
    },
  });
}

// ============================================================
// Queries
// ============================================================

export function useCodeLabProblems(query: ListProblemsQuery = {}) {
  return useQuery<CodeLabProblemSummary[]>({
    queryKey: codeLabKeys.problems(query),
    queryFn: () => codeLabService.listProblems(query),
    staleTime: 60 * 1000,
  });
}

export function useCodeLabProblem(slug: string | null | undefined) {
  return useQuery<CodeLabProblem>({
    queryKey: codeLabKeys.problem(slug ?? ''),
    queryFn: () => codeLabService.getProblem(slug as string),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyCodeSubmissions(query: ListSubmissionsQuery = {}) {
  return useQuery<CodeSubmissionSummary[]>({
    queryKey: codeLabKeys.mySubmissions(query),
    queryFn: () => codeLabService.listMySubmissions(query),
    staleTime: 30 * 1000,
  });
}

export function useMyCodeSubmissionsForProblem(
  slug: string | null | undefined,
  query: ListSubmissionsQuery = {},
) {
  return useQuery<CodeSubmissionSummary[]>({
    queryKey: codeLabKeys.myProblemSubmissions(slug ?? '', query),
    queryFn: () => codeLabService.listMySubmissionsForProblem(slug as string, query),
    enabled: Boolean(slug),
    staleTime: 30 * 1000,
  });
}

export function useProblemSubmissions(
  slug: string | null | undefined,
  query: ListSubmissionsQuery = {},
) {
  return useQuery<CodeSubmissionSummary[]>({
    queryKey: codeLabKeys.problemSubmissions(slug ?? '', query),
    queryFn: () => codeLabService.listProblemSubmissions(slug as string, query),
    enabled: Boolean(slug),
    staleTime: 30 * 1000,
  });
}

export function useCodeSubmission(submissionId: string | null | undefined) {
  return useQuery<CodeSubmissionSummary>({
    queryKey: codeLabKeys.submission(submissionId ?? ''),
    queryFn: () => codeLabService.getSubmission(submissionId as string),
    enabled: Boolean(submissionId),
    staleTime: 30 * 1000,
  });
}
