import api from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type {
  CreateDiscussionReplyPayload,
  CreateDiscussionThreadPayload,
  DiscussionReply,
  DiscussionThread,
  DiscussionThreadDetail,
  ForumThreadListParams,
  ForumThreadListResponse,
} from '@/types/forum';

export const forumService = {
  listThreads: async (
    courseId: string,
    params?: ForumThreadListParams,
  ): Promise<ForumThreadListResponse> => {
    const { data } = await api.get<ApiResponse<ForumThreadListResponse>>(
      `/courses/${courseId}/forum/threads`,
      { params },
    );
    return data.data;
  },

  createThread: async (
    courseId: string,
    payload: CreateDiscussionThreadPayload,
  ): Promise<DiscussionThread> => {
    const { data } = await api.post<ApiResponse<DiscussionThread>>(
      `/courses/${courseId}/forum/threads`,
      payload,
    );
    return data.data;
  },

  getThread: async (threadId: string): Promise<DiscussionThreadDetail> => {
    const { data } = await api.get<ApiResponse<DiscussionThreadDetail>>(
      `/forum/threads/${threadId}`,
    );
    return data.data;
  },

  updateThread: async (
    threadId: string,
    payload: Partial<CreateDiscussionThreadPayload>,
  ): Promise<DiscussionThread> => {
    const { data } = await api.patch<ApiResponse<DiscussionThread>>(
      `/forum/threads/${threadId}`,
      payload,
    );
    return data.data;
  },

  deleteThread: async (threadId: string): Promise<void> => {
    await api.delete(`/forum/threads/${threadId}`);
  },

  togglePin: async (threadId: string): Promise<DiscussionThread> => {
    const { data } = await api.post<ApiResponse<DiscussionThread>>(
      `/forum/threads/${threadId}/pin`,
    );
    return data.data;
  },

  toggleLock: async (threadId: string): Promise<DiscussionThread> => {
    const { data } = await api.post<ApiResponse<DiscussionThread>>(
      `/forum/threads/${threadId}/lock`,
    );
    return data.data;
  },

  toggleResolve: async (threadId: string): Promise<DiscussionThread> => {
    const { data } = await api.post<ApiResponse<DiscussionThread>>(
      `/forum/threads/${threadId}/resolve`,
    );
    return data.data;
  },

  createReply: async (
    threadId: string,
    payload: CreateDiscussionReplyPayload,
  ): Promise<DiscussionReply> => {
    const { data } = await api.post<ApiResponse<DiscussionReply>>(
      `/forum/threads/${threadId}/replies`,
      payload,
    );
    return data.data;
  },

  updateReply: async (
    replyId: string,
    payload: Pick<CreateDiscussionReplyPayload, 'body'>,
  ): Promise<DiscussionReply> => {
    const { data } = await api.patch<ApiResponse<DiscussionReply>>(
      `/forum/replies/${replyId}`,
      payload,
    );
    return data.data;
  },

  deleteReply: async (replyId: string): Promise<void> => {
    await api.delete(`/forum/replies/${replyId}`);
  },

  toggleAcceptedReply: async (replyId: string): Promise<DiscussionReply> => {
    const { data } = await api.post<ApiResponse<DiscussionReply>>(
      `/forum/replies/${replyId}/accept`,
    );
    return data.data;
  },
};
