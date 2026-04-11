import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@/types';

// ============================================================
// Roadmap Service — API calls for learning roadmaps
// ============================================================

const API_BASE = '/roadmaps';

export interface RoadmapCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string | null;
  status: string;
  estimatedDurationMinutes: number;
  orderIndex: number;
  isRequired: boolean;
  trainer: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  stats: {
    totalModules: number;
    totalLessons: number;
    totalEnrollments: number;
  };
  userEnrollment?: {
    enrollmentId: string;
    status: string;
    progressPercent: number;
    completedLessonsCount: number;
    enrolledAt: string;
    startedAt: string | null;
    completedAt: string | null;
  };
}

export interface RoadmapListItem {
  id: string;
  title: string;
  description: string;
  targetPosition: string | null;
  isActive: boolean;
  createdAt: string;
  department: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  stats: {
    totalCourses: number;
    requiredCourses: number;
    optionalCourses: number;
    totalEstimatedMinutes: number;
    totalAssignments: number;
  };
}

export interface RoadmapDetail extends RoadmapListItem {
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
  courses: RoadmapCourse[];
  userAssignment?: {
    assignmentId: string;
    status: 'assigned' | 'in_progress' | 'completed' | 'dropped';
    assignedAt: string;
    startedAt: string | null;
    completedAt: string | null;
    droppedAt: string | null;
    assignedBy: {
      id: string;
      fullName: string;
    };
  };
}

export interface RoadmapAssignment {
  id: string;
  userId: string;
  roadmapId: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'dropped';
  assignedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  droppedAt: string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    department: {
      id: string;
      name: string;
    };
  };
  roadmap: {
    id: string;
    title: string;
    description: string;
    targetPosition: string | null;
    isActive: boolean;
    department: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
      slug: string;
    };
    coursesCount?: number;
    stats?: {
      totalCourses?: number;
      totalLessons?: number;
      totalDurationMinutes?: number;
      requiredCourses?: number;
      optionalCourses?: number;
      totalEstimatedMinutes?: number;
      totalAssignments?: number;
    };
  };
  assignedBy: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface RoadmapListParams {
  departmentId?: string;
  categoryId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface RoadmapAssignmentParams {
  userId?: string;
  roadmapId?: string;
  status?: 'assigned' | 'in_progress' | 'completed' | 'dropped';
  departmentId?: string;
  page?: number;
  limit?: number;
}

export const roadmapService = {
  // List roadmaps
  list: async (params?: RoadmapListParams): Promise<PaginatedResponse<RoadmapListItem>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<RoadmapListItem>>>(API_BASE, {
      params,
    });
    return data.data;
  },

  // Get roadmap detail
  getDetail: async (id: string): Promise<RoadmapDetail> => {
    const { data } = await api.get<ApiResponse<RoadmapDetail>>(`${API_BASE}/${id}/detail`);
    return data.data;
  },

  // List assignments
  listAssignments: async (
    params?: RoadmapAssignmentParams,
  ): Promise<PaginatedResponse<RoadmapAssignment>> => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<RoadmapAssignment>>>(
      `${API_BASE}/assignments`,
      { params },
    );
    return data.data;
  },

  // Update assignment status
  updateAssignmentStatus: async (
    assignmentId: string,
    status: 'assigned' | 'in_progress' | 'completed' | 'dropped',
  ): Promise<RoadmapAssignment> => {
    const { data } = await api.patch<ApiResponse<RoadmapAssignment>>(
      `${API_BASE}/assignments/${assignmentId}/status`,
      { status },
    );
    return data.data;
  },
};
