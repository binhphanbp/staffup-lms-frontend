import api from '@/lib/axios';

// ============================================================
// Company Document API Service — Admin CRUD + Indexing
// ============================================================

const API_BASE = '/company-documents';

// ----- Types -----

export interface CompanyDocument {
  id: string;
  title: string;
  content?: string;
  category: string | null;
  isActive: boolean;
  uploadedById: string;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDocumentListResponse {
  data: Omit<CompanyDocument, 'content'>[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateDocumentInput {
  title: string;
  content: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
  category?: string | null;
  isActive?: boolean;
}

export interface CompanyDocumentListParams {
  search?: string;
  category?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ----- API Methods -----

export const companyDocumentApi = {
  getDocuments: async (
    params?: CompanyDocumentListParams,
  ): Promise<CompanyDocumentListResponse> => {
    const { data } = await api.get<ApiResponse<CompanyDocumentListResponse>>(API_BASE, { params });
    return data.data;
  },

  getDocumentById: async (id: string): Promise<CompanyDocument> => {
    const { data } = await api.get<ApiResponse<CompanyDocument>>(`${API_BASE}/${id}`);
    return data.data;
  },

  createDocument: async (input: CreateDocumentInput): Promise<CompanyDocument> => {
    const { data } = await api.post<ApiResponse<CompanyDocument>>(API_BASE, input);
    return data.data;
  },

  updateDocument: async (id: string, input: UpdateDocumentInput): Promise<CompanyDocument> => {
    const { data } = await api.patch<ApiResponse<CompanyDocument>>(`${API_BASE}/${id}`, input);
    return data.data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get<ApiResponse<string[]>>(`${API_BASE}/categories`);
    return data.data;
  },

  // Indexing (via ai-chat admin endpoints)
  indexDocument: async (id: string): Promise<{ documentId: string; chunks: number }> => {
    const { data } = await api.post<ApiResponse<{ documentId: string; chunks: number }>>(
      `/ai-chat/admin/index/${id}`,
    );
    return data.data;
  },

  indexAllDocuments: async (): Promise<{ indexed: number; totalChunks: number }> => {
    const { data } = await api.post<ApiResponse<{ indexed: number; totalChunks: number }>>(
      '/ai-chat/admin/index-all',
    );
    return data.data;
  },
};
