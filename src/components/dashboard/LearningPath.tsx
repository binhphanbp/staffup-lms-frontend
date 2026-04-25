import React from 'react';
import Link from 'next/link';
import type { EmployeeDashboardStats } from '@/types';

interface LearningPathProps {
  roadmaps: EmployeeDashboardStats['myRoadmaps'] | null;
}

function statusLabel(status: string) {
  if (status === 'completed') return { text: 'Hoàn thành', cls: 'bg-green-100 text-green-700' };
  if (status === 'in_progress') return { text: 'Đang học', cls: 'bg-blue-100 text-blue-700' };
  return { text: 'Được giao', cls: 'bg-slate-100 text-slate-500' };
}

export const LearningPath = ({ roadmaps }: LearningPathProps) => {
  const list = roadmaps?.roadmaps ?? [];

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <i className="fa-solid fa-route text-primary text-sm"></i> Lộ trình học tập
          {list.length > 0 && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-bold">
              {list.length}
            </span>
          )}
        </h2>
        <Link href="/roadmaps" className="text-primary text-xs font-semibold hover:underline">
          Xem tất cả
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="card p-6 text-center text-sm text-slate-400">
          Bạn chưa được gán lộ trình học tập nào.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((roadmap) => {
            const pct = roadmap.progressPercent ?? 0;
            const sl = statusLabel(roadmap.status);
            return (
              <Link
                key={roadmap.assignmentId}
                href={`/roadmaps/${roadmap.roadmapId}`}
                className="card group flex flex-col gap-3 p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="group-hover:text-primary truncate text-sm font-bold text-slate-800 transition-colors">
                      {roadmap.roadmapTitle}
                    </h3>
                    {roadmap.targetPosition && (
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                        <i className="fa-solid fa-bullseye text-[9px]"></i> Mục tiêu:{' '}
                        {roadmap.targetPosition}
                      </div>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${sl.cls}`}
                  >
                    {sl.text}
                  </span>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      {roadmap.completedCourses}/{roadmap.totalCourses} khóa học
                    </span>
                    <span className="text-primary font-bold">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${roadmap.status === 'completed' ? 'bg-green-500' : 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Giao: {new Date(roadmap.assignedAt).toLocaleDateString('vi-VN')}</span>
                  {roadmap.completedAt && (
                    <span className="font-medium text-green-600">
                      <i className="fa-solid fa-check mr-1"></i>
                      Hoàn thành: {new Date(roadmap.completedAt).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
