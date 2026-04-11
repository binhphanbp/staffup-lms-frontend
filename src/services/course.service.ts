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
    
    const courseDetail = data.data;
    
    // If expand includes 'all' or 'modules', fetch modules with lessons
    if (expand === 'all' || expand === 'modules') {
      try {
        // Fetch modules
        const modulesResponse = await api.get<ApiResponse<CourseModuleItem[]>>(
          `${API_BASE}/${id}/modules`,
        );
        const modules = modulesResponse.data.data;
        
        // Fetch lessons for each module
        const modulesWithLessons = await Promise.all(
          modules.map(async (module) => {
            try {
              const lessonsResponse = await api.get<ApiResponse<any[]>>(
                `${API_BASE}/${id}/modules/${module.id}/lessons`,
              );
              return {
                ...module,
                lessons: lessonsResponse.data.data,
              };
            } catch (error) {
              console.error(`Error fetching lessons for module ${module.id}:`, error);
              return {
                ...module,
                lessons: [],
              };
            }
          })
        );
        
        courseDetail.modules = modulesWithLessons;
      } catch (error) {
        console.error('Error fetching modules:', error);
        courseDetail.modules = [];
      }
    }
    
    return courseDetail;
  },

  // ----- Modules -----

  listModules: async (courseId: string): Promise<CourseModuleItem[]> => {
    const { data } = await api.get<ApiResponse<CourseModuleItem[]>>(
      `${API_BASE}/${courseId}/modules`,
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
};
