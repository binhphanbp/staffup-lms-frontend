import api from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type {
  AiGenerateTemplateInput,
  AiTemplateSuggestion,
  AssignPlanInput,
  ListAssignableUsersResponse,
  OnboardingPlanDetail,
  OnboardingPlanStatus,
  OnboardingPlanSummary,
  OnboardingTemplateDetail,
  OnboardingTemplateSummary,
  UpdatePlanInput,
  UpdateTaskStatusInput,
  UpsertTemplateInput,
} from '@/types/onboarding';

export interface ListTemplatesParams {
  isActive?: boolean;
  departmentId?: string;
  search?: string;
}

export interface ListPlansParams {
  status?: OnboardingPlanStatus;
  scope?: 'mine' | 'team';
  assigneeId?: string;
  managerId?: string;
}

export const onboardingService = {
  listTemplates: async (params: ListTemplatesParams = {}): Promise<OnboardingTemplateSummary[]> => {
    const search: Record<string, string> = {};
    if (params.isActive !== undefined) search.isActive = String(params.isActive);
    if (params.departmentId) search.departmentId = params.departmentId;
    if (params.search) search.search = params.search;
    const { data } = await api.get<ApiResponse<OnboardingTemplateSummary[]>>(
      '/onboarding/templates',
      { params: search },
    );
    return data.data;
  },

  getTemplate: async (id: string): Promise<OnboardingTemplateDetail> => {
    const { data } = await api.get<ApiResponse<OnboardingTemplateDetail>>(
      `/onboarding/templates/${id}`,
    );
    return data.data;
  },

  createTemplate: async (input: UpsertTemplateInput): Promise<OnboardingTemplateDetail> => {
    const { data } = await api.post<ApiResponse<OnboardingTemplateDetail>>(
      '/onboarding/templates',
      input,
    );
    return data.data;
  },

  updateTemplate: async (
    id: string,
    input: UpsertTemplateInput,
  ): Promise<OnboardingTemplateDetail> => {
    const { data } = await api.put<ApiResponse<OnboardingTemplateDetail>>(
      `/onboarding/templates/${id}`,
      input,
    );
    return data.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/onboarding/templates/${id}`);
  },

  cloneTemplate: async (id: string): Promise<OnboardingTemplateDetail> => {
    const { data } = await api.post<ApiResponse<OnboardingTemplateDetail>>(
      `/onboarding/templates/${id}/clone`,
    );
    return data.data;
  },

  generateTemplate: async (input: AiGenerateTemplateInput): Promise<AiTemplateSuggestion> => {
    const { data } = await api.post<ApiResponse<AiTemplateSuggestion>>(
      '/onboarding/templates/ai-generate',
      input,
    );
    return data.data;
  },

  listPlans: async (params: ListPlansParams = {}): Promise<OnboardingPlanSummary[]> => {
    const { data } = await api.get<ApiResponse<OnboardingPlanSummary[]>>('/onboarding/plans', {
      params,
    });
    return data.data;
  },

  getMyActivePlan: async (): Promise<OnboardingPlanDetail | null> => {
    const { data } = await api.get<ApiResponse<OnboardingPlanDetail | null>>(
      '/onboarding/plans/me/active',
    );
    return data.data;
  },

  getPlan: async (id: string): Promise<OnboardingPlanDetail> => {
    const { data } = await api.get<ApiResponse<OnboardingPlanDetail>>(`/onboarding/plans/${id}`);
    return data.data;
  },

  assignPlan: async (input: AssignPlanInput): Promise<OnboardingPlanDetail> => {
    const { data } = await api.post<ApiResponse<OnboardingPlanDetail>>(
      '/onboarding/plans/assign',
      input,
    );
    return data.data;
  },

  updatePlan: async (id: string, input: UpdatePlanInput): Promise<OnboardingPlanDetail> => {
    const { data } = await api.patch<ApiResponse<OnboardingPlanDetail>>(
      `/onboarding/plans/${id}`,
      input,
    );
    return data.data;
  },

  deletePlan: async (id: string): Promise<void> => {
    await api.delete(`/onboarding/plans/${id}`);
  },

  updateTaskStatus: async (
    planId: string,
    taskId: string,
    input: UpdateTaskStatusInput,
  ): Promise<OnboardingPlanDetail> => {
    const { data } = await api.patch<ApiResponse<OnboardingPlanDetail>>(
      `/onboarding/plans/${planId}/tasks/${taskId}/status`,
      input,
    );
    return data.data;
  },

  listAssignableUsers: async (): Promise<ListAssignableUsersResponse> => {
    const { data } = await api.get<ApiResponse<ListAssignableUsersResponse>>(
      '/onboarding/assignable-users',
    );
    return data.data;
  },
};
