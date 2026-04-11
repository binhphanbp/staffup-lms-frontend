import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

// ============================================================
// Certificate Service — API calls for certificates
// ============================================================

const API_BASE = '/certificates';

export interface Certificate {
  id: string;
  enrollmentId: string;
  courseId: string;
  userId: string;
  issueDate: string;
  certificateNumber: string;
  course: {
    id: string;
    title: string;
    slug: string;
  };
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  trainer: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface CertificateListParams {
  userId?: string;
  courseId?: string;
  page?: number;
  limit?: number;
}

export const certificateService = {
  // List certificates
  list: async (params?: CertificateListParams): Promise<{ data: Certificate[]; meta: any }> => {
    const { data } = await api.get<ApiResponse<{ data: Certificate[]; meta: any }>>(API_BASE, {
      params,
    });
    return data.data;
  },

  // Get certificate detail
  getDetail: async (id: string): Promise<Certificate> => {
    const { data } = await api.get<ApiResponse<Certificate>>(`${API_BASE}/${id}`);
    return data.data;
  },

  // Issue certificate for completed enrollment
  issue: async (enrollmentId: string): Promise<Certificate> => {
    const { data } = await api.post<ApiResponse<Certificate>>(
      `${API_BASE}/issue/${enrollmentId}`,
    );
    return data.data;
  },

  // Download certificate PDF
  downloadPdf: async (id: string): Promise<Blob> => {
    const { data } = await api.get(`${API_BASE}/${id}/download`, {
      responseType: 'blob',
    });
    return data;
  },

  // Verify certificate
  verify: async (certificateNumber: string): Promise<Certificate> => {
    const { data } = await api.get<ApiResponse<Certificate>>(
      `${API_BASE}/verify/${certificateNumber}`,
    );
    return data.data;
  },
};
