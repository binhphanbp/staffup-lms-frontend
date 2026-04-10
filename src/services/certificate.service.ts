import api from '@/lib/axios';
import type { ApiResponse, CertificateResponse, CertificateListResponse } from '@/types';

// ============================================================
// Certificate Service — list and view certificates
// ============================================================

const API_BASE = '/certificates';

export interface CertificateListParams {
  page?: number;
  limit?: number;
}

export const certificateService = {
  list: async (params?: CertificateListParams): Promise<CertificateListResponse> => {
    const { data } = await api.get<ApiResponse<CertificateListResponse>>(API_BASE, {
      params,
    });
    return data.data;
  },

  getById: async (id: string): Promise<CertificateResponse> => {
    const { data } = await api.get<ApiResponse<CertificateResponse>>(`${API_BASE}/${id}`);
    return data.data;
  },

  getByEnrollment: async (enrollmentId: string): Promise<CertificateResponse> => {
    const { data } = await api.get<ApiResponse<CertificateResponse>>(
      `${API_BASE}/enrollment/${enrollmentId}`,
    );
    return data.data;
  },
};
