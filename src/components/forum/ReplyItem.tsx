import { CheckCircle2, CornerDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DiscussionReply } from '@/types/forum';

interface ReplyItemProps {
  reply: DiscussionReply;
  canAccept: boolean;
  onAccept: (replyId: string) => void;
  onReply: (reply: DiscussionReply) => void;
  isAccepting?: boolean;
  nested?: boolean;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export const ReplyItem = ({
  reply,
  canAccept,
  onAccept,
  onReply,
  isAccepting,
  nested,
}: ReplyItemProps) => (
  <div
    className={cn(
      'rounded-xl border bg-white p-4',
      reply.isAccepted ? 'border-emerald-300 bg-emerald-50/70' : 'border-slate-200',
      nested && 'ml-6 border-slate-100 bg-slate-50',
    )}
  >
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {nested && <CornerDownRight className="size-4 text-slate-400" />}
        <span className="text-sm font-semibold text-slate-800">{reply.author.fullName}</span>
        <span className="text-xs text-slate-400">• {formatDate(reply.createdAt)}</span>
      </div>
      {reply.isAccepted && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="size-3.5" />
          Câu trả lời được chấp nhận
        </span>
      )}
    </div>
    <p className="text-sm leading-6 whitespace-pre-line text-slate-700">{reply.body}</p>

    <div className="mt-3 flex gap-2">
      {!nested && (
        <Button variant="ghost" size="sm" onClick={() => onReply(reply)}>
          Phản hồi
        </Button>
      )}
      {canAccept && (
        <Button
          variant={reply.isAccepted ? 'secondary' : 'outline'}
          size="sm"
          disabled={isAccepting}
          onClick={() => onAccept(reply.id)}
        >
          {reply.isAccepted ? 'Bỏ chấp nhận' : 'Chấp nhận câu trả lời'}
        </Button>
      )}
    </div>

    {reply.childReplies.length > 0 && (
      <div className="mt-3 space-y-3">
        {reply.childReplies.map((child) => (
          <ReplyItem
            key={child.id}
            reply={child}
            canAccept={false}
            onAccept={onAccept}
            onReply={onReply}
            nested
          />
        ))}
      </div>
    )}
  </div>
);
