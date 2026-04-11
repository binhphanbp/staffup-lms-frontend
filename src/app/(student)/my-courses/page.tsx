'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { useEnrollments } from '@/hooks/useEnrollments';
import { BookOpen, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import type { EnrollmentListItem } from '@/types';

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    assigned: { label: 'Đã ghi danh', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'Đang học', color: 'bg-yellow-100 text-yellow-700' },
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-700' },
    expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-700' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.assigned;

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
}

// Course card component
function EnrollmentCard({ enrollment }: { enrollment: EnrollmentListItem }) {
  const { course, progressPercent, status, enrolledAt, dueAt, isOverdue } = enrollment;

  return (
    <Link
      href={`/courses/detail?id=${course.id}`}
      className="card group flex flex-col overflow-hidden transition-all hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <BookOpen className="h-12 w-12" />
          </div>
        )}
        
        {/* Status badge overlay */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} />
        </div>

        {/* Overdue badge */}
        {isOverdue && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            <AlertCircle className="h-3 w-3" />
            Quá hạn
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-base font-bold text-slate-800 group-hover:text-blue-600">
          {course.title}
        </h3>

        {/* Trainer */}
        <p className="mb-3 text-xs text-slate-500">
          Giảng viên: {course.trainer.fullName}
        </p>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Tiến độ</span>
            <span className="font-bold text-blue-600">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-auto space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Ghi danh: {new Date(enrolledAt).toLocaleDateString('vi-VN')}</span>
          </div>
          
          {dueAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                Hạn: {new Date(dueAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}

          {status === 'completed' && enrollment.completedAt && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Hoàn thành: {new Date(enrollment.completedAt).toLocaleDateString('vi-VN')}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function MyCoursesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: enrollmentResponse, isLoading } = useEnrollments();
  
  // Extract array from paginated response
  const enrollments = enrollmentResponse?.data || [];

  // Filter enrollments by status
  const filteredEnrollments = enrollments.filter((e) => {
    if (statusFilter === 'all') return true;
    return e.status === statusFilter;
  });

  // Stats
  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter((e) => e.status === 'in_progress').length,
    completed: enrollments.filter((e) => e.status === 'completed').length,
    overdue: enrollments.filter((e) => e.isOverdue).length,
  };

  return (
    <>
      <StudentHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Khóa học của tôi' }]}
      />

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-slate-800">Khóa học của tôi</h1>
          <p className="text-sm text-slate-500">
            Quản lý và theo dõi tiến độ học tập của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Tổng khóa học</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Đang học</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Quá hạn</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'assigned', label: 'Đã ghi danh' },
            { value: 'in_progress', label: 'Đang học' },
            { value: 'completed', label: 'Hoàn thành' },
            { value: 'expired', label: 'Hết hạn' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Course grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-96 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : filteredEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnrollments.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="mb-4 h-16 w-16 text-slate-300" />
            <h3 className="mb-2 text-lg font-semibold text-slate-700">
              Chưa có khóa học nào
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              Bạn chưa ghi danh khóa học nào. Khám phá các khóa học mới ngay!
            </p>
            <Link
              href="/courses"
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Khám phá khóa học
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
