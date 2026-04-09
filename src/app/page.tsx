/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';
import { StatCards } from '@/components/dashboard/StatCards';
import { LearningPath } from '@/components/dashboard/LearningPath';
import { SkillProfile } from '@/components/dashboard/SkillProfile';

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] text-sm text-slate-700">
      <Sidebar />

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header breadcrumbs={[{ label: 'Trang chủ' }, { label: 'Bảng điều khiển' }]} />

        <div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth p-6 lg:p-8">
          {/* Gọi Component Thống kê */}
          <StatCards />

          <div className="flex flex-col gap-8 xl:flex-row">
            {/* CỘT BÊN TRÁI */}
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              {/* Tiếp tục học (Tạm thời giữ nguyên vì nó gắn liền với ảnh khóa học) */}
              <div>
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Tiếp tục học</h2>
                  <a href="/courses" className="text-primary text-xs font-semibold hover:underline">
                    Xem tất cả khóa học
                  </a>
                </div>

                <div className="card course-card border-l-primary flex cursor-pointer flex-col gap-5 border-l-4 p-4 transition-shadow hover:shadow-md sm:flex-row">
                  <div className="course-thumb-container relative h-32 w-full flex-shrink-0 rounded-md bg-slate-100 sm:w-48">
                    <img
                      src="https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                      className="h-full w-full object-cover"
                      alt="System Design"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                      <div className="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <i className="fa-solid fa-play ml-1"></i>
                      </div>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-primary rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase">
                        System Design
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        Bắt buộc (Onboarding)
                      </span>
                    </div>
                    <h3 className="mb-1 truncate text-base font-bold text-slate-800">
                      Thiết kế hệ thống phân tán chịu tải cao
                    </h3>
                    <p className="mb-4 line-clamp-1 text-xs text-slate-500">
                      Giảng viên: Lê Nam (Head of Engineering)
                    </p>

                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          Bài 4: Load Balancing Strategies
                        </span>
                        <span className="text-primary font-bold">65%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="bg-primary relative h-full w-[65%] rounded-full">
                          <div className="absolute top-0 left-0 h-full w-full animate-[shine_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gọi Component Lộ trình */}
              <LearningPath />
            </div>

            {/* CỘT BÊN PHẢI */}
            <div className="flex w-full flex-shrink-0 flex-col gap-8 xl:w-80">
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
