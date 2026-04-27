'use client';

import { useEffect, useState, useTransition } from 'react';
import { Download, CheckCircle2, Loader2, WifiOff } from 'lucide-react';
import { offlineLessonCache } from '@/lib/offlineLessonCache';
import { toast } from '@/lib/toast';

interface SaveOfflineButtonProps {
  lessonId?: string | null;
  courseId?: string;
  courseTitle?: string;
  lessonTitle?: string;
  /** Auxiliary URLs to also cache (transcript, poster, etc.) */
  extraUrls?: string[];
  className?: string;
}

export function SaveOfflineButton({
  lessonId,
  courseId,
  courseTitle,
  lessonTitle,
  extraUrls = [],
  className,
}: SaveOfflineButtonProps) {
  const [saved, setSaved] = useState(false);
  const [supported, setSupported] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    const supportedNow = offlineLessonCache.isSupported();
    if (!supportedNow) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
      return;
    }
    if (!lessonId) {
      setSaved(false);
      return;
    }
    offlineLessonCache.isSaved(lessonId).then((isSaved) => {
      if (!cancelled) setSaved(isSaved);
    });
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (!supported) {
    return (
      <span
        title="Trình duyệt không hỗ trợ lưu offline"
        className="hidden items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 md:inline-flex"
      >
        <WifiOff className="size-3" />
        Không hỗ trợ
      </span>
    );
  }

  if (!lessonId || !courseId) return null;

  const handleSave = () => {
    if (saved || isPending) return;
    const lessonRoute = `/courses/detail/learning-room?courseId=${encodeURIComponent(
      courseId,
    )}&lessonId=${encodeURIComponent(lessonId)}`;

    startTransition(async () => {
      try {
        await offlineLessonCache.saveLesson({
          id: lessonId,
          courseId,
          courseTitle: courseTitle ?? 'Khoá học',
          lessonTitle: lessonTitle ?? 'Bài học',
          lessonRoute,
          extraUrls,
        });
        setSaved(true);
        toast.success('Đã lưu bài học để xem offline.');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Không lưu được bài học offline.');
      }
    });
  };

  const handleRemove = () => {
    if (!saved || isPending) return;
    startTransition(async () => {
      try {
        await offlineLessonCache.remove(lessonId);
        setSaved(false);
        toast.info('Đã xoá bài học khỏi cache offline.');
      } catch {
        toast.error('Không xoá được bài học khỏi cache.');
      }
    });
  };

  if (saved) {
    return (
      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending}
        title="Đã lưu offline — bấm để gỡ"
        className={
          className ??
          'hidden items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-60 md:inline-flex'
        }
      >
        {isPending ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <CheckCircle2 className="size-3" />
        )}
        Đã lưu offline
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={isPending}
      title="Lưu bài học để xem được khi mất mạng"
      className={
        className ??
        'hover:border-primary hover:text-primary hidden items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition disabled:opacity-60 md:inline-flex'
      }
    >
      {isPending ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}
      Lưu offline
    </button>
  );
}
