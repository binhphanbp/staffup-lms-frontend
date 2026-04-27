'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookOpen, Trash2, RefreshCw, WifiOff, HardDrive } from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { offlineLessonCache, type OfflineLessonMeta } from '@/lib/offlineLessonCache';
import { toast } from '@/lib/toast';

export default function SavedLessonsPage() {
  const [items, setItems] = useState<OfflineLessonMeta[] | null>(null);
  const [supported, setSupported] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const refresh = async () => {
    if (!offlineLessonCache.isSupported()) {
      setSupported(false);
      setItems([]);
      return;
    }
    const list = await offlineLessonCache.listSaved();
    setItems(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const totalBytes = useMemo(
    () => (items ?? []).reduce((acc, it) => acc + (it.approxBytes ?? 0), 0),
    [items],
  );

  const handleRemove = async (id: string) => {
    setBusyId(id);
    try {
      await offlineLessonCache.remove(id);
      toast.info('Đã xoá khỏi cache offline.');
      await refresh();
    } catch {
      toast.error('Không xoá được. Vui lòng thử lại.');
    } finally {
      setBusyId(null);
    }
  };

  const handleClearAll = async () => {
    if (!items || items.length === 0) return;
    if (!window.confirm('Xoá toàn bộ bài học đã lưu offline?')) return;
    setBusyId('__all__');
    try {
      await offlineLessonCache.clearAll();
      toast.info('Đã xoá toàn bộ cache offline.');
      await refresh();
    } catch {
      toast.error('Không xoá được toàn bộ.');
    } finally {
      setBusyId(null);
    }
  };

  const breadcrumbs = useMemo(
    () => [{ label: 'Trang chủ', href: '/' }, { label: 'Bài học đã lưu' }],
    [],
  );

  return (
    <>
      <StudentHeader breadcrumbs={breadcrumbs} />
      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f0f2f5] px-4 py-6 md:px-8 md:py-8 dark:bg-slate-950">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          {/* Hero */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 md:text-2xl dark:text-slate-50">
                  <Bookmark className="text-primary size-6" />
                  Bài học đã lưu offline
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Mở khóa học khi đang online và bấm <strong>Lưu offline</strong> ở đầu thanh học để
                  có thể xem lại ngay cả khi mất mạng.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                  <HardDrive className="size-3.5" />
                  {offlineLessonCache.formatBytes(totalBytes)} đã dùng
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
                    online
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}
                >
                  {online ? <RefreshCw className="size-3.5" /> : <WifiOff className="size-3.5" />}
                  {online ? 'Đang online' : 'Đang offline'}
                </span>
              </div>
            </div>
          </section>

          {/* Content */}
          {!supported ? (
            <EmptyState
              icon={<WifiOff className="size-10 text-amber-500" />}
              title="Trình duyệt không hỗ trợ lưu offline"
              description="Cache Storage API không khả dụng. Bạn vẫn có thể học trực tuyến bình thường, nhưng tính năng offline cần Chrome/Edge/Safari mới."
            />
          ) : items === null ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Bookmark className="size-10 text-slate-400" />}
              title="Chưa có bài học nào được lưu"
              description="Vào một bài học bất kỳ rồi bấm “Lưu offline” ở thanh đầu để bắt đầu."
              action={
                <Link
                  href="/courses"
                  className="bg-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white"
                >
                  <BookOpen className="size-4" />
                  Đến thư viện khóa học
                </Link>
              }
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Có <strong>{items.length}</strong> bài học đã được lưu.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={busyId === '__all__'}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="size-3.5" />
                  Xoá tất cả
                </button>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {it.courseTitle}
                        </p>
                        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
                          {it.lessonTitle}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                            <HardDrive className="size-3" />
                            {offlineLessonCache.formatBytes(it.approxBytes)}
                          </span>
                          <span>
                            Lưu lúc{' '}
                            {new Date(it.savedAt).toLocaleString('vi-VN', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(it.id)}
                        disabled={busyId === it.id}
                        title="Xoá khỏi cache"
                        className="rounded-md p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={
                          it.lessonRoute ??
                          `/courses/detail/learning-room?courseId=${it.courseId}&lessonId=${it.id}`
                        }
                        className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
                      >
                        <BookOpen className="size-3.5" />
                        Mở bài học
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}
