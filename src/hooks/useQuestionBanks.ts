import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  questionBankService,
  type GenerateAiQuestionsPayload,
  type AiDraftQuestion,
} from '@/services/question-bank.service';
import type { QuestionBankListParams } from '@/types';

export function useQuestionBanks(params?: QuestionBankListParams) {
  return useQuery({
    queryKey: ['question-banks', params],
    queryFn: () => questionBankService.list(params),
  });
}

export function useQuestionBankDetail(id: string | null) {
  return useQuery({
    queryKey: ['question-bank', id],
    queryFn: () => questionBankService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateQuestionBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      questionBankService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-banks'] });
    },
  });
}

export function useUpdateQuestionBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name?: string; description?: string };
    }) => questionBankService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-banks'] });
    },
  });
}

export function useDeleteQuestionBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionBankService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-banks'] });
    },
  });
}

export function useQuestionBankQuestions(bankId: string | null) {
  return useQuery({
    queryKey: ['question-bank-questions', bankId],
    queryFn: () => questionBankService.listQuestions(bankId!),
    enabled: !!bankId,
  });
}

export function useGenerateAiQuestions() {
  return useMutation({
    mutationFn: ({ bankId, payload }: { bankId: string; payload: GenerateAiQuestionsPayload }) =>
      questionBankService.generateAiQuestions(bankId, payload),
  });
}

export function useSaveAiQuestions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bankId, questions }: { bankId: string; questions: AiDraftQuestion[] }) =>
      questionBankService.saveAiQuestions(bankId, { questions }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['question-banks'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank', variables.bankId] });
      queryClient.invalidateQueries({ queryKey: ['question-bank-questions', variables.bankId] });
    },
  });
}
