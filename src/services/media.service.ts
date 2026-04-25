import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export interface MediaListItem {
  assetId: string;
  publicId: string;
  version: number;
  width: number | null;
  height: number | null;
  format: string | null;
  resourceType: string;
  bytes: number;
  duration: number | null;
  createdAt: string | null;
  secureUrl: string;
  playbackUrl: string;
  folder: string | null;
  originalFilename: string | null;
}

export interface MediaListResponse {
  items: MediaListItem[];
  nextCursor: string | null;
  folder: string;
  resourceType: 'image' | 'video' | 'raw';
}

export interface MediaFolderItem {
  name: string;
  path: string;
}

export interface MediaFolderListResponse {
  items: MediaFolderItem[];
  nextCursor: string | null;
  path: string | null;
}

export const mediaService = {
  listByFolder: async (params: {
    folder: string;
    resourceType?: 'image' | 'video' | 'raw';
    maxResults?: number;
    nextCursor?: string;
  }) => {
    const { data } = await api.get<ApiResponse<MediaListResponse>>('/media', {
      params,
    });

    return data.data;
  },

  listFolders: async (params?: { path?: string; maxResults?: number; nextCursor?: string }) => {
    const { data } = await api.get<ApiResponse<MediaFolderListResponse>>('/media/folders', {
      params,
    });

    return data.data;
  },
};
