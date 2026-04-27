import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { forumService } from '@/services/forum.service';
import type {
  CreateDiscussionReplyPayload,
  CreateDiscussionThreadPayload,
  ForumThreadListParams,
} from '@/types/forum';

export const FORUM_THREADS_QUERY_KEY = 'forum-threads';
export const FORUM_THREAD_QUERY_KEY = 'forum-thread';

export function useForumThreads(
  courseId: string | null | undefined,
  params: ForumThreadListParams,
) {
  return useQuery({
    queryKey: [FORUM_THREADS_QUERY_KEY, courseId, params],
    queryFn: () => forumService.listThreads(courseId!, params),
    enabled: !!courseId,
  });
}

export function useForumThread(threadId: string | null | undefined) {
  return useQuery({
    queryKey: [FORUM_THREAD_QUERY_KEY, threadId],
    queryFn: () => forumService.getThread(threadId!),
    enabled: !!threadId,
  });
}

export function useCreateForumThread(courseId: string | null | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDiscussionThreadPayload) =>
      forumService.createThread(courseId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FORUM_THREADS_QUERY_KEY, courseId] });
    },
  });
}

export function useForumThreadModeration(
  courseId: string | null | undefined,
  threadId?: string | null,
) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [FORUM_THREADS_QUERY_KEY, courseId] });
    if (threadId) {
      queryClient.invalidateQueries({ queryKey: [FORUM_THREAD_QUERY_KEY, threadId] });
    }
  };

  return useMutation({
    mutationFn: ({ action, id }: { action: 'pin' | 'lock' | 'resolve'; id: string }) => {
      if (action === 'pin') return forumService.togglePin(id);
      if (action === 'lock') return forumService.toggleLock(id);
      return forumService.toggleResolve(id);
    },
    onSuccess: invalidate,
  });
}

export function useCreateForumReply(
  courseId: string | null | undefined,
  threadId: string | null | undefined,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDiscussionReplyPayload) =>
      forumService.createReply(threadId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FORUM_THREADS_QUERY_KEY, courseId] });
      queryClient.invalidateQueries({ queryKey: [FORUM_THREAD_QUERY_KEY, threadId] });
    },
  });
}

export function useAcceptForumReply(
  courseId: string | null | undefined,
  threadId: string | null | undefined,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (replyId: string) => forumService.toggleAcceptedReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FORUM_THREADS_QUERY_KEY, courseId] });
      queryClient.invalidateQueries({ queryKey: [FORUM_THREAD_QUERY_KEY, threadId] });
    },
  });
}
