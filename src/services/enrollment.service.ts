import api from '@/lib/axios';
import type {
  ApiResponse,
  EnrollmentListItem,
  EnrollmentDetailResponse,
  EnrollmentProgressResponse,
  LessonProgressUpdate,
  PaginatedResponse,
} from '@/types';

// ============================================================
// Enrollment Service — enrollment, progress tracking
// ============================================================

const API_BASE = '/enrollments';

export interface EnrollmentListParams {
  status?: string;
  courseId?: string;
  userId?: string;
  departmentId?: string;
  overdue?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const enrollmentService = {
  // ----- Enrollments -----

  list: async (params?: EnrollmentListParams): Promise<PaginatedResponse<EnrollmentListItem>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<EnrollmentListItem>>>(API_BASE, {
      params,
    });
    return data.data;
  },

  getDetail: async (id: string): Promise<EnrollmentDetailResponse> => {
    const { data } = await api.get<ApiResponse<EnrollmentDetailResponse>>(
      `${API_BASE}/${id}/detail`,
    );
    return data.data;
  },

  enroll: async (courseId: string, userIds: string[]): Promise<{ enrolled: number }> => {
    const { data } = await api.post<ApiResponse<{ enrolled: number }>>(
      `${API_BASE}/courses/${courseId}/enroll`,
      { userIds },
    );
    return data.data;
  },

  updateStatus: async (id: string, status: string): Promise<void> => {
    await api.patch(`${API_BASE}/${id}/status`, { status });
  },

  // ----- Lesson Progress -----

  getProgress: async (enrollmentId: string): Promise<EnrollmentProgressResponse> => {
    const { data } = await api.get<ApiResponse<EnrollmentProgressResponse>>(
      `${API_BASE}/${enrollmentId}/progress`,
    );
    return data.data;
  },

  startLesson: async (enrollmentId: string, lessonId: string): Promise<void> => {
    await api.post(`${API_BASE}/${enrollmentId}/lessons/${lessonId}/start`);
  },

  updateLessonProgress: async (
    enrollmentId: string,
    lessonId: string,
    payload: LessonProgressUpdate,
  ): Promise<void> => {
    await api.patch(`${API_BASE}/${enrollmentId}/lessons/${lessonId}/progress`, payload);
  },

  completeLesson: async (enrollmentId: string, lessonId: string): Promise<void> => {
    await api.post(`${API_BASE}/${enrollmentId}/lessons/${lessonId}/complete`);
  },
};
