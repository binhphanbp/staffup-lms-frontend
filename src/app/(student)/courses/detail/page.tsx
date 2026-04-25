/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { HeroBanner } from '@/components/course-detail/HeroBanner';
import { CourseCurriculum } from '@/components/course-detail/CourseCurriculum';
import { CourseSidebar } from '@/components/course-detail/CourseSidebar';
import { useCourseDetail } from '@/hooks/useCourses';
import { useEnrollments, useSelfEnroll } from '@/hooks/useEnrollments';
import { useCourseVideoMedia } from '@/hooks/useMedia';
import { buildMediaModules } from '@/lib/course-media';
import { getEmbeddedVideoUrl, isEmbeddableVideo, resolveMediaUrl } from '@/lib/media';

export default function CourseDetailPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  const { data: course, isLoading, isError } = useCourseDetail(courseId);
  const { data: enrollmentData } = useEnrollments(courseId ? { courseId, limit: 1 } : undefined);
  const { data: courseVideoMedia } = useCourseVideoMedia(
    course?.mediaFolder ?? null,
    Boolean(course?.mediaFolder),
  );
  const selfEnroll = useSelfEnroll();
  const enrollment = enrollmentData?.data?.[0] ?? null;
  const fallbackModules = useMemo(
    () => buildMediaModules(courseVideoMedia?.items),
    [courseVideoMedia?.items],
  );
  const courseModules = (course?.modules?.length ? course.modules : fallbackModules) ?? [];

  const previewLesson = useMemo(() => {
    const lessons =
      courseModules.flatMap((module) =>
        module.lessons.map((lesson) => ({
          ...lesson,
          moduleTitle: module.title,
        })),
      ) ?? [];

    return (
      lessons.find((lesson) => lesson.lessonType === 'video' && lesson.isPreview) ??
      lessons.find((lesson) => lesson.lessonType === 'video') ??
      null
    );
  }, [courseModules]);

  const previewVideoUrl = resolveMediaUrl(previewLesson?.videoUrl);
  const embeddedPreviewVideoUrl = getEmbeddedVideoUrl(previewVideoUrl);
  const shouldRenderIframe = isEmbeddableVideo(previewVideoUrl);

  const handleSelfEnroll = () => {
    if (!course?.id || selfEnroll.isPending) return;
    selfEnroll.mutate(course.id);
  };

  if (isLoading) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Thư viện Khóa học', href: '/courses' },
            { label: 'Đang tải...' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center bg-[#f8fafc]">
          <div className="text-sm text-slate-500">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải thông tin khóa học...
          </div>
        </div>
      </>
    );
  }

  if (isError || !course) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Thư viện Khóa học', href: '/courses' },
            { label: 'Lỗi' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center bg-[#f8fafc]">
          <div className="text-center">
            <p className="mb-4 text-sm text-red-500">Không thể tải thông tin khóa học.</p>
            <Link href="/courses" className="text-primary text-sm font-medium hover:underline">
              ← Quay lại Thư viện Khóa học
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Thư viện Khóa học', href: '/courses' },
          { label: course.title },
        ]}
      />

      <div
        className="custom-scrollbar relative flex-1 overflow-y-auto scroll-smooth bg-[#f8fafc]"
        id="mainScrollArea"
      >
        <HeroBanner course={course} />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-4 md:px-8 md:py-8 lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-8 pb-12">
            <div className="sticky top-0 z-10 -mt-2 border-b border-gray-200 bg-[#f8fafc] pt-2">
              <nav className="flex gap-6 text-[13px] font-semibold">
                <a
                  href="#overview"
                  className="border-primary text-primary border-b-2 py-3 transition-colors"
                >
                  Tổng quan
                </a>
                <a
                  href="#preview"
                  className="border-b-2 border-transparent py-3 text-slate-500 transition-colors hover:text-slate-800"
                >
                  Video preview
                </a>
                <a
                  href="#curriculum"
                  className="border-b-2 border-transparent py-3 text-slate-500 transition-colors hover:text-slate-800"
                >
                  Giáo trình
                </a>
                <a
                  href="#instructor"
                  className="border-b-2 border-transparent py-3 text-slate-500 transition-colors hover:text-slate-800"
                >
                  Giảng viên
                </a>
              </nav>
            </div>

            <section id="overview" className="scroll-mt-20">
              <div className="card border border-gray-200 p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-800">Mô tả khóa học</h2>
                <p className="text-[14px] leading-relaxed text-slate-600">
                  {course.description?.trim() || 'Khóa học này chưa có mô tả chi tiết.'}
                </p>
              </div>
            </section>

            <section id="preview" className="scroll-mt-20">
              <div className="card overflow-hidden border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-bold text-slate-800">Video preview</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {previewLesson
                      ? `Xem trước bài: ${previewLesson.title}`
                      : 'Khóa học này hiện chưa có video preview.'}
                  </p>
                </div>

                {previewVideoUrl ? (
                  shouldRenderIframe && embeddedPreviewVideoUrl ? (
                    <iframe
                      src={embeddedPreviewVideoUrl}
                      className="h-[260px] w-full md:h-[420px]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={previewLesson?.title ?? 'Course preview video'}
                    />
                  ) : (
                    <video
                      src={previewVideoUrl}
                      className="h-[260px] w-full bg-black object-contain md:h-[420px]"
                      controls
                    />
                  )
                ) : (
                  <div className="flex h-[260px] items-center justify-center bg-slate-900 text-sm text-slate-300 md:h-[420px]">
                    Không có video preview cho khóa học này.
                  </div>
                )}

                {previewLesson?.moduleTitle && (
                  <div className="bg-slate-50 px-6 py-3 text-sm text-slate-600">
                    Thuoc phan:{' '}
                    <span className="font-semibold text-slate-800">
                      {previewLesson.moduleTitle}
                    </span>
                  </div>
                )}
              </div>
            </section>

            <CourseCurriculum
              modules={courseModules}
              totalModules={course.stats?.totalModules ?? courseModules.length}
              totalLessons={
                course.stats?.totalLessons ??
                courseModules.reduce((sum, module) => sum + module.lessons.length, 0)
              }
              totalDurationMinutes={
                course.stats?.totalDurationMinutes ??
                Math.round(
                  courseModules.reduce(
                    (sum, module) =>
                      sum +
                      module.lessons.reduce(
                        (lessonSum, lesson) => lessonSum + lesson.durationSeconds,
                        0,
                      ),
                    0,
                  ) / 60,
                )
              }
            />

            {course.trainer && (
              <section id="instructor" className="scroll-mt-20">
                <h2 className="mb-4 text-lg font-bold text-slate-800">Giảng viên nội bộ</h2>
                <div className="card flex items-start gap-5 border border-gray-200 p-5">
                  <img
                    src={
                      course.trainer.avatarUrl ??
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(course.trainer.fullName)}&background=0f172a&color=fff&size=100`
                    }
                    className="h-20 w-20 rounded-full shadow-sm"
                    alt={course.trainer.fullName}
                  />
                  <div>
                    <h3 className="mb-1 text-base font-bold text-slate-800">
                      {course.trainer.fullName}
                    </h3>
                    <div className="text-primary mb-3 font-mono text-[12px] tracking-tight">
                      {course.trainer.email}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          <CourseSidebar
            course={course}
            enrollment={enrollment}
            isEnrolling={selfEnroll.isPending}
            onSelfEnroll={handleSelfEnroll}
          />
        </div>

        <footer className="border-t border-gray-200 bg-white py-6 text-center text-[11px] text-slate-400">
          &copy; 2026 Staffup LMS. Mã khóa học: {course.slug ?? course.id}.
        </footer>
      </div>
    </>
  );
}
