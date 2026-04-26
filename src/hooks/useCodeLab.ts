import { useMutation } from '@tanstack/react-query';
import {
  codeLabService,
  type EvaluateCodePayload,
  type CodeLabEvaluationResult,
} from '@/services/code-lab.service';

export function useEvaluateCode() {
  return useMutation<CodeLabEvaluationResult, Error, EvaluateCodePayload>({
    mutationFn: (payload) => codeLabService.evaluate(payload),
  });
}
