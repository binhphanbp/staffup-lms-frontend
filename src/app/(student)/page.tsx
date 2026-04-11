/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { LearningPath } from '@/components/dashboard/LearningPath';
import { SkillProfile } from '@/components/dashboard/SkillProfile';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { RecommendedCourses } from '@/components/dashboard/RecommendedCourses';
import { useEmployeeDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  
  // Check if user doesn't have employee role
  const hasEmployeeRole = user?.roleCodes?.includes('employee') ?? false;
  
  const { data: stats, isLoading, error } = useEmployeeDashboard();

  // Find the first in-progress course to show in "Tiếp tục học"
  const continueCourse = stats?.myCourses?.courses?.find((c) => c.status === 'in_progress');

  // If API error (403 or other) OR no employee role, show empty state with mockdata
  const hasApiError = error !== null || !hasEmployeeRole;
  
  // Check if it's a 403 error (permission denied)
  const is403Error = error && 'response' in error && (error as any).response?.status === 403;

  if (isLoading) {
    return (
      <>
        <StudentHeader breadcrumbs={[{ label: 'Trang chủ' }, { label: 'Bảng điều khiển' }]} />
        <div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth bg-[#f0f2f5] p-6 lg:p-8">
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <i className="fa-solid fa-spinner fa-spin mb-4 text-4xl text-primary"></i>
              <div className="text-sm text-slate-500">Đang tải dữ liệu...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudentHeader breadcrumbs={[{ label: 'Trang chủ' }, { label: 'Bảng điều khiển' }]} />

      <div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth bg-[#f0f2f5] p-6 lg:p-8">
        {/* Welcome Banner */}
        <div className="card mb-6 overflow-hidden border-l-4 border-l-blue-500">
          <div className="bg-linear-to-r from-blue-50 to-purple-50 p-6">
            <h1 className="mb-2 text-xl font-bold text-slate-800">
              Chào mừng trở lại! 👋
            </h1>
            <p className="text-sm text-slate-600">
              Hãy tiếp tục hành trình học tập của bạn
            </p>
          </div>
        </div>

        {/* API Error Notice (only for 403 or no employee role) */}
        {(is403Error || !hasEmployeeRole) && (
          <div className="card mb-6 border-l-4 border-l-yellow-500 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-triangle-exclamation text-yellow-600"></i>
              <div>
                <h3 className="mb-1 text-sm font-bold text-yellow-800">
                  Không thể tải dữ liệu thống kê
                </h3>
                <p className="text-xs text-yellow-700">
                  {!hasEmployeeRole 
                    ? 'Tài khoản của bạn chưa có vai trò "employee". Vui lòng liên hệ quản trị viên để được cấp quyền.'
                    : 'Tài khoản của bạn có thể chưa có quyền truy cập dashboard hoặc cần đăng nhập lại.'
                  }
                  {' '}Bạn vẫn có thể xem các khóa học và lộ trình phát triển bên dưới.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <StatCards stats={hasApiError ? null : (stats ?? null)} />

        {/* Quick Actions */}
        <QuickActions />

        <div className="flex flex-col gap-8 xl:flex-row">
          {/* CỘT BÊN TRÁI */}
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            {/* Tiếp tục học */}
            <div>
              <div className="mb-4 flex items-end justify-between">
                <h2 className="text-lg font-bold text-slate-800">Tiếp tục học</h2>
                <Link
                  href="/courses"
                  className="text-primary text-xs font-semibold hover:underline"
                >
                  Xem tất cả khóa học
                </Link>
              </div>

              {continueCourse && !hasApiError ? (
                <Link
                  href={`/courses/detail/learning-room?courseId=${continueCourse.courseId}`}
                  className="card course-card border-l-primary flex cursor-pointer flex-col gap-5 border-l-4 p-4 transition-shadow hover:shadow-md sm:flex-row"
                >
                  <div className="course-thumb-container relative h-32 w-full shrink-0 rounded-md bg-slate-100 sm:w-48">
                    {continueCourse.courseThumbnail ? (
                      <img
                        src={continueCourse.courseThumbnail}
                        className="h-full w-full object-cover"
                        alt={continueCourse.courseTitle}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        {continueCourse.courseTitle}
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 className="mb-1 truncate text-base font-bold text-slate-800">
                      {continueCourse.courseTitle}
                    </h3>
                    <p className="mb-4 text-xs text-slate-500">
                      Đã ghi danh:{' '}
                      {new Date(continueCourse.enrolledAt).toLocaleDateString('vi-VN')}
                    </p>

                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">Tiến độ</span>
                        <span className="text-primary font-bold">{continueCourse.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="bg-primary relative h-full rounded-full"
                          style={{ width: `${continueCourse.progress}%` }}
                        >
                          <div className="absolute top-0 left-0 h-full w-full animate-[shine_2s_infinite] bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="card p-6 text-center text-sm text-slate-400">
                  Bạn chưa có khóa học nào đang học.{' '}
                  <Link href="/courses" className="text-primary hover:underline">
                    Khám phá khóa học
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <RecentActivity 
              activities={hasApiError ? [] : (stats?.progressSummary?.recentActivity ? [{
                id: '1',
                type: 'lesson_completed' as const,
                title: 'Hoạt động gần đây',
                description: stats.progressSummary.recentActivity,
                timestamp: 'Vừa xong',
              }] : [])}
              totalTimeSpent={hasApiError ? undefined : stats?.progressSummary?.totalTimeSpentMinutes}
              completedLessons={hasApiError ? undefined : stats?.progressSummary?.completedLessons}
            />

            {/* Learning Path */}
            <LearningPath roadmaps={hasApiError ? null : (stats?.myRoadmaps ?? null)} />

            {/* Recommended Roadmaps */}
            <div>
              <div className="mb-4 flex items-end justify-between">
                <h2 className="text-lg font-bold text-slate-800">Lộ trình phát triển nghề nghiệp</h2>
                <Link
                  href="/roadmaps"
                  className="text-primary text-xs font-semibold hover:underline"
                >
                  Xem tất cả lộ trình
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Frontend Developer */}
                <Link
                  href="/roadmaps/frontend-developer"
                  className="card group overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="border-b border-gray-100 bg-linear-to-r from-blue-50 to-purple-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
                        Lập trình
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                        Trung cấp
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600">
                      Frontend Developer
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="mb-3 line-clamp-2 text-xs text-slate-600">
                      Lộ trình toàn diện để trở thành Frontend Developer với React, Vue.js, Next.js
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-clock"></i>
                        6 tháng
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fa-solid fa-book-open"></i>
                        4 khóa học
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Backend Developer */}
                <Link
                  href="/roadmaps/backend-developer"
                  className="card group overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="border-b border-gray-100 bg-linear-to-r from-green-50 to-blue-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
                        Lập trình
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                        Trung cấp
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600">
                      Backend Developer
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="mb-3 line-clamp-2 text-xs text-slate-600">
                      Học Python, PHP, MySQL và xây dựng API backend chuyên nghiệp
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-clock"></i>
                        7 tháng
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fa-solid fa-book-open"></i>
                        4 khóa học
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* CỘT BÊN PHẢI */}
          <div className="flex w-full shrink-0 flex-col gap-8 xl:w-80">
            {/* Upcoming Deadlines */}
            <UpcomingDeadlines 
              deadlines={hasApiError ? [] : (stats?.progressSummary?.upcomingDeadlines?.map(d => ({
                id: d.courseId,
                courseTitle: d.courseTitle,
                taskTitle: 'Hoàn thành khóa học',
                dueDate: d.dueAt,
                daysLeft: d.daysRemaining,
                type: 'course' as const,
                courseId: d.courseId,
                currentProgress: d.currentProgress,
              })) ?? [])}
            />

            {/* Skill Profile */}
            <SkillProfile />

            {/* AI Recommended Courses */}
            <RecommendedCourses />
          </div>
        </div>
      </div>
    </>
  );
}
