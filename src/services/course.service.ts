import api from '@/lib/axios';
import type {
  ApiResponse,
  CourseListItem,
  CourseDetailResponse,
  CourseListParams,
  CourseModuleItem,
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

  getById: async (id: string): Promise<CourseDetailResponse> => {
    const { data } = await api.get<ApiResponse<CourseDetailResponse>>(`${API_BASE}/${id}`);
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
    const { data } = await api.get<ApiResponse<CourseModuleItem[]>>(`${API_BASE}/${courseId}/modules`);
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
};
