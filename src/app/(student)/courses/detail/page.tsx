/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { StudentHeader } from '@/components/shared/StudentHeader';
import Link from 'next/link';

// Import các component vừa bóc tách
import { HeroBanner } from '@/components/course-detail/HeroBanner';
import { CourseCurriculum } from '@/components/course-detail/CourseCurriculum';
import { CourseSidebar } from '@/components/course-detail/CourseSidebar';
import { useCourseDetail } from '@/hooks/useCourses';

export default function CourseDetailPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  const { data: course, isLoading, isError } = useCourseDetail(courseId);

  if (isLoading) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Thư viện Khóa học', href: '/courses' },
            { label: 'Đang tải...' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center bg-[#f8fafc]">
          <div className="text-sm text-slate-500">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải thông tin khóa học...
          </div>
        </div>
      </>
    );
  }

  if (isError || !course) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Thư viện Khóa học', href: '/courses' },
            { label: 'Lỗi' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center bg-[#f8fafc]">
          <div className="text-center">
            <p className="mb-4 text-sm text-red-500">Không thể tải thông tin khóa học.</p>
            <Link href="/courses" className="text-primary text-sm font-medium hover:underline">
              ← Quay lại Thư viện Khóa học
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Thư viện Khóa học', href: '/courses' },
          { label: course.title },
        ]}
      />

      <div
        className="custom-scrollbar relative flex-1 overflow-y-auto scroll-smooth bg-[#f8fafc]"
        id="mainScrollArea"
      >
        {/* 1. HERO BANNER */}
        <HeroBanner course={course} />

        {/* 2. MAIN CONTENT AREA */}
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-4 md:px-8 md:py-8 lg:flex-row">
          {/* Cột Trái: Nội dung chi tiết */}
          <div className="flex min-w-0 flex-1 flex-col gap-8 pb-12">
            <div className="sticky top-0 z-10 -mt-2 border-b border-gray-200 bg-[#f8fafc] pt-2">
              <nav className="flex gap-6 text-[13px] font-semibold">
                <a
                  href="#overview"
                  className="border-primary text-primary border-b-2 py-3 transition-colors"
                >
                  Tổng quan
                </a>
                <a
                  href="#curriculum"
                  className="border-b-2 border-transparent py-3 text-slate-500 transition-colors hover:text-slate-800"
                >
                  Giáo trình
                </a>
                <a
                  href="#instructor"
                  className="border-b-2 border-transparent py-3 text-slate-500 transition-colors hover:text-slate-800"
                >
                  Giảng viên
                </a>
                <a
                  href="#reviews"
                  className="border-b-2 border-transparent py-3 text-slate-500 transition-colors hover:text-slate-800"
                >
                  Đánh giá
                </a>
              </nav>
            </div>

            {/* Phần Tổng quan và Yêu cầu đầu vào (Giữ lại để HTML trang chính không quá trống) */}
            <section id="overview" className="scroll-mt-20">
              <div className="card border border-gray-200 p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-800">Bạn sẽ học được gì?</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-check text-success mt-1"></i>
                    <span className="text-[13px] leading-relaxed text-slate-600">
                      Phân biệt và áp dụng{' '}
                      <code className="rounded bg-slate-100 px-1 font-mono text-[11px] text-pink-600">
                        SQL
                      </code>{' '}
                      vs{' '}
                      <code className="rounded bg-slate-100 px-1 font-mono text-[11px] text-pink-600">
                        NoSQL
                      </code>{' '}
                      đúng ngữ cảnh.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-check text-success mt-1"></i>
                    <span className="text-[13px] leading-relaxed text-slate-600">
                      Thiết kế hệ thống <span className="font-semibold">Microservices</span> chịu
                      lỗi (Fault Tolerance).
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-check text-success mt-1"></i>
                    <span className="text-[13px] leading-relaxed text-slate-600">
                      Kỹ thuật Caching (Redis/Memcached) và Load Balancing chuyên sâu.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-check text-success mt-1"></i>
                    <span className="text-[13px] leading-relaxed text-slate-600">
                      Xử lý Message Queue (Kafka/RabbitMQ) cho tác vụ bất đồng bộ.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="scroll-mt-20">
              <h2 className="mb-4 text-lg font-bold text-slate-800">Yêu cầu đầu vào</h2>
              <ul className="list-inside list-disc space-y-2 text-[13px] text-slate-600 marker:text-slate-400">
                <li>Đã nắm vững ít nhất một ngôn ngữ Backend (Java, Go, Node.js, Python).</li>
                <li>Có kinh nghiệm cơ bản về vận hành Database.</li>
                <li>
                  Đã hoàn thành khóa học{' '}
                  <Link href="#" className="text-primary font-medium hover:underline">
                    Bảo mật thông tin (OWASP)
                  </Link>
                  .
                </li>
              </ul>
            </section>

            {/* 3. COMPONENT GIÁO TRÌNH */}
            <CourseCurriculum
              modules={course.modules}
              totalModules={course.stats?.totalModules}
              totalLessons={course.stats?.totalLessons}
              totalDurationMinutes={course.stats?.totalDurationMinutes}
            />

            {/* 4. Phần Giảng viên */}
            {course.trainer && (
              <section id="instructor" className="scroll-mt-20">
                <h2 className="mb-4 text-lg font-bold text-slate-800">Giảng viên nội bộ</h2>
                <div className="card flex items-start gap-5 border border-gray-200 p-5">
                  <img
                    src={
                      course.trainer.avatarUrl ??
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(course.trainer.fullName)}&background=0f172a&color=fff&size=100`
                    }
                    className="h-20 w-20 rounded-full shadow-sm"
                    alt={course.trainer.fullName}
                  />
                  <div>
                    <h3 className="mb-1 text-base font-bold text-slate-800">
                      {course.trainer.fullName}
                    </h3>
                    <div className="text-primary mb-3 font-mono text-[12px] tracking-tight">
                      {course.trainer.email}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Cột Phải: Thanh Sidebar chức năng */}
          <CourseSidebar course={course} />
        </div>

        <footer className="border-t border-gray-200 bg-white py-6 text-center text-[11px] text-slate-400">
          &copy; 2026 Staffup LMS. Mã khóa học: {course.slug ?? course.id}.
        </footer>
      </div>
    </>
  );
}
