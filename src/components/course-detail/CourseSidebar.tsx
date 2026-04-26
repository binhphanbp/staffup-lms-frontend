/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import type { CourseDetailResponse, EnrollmentListItem } from '@/types';

interface CourseSidebarProps {
  course?: CourseDetailResponse;
  enrollment?: EnrollmentListItem | null;
  isEnrolling?: boolean;
  onSelfEnroll?: () => void;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ''}`;
  return `${m}m`;
}

export const CourseSidebar = ({
  course,
  enrollment,
  isEnrolling = false,
  onSelfEnroll,
}: CourseSidebarProps) => {
  const stats = course?.stats;
  const totalDuration = stats?.totalDurationMinutes
    ? formatDuration(stats.totalDurationMinutes)
    : '--';
  const totalLessons = stats?.totalLessons ?? '--';
  const isJoined = Boolean(enrollment);
  const ctaHref = course ? `/courses/detail/learning-room?courseId=${course.id}` : '#';

  return (
    <div className="relative w-full flex-shrink-0 lg:w-[320px] xl:w-[350px]">
      <div className="sticky top-6 flex flex-col gap-6">
        <div className="card border-t-primary border-t-4 p-6 shadow-lg shadow-slate-200/50">
          {isJoined ? (
            <Link
              href={ctaHref}
              className="bg-primary hover:bg-primary-hover mb-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-transform active:scale-95"
            >
              <i className="fa-solid fa-play"></i> Tiếp tục học
            </Link>
          ) : (
            <button
              type="button"
              onClick={onSelfEnroll}
              disabled={!course || isEnrolling}
              className="bg-primary hover:bg-primary-hover mb-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className={`fa-solid ${isEnrolling ? 'fa-spinner fa-spin' : 'fa-user-plus'}`}></i>
              {isEnrolling ? 'Đang tham gia...' : 'Tham gia khóa học'}
            </button>
          )}

          {isJoined && enrollment ? (
            <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">
              Bạn đã tham gia khóa học.
              <div className="mt-1 font-semibold">
                Tiến độ hiện tại: {Math.round(enrollment.progressPercent ?? 0)}%
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
              Cần tham gia khóa học trước khi vào phòng học và làm bài test.
            </div>
          )}

          <div className="space-y-3.5 text-[13px] text-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-clock w-4 text-center text-slate-400"></i> Thời lượng
              </div>
              <span className="font-medium text-slate-800">{totalDuration}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-layer-group w-4 text-center text-slate-400"></i> Số bài
                học
              </div>
              <span className="font-medium text-slate-800">{totalLessons} bài</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-cubes w-4 text-center text-slate-400"></i> Số phần
              </div>
              <span className="font-medium text-slate-800">{stats?.totalModules ?? '--'} phần</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-award w-4 text-center text-slate-400"></i> Chứng nhận
              </div>
              <span className="font-medium text-slate-800">Cấp nội bộ (Level UP)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-mobile-screen-button w-4 text-center text-slate-400"></i>
                Truy cập
              </div>
              <span className="font-medium text-slate-800">Mobile & Web</span>
            </div>
          </div>

          <div className="my-5 h-px w-full bg-gray-100"></div>

          <button className="flex w-full items-center justify-center gap-2 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:text-slate-800">
            <i className="fa-solid fa-share-nodes"></i> Chia sẻ khóa học
          </button>
        </div>

        {course?.trainer && (
          <div className="card border border-gray-200 p-5">
            <h3 className="mb-3 text-[13px] font-bold text-slate-800">Giảng viên</h3>
            <div className="flex gap-3">
              <img
                src={
                  course.trainer.avatarUrl ??
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(course.trainer.fullName)}&background=0f172a&color=fff&size=100`
                }
                className="h-12 w-12 rounded-full object-cover"
                alt={course.trainer.fullName}
              />
              <div>
                <div className="mb-1 text-[13px] font-bold text-slate-700">
                  {course.trainer.fullName}
                </div>
                <div className="text-[11px] text-slate-400">{course.trainer.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
