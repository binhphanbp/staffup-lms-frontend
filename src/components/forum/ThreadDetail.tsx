import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, Pin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAcceptForumReply,
  useCreateForumReply,
  useForumThread,
  useForumThreadModeration,
} from '@/hooks/useForumThreads';
import { toast } from '@/lib/toast';
import { useAuthStore } from '@/store/useAuthStore';
import type { DiscussionReply, DiscussionThread } from '@/types/forum';
import { ReplyItem } from './ReplyItem';

interface ThreadDetailProps {
  courseId: string;
  threadId: string;
  fallbackThread?: DiscussionThread;
  onBack: () => void;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export const ThreadDetail = ({ courseId, threadId, fallbackThread, onBack }: ThreadDetailProps) => {
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);
  const canModerate = hasRole('admin') || hasRole('trainer');

  const { data: thread, isLoading, isError, refetch } = useForumThread(threadId);
  const createReply = useCreateForumReply(courseId, threadId);
  const moderation = useForumThreadModeration(courseId, threadId);
  const acceptReply = useAcceptForumReply(courseId, threadId);

  const [replyBody, setReplyBody] = useState('');
  const [parentReply, setParentReply] = useState<DiscussionReply | null>(null);

  const visibleThread = thread ?? fallbackThread;
  const canAccept = !!visibleThread && (visibleThread.authorId === user?.id || canModerate);

  const submitReply = async () => {
    const body = replyBody.trim();
    if (!body) return;

    try {
      await createReply.mutateAsync({
        body,
        parentReplyId: parentReply?.id,
      });
      setReplyBody('');
      setParentReply(null);
      toast.success('Đã gửi câu trả lời.');
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không gửi được câu trả lời.';
      toast.error(message);
    }
  };

  const toggleModeration = async (action: 'pin' | 'lock' | 'resolve') => {
    try {
      await moderation.mutateAsync({ action, id: threadId });
      toast.success('Đã cập nhật trạng thái thảo luận.');
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không cập nhật được trạng thái.';
      toast.error(message);
    }
  };

  const toggleAccept = async (replyId: string) => {
    try {
      await acceptReply.mutateAsync(replyId);
      toast.success('Đã cập nhật câu trả lời được chấp nhận.');
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không cập nhật được câu trả lời.';
      toast.error(message);
    }
  };

  if (isLoading && !visibleThread) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !visibleThread) {
    return (
      <EmptyState
        title="Không tải được thảo luận"
        description="Thử lại hoặc quay về danh sách câu hỏi."
        action={
          <Button variant="outline" onClick={() => refetch()}>
            Thử lại
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to threads
        </Button>
        <div className="flex flex-wrap gap-2">
          {canModerate && (
            <>
              <Button variant="outline" onClick={() => toggleModeration('pin')}>
                <Pin className="size-4" />
                {visibleThread.isPinned ? 'Bỏ ghim' : 'Ghim'}
              </Button>
              <Button variant="outline" onClick={() => toggleModeration('lock')}>
                <Lock className="size-4" />
                {visibleThread.isLocked ? 'Mở khóa' : 'Khóa'}
              </Button>
            </>
          )}
          {canAccept && (
            <Button variant="outline" onClick={() => toggleModeration('resolve')}>
              <CheckCircle2 className="size-4" />
              {visibleThread.isResolved ? 'Bỏ đã giải' : 'Đánh dấu đã giải'}
            </Button>
          )}
        </div>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {visibleThread.isResolved && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
              Đã giải đáp
            </span>
          )}
          {visibleThread.isLocked && (
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
              Đã khóa
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-slate-950">{visibleThread.title}</h2>
        <p className="mt-1 text-xs text-slate-500">
          {visibleThread.author.fullName} • {formatDate(visibleThread.createdAt)}
          {visibleThread.lesson ? ` • ${visibleThread.lesson.title}` : ''}
        </p>
        <p className="mt-4 text-sm leading-7 whitespace-pre-line text-slate-700">
          {visibleThread.body}
        </p>
      </article>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800">
          {thread?.replies.length ?? visibleThread.replyCount} câu trả lời
        </h3>
        {thread?.replies.length ? (
          thread.replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              canAccept={canAccept}
              onAccept={toggleAccept}
              onReply={setParentReply}
              isAccepting={acceptReply.isPending}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Chưa có câu trả lời. Hãy là người đầu tiên phản hồi.
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800">Trả lời</h3>
          {parentReply && (
            <button
              type="button"
              className="text-primary text-xs font-semibold hover:underline"
              onClick={() => setParentReply(null)}
            >
              Đang phản hồi {parentReply.author.fullName} — hủy
            </button>
          )}
        </div>
        <textarea
          value={replyBody}
          onChange={(event) => setReplyBody(event.target.value)}
          disabled={visibleThread.isLocked}
          rows={4}
          className="focus:border-primary focus:ring-primary/10 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder={
            visibleThread.isLocked
              ? 'Thảo luận đã bị khóa, không thể trả lời.'
              : 'Nhập câu trả lời của bạn...'
          }
        />
        <div className="mt-3 flex justify-end">
          <Button
            onClick={submitReply}
            disabled={
              visibleThread.isLocked || createReply.isPending || replyBody.trim().length < 5
            }
          >
            <Send className="size-4" />
            Gửi câu trả lời
          </Button>
        </div>
      </section>
    </div>
  );
};
