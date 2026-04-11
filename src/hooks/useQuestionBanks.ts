import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionBankService } from '@/services/question-bank.service';

// ============================================================
// Question Bank Hooks
// ============================================================

export function useQuestionBanks(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  ownerTrainerId?: string;
  search?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ['question-banks', params],
    queryFn: () => questionBankService.list(params),
  });
}

export function useQuestionBank(id: string | null) {
  return useQuery({
    queryKey: ['question-bank', id],
    queryFn: () => questionBankService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateQuestionBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionBankService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-banks'] });
    },
  });
}

export function useUpdateQuestionBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; [key: string]: unknown }) =>
      questionBankService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['question-banks'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank', variables.id] });
    },
  });
}

export function useDeleteQuestionBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionBankService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-banks'] });
    },
  });
}

// Questions
export function useQuestions(bankId: string | null, params?: {
  page?: number;
  limit?: number;
  questionType?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ['questions', bankId, params],
    queryFn: () => questionBankService.listQuestions(bankId!, params),
    enabled: !!bankId,
  });
}

export function useQuestion(bankId: string | null, questionId: string | null) {
  return useQuery({
    queryKey: ['question', bankId, questionId],
    queryFn: () => questionBankService.getQuestion(bankId!, questionId!),
    enabled: !!bankId && !!questionId,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bankId, ...payload }: { bankId: string; [key: string]: unknown }) =>
      questionBankService.createQuestion(bankId, payload as any),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions', variables.bankId] });
      queryClient.invalidateQueries({ queryKey: ['question-bank', variables.bankId] });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bankId,
      questionId,
      ...payload
    }: {
      bankId: string;
      questionId: string;
      [key: string]: unknown;
    }) => questionBankService.updateQuestion(bankId, questionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions', variables.bankId] });
      queryClient.invalidateQueries({ queryKey: ['question', variables.bankId, variables.questionId] });
    },
  });
}

export function useDeactivateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bankId, questionId }: { bankId: string; questionId: string }) =>
      questionBankService.deactivateQuestion(bankId, questionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions', variables.bankId] });
    },
  });
}

// Options
export function useCreateOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bankId,
      questionId,
      ...payload
    }: {
      bankId: string;
      questionId: string;
      [key: string]: unknown;
    }) => questionBankService.createOption(bankId, questionId, payload as any),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['question', variables.bankId, variables.questionId] });
    },
  });
}

export function useUpdateOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bankId,
      questionId,
      optionId,
      ...payload
    }: {
      bankId: string;
      questionId: string;
      optionId: string;
      [key: string]: unknown;
    }) => questionBankService.updateOption(bankId, questionId, optionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['question', variables.bankId, variables.questionId] });
    },
  });
}

export function useDeleteOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bankId,
      questionId,
      optionId,
    }: {
      bankId: string;
      questionId: string;
      optionId: string;
    }) => questionBankService.deleteOption(bankId, questionId, optionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['question', variables.bankId, variables.questionId] });
    },
  });
}
