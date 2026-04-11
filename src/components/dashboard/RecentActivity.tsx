import React from 'react';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'lesson_completed' | 'quiz_passed' | 'certificate_earned' | 'course_enrolled';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
  totalTimeSpent?: number;
  completedLessons?: number;
}

export const RecentActivity = ({ activities = [], totalTimeSpent, completedLessons }: RecentActivityProps) => {
  const displayActivities = activities;

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'lesson_completed':
        return { icon: 'fa-circle-check', color: 'text-green-600', bg: 'bg-green-50' };
      case 'quiz_passed':
        return { icon: 'fa-trophy', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'certificate_earned':
        return { icon: 'fa-certificate', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'course_enrolled':
        return { icon: 'fa-book-open', color: 'text-purple-600', bg: 'bg-purple-50' };
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <i className="fa-solid fa-clock-rotate-left"></i>
          Hoạt động gần đây
        </h3>
        <Link href="/my-courses" className="text-primary text-xs font-semibold hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {displayActivities.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fa-regular fa-clock-rotate-left mb-2 block text-2xl text-slate-300"></i>
            <div className="text-sm text-slate-400">Chưa có hoạt động nào gần đây</div>
            {(totalTimeSpent !== undefined || completedLessons !== undefined) && (
              <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
                {completedLessons !== undefined && (
                  <div>
                    <i className="fa-solid fa-check-circle mr-1 text-green-500"></i>
                    {completedLessons} bài học hoàn thành
                  </div>
                )}
                {totalTimeSpent !== undefined && (
                  <div>
                    <i className="fa-solid fa-clock mr-1 text-blue-500"></i>
                    {Math.floor(totalTimeSpent / 60)}h {totalTimeSpent % 60}m học tập
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {displayActivities.map((activity) => {
            const iconConfig = getIcon(activity.type);
            const content = (
              <div className="flex gap-3 p-4 transition-colors hover:bg-slate-50">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconConfig.bg}`}
                >
                  <i className={`fa-solid ${iconConfig.icon} ${iconConfig.color}`}></i>
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 text-[13px] font-semibold text-slate-800">
                    {activity.title}
                  </div>
                  <div className="mb-1 text-[12px] text-slate-600">{activity.description}</div>
                  <div className="text-[11px] text-slate-400">{activity.timestamp}</div>
                </div>
              </div>
            );

            return activity.link ? (
              <Link key={activity.id} href={activity.link} className="block">
                {content}
              </Link>
            ) : (
              <div key={activity.id}>{content}</div>
            );
          })}
          {(totalTimeSpent !== undefined || completedLessons !== undefined) && (
            <div className="flex justify-around bg-slate-50 p-3 text-xs">
              {completedLessons !== undefined && (
                <div className="text-center">
                  <div className="font-bold text-slate-800">{completedLessons}</div>
                  <div className="text-slate-500">Bài học hoàn thành</div>
                </div>
              )}
              {totalTimeSpent !== undefined && (
                <div className="text-center">
                  <div className="font-bold text-slate-800">
                    {Math.floor(totalTimeSpent / 60)}h {totalTimeSpent % 60}m
                  </div>
                  <div className="text-slate-500">Thời gian học tập</div>
                </div>
              )}
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
};
