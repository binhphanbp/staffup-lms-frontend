import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionBankService } from '@/services/question-bank.service';
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
