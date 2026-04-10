/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';
import { StatCards } from '@/components/dashboard/StatCards';
import { LearningPath } from '@/components/dashboard/LearningPath';
import { SkillProfile } from '@/components/dashboard/SkillProfile';
import { useEmployeeDashboard } from '@/hooks/useDashboard';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: stats } = useEmployeeDashboard();

  // Find the first in-progress course to show in "Tiếp tục học"
  const continueCourse = stats?.myCourses?.courses?.find((c) => c.status === 'in_progress');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] text-sm text-slate-700">
      <Sidebar />

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header breadcrumbs={[{ label: 'Trang chủ' }, { label: 'Bảng điều khiển' }]} />

        <div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth p-6 lg:p-8">
          {/* Gọi Component Thống kê */}
          <StatCards stats={stats ?? null} />

          <div className="flex flex-col gap-8 xl:flex-row">
            {/* CỘT BÊN TRÁI */}
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              {/* Tiếp tục học */}
              <div>
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Tiếp tục học</h2>
                  <Link href="/courses" className="text-primary text-xs font-semibold hover:underline">
                    Xem tất cả khóa học
                  </Link>
                </div>

                {continueCourse ? (
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
                        Đã ghi danh: {new Date(continueCourse.enrolledAt).toLocaleDateString('vi-VN')}
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
                            <div className="absolute top-0 left-0 h-full w-full animate-[shine_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
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

              {/* Gọi Component Lộ trình */}
              <LearningPath roadmaps={stats?.myRoadmaps ?? null} />
            </div>

            {/* CỘT BÊN PHẢI */}
            <div className="flex w-full shrink-0 flex-col gap-8 xl:w-80">
              {/* Gọi Component Hồ sơ năng lực */}
              <SkillProfile />

              {/* AI Đề xuất */}
              <div className="card overflow-hidden border-purple-200">
                <div className="flex items-center justify-between border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white px-5 py-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-purple-800">
                    <i className="fa-solid fa-wand-magic-sparkles"></i> AI Đề xuất khóa học
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  <div className="group cursor-pointer p-4 transition-colors hover:bg-slate-50">
                    <div className="group-hover:text-primary mb-1 text-[13px] leading-tight font-bold text-slate-800 transition-colors">
                      Bảo mật Web & Phòng chống tấn công
                    </div>
                    <div className="mb-2 text-[11px] text-slate-500">
                      Để lấp đầy khoảng trống kỹ năng Security.
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-600">
                        High Priority
                      </span>
                      <button className="text-primary border-primary hover:bg-primary rounded border px-2 py-1 text-[10px] font-bold transition-colors hover:text-white">
                        Đăng ký
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
