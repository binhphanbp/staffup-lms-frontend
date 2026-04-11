'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { useRoadmapDetail, useUpdateAssignmentStatus } from '@/hooks/useRoadmaps';
import {
  Loader2,
  AlertCircle,
  BookOpen,
  Clock,
  Target,
  Users,
  CheckCircle2,
  PlayCircle,
  Lock,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import type { RoadmapCourse } from '@/services/roadmap.service';

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  if (hours < 1) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days} ngày`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface CourseCardProps {
  course: RoadmapCourse;
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => {
  const isEnrolled = !!course.userEnrollment;
  const isCompleted = course.userEnrollment?.status === 'completed';
  const progress = course.userEnrollment?.progressPercent || 0;

  return (
    <Link
      href={isEnrolled ? `/courses/detail/learning-room?courseId=${course.id}` : `/courses/detail?courseId=${course.id}`}
      className={`card group flex h-full flex-col ${isCompleted ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      {/* Thumbnail */}
      <div className="relative h-40 shrink-0 overflow-hidden rounded-t-xl bg-slate-100">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isCompleted ? 'grayscale-30 filter' : ''}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-slate-400" />
          </div>
        )}

        {/* Order badge */}
        <div className="absolute top-3 left-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200">
            <span className="text-[11px] font-black text-slate-800">{index + 1}</span>
          </div>
        </div>

        {/* Required badge */}
        {course.isRequired && (
          <div className="absolute top-3 right-3">
            <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              Bắt buộc
            </span>
          </div>
        )}

        {/* Status badge */}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
            <div className="bg-success flex -rotate-12 transform items-center gap-1.5 rounded border border-white px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
              <i className="fa-solid fa-circle-check"></i> Đã hoàn thành
            </div>
          </div>
        )}

        {isEnrolled && !isCompleted && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1.5 rounded-full bg-blue-500/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white">
              <PlayCircle className="h-3 w-3" />
              Đang học
            </div>
          </div>
        )}

        {!isEnrolled && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-500/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white">
              <Lock className="h-3 w-3" />
              Chưa ghi danh
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Stats */}
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {course.stats.totalLessons} bài
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(course.estimatedDurationMinutes)}
          </span>
        </div>

        {/* Title */}
        <h3 className="group-hover:text-primary mb-2 text-[14px] leading-snug font-bold text-slate-800 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-[12px] text-slate-500">{course.description}</p>

        <div className="mt-auto"></div>

        {/* Progress bar */}
        {isEnrolled && !isCompleted && (
          <>
            <div className="mt-2 mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-primary text-[11px] font-bold">Tiến độ: {progress}%</div>
              <div className="text-[11px] text-slate-400">{course.userEnrollment?.completedLessonsCount}/{course.stats.totalLessons} bài</div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="my-3 h-px w-full bg-gray-100"></div>
        <div className="flex items-center justify-between">
          {course.trainer && (
            <div className="flex items-center gap-2">
              {course.trainer.avatarUrl ? (
                <img
                  src={course.trainer.avatarUrl}
                  className="h-6 w-6 rounded-full border border-gray-200"
                  alt="Trainer"
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.trainer.fullName)}&background=f1f5f9&color=475569`}
                  className="h-6 w-6 rounded-full border border-gray-200"
                  alt="Trainer"
                />
              )}
              <div className="max-w-25 truncate text-[11px] font-medium text-slate-600">
                {course.trainer.fullName}
              </div>
            </div>
          )}
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Users className="h-3 w-3" />
            {course.stats.totalEnrollments}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roadmapId = params.id as string;
  const { data: roadmap, isLoading, error } = useRoadmapDetail(roadmapId);
  const updateStatus = useUpdateAssignmentStatus();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartRoadmap = async () => {
    if (!roadmap?.userAssignment) return;
    
    setIsStarting(true);
    try {
      await updateStatus.mutateAsync({
        assignmentId: roadmap.userAssignment.assignmentId,
        status: 'in_progress',
      });
    } catch (err) {
      console.error('Failed to start roadmap:', err);
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Lộ trình phát triển', href: '/learning-path' },
            { label: 'Chi tiết' },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="inline-flex items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-medium">Đang tải lộ trình...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !roadmap) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Lộ trình phát triển', href: '/learning-path' },
            { label: 'Chi tiết' },
          ]}
        />
        <div className="py-20 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div>
              <p className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy lộ trình</p>
              <p className="text-sm text-slate-500 mb-6">Lộ trình này không tồn tại hoặc bạn không có quyền truy cập</p>
              <button
                onClick={() => router.push('/learning-path')}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const completedCourses = roadmap.courses.filter(c => c.userEnrollment?.status === 'completed').length;
  const totalCourses = roadmap.courses.length;
  const overallProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lộ trình phát triển', href: '/learning-path' },
          { label: roadmap.title },
        ]}
      />

      <div className="custom-scrollbar relative flex-1 overflow-y-auto bg-white p-4 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm flex-shrink-0">
              <i className="fa-solid fa-route text-primary text-2xl"></i>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
                  {roadmap.category.name}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
                  {roadmap.department.name}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                {roadmap.title}
              </h1>
              <p className="text-sm text-slate-600 mb-3">
                {roadmap.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-semibold">{totalCourses} khóa học</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">{formatDuration(roadmap.stats.totalEstimatedMinutes)}</span>
                </div>
                {roadmap.targetPosition && (
                  <div className="flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    <span className="font-semibold">{roadmap.targetPosition}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Assignment info & Progress */}
        {roadmap.userAssignment && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                  <i className="fa-solid fa-user text-primary"></i>
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 mb-1">Tiến độ của bạn</h2>
                  <p className="text-sm text-slate-600">
                    Giao bởi: <span className="font-semibold">{roadmap.userAssignment.assignedBy.fullName}</span>
                  </p>
                  {roadmap.userAssignment.assignedAt && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>Ngày giao: {formatDate(roadmap.userAssignment.assignedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              {roadmap.userAssignment.status === 'assigned' && (
                <button
                  onClick={handleStartRoadmap}
                  disabled={isStarting}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4" />
                      Bắt đầu học
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  {completedCourses} / {totalCourses} khóa học hoàn thành
                </span>
                <span className="text-lg font-bold text-primary">{overallProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white overflow-hidden">
                <div
                  className="bg-primary h-full transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Course List */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="sticky top-0 z-20 flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row">
            <h2 className="text-sm font-medium text-slate-600">
              Danh sách khóa học: <span className="font-bold text-slate-900">{totalCourses}</span> khóa
            </h2>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span className="text-slate-600">
                  <span className="font-bold text-slate-800">{completedCourses}</span> Hoàn thành
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <PlayCircle className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-slate-600">
                  <span className="font-bold text-slate-800">
                    {roadmap.courses.filter(c => c.userEnrollment && c.userEnrollment.status !== 'completed').length}
                  </span> Đang học
                </span>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {roadmap.courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
