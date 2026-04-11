import React from 'react';

interface StatsOverviewProps {
  totalStudents?: number;
  ratingAvg?: number;
  pendingGrading?: number;
  totalCourses?: number;
  loading?: boolean;
}

const Skeleton = () => <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />;

export const StatsOverview = ({
  totalStudents,
  ratingAvg,
  pendingGrading,
  totalCourses,
  loading,
}: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="clean-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Học viên tham gia</span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400">
            <i className="fa-solid fa-users text-sm"></i>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <Skeleton />
          ) : (
            <span className="text-2xl font-bold text-slate-800">{totalStudents ?? '—'}</span>
          )}
        </div>
      </div>

      <div className="clean-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Đánh giá trung bình</span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400">
            <i className="fa-regular fa-star text-sm"></i>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          {loading ? (
            <Skeleton />
          ) : (
            <>
              <span className="text-2xl font-bold text-slate-800">{ratingAvg ?? '—'}</span>
              {ratingAvg !== null && ratingAvg !== undefined && (
                <span className="text-sm font-medium text-slate-400">/ 5.0</span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="clean-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Bài tập chờ chấm</span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400">
            <i className="fa-solid fa-code-pull-request text-sm"></i>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <Skeleton />
          ) : (
            <span
              className={`text-2xl font-bold ${pendingGrading && pendingGrading > 0 ? 'text-danger' : 'text-slate-800'}`}
            >
              {pendingGrading ?? '—'}
            </span>
          )}
        </div>
      </div>

      <div className="clean-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Tổng khóa học</span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400">
            <i className="fa-solid fa-book text-sm"></i>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <Skeleton />
          ) : (
            <span className="text-2xl font-bold text-slate-800">{totalCourses ?? '—'}</span>
          )}
        </div>
      </div>
    </div>
  );
};
