import type { PaginatedResponse } from '@/types';

export type ForumStatusFilter = 'open' | 'resolved';
export type ForumSort = 'recent' | 'popular';

export interface DiscussionAuthor {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface DiscussionLesson {
  id: string;
  title: string;
}

export interface DiscussionThread {
  id: string;
  courseId: string;
  lessonId: string | null;
  authorId: string;
  title: string;
  body: string;
  excerpt: string;
  isPinned: boolean;
  isLocked: boolean;
  isResolved: boolean;
  viewCount: number;
  replyCount: number;
  lastReplyAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: DiscussionAuthor;
  lesson: DiscussionLesson | null;
}

export interface DiscussionReply {
  id: string;
  threadId: string;
  authorId: string;
  parentReplyId: string | null;
  body: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  author: DiscussionAuthor;
  childReplies: DiscussionReply[];
}

export interface DiscussionThreadDetail extends DiscussionThread {
  replies: DiscussionReply[];
}

export interface ForumThreadListParams {
  lessonId?: string;
  status?: ForumStatusFilter;
  sort?: ForumSort;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateDiscussionThreadPayload {
  title: string;
  body: string;
  lessonId?: string;
}

export interface CreateDiscussionReplyPayload {
  body: string;
  parentReplyId?: string;
}

export type ForumThreadListResponse = PaginatedResponse<DiscussionThread>;
