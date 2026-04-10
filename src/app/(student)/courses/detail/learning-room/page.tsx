'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LearningHeader } from '@/components/learning-room/LearningHeader';
import { VideoPlayer } from '@/components/learning-room/VideoPlayer';
import { LearningTabs } from '@/components/learning-room/LearningTabs';
import { SyllabusSidebar } from '@/components/learning-room/SyllabusSidebar';
import { useCourseDetail } from '@/hooks/useCourses';
import { useEnrollments, useEnrollmentProgress } from '@/hooks/useEnrollments';

export default function LearningRoomPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  // Mặc định đóng trên mobile, mở trên desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Fetch course detail with modules
  const { data: course, isLoading: courseLoading } = useCourseDetail(courseId);

  // Fetch user's enrollment for this course
  const { data: enrollmentData } = useEnrollments(courseId ? { courseId, limit: 1 } : undefined);
  const enrollment = enrollmentData?.data?.[0] ?? null;
  const enrollmentId = enrollment?.id ?? null;

  // Fetch per-lesson progress
  const { data: progress } = useEnrollmentProgress(enrollmentId);

  // Build a flat list of all lessons with module context
  const allLessons = useMemo(() => {
    if (!course?.modules) return [];
    return course.modules
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .flatMap((mod) =>
        mod.lessons
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((lesson) => ({
            ...lesson,
            moduleId: mod.id,
            moduleTitle: mod.title,
          })),
      );
  }, [course?.modules]);

  // Determine active lesson (selected, or last-accessed, or first)
  const activeLesson = useMemo(() => {
    if (!allLessons.length) return null;
    if (activeLessonId) return allLessons.find((l) => l.id === activeLessonId) ?? allLessons[0];
    // Try to resume from last accessed via progress modules
    if (progress?.modules) {
      for (const mod of progress.modules) {
        const inProgress = mod.lessons.find((l) => l.progress.status === 'in_progress');
        if (inProgress) return allLessons.find((l) => l.id === inProgress.id) ?? allLessons[0];
      }
    }
    return allLessons[0];
  }, [allLessons, activeLessonId, progress]);

  // Build lesson progress map from nested modules → lessons → progress
  const lessonProgressMap = useMemo(() => {
    const map = new Map<
      string,
      {
        lessonId: string;
        status: import('@/types').LessonProgressStatus;
        watchTimeSeconds: number;
        lastPositionSeconds: number;
      }
    >();
    progress?.modules?.forEach((mod) => {
      mod.lessons.forEach((lesson) => {
        map.set(lesson.id, {
          lessonId: lesson.id,
          status: lesson.progress.status,
          watchTimeSeconds: lesson.progress.watchTimeSeconds,
          lastPositionSeconds: lesson.progress.lastPositionSeconds,
        });
      });
    });
    return map;
  }, [progress]);

  if (courseLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-sm text-slate-400">
          <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải phòng học...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <p className="mb-4 text-sm text-red-400">Không thể tải khóa học.</p>
          <Link href="/courses" className="text-primary text-sm hover:underline">
            ← Quay lại Thư viện
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-900 text-slate-800">
      <LearningHeader
        courseTitle={course.title}
        lessonTitle={activeLesson?.title}
        progressPercent={progress?.summary?.progressPercent ?? 0}
        completedLessons={progress?.summary?.completedLessonsCount ?? 0}
        totalLessons={progress?.summary?.totalLessonsCount ?? 0}
        courseId={course.id}
        enrollmentId={enrollmentId}
        lessonId={activeLesson?.id ?? null}
        onOpenSyllabus={() => setIsSidebarOpen(true)}
      />

      <div className="relative flex flex-1 overflow-hidden bg-slate-900">
        {/* KHỐI TRÁI: Video và Tabs */}
        <div className="custom-scrollbar flex h-full flex-1 flex-col overflow-y-auto bg-white">
          <VideoPlayer lesson={activeLesson ?? undefined} />
          <LearningTabs lesson={activeLesson ?? undefined} trainer={course.trainer} />
        </div>

        {/* Backdrop — chỉ hiện trên mobile khi sidebar mở */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* KHỐI PHẢI: Giáo trình */}
        <SyllabusSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          modules={course.modules ?? []}
          activeLessonId={activeLesson?.id ?? null}
          lessonProgressMap={lessonProgressMap}
          completedLessons={progress?.summary?.completedLessonsCount ?? 0}
          totalLessons={progress?.summary?.totalLessonsCount ?? 0}
          onSelectLesson={(lessonId) => setActiveLessonId(lessonId)}
        />
      </div>
    </div>
  );
}
