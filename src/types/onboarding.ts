export type OnboardingTaskCategory =
  | 'learning'
  | 'admin'
  | 'meeting'
  | 'practice'
  | 'review'
  | 'other';

export type OnboardingTaskPriority = 'low' | 'medium' | 'high';
export type OnboardingTaskStatus = 'pending' | 'in_progress' | 'done' | 'skipped';
export type OnboardingPlanStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface OnboardingTaskDto {
  id: string;
  title: string;
  description: string | null;
  category: OnboardingTaskCategory;
  priority: OnboardingTaskPriority;
  estimatedHours: number;
  orderIndex: number;
  courseId: string | null;
  courseTitle: string | null;
  resourceUrl: string | null;
  status: OnboardingTaskStatus;
  completedAt: string | null;
  completedById: string | null;
  completedByName: string | null;
  managerNote: string | null;
}

export interface OnboardingStageDto {
  id: string;
  name: string;
  description: string | null;
  orderIndex: number;
  startOffsetDays: number;
  endOffsetDays: number;
  tasks: OnboardingTaskDto[];
}

export interface OnboardingTemplateSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  targetPosition: string | null;
  departmentId: string | null;
  departmentName: string | null;
  totalDays: number;
  isActive: boolean;
  isSystem: boolean;
  createdById: string | null;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  stageCount: number;
  planCount: number;
}

export interface OnboardingTemplateDetail extends OnboardingTemplateSummary {
  stages: OnboardingStageDto[];
}

export interface OnboardingPlanSummary {
  id: string;
  templateId: string | null;
  templateName: string;
  assigneeId: string;
  assigneeName: string;
  assigneePosition: string | null;
  assigneeAvatarUrl: string | null;
  managerId: string;
  managerName: string;
  startDate: string;
  status: OnboardingPlanStatus;
  notes: string | null;
  totalDays: number;
  totalTaskCount: number;
  completedTaskCount: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingPlanDetail extends OnboardingPlanSummary {
  stages: OnboardingStageDto[];
}

export interface AiTaskSuggestion {
  title: string;
  description: string;
  category: OnboardingTaskCategory;
  priority: OnboardingTaskPriority;
  estimatedHours: number;
}

export interface AiStageSuggestion {
  name: string;
  description: string;
  startOffsetDays: number;
  endOffsetDays: number;
  tasks: AiTaskSuggestion[];
}

export interface AiTemplateSuggestion {
  name: string;
  description: string;
  totalDays: number;
  stages: AiStageSuggestion[];
}

export interface AssignableUser {
  id: string;
  fullName: string;
  email: string;
  positionTitle: string | null;
  avatarUrl: string | null;
  departmentName: string | null;
  activePlanId: string | null;
}

export interface ListAssignableUsersResponse {
  users: AssignableUser[];
}

export interface UpsertTaskInput {
  id?: string;
  title: string;
  description?: string | null;
  category?: OnboardingTaskCategory;
  priority?: OnboardingTaskPriority;
  estimatedHours?: number;
  courseId?: string | null;
  resourceUrl?: string | null;
}

export interface UpsertStageInput {
  id?: string;
  name: string;
  description?: string | null;
  startOffsetDays: number;
  endOffsetDays: number;
  tasks: UpsertTaskInput[];
}

export interface UpsertTemplateInput {
  name: string;
  description?: string;
  targetPosition?: string | null;
  departmentId?: string | null;
  totalDays?: number;
  isActive?: boolean;
  stages: UpsertStageInput[];
}

export interface AiGenerateTemplateInput {
  targetPosition: string;
  departmentName?: string | null;
  totalDays?: number;
  toneHint?: string | null;
  extraNotes?: string | null;
}

export interface AssignPlanInput {
  templateId: string;
  assigneeId: string;
  startDate: string;
  notes?: string | null;
}

export interface UpdatePlanInput {
  startDate?: string;
  status?: OnboardingPlanStatus;
  notes?: string | null;
}

export interface UpdateTaskStatusInput {
  status: OnboardingTaskStatus;
  managerNote?: string | null;
}
