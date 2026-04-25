import api from '@/lib/axios';
import type {
  ApiResponse,
  RoadmapDetail,
  RoadmapAssignment,
  RoadmapAssignmentListParams,
} from '@/types';

// ============================================================
// Roadmap Service — roadmaps & assignments
// ============================================================

const API_BASE = '/roadmaps';

interface RoadmapAssignmentsResponse {
  assignments: RoadmapAssignment[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface RoadmapListResponse {
  roadmaps: RoadmapDetail[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface RoadmapListParams {
  search?: string;
  departmentId?: string;
  categoryId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const roadmapService = {
  list: async (params?: RoadmapListParams): Promise<RoadmapListResponse> => {
    const { data } = await api.get<ApiResponse<RoadmapListResponse>>(API_BASE, { params });
    return data.data;
  },

  getDetail: async (id: string): Promise<RoadmapDetail> => {
    const { data } = await api.get<ApiResponse<RoadmapDetail>>(`${API_BASE}/${id}`);
    return data.data;
  },

  getAssignments: async (
    params?: RoadmapAssignmentListParams,
  ): Promise<RoadmapAssignmentsResponse> => {
    const { data } = await api.get<ApiResponse<RoadmapAssignmentsResponse>>(
      `${API_BASE}/assignments`,
      { params },
    );
    return data.data;
  },

  updateAssignmentStatus: async (
    assignmentId: string,
    status: string,
  ): Promise<RoadmapAssignment> => {
    const { data } = await api.patch<ApiResponse<RoadmapAssignment>>(
      `${API_BASE}/assignments/${assignmentId}/status`,
      { status },
    );
    return data.data;
  },
};
