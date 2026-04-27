'use client';

import { BookOpen } from 'lucide-react';
import type { CourseDistribution } from '@/services/department-analytics.service';

interface DeptCourseDistributionProps {
  courses: CourseDistribution[];
}

export function DeptCourseDistribution({ courses }: DeptCourseDistributionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E8EAED] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h3 className="flex items-center gap-2 text-base font-semibold text-[#202124] dark:text-white">
          <BookOpen className="h-4 w-4 text-indigo-500" />
          Phân bổ khóa học
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-[#5F6368] dark:text-slate-400">
          <Legend color="#34A853" label="Hoàn thành" />
          <Legend color="#F4B400" label="Đang học" />
          <Legend color="#DADCE0" label="Chưa bắt đầu" />
        </div>
      </header>
      {courses.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-[#5F6368] dark:text-slate-400">
          Chưa có khóa học nào được gán cho phòng ban này.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {courses.map((c) => {
            const total = c.totalEnrollments || 1;
            const completedPct = (c.completed / total) * 100;
            const inProgressPct = (c.inProgress / total) * 100;
            const notStartedPct = (c.notStarted / total) * 100;
            return (
              <li key={c.courseId} className="px-5 py-3.5">
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium text-[#202124] dark:text-white">
                    {c.title}
                  </span>
                  <span className="shrink-0 text-xs text-[#5F6368] dark:text-slate-400">
                    {c.totalEnrollments} học viên · TB {c.averageProgressPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${completedPct}%` }}
                    title={`Hoàn thành: ${c.completed}`}
                  />
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${inProgressPct}%` }}
                    title={`Đang học: ${c.inProgress}`}
                  />
                  <div
                    className="h-full bg-slate-300 dark:bg-slate-600"
                    style={{ width: `${notStartedPct}%` }}
                    title={`Chưa bắt đầu: ${c.notStarted}`}
                  />
                </div>
                <div className="mt-1 flex gap-3 text-[11px] text-[#5F6368] dark:text-slate-400">
                  <span>{c.completed} hoàn thành</span>
                  <span>{c.inProgress} đang học</span>
                  <span>{c.notStarted} chưa bắt đầu</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
