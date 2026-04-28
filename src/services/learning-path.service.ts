import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export type NodeStatus = 'exempt' | 'available' | 'locked';

export interface CurriculumNode {
  id: string;
  title: string;
  category: string;
  estimatedHours: number;
  description: string;
}

export interface CurriculumEdge {
  id: number;
  fromId: string;
  toId: string;
}

export interface ClassifiedNode extends CurriculumNode {
  status: NodeStatus;
  unmetPrereqs: string[];
  layer: number;
}

export interface PreviewResult {
  totalLessons: number;
  exempted: ClassifiedNode[];
  available: ClassifiedNode[];
  locked: ClassifiedNode[];
  toLearnInOrder: ClassifiedNode[];
  prunedPercent: number;
  classified: Record<string, ClassifiedNode>;
}

export interface EmployeeSnapshot {
  fullName: string;
  position: string;
  department: string;
  startDate?: string;
  testScore?: number;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  metadata: {
    employeeName: string;
    totalLessons: number;
    exemptedCount: number;
    toLearnCount: number;
    prunedPercent: number;
  };
}

export interface EmployeeListItem {
  id: string;
  fullName: string;
  email: string;
  position: string;
  avatarUrl: string | null;
  department: { id: string; name: string } | null;
}

export const learningPathService = {
  async getGraph(): Promise<{ nodes: CurriculumNode[]; edges: CurriculumEdge[] }> {
    const res =
      await api.get<ApiResponse<{ nodes: CurriculumNode[]; edges: CurriculumEdge[] }>>(
        '/learning-path/graph',
      );
    return res.data.data;
  },

  async listEmployees(): Promise<EmployeeListItem[]> {
    const res = await api.get<ApiResponse<EmployeeListItem[]>>('/learning-path/users');
    return res.data.data;
  },

  async preview(input: { userId?: number; passedNodeIds?: string[] }): Promise<PreviewResult> {
    const res = await api.post<ApiResponse<PreviewResult>>('/learning-path/preview', input);
    return res.data.data;
  },

  async generateEmail(input: {
    userId?: number;
    employee?: EmployeeSnapshot;
    passedNodeIds?: string[];
  }): Promise<{ email: GeneratedEmail; preview: PreviewResult }> {
    const res = await api.post<ApiResponse<{ email: GeneratedEmail; preview: PreviewResult }>>(
      '/learning-path/generate-email',
      input,
    );
    return res.data.data;
  },

  async addEdge(fromId: string, toId: string): Promise<CurriculumEdge> {
    const res = await api.post<ApiResponse<CurriculumEdge>>('/learning-path/edges', {
      fromId,
      toId,
    });
    return res.data.data;
  },

  async removeEdge(edgeId: number): Promise<void> {
    await api.delete(`/learning-path/edges/${edgeId}`);
  },

  async setTestResults(userId: number, nodeIds: string[]): Promise<void> {
    await api.post('/learning-path/test-results', { userId, nodeIds });
  },
};
