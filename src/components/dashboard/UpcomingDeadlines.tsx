import React from 'react';
import Link from 'next/link';

interface Deadline {
  id: string;
  courseTitle: string;
  taskTitle: string;
  dueDate: string;
  daysLeft: number;
  type: 'quiz' | 'assignment' | 'course';
  courseId?: string;
  currentProgress?: number;
}

interface UpcomingDeadlinesProps {
  deadlines?: Deadline[];
}

export const UpcomingDeadlines = ({ deadlines = [] }: UpcomingDeadlinesProps) => {
  const displayDeadlines = deadlines;

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 2) return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
    if (daysLeft <= 7)
      return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' };
    return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <i className="fa-solid fa-calendar-days"></i>
          Deadline sắp tới
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {displayDeadlines.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            <i className="fa-regular fa-calendar-check mb-2 block text-2xl"></i>
            Không có deadline nào sắp tới
          </div>
        ) : (
          displayDeadlines.map((deadline) => {
            const urgency = getUrgencyColor(deadline.daysLeft);
            const link =
              deadline.type === 'quiz'
                ? `/quiz-assessment?quizId=${deadline.id}&courseId=${deadline.courseId}`
                : `/courses/detail?id=${deadline.courseId}`;

            return (
              <Link
                key={deadline.id}
                href={link}
                className="flex items-start gap-3 p-4 transition-colors hover:bg-slate-50"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border ${urgency.border} ${urgency.bg}`}
                >
                  <div className={`text-lg font-bold ${urgency.text}`}>{deadline.daysLeft}</div>
                  <div className={`text-[9px] font-semibold ${urgency.text}`}>ngày</div>
                </div>

                <div className="flex-1">
                  <div className="mb-0.5 text-[13px] font-semibold text-slate-800">
                    {deadline.taskTitle}
                  </div>
                  <div className="mb-1 text-[12px] text-slate-600">{deadline.courseTitle}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <i className="fa-regular fa-clock"></i>
                    Hạn: {formatDate(deadline.dueDate)}
                  </div>
                  {deadline.currentProgress !== undefined && (
                    <div className="mt-1.5">
                      <div className="mb-0.5 flex justify-between text-[10px]">
                        <span className="text-slate-500">Tiến độ</span>
                        <span className="font-semibold text-slate-700">{deadline.currentProgress}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${deadline.currentProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <i className="fa-solid fa-chevron-right mt-3 text-xs text-slate-300"></i>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
