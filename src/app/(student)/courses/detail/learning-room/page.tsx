'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { LessonProgressStatus } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LearningHeader } from '@/components/learning-room/LearningHeader';
import { VideoPlayer } from '@/components/learning-room/VideoPlayer';
import { LearningTabs } from '@/components/learning-room/LearningTabs';
import { SyllabusSidebar } from '@/components/learning-room/SyllabusSidebar';
import { useCourseDetail } from '@/hooks/useCourses';
import { useEnrollments, useEnrollmentProgress } from '@/hooks/useEnrollments';
import { useCourseVideoMedia } from '@/hooks/useMedia';
import { buildMediaModules } from '@/lib/course-media';
import { useQueryClient } from '@tanstack/react-query';

export default function LearningRoomPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const { data: course, isLoading: courseLoading } = useCourseDetail(courseId);
  const { data: enrollmentData } = useEnrollments(courseId ? { courseId, limit: 1 } : undefined);
  const enrollment = enrollmentData?.data?.[0] ?? null;
  const enrollmentId = enrollment?.id ?? null;

  const { data: fallbackEnrollments, isLoading: fallbackEnrollmentsLoading } = useEnrollments(
    !courseId ? { limit: 1 } : undefined,
  );
  const fallbackEnrollment = fallbackEnrollments?.data?.[0] ?? null;

  const { data: progress, refetch: refetchProgress } = useEnrollmentProgress(enrollmentId);
  const { data: courseVideoMedia, isError: courseVideoMediaError } = useCourseVideoMedia(
    course?.mediaFolder ?? null,
    Boolean(course?.mediaFolder),
  );
  const fallbackModules = useMemo(
    () => buildMediaModules(courseVideoMedia?.items),
    [courseVideoMedia?.items],
  );

  const modules = course?.modules?.length ? course.modules : fallbackModules;
  const allLessons = useMemo(() => {
    if (!modules) return [];
    return modules
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .flatMap((mod) =>
        mod.lessons
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((lesson) => ({ ...lesson, moduleId: mod.id, moduleTitle: mod.title })),
      );
  }, [modules]);

  // Auto-resume from last in-progress lesson on first load
  const activeLesson = useMemo(() => {
    if (!allLessons.length) return null;
    if (activeLessonId) return allLessons.find((l) => l.id === activeLessonId) ?? allLessons[0];
    if (progress?.modules) {
      for (const mod of progress.modules) {
        const inProg = mod.lessons.find((l) => l.progress.status === 'in_progress');
        if (inProg) return allLessons.find((l) => l.id === inProg.id) ?? null;
      }
    }
    return allLessons.find((l) => l.lessonType === 'video') ?? allLessons[0];
  }, [allLessons, activeLessonId, progress]);

  const activeLessonIndex = useMemo(
    () => allLessons.findIndex((l) => l.id === activeLesson?.id),
    [allLessons, activeLesson],
  );
  const hasPrevLesson = activeLessonIndex > 0;
  const hasNextLesson = activeLessonIndex < allLessons.length - 1;

  const goToLesson = useCallback((id: string) => {
    setActiveLessonId(id);
    window.scrollTo({ top: 0 });
  }, []);
  const goPrev = useCallback(() => {
    if (hasPrevLesson) goToLesson(allLessons[activeLessonIndex - 1].id);
  }, [hasPrevLesson, allLessons, activeLessonIndex, goToLesson]);
  const goNext = useCallback(() => {
    if (hasNextLesson) goToLesson(allLessons[activeLessonIndex + 1].id);
  }, [hasNextLesson, allLessons, activeLessonIndex, goToLesson]);

  // Keyboard shortcuts: ← → for prev/next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  const lessonProgressMap = useMemo(() => {
    const map = new Map<
      string,
      {
        lessonId: string;
        status: LessonProgressStatus;
        watchTimeSeconds: number;
        lastPositionSeconds: number;
      }
    >();
    progress?.modules?.forEach((mod) => {
      mod.lessons.forEach((l) => {
        map.set(l.id, {
          lessonId: l.id,
          status: l.progress.status,
          watchTimeSeconds: l.progress.watchTimeSeconds,
          lastPositionSeconds: l.progress.lastPositionSeconds,
        });
      });
    });
    return map;
  }, [progress]);

  const activeLessonProgress = activeLesson ? lessonProgressMap.get(activeLesson.id) : undefined;
  const isActiveLessonCompleted = activeLessonProgress?.status === 'completed';

  const handleLessonComplete = useCallback(() => {
    refetchProgress();
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  }, [refetchProgress, queryClient]);

  useEffect(() => {
    if (!courseId && fallbackEnrollment?.course?.id) {
      router.replace(`/courses/detail/learning-room?courseId=${fallbackEnrollment.course.id}`);
    }
  }, [courseId, fallbackEnrollment?.course?.id, router]);

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (!courseId && fallbackEnrollmentsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-spinner fa-spin text-primary text-2xl"></i>
          <p className="text-sm text-slate-400">Đang tìm khóa học gần nhất...</p>
        </div>
      </div>
    );
  }

  if (!courseId && !fallbackEnrollment) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <i className="fa-solid fa-graduation-cap mb-4 block text-4xl text-slate-600"></i>
          <p className="mb-4 text-sm text-slate-300">Bạn chưa có khóa học nào để vào phòng học.</p>
          <Link
            href="/courses"
            className="bg-primary hover:bg-primary-hover rounded-lg px-4 py-2 text-sm font-semibold text-white"
          >
            Khám phá khóa học
          </Link>
        </div>
      </div>
    );
  }

  if (courseLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-spinner fa-spin text-primary text-2xl"></i>
          <p className="text-sm text-slate-400">Đang tải phòng học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <i className="fa-solid fa-circle-exclamation mb-4 block text-4xl text-red-500"></i>
          <p className="mb-4 text-sm text-red-400">Không thể tải khóa học.</p>
          <Link href="/courses" className="text-primary text-sm hover:underline">
            ← Quay lại Thư viện
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = progress?.summary?.completedLessonsCount ?? 0;
  const totalCount = progress?.summary?.totalLessonsCount ?? allLessons.length;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-900 text-slate-800">
      <LearningHeader
        courseTitle={course.title}
        lessonTitle={activeLesson?.title}
        lessonIndex={activeLessonIndex >= 0 ? activeLessonIndex : undefined}
        totalLessons={totalCount}
        progressPercent={progress?.summary?.progressPercent ?? 0}
        completedLessons={completedCount}
        courseId={course.id}
        enrollmentId={enrollmentId}
        lessonId={activeLesson?.id ?? null}
        isLessonCompleted={isActiveLessonCompleted}
        hasPrevLesson={hasPrevLesson}
        hasNextLesson={hasNextLesson}
        onPrevLesson={goPrev}
        onNextLesson={goNext}
        onOpenSyllabus={() => setIsSidebarOpen((v) => !v)}
      />

      <div className="relative flex flex-1 overflow-hidden">
        {/* ── Main content ─── */}
        <div className="custom-scrollbar flex h-full flex-1 flex-col overflow-y-auto bg-white">
          <VideoPlayer
            lesson={activeLesson ?? undefined}
            fallbackMediaItems={courseVideoMedia?.items}
            mediaError={courseVideoMediaError}
            enrollmentId={enrollmentId}
            isCompleted={isActiveLessonCompleted}
            lastPositionSeconds={activeLessonProgress?.lastPositionSeconds}
            onLessonComplete={handleLessonComplete}
            onNextLesson={goNext}
            onPrevLesson={goPrev}
            hasNextLesson={hasNextLesson}
            hasPrevLesson={hasPrevLesson}
          />
          <LearningTabs
            lesson={activeLesson ?? undefined}
            trainer={course.trainer}
            enrollmentId={enrollmentId}
            courseId={courseId}
          />
        </div>

        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── Syllabus sidebar ─── */}
        <SyllabusSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((v) => !v)}
          modules={modules ?? []}
          activeLessonId={activeLesson?.id ?? null}
          lessonProgressMap={lessonProgressMap}
          completedLessons={completedCount}
          totalLessons={totalCount}
          onSelectLesson={goToLesson}
        />
      </div>
    </div>
  );
}
