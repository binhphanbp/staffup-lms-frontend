import api from '@/lib/axios';
import type {
  ApiResponse,
  CourseListItem,
  CourseDetailResponse,
  CourseListParams,
  CourseModuleItem,
  LessonDetail,
  PaginatedResponse,
  LessonResource,
} from '@/types';

// ============================================================
// Course Service — API calls for courses, modules, lessons
// ============================================================

const API_BASE = '/courses';

export const courseService = {
  // ----- Courses -----

  list: async (params?: CourseListParams): Promise<PaginatedResponse<CourseListItem>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<CourseListItem>>>(API_BASE, {
      params,
    });
    return data.data;
  },

  getById: async (id: string, expand?: string): Promise<CourseDetailResponse> => {
    const { data } = await api.get<ApiResponse<CourseDetailResponse>>(`${API_BASE}/${id}`, {
      params: expand ? { expand } : undefined,
    });
    return data.data;
  },

  getDetail: async (id: string, expand?: string): Promise<CourseDetailResponse> => {
    const { data } = await api.get<ApiResponse<CourseDetailResponse>>(`${API_BASE}/${id}/detail`, {
      params: expand ? { expand } : undefined,
    });
    return data.data;
  },

  // ----- Modules -----

  listModules: async (courseId: string): Promise<CourseModuleItem[]> => {
    const { data } = await api.get<ApiResponse<CourseModuleItem[]>>(
      `${API_BASE}/${courseId}/modules`,
    );
    return data.data;
  },

  listLessonsForModule: async (courseId: string, moduleId: string): Promise<LessonDetail[]> => {
    const { data } = await api.get<ApiResponse<LessonDetail[]>>(
      `${API_BASE}/${courseId}/modules/${moduleId}/lessons`,
    );
    return data.data;
  },

  // ----- Lesson Resources -----

  listLessonResources: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
  ): Promise<LessonResource[]> => {
    const { data } = await api.get<ApiResponse<LessonResource[]>>(
      `${API_BASE}/${courseId}/modules/${moduleId}/lessons/${lessonId}/resources`,
    );
    return data.data;
  },

  // ----- CRUD -----

  create: async (payload: Record<string, unknown>): Promise<CourseDetailResponse> => {
    const { data } = await api.post<ApiResponse<CourseDetailResponse>>(API_BASE, payload);
    return data.data;
  },

  update: async (id: string, payload: Record<string, unknown>): Promise<CourseDetailResponse> => {
    const { data } = await api.patch<ApiResponse<CourseDetailResponse>>(
      `${API_BASE}/${id}`,
      payload,
    );
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<void> => {
    await api.patch(`${API_BASE}/${id}/status`, { status });
  },

  // ----- AI Course Authoring -----

  generateOutline: async (
    payload: GenerateCourseOutlinePayload,
  ): Promise<GenerateCourseOutlineResult> => {
    const { data } = await api.post<ApiResponse<GenerateCourseOutlineResult>>(
      `${API_BASE}/ai/generate-outline`,
      payload,
    );
    return data.data;
  },

  generateLessonContent: async (
    payload: GenerateLessonContentPayload,
  ): Promise<GenerateLessonContentResult> => {
    const { data } = await api.post<ApiResponse<GenerateLessonContentResult>>(
      `${API_BASE}/ai/generate-lesson-content`,
      payload,
    );
    return data.data;
  },

  saveCourseFromOutline: async (
    payload: SaveCourseFromOutlinePayload,
  ): Promise<SaveCourseFromOutlineResult> => {
    const { data } = await api.post<ApiResponse<SaveCourseFromOutlineResult>>(
      `${API_BASE}/ai/save-from-outline`,
      payload,
    );
    return data.data;
  },
};

// ============================================================
// AI Course Authoring — types
// ============================================================

export type AiCourseLessonType = 'article' | 'video' | 'quiz';
export type AiCourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
export type AiLanguage = 'vi' | 'en';
export type AiLengthHint = 'short' | 'medium' | 'long';

export interface GenerateCourseOutlinePayload {
  topic: string;
  description?: string;
  audience?: string;
  level?: AiCourseLevel;
  moduleCount?: number;
  lessonsPerModule?: number;
  sourceContent?: string;
  language?: AiLanguage;
}

export interface AiDraftLesson {
  tempId: string;
  title: string;
  description: string;
  lessonType: AiCourseLessonType;
  estimatedDurationMinutes: number;
}

export interface AiDraftModule {
  tempId: string;
  title: string;
  description: string;
  lessons: AiDraftLesson[];
}

export interface AiDraftCourseMeta {
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  learningObjectives: string[];
}

export interface GenerateCourseOutlineResult {
  course: AiDraftCourseMeta;
  modules: AiDraftModule[];
  model: string;
  generatedAt: string;
}

export interface GenerateLessonContentPayload {
  courseTitle: string;
  courseDescription?: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonDescription?: string;
  sourceContent?: string;
  language?: AiLanguage;
  lengthHint?: AiLengthHint;
}

export interface GenerateLessonContentResult {
  content: string;
  model: string;
  generatedAt: string;
}

export interface SaveCourseFromOutlinePayload {
  course: {
    title: string;
    description?: string;
    estimatedDurationMinutes?: number;
    categoryId?: string;
    ownerDepartmentId?: string;
    thumbnailUrl?: string;
  };
  modules: {
    title: string;
    description?: string;
    lessons: {
      title: string;
      description?: string;
      lessonType: AiCourseLessonType;
      contentText?: string | null;
      estimatedDurationMinutes?: number;
    }[];
  }[];
}

export interface SaveCourseFromOutlineResult {
  course: {
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: string;
  };
  moduleCount: number;
  lessonCount: number;
}
