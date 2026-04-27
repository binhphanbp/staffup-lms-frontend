import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type ListPlansParams,
  type ListTemplatesParams,
  onboardingService,
} from '@/services/onboarding.service';
import type {
  AiGenerateTemplateInput,
  AssignPlanInput,
  UpdatePlanInput,
  UpdateTaskStatusInput,
  UpsertTemplateInput,
} from '@/types/onboarding';

export const ONBOARDING_KEYS = {
  all: ['onboarding'] as const,
  templates: () => [...ONBOARDING_KEYS.all, 'templates'] as const,
  templatesList: (params: ListTemplatesParams) =>
    [...ONBOARDING_KEYS.templates(), 'list', params] as const,
  template: (id: string) => [...ONBOARDING_KEYS.templates(), 'detail', id] as const,
  plans: () => [...ONBOARDING_KEYS.all, 'plans'] as const,
  plansList: (params: ListPlansParams) => [...ONBOARDING_KEYS.plans(), 'list', params] as const,
  plan: (id: string) => [...ONBOARDING_KEYS.plans(), 'detail', id] as const,
  myActivePlan: () => [...ONBOARDING_KEYS.plans(), 'me', 'active'] as const,
  assignableUsers: () => [...ONBOARDING_KEYS.all, 'assignable-users'] as const,
};

export function useOnboardingTemplates(params: ListTemplatesParams = {}) {
  return useQuery({
    queryKey: ONBOARDING_KEYS.templatesList(params),
    queryFn: () => onboardingService.listTemplates(params),
  });
}

export function useOnboardingTemplate(id: string | null | undefined) {
  return useQuery({
    queryKey: ONBOARDING_KEYS.template(id ?? ''),
    queryFn: () => onboardingService.getTemplate(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateOnboardingTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpsertTemplateInput) => onboardingService.createTemplate(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.templates() });
    },
  });
}

export function useUpdateOnboardingTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpsertTemplateInput }) =>
      onboardingService.updateTemplate(id, input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.templates() });
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.template(vars.id) });
    },
  });
}

export function useDeleteOnboardingTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => onboardingService.deleteTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.templates() });
    },
  });
}

export function useCloneOnboardingTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => onboardingService.cloneTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.templates() });
    },
  });
}

export function useGenerateOnboardingTemplate() {
  return useMutation({
    mutationFn: (input: AiGenerateTemplateInput) => onboardingService.generateTemplate(input),
  });
}

export function useOnboardingPlans(params: ListPlansParams = {}) {
  return useQuery({
    queryKey: ONBOARDING_KEYS.plansList(params),
    queryFn: () => onboardingService.listPlans(params),
  });
}

export function useOnboardingPlan(id: string | null | undefined) {
  return useQuery({
    queryKey: ONBOARDING_KEYS.plan(id ?? ''),
    queryFn: () => onboardingService.getPlan(id as string),
    enabled: Boolean(id),
  });
}

export function useMyActiveOnboardingPlan() {
  return useQuery({
    queryKey: ONBOARDING_KEYS.myActivePlan(),
    queryFn: () => onboardingService.getMyActivePlan(),
  });
}

export function useAssignOnboardingPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AssignPlanInput) => onboardingService.assignPlan(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.plans() });
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.assignableUsers() });
    },
  });
}

export function useUpdateOnboardingPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePlanInput }) =>
      onboardingService.updatePlan(id, input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.plans() });
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.plan(vars.id) });
    },
  });
}

export function useDeleteOnboardingPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => onboardingService.deletePlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.plans() });
    },
  });
}

export function useUpdateOnboardingTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      taskId,
      input,
    }: {
      planId: string;
      taskId: string;
      input: UpdateTaskStatusInput;
    }) => onboardingService.updateTaskStatus(planId, taskId, input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.plan(vars.planId) });
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.plans() });
      qc.invalidateQueries({ queryKey: ONBOARDING_KEYS.myActivePlan() });
    },
  });
}

export function useAssignableUsers() {
  return useQuery({
    queryKey: ONBOARDING_KEYS.assignableUsers(),
    queryFn: () => onboardingService.listAssignableUsers(),
  });
}
