import { useMemo, useState } from 'react';
import { Loader2, MessageSquarePlus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateForumThread, useForumThreads } from '@/hooks/useForumThreads';
import { toast } from '@/lib/toast';
import type { LessonDetail } from '@/types';
import type { DiscussionThread, ForumSort, ForumStatusFilter } from '@/types/forum';
import { ThreadCard } from './ThreadCard';
import { ThreadDetail } from './ThreadDetail';

interface ForumPanelProps {
  courseId: string;
  lesson?: LessonDetail & { moduleTitle?: string };
  lessons?: Array<LessonDetail & { moduleTitle?: string }>;
}

const statusOptions: Array<{ value?: ForumStatusFilter; label: string }> = [
  { label: 'Tất cả' },
  { value: 'open', label: 'Chưa giải' },
  { value: 'resolved', label: 'Đã giải' },
];

export const ForumPanel = ({ courseId, lesson, lessons = [] }: ForumPanelProps) => {
  const [status, setStatus] = useState<ForumStatusFilter | undefined>();
  const [sort, setSort] = useState<ForumSort>('recent');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedThread, setSelectedThread] = useState<DiscussionThread | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(lesson?.id ?? '');

  const params = useMemo(
    () => ({
      status,
      sort,
      search: search.trim() || undefined,
      page,
      limit: 8,
    }),
    [page, search, sort, status],
  );

  const { data, isLoading, isError, refetch } = useForumThreads(courseId, params);
  const createThread = useCreateForumThread(courseId);

  const flattenedLessons = useMemo(
    () => (lessons.length > 0 ? lessons : lesson ? [lesson] : []),
    [lesson, lessons],
  );

  const submitThread = async () => {
    try {
      const created = await createThread.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        lessonId: selectedLessonId || undefined,
      });
      setTitle('');
      setBody('');
      setSelectedLessonId(lesson?.id ?? '');
      setCreateOpen(false);
      setSelectedThread(created);
      toast.success('Đã tạo câu hỏi mới.');
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không tạo được câu hỏi.';
      toast.error(message);
    }
  };

  if (selectedThread) {
    return (
      <ThreadDetail
        courseId={courseId}
        threadId={selectedThread.id}
        fallbackThread={selectedThread}
        onBack={() => setSelectedThread(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  setStatus(option.value);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  status === option.value
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <MessageSquarePlus className="size-4" />
            Đặt câu hỏi mới
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="focus:border-primary focus:ring-primary/10 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none focus:bg-white focus:ring-2"
              placeholder="Tìm kiếm câu hỏi..."
            />
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as ForumSort)}
            className="focus:border-primary focus:ring-primary/10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2"
          >
            <option value="recent">Sắp xếp: Mới nhất</option>
            <option value="popular">Sắp xếp: Phổ biến</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : isError ? (
        <EmptyState
          title="Không tải được diễn đàn"
          description="Thử tải lại danh sách câu hỏi."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
              Thử lại
            </Button>
          }
        />
      ) : data?.data.length ? (
        <div className="space-y-3">
          {data.data.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} onClick={() => setSelectedThread(thread)} />
          ))}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>
              Trang {data.meta.page} / {Math.max(data.meta.totalPages, 1)}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                →
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Chưa có câu hỏi"
          description="Bắt đầu thảo luận bằng cách đặt câu hỏi đầu tiên cho khóa học này."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <MessageSquarePlus className="size-4" />
              Đặt câu hỏi mới
            </Button>
          }
        />
      )}

      <Dialog
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        ariaLabel="Đặt câu hỏi mới"
        widthClassName="max-w-2xl"
      >
        <div className="space-y-4 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Đặt câu hỏi mới</h2>
            <p className="mt-1 text-sm text-slate-500">
              Câu hỏi sẽ hiển thị trong diễn đàn của khóa học để học viên và trainer cùng phản hồi.
            </p>
          </div>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="focus:border-primary focus:ring-primary/10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
            placeholder="Tiêu đề câu hỏi (10–200 ký tự)"
          />
          <select
            value={selectedLessonId}
            onChange={(event) => setSelectedLessonId(event.target.value)}
            className="focus:border-primary focus:ring-primary/10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
          >
            <option value="">Gắn với toàn khóa học</option>
            {flattenedLessons.map((item) => (
              <option key={item.id} value={item.id}>
                {item.moduleTitle ? `${item.moduleTitle} — ` : ''}
                {item.title}
              </option>
            ))}
          </select>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={7}
            className="focus:border-primary focus:ring-primary/10 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2"
            placeholder="Mô tả chi tiết câu hỏi (20–5000 ký tự)"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={submitThread}
              disabled={
                createThread.isPending || title.trim().length < 10 || body.trim().length < 20
              }
            >
              {createThread.isPending && <Loader2 className="size-4 animate-spin" />}
              Tạo câu hỏi
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
