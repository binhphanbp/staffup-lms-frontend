import React from 'react';
import type { EmployeeDashboardStats } from '@/types';

interface StatCardsProps {
  stats: EmployeeDashboardStats | null;
}

export const StatCards = ({ stats }: StatCardsProps) => {
  const totalHours = stats ? Math.round(stats.progressSummary.totalTimeSpentMinutes / 60) : 0;
  const completedCourses = stats?.myCourses?.completed ?? 0;
  const totalCourses = stats?.myCourses?.total ?? 0;

  const avgProgress = stats?.progressSummary?.averageProgress ?? 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Giờ học */}
      <div className="card group hover:border-primary relative overflow-hidden p-5 transition-colors">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-bl-full bg-blue-50 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <div className="mb-2 flex items-start justify-between">
            <div className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Giờ học tích lũy
            </div>
            <i className="fa-solid fa-clock-rotate-left text-primary/50 text-lg"></i>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{totalHours}</span>
            <span className="text-sm font-medium text-slate-500">giờ</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-green-600">
            <i className="fa-solid fa-book-open"></i>{' '}
            {stats?.progressSummary?.completedLessons ?? 0} bài học đã hoàn thành
          </div>
        </div>
      </div>

      {/* Card 2: Khóa hoàn thành */}
      <div className="card group hover:border-primary relative overflow-hidden p-5 transition-colors">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-bl-full bg-orange-50 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <div className="mb-2 flex items-start justify-between">
            <div className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Khóa đã hoàn thành
            </div>
            <i className="fa-solid fa-graduation-cap text-warning/50 text-lg"></i>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{completedCourses}</span>
            <span className="text-sm font-medium text-slate-500">khóa</span>
          </div>
          {totalCourses > 0 && (
            <>
              <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="bg-warning h-full"
                  style={{ width: `${Math.round((completedCourses / totalCourses) * 100)}%` }}
                ></div>
              </div>
              <div className="mt-1 text-right text-[10px] text-slate-400">
                Tổng: {totalCourses} khóa ({stats?.myCourses?.inProgress ?? 0} đang học)
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card 3: Chứng chỉ */}
      <div className="card group hover:border-primary relative overflow-hidden p-5 transition-colors">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-bl-full bg-green-50 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <div className="mb-2 flex items-start justify-between">
            <div className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Chứng chỉ đạt được
            </div>
            <i className="fa-solid fa-certificate text-success/50 text-lg"></i>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">
              {stats?.certificates?.total ?? 0}
            </span>
            <span className="text-sm font-medium text-slate-500">chứng chỉ</span>
          </div>
          {(stats?.progressSummary?.upcomingDeadlines?.length ?? 0) > 0 && (
            <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-orange-600">
              <i className="fa-solid fa-clock"></i>{' '}
              {stats!.progressSummary.upcomingDeadlines.length} deadline sắp tới
            </div>
          )}
        </div>
      </div>

      {/* Card 4: Tiến độ trung bình */}
      <div className="card group hover:border-primary relative overflow-hidden p-5 transition-colors">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-bl-full bg-violet-50 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <div className="mb-2 flex items-start justify-between">
            <div className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Tiến độ trung bình
            </div>
            <i className="fa-solid fa-chart-line text-lg text-violet-400/70"></i>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{Math.round(avgProgress)}</span>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-violet-400 transition-all"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
          <div className="mt-1 text-right text-[10px] text-slate-400">
            {totalCourses > 0 ? `Trên ${totalCourses} khóa học` : 'Chưa có dữ liệu'}
          </div>
        </div>
      </div>
    </div>
  );
};
