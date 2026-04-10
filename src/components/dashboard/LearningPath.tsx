import React from 'react';
import type { EmployeeDashboardStats } from '@/types';

interface LearningPathProps {
  roadmaps: EmployeeDashboardStats['myRoadmaps'] | null;
}

export const LearningPath = ({ roadmaps }: LearningPathProps) => {
  const roadmap = roadmaps?.roadmaps?.[0]; // Show first roadmap

  if (!roadmap) {
    return (
      <div className="card flex h-full flex-col">
        <div className="flex items-center justify-between rounded-t-lg border-b border-gray-100 bg-gray-50/50 px-5 py-4">
          <h3 className="font-bold text-slate-800">Lộ trình học tập</h3>
        </div>
        <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-400">
          Bạn chưa được gán lộ trình học tập nào.
        </div>
      </div>
    );
  }

  const progressPercent = roadmap.progressPercent ?? 0;

  return (
    <div className="card flex h-full flex-col">
      <div className="flex items-center justify-between rounded-t-lg border-b border-gray-100 bg-gray-50/50 px-5 py-4">
        <div>
          <h3 className="font-bold text-slate-800">Lộ trình: {roadmap.roadmapTitle}</h3>
          <div className="mt-0.5 text-[11px] text-slate-500">
            Tiến độ: {roadmap.completedCourses}/{roadmap.totalCourses} khóa học ({progressPercent}%)
            {roadmap.targetPosition && <> • Mục tiêu: {roadmap.targetPosition}</>}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>
            {roadmap.status === 'completed'
              ? 'Đã hoàn thành'
              : roadmap.status === 'in_progress'
                ? 'Đang học tập'
                : 'Đã gán'}
          </span>
          <span>{progressPercent}%</span>
        </div>

        {roadmaps && roadmaps.roadmaps.length > 1 && (
          <div className="mt-4 text-[11px] text-slate-400">
            + {roadmaps.roadmaps.length - 1} lộ trình khác
          </div>
        )}
      </div>
    </div>
  );
};
