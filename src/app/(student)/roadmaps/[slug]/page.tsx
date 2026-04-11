'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { getRoadmapBySlug } from '@/data/mockRoadmaps';
import Link from 'next/link';
import {
  Clock,
  Target,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Award,
  ArrowRight,
  Calendar,
} from 'lucide-react';

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const roadmap = getRoadmapBySlug(slug);

  if (!roadmap) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Lộ trình phát triển', href: '/roadmaps' },
            { label: 'Chi tiết' },
          ]}
        />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <i className="fa-solid fa-exclamation-triangle text-3xl text-red-600"></i>
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-800">Không tìm thấy lộ trình</h3>
            <p className="mb-6 text-sm text-slate-500">
              Lộ trình này không tồn tại hoặc đã bị xóa
            </p>
            <button
              onClick={() => router.push('/roadmaps')}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Nâng cao';
      default:
        return difficulty;
    }
  };

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lộ trình phát triển', href: '/roadmaps' },
          { label: roadmap.title },
        ]}
      />

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl pb-20">
          {/* Hero Section */}
          <div className="card mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-700">
                  {roadmap.categoryName}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold ${getDifficultyColor(roadmap.difficulty)}`}
                >
                  {getDifficultyLabel(roadmap.difficulty)}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white">
                  {roadmap.departmentName}
                </span>
              </div>
              <h1 className="mb-3 text-3xl font-bold">{roadmap.title}</h1>
              <p className="mb-6 text-sm opacity-90">{roadmap.description}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                  <Clock className="mb-2 h-5 w-5" />
                  <p className="text-xs opacity-75">Thời gian</p>
                  <p className="text-base font-bold">{roadmap.estimatedMonths} tháng</p>
                </div>
                <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                  <BookOpen className="mb-2 h-5 w-5" />
                  <p className="text-xs opacity-75">Khóa học</p>
                  <p className="text-base font-bold">{roadmap.courses.length} khóa</p>
                </div>
                <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                  <Target className="mb-2 h-5 w-5" />
                  <p className="text-xs opacity-75">Vị trí mục tiêu</p>
                  <p className="text-xs font-bold">{roadmap.targetPosition}</p>
                </div>
                <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                  <Award className="mb-2 h-5 w-5" />
                  <p className="text-xs opacity-75">Kỹ năng</p>
                  <p className="text-base font-bold">{roadmap.skills.length} kỹ năng</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course List */}
              <div className="card mb-8">
                <div className="border-b border-gray-200 p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Các khóa học trong lộ trình
                  </h2>
                  <p className="mt-1 text-xs text-slate-600">
                    Hoàn thành các khóa học theo thứ tự để đạt hiệu quả tốt nhất
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {roadmap.courses.map((course, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
                      >
                        {/* Order Badge */}
                        <div className="absolute -left-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white shadow-lg">
                          {index + 1}
                        </div>

                        <div className="ml-8">
                          <div className="mb-2 flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="mb-1 text-sm font-bold text-slate-800 group-hover:text-blue-600">
                                {course.courseTitle}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {course.estimatedWeeks} tuần
                                </span>
                                {course.isRequired ? (
                                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                    Bắt buộc
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                                    Tùy chọn
                                  </span>
                                )}
                              </div>
                            </div>
                            <Link
                              href={`/courses?search=${course.courseSlug}`}
                              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                            >
                              Xem khóa học
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>

                        {/* Progress Line */}
                        {index < roadmap.courses.length - 1 && (
                          <div className="absolute bottom-0 left-5 h-4 w-0.5 translate-y-full bg-gradient-to-b from-blue-300 to-transparent"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="card mb-8">
                <div className="border-b border-gray-200 p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Kết quả học tập
                  </h2>
                  <p className="mt-1 text-xs text-slate-600">
                    Những gì bạn sẽ đạt được sau khi hoàn thành lộ trình
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {roadmap.outcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <p className="text-sm text-slate-700">{outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Skills */}
              <div className="card mb-8">
                <div className="border-b border-gray-200 p-6">
                  <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
                    <Award className="h-5 w-5 text-purple-600" />
                    Kỹ năng đạt được
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {roadmap.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
                  <h3 className="mb-2 text-base font-bold">Sẵn sàng bắt đầu?</h3>
                  <p className="mb-4 text-xs opacity-90">
                    Bắt đầu hành trình phát triển sự nghiệp của bạn ngay hôm nay
                  </p>
                  <Link
                    href="/courses"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50"
                  >
                    <BookOpen className="h-4 w-4" />
                    Khám phá khóa học
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
