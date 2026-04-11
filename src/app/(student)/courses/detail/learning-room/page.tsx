'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LearningHeader } from '@/components/learning-room/LearningHeader';
import { VideoPlayerWithTracking } from '@/components/learning-room/VideoPlayerWithTracking';
import { LearningTabs } from '@/components/learning-room/LearningTabs';
import { SyllabusSidebar } from '@/components/learning-room/SyllabusSidebar';
import { LessonNavigation } from '@/components/learning-room/LessonNavigation';
import { CertificateModal } from '@/components/learning-room/CertificateModal';
import { useCourseDetail } from '@/hooks/useCourses';
import { useEnrollments, useEnrollmentProgress, useCompleteLesson } from '@/hooks/useEnrollments';
import { useIssueCertificate, useDownloadCertificate } from '@/hooks/useCertificates';
import { useQuizzes } from '@/hooks/useQuizzes';
import type { Certificate } from '@/services/certificate.service';

function LearningRoomContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  // Mặc định đóng trên mobile, mở trên desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [issuedCertificate, setIssuedCertificate] = useState<Certificate | null>(null);
  const videoPlayerRef = React.useRef<{ seekTo: (time: number) => void }>(null);

  // Fetch course detail with modules
  const { data: course, isLoading: courseLoading } = useCourseDetail(courseId);

  // Fetch user's enrollment for this course
  const { data: enrollmentData } = useEnrollments(courseId ? { courseId, limit: 1 } : undefined);
  const enrollment = enrollmentData?.data?.[0] ?? null;
  const enrollmentId = enrollment?.id ?? null;

  // Fetch quizzes for this course
  const { data: quizzesResponse } = useQuizzes(courseId ? { courseId, limit: 100 } : undefined);
  const quizzes = quizzesResponse?.quizzes ?? [];

  // Fetch per-lesson progress
  const { data: progress } = useEnrollmentProgress(enrollmentId);
  const completeLesson = useCompleteLesson();
  const issueCertificate = useIssueCertificate();
  const downloadCertificate = useDownloadCertificate();

  // Build a flat list of all lessons with module context
  const allLessons = useMemo(() => {
    if (!course?.modules) return [];
    return course.modules
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .flatMap((mod) => {
        if (!mod.lessons) return [];
        return mod.lessons
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((lesson) => ({
            ...lesson,
            moduleId: mod.id,
            moduleTitle: mod.title,
          }));
      });
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

  // Get current lesson index and navigation info
  const currentLessonIndex = useMemo(() => {
    if (!activeLesson) return -1;
    return allLessons.findIndex((l) => l.id === activeLesson.id);
  }, [allLessons, activeLesson]);

  const hasPreviousLesson = currentLessonIndex > 0;
  const hasNextLesson = currentLessonIndex < allLessons.length - 1;
  const nextLesson = hasNextLesson ? allLessons[currentLessonIndex + 1] : null;
  const previousLesson = hasPreviousLesson ? allLessons[currentLessonIndex - 1] : null;

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

  // Handle next lesson
  const handleNextLesson = () => {
    if (hasNextLesson && nextLesson) {
      setActiveLessonId(nextLesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle previous lesson
  const handlePreviousLesson = () => {
    if (hasPreviousLesson && previousLesson) {
      setActiveLessonId(previousLesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle manual complete lesson
  const handleManualComplete = () => {
    if (!enrollmentId || !activeLesson?.id) return;
    
    completeLesson.mutate(
      { enrollmentId, lessonId: activeLesson.id },
      {
        onSuccess: () => {
          // Auto advance to next lesson after 1 second
          setTimeout(() => {
            handleNextLesson();
          }, 1000);
        },
      }
    );
  };

  // Handle lesson complete (from video player)
  const handleLessonComplete = () => {
    // Check if this is the last lesson and course is 100% complete
    if (hasNextLesson) {
      // Auto advance to next lesson after 2 seconds
      setTimeout(() => {
        handleNextLesson();
      }, 2000);
    } else {
      // This is the last lesson - check if course is 100% complete
      setTimeout(() => {
        checkAndShowCertificate();
      }, 2000);
    }
  };

  // Check if course is 100% complete and show certificate
  const checkAndShowCertificate = () => {
    if (!enrollmentId || !progress) return;

    const progressPercent = progress.summary?.progressPercent ?? 0;
    const existingCertificate = progress.certificate;

    if (progressPercent >= 100) {
      // Check if certificate already exists in progress data
      if (existingCertificate?.isIssued && existingCertificate.certificateId) {
        // Certificate already exists, just show it
        setIssuedCertificate({
          id: existingCertificate.certificateId,
          certificateNumber: existingCertificate.certificateCode || 'N/A',
          issueDate: existingCertificate.issuedAt || new Date().toISOString(),
          enrollmentId,
          courseId: course?.id || '',
          userId: '',
          course: {
            id: course?.id || '',
            title: course?.title || '',
            slug: course?.slug || '',
          },
          user: { id: '', fullName: '', email: '' },
          trainer: { id: '', fullName: '', email: '' },
        } as any);
        setShowCertificateModal(true);
      } else if (!issueCertificate.isPending) {
        // Try to issue certificate via API
        issueCertificate.mutate(enrollmentId, {
          onSuccess: (certificate) => {
            setIssuedCertificate(certificate);
            setShowCertificateModal(true);
          },
          onError: (error: any) => {
            // If API fails (404), show congratulations anyway
            // Backend might auto-issue certificate on completion
            if (error?.response?.status === 404) {
              // Show a generic congratulations modal
              setIssuedCertificate({
                id: 'pending',
                certificateNumber: 'Đang xử lý...',
                issueDate: new Date().toISOString(),
                enrollmentId,
                courseId: course?.id || '',
                userId: '',
                course: {
                  id: course?.id || '',
                  title: course?.title || '',
                  slug: course?.slug || '',
                },
                user: { id: '', fullName: '', email: '' },
                trainer: { id: '', fullName: '', email: '' },
              } as any);
              setShowCertificateModal(true);
            }
          },
        });
      }
    }
  };

  // Auto-check for certificate when progress updates
  React.useEffect(() => {
    if (!enrollmentId || !progress) return;

    const progressPercent = progress.summary?.progressPercent ?? 0;
    const hasShownModal = showCertificateModal || issuedCertificate;

    // If 100% complete and haven't shown modal yet
    if (progressPercent >= 100 && !hasShownModal) {
      checkAndShowCertificate();
    }
  }, [progress?.summary?.progressPercent, progress?.certificate?.isIssued, enrollmentId]);

  // Handle download certificate
  const handleDownloadCertificate = () => {
    if (issuedCertificate) {
      downloadCertificate.mutate(issuedCertificate.id);
    }
  };

  // Check if current lesson is completed
  const isLessonCompleted = useMemo(() => {
    if (!activeLesson) return false;
    const lessonProgress = lessonProgressMap.get(activeLesson.id);
    return lessonProgress?.status === 'completed';
  }, [activeLesson, lessonProgressMap]);

  // Get last position for current lesson
  const lastPositionSeconds = useMemo(() => {
    if (!activeLesson) return 0;
    const lessonProgress = lessonProgressMap.get(activeLesson.id);
    return lessonProgress?.lastPositionSeconds ?? 0;
  }, [activeLesson, lessonProgressMap]);

  // Calculate total lessons from course modules if progress not available
  const totalLessonsCount = useMemo(() => {
    return progress?.summary?.totalLessonsCount ?? allLessons.length;
  }, [progress?.summary?.totalLessonsCount, allLessons.length]);

  const completedLessonsCount = useMemo(() => {
    return progress?.summary?.completedLessonsCount ?? 0;
  }, [progress?.summary?.completedLessonsCount]);

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
        completedLessons={completedLessonsCount}
        totalLessons={totalLessonsCount}
        courseId={course.id}
        enrollmentId={enrollmentId}
        lessonId={activeLesson?.id ?? null}
        onOpenSyllabus={() => setIsSidebarOpen(true)}
        hasCertificate={progress?.certificate?.isIssued ?? false}
      />

      <div className="relative flex flex-1 overflow-hidden bg-slate-900">
        {/* KHỐI TRÁI: Video và Tabs */}
        <div className="custom-scrollbar flex h-full flex-1 flex-col overflow-y-auto bg-white">
          <VideoPlayerWithTracking 
            lesson={activeLesson ?? undefined}
            enrollmentId={enrollmentId}
            onLessonComplete={handleLessonComplete}
            onNextLesson={handleNextLesson}
            onPreviousLesson={handlePreviousLesson}
            hasNextLesson={hasNextLesson}
            hasPreviousLesson={hasPreviousLesson}
            onTimeUpdate={setCurrentVideoTime}
            lastPositionSeconds={lastPositionSeconds}
          />
          
          {/* Lesson Navigation */}
          <LessonNavigation
            onPrevious={handlePreviousLesson}
            onNext={handleNextLesson}
            onComplete={handleManualComplete}
            hasPrevious={hasPreviousLesson}
            hasNext={hasNextLesson}
            isCompleted={isLessonCompleted}
            currentLessonTitle={activeLesson?.title}
            nextLessonTitle={nextLesson?.title}
          />

          <LearningTabs 
            lesson={activeLesson ?? undefined} 
            trainer={course.trainer}
            currentVideoTime={currentVideoTime}
            onSeekTo={(time) => {
              // This will be handled by VideoPlayerWithTracking via ref
              const video = document.querySelector('video');
              if (video) {
                video.currentTime = time;
                video.play();
              }
            }}
          />
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
          completedLessons={completedLessonsCount}
          totalLessons={totalLessonsCount}
          onSelectLesson={(lessonId) => setActiveLessonId(lessonId)}
          quizzes={quizzes}
          enrollmentId={enrollmentId}
        />
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        certificate={issuedCertificate}
        courseTitle={course.title}
        onDownload={handleDownloadCertificate}
      />
    </div>
  );
}

export default function LearningRoomPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-slate-500">
          <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải phòng học...
        </div>
      </div>
    }>
      <LearningRoomContent />
    </Suspense>
  );
}
