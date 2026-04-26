'use client';
import React from 'react';
import Link from 'next/link';
import { useCompleteLesson } from '@/hooks/useEnrollments';

interface LearningHeaderProps {
  courseTitle?: string;
  lessonTitle?: string;
  lessonIndex?: number;
  totalLessons?: number;
  progressPercent?: number;
  completedLessons?: number;
  courseId?: string;
  enrollmentId?: string | null;
  lessonId?: string | null;
  isLessonCompleted?: boolean;
  hasPrevLesson?: boolean;
  hasNextLesson?: boolean;
  onPrevLesson?: () => void;
  onNextLesson?: () => void;
  onOpenSyllabus?: () => void;
}

export const LearningHeader = ({
  courseTitle,
  lessonTitle,
  lessonIndex,
  totalLessons,
  progressPercent = 0,
  completedLessons = 0,
  courseId,
  enrollmentId,
  lessonId,
  isLessonCompleted = false,
  hasPrevLesson = false,
  hasNextLesson = false,
  onPrevLesson,
  onNextLesson,
  onOpenSyllabus,
}: LearningHeaderProps) => {
  const completeLesson = useCompleteLesson();
  const backHref = courseId ? `/courses/detail?id=${courseId}` : '/courses/detail';

  const handleMarkComplete = () => {
    if (enrollmentId && lessonId && !isLessonCompleted) {
      completeLesson.mutate({ enrollmentId, lessonId });
    }
  };

  return (
    <header className="z-20 flex h-13 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-3 text-white lg:px-5">
      {/* ── Left: Back + Title ─── */}
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href={backHref}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          title="Quay lại chi tiết khóa học"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </Link>
        <div className="hidden h-5 w-px bg-slate-700 sm:block" />
        <div className="min-w-0">
          <div className="truncate text-[13px] leading-tight font-bold">{courseTitle ?? '...'}</div>
          {lessonTitle && (
            <div className="truncate text-[10px] leading-tight text-slate-400">
              {lessonIndex !== undefined && totalLessons !== undefined
                ? `${lessonIndex + 1}/${totalLessons} · `
                : ''}
              {lessonTitle}
            </div>
          )}
        </div>
      </div>

      {/* ── Center: Prev / Next ─── */}
      <div className="flex items-center gap-1">
        <button
          onClick={onPrevLesson}
          disabled={!hasPrevLesson}
          className="flex h-8 w-8 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="Bài trước"
        >
          <i className="fa-solid fa-chevron-up text-xs"></i>
        </button>
        <button
          onClick={onNextLesson}
          disabled={!hasNextLesson}
          className="flex h-8 w-8 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="Bài tiếp theo"
        >
          <i className="fa-solid fa-chevron-down text-xs"></i>
        </button>
      </div>

      {/* ── Right: Progress + Actions ─── */}
      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        <div className="hidden items-center gap-2.5 md:flex">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-slate-300">
              {completedLessons}/{totalLessons ?? '?'} bài
            </div>
            <div className="text-primary text-[10px] font-bold">{Math.round(progressPercent)}%</div>
          </div>
          <div className="h-10 w-10">
            <svg viewBox="0 0 36 36" className="-rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#1677ff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(progressPercent / 100) * 87.96} 87.96`}
                className="transition-all duration-700"
              />
            </svg>
          </div>
        </div>

        <div className="hidden h-5 w-px bg-slate-700 md:block" />

        {/* Mark complete button */}
        {isLessonCompleted ? (
          <div className="hidden items-center gap-1.5 rounded-md bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-400 md:flex">
            <i className="fa-solid fa-circle-check"></i> Đã hoàn thành
          </div>
        ) : (
          <button
            onClick={handleMarkComplete}
            disabled={!enrollmentId || !lessonId || completeLesson.isPending}
            className="hover:border-primary hover:text-primary hidden items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors disabled:cursor-not-allowed disabled:opacity-40 md:flex"
          >
            <i
              className={`fa-solid ${completeLesson.isPending ? 'fa-spinner fa-spin' : 'fa-check'} text-[10px]`}
            ></i>
            Đánh dấu xong
          </button>
        )}

        {/* Mobile syllabus */}
        {onOpenSyllabus && (
          <button
            onClick={onOpenSyllabus}
            className="flex items-center gap-1.5 rounded border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white md:hidden"
          >
            <i className="fa-solid fa-list text-xs"></i>
          </button>
        )}
      </div>
    </header>
  );
};
