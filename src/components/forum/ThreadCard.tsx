import { CheckCircle2, Lock, MessageCircle, Pin, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DiscussionThread } from '@/types/forum';

interface ThreadCardProps {
  thread: DiscussionThread;
  isSelected?: boolean;
  onClick: () => void;
}

const formatRelative = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export const ThreadCard = ({ thread, isSelected, onClick }: ThreadCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'hover:border-primary/40 w-full rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md',
      isSelected ? 'border-primary ring-primary/10 ring-2' : 'border-slate-200',
      thread.isPinned && 'border-amber-200 bg-amber-50/50',
    )}
  >
    <div className="mb-2 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {thread.isPinned && <Pin className="size-4 text-amber-500" />}
          {thread.isResolved && <CheckCircle2 className="size-4 text-emerald-500" />}
          {thread.isLocked && <Lock className="size-4 text-slate-400" />}
          <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{thread.title}</h3>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{thread.excerpt}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
        <MessageCircle className="size-3.5" />
        {thread.replyCount}
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
      <UserCircle className="size-3.5" />
      <span className="font-medium text-slate-700">{thread.author.fullName}</span>
      <span>•</span>
      <span>{formatRelative(thread.lastReplyAt ?? thread.createdAt)}</span>
      {thread.lesson && (
        <>
          <span>•</span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
            {thread.lesson.title}
          </span>
        </>
      )}
    </div>
  </button>
);
