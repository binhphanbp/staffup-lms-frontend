'use client';
import React, { useState } from 'react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { FilterSidebar } from '@/components/course/FilterSidebar';
import { CourseSkeleton } from '@/components/course/CourseSkeleton';
import { CourseCard, type CourseType } from '@/components/course/CourseCard';
import { Pagination } from '@/components/shared/Pagination';
import { useCourses } from '@/hooks/useCourses';
import { useCourseStore } from '@/store/useCourseStore';
import type { CourseListItem } from '@/types';

// Helper: chuyển dữ liệu API → CourseType cho CourseCard
function toCourseType(item: CourseListItem): CourseType {
  const durationMin = item.estimatedDurationMinutes ?? 0;
  const hours = Math.floor(durationMin / 60);
  const mins = durationMin % 60;
  const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return {
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    imageUrl: item.thumbnailUrl ?? undefined,
    level: item.category?.name ?? 'All Levels',
    tags: (item.tags ?? []).map((t) => ({ label: t.name, colorClass: 'bg-blue-500' })),
    author: item.trainer
      ? {
          name: item.trainer.fullName,
          avatar:
            item.trainer.avatarUrl ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.trainer.fullName)}&background=f1f5f9&color=475569`,
        }
      : undefined,
    duration,
  };
}

export default function CourseCatalog() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  const { filters, resetFilters } = useCourseStore();

  // Gọi API thật qua React Query
  const { data, isLoading, isError } = useCourses({
    search: filters.search || undefined,
    categoryId: filters.category || undefined,
    page,
    limit,
    sortBy: filters.sortBy === 'newest' ? 'createdAt' : undefined,
    sortOrder: filters.sortBy === 'newest' ? 'desc' : undefined,
  });

  const courses = data?.data ?? [];
  const meta = data?.meta;

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleReset = () => {
    resetFilters();
    setPage(1);
  };

  const handleFilterChange = () => {
    setPage(1); // Reset về trang 1 khi filter thay đổi
  };

  return (
    <>
      <StudentHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Thư viện Khóa học' }]}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <FilterSidebar
          isOpen={isFilterOpen}
          onReset={handleReset}
          onFilterChange={handleFilterChange}
        />

        <div className="custom-scrollbar relative flex h-full flex-1 flex-col overflow-y-auto scroll-smooth p-4 lg:p-8">
          {/* Thanh công cụ Bộ lọc */}
          <div className="sticky top-0 z-20 mb-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFilter}
                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-all ${isFilterOpen ? 'bg-primary-bg text-primary border-primary' : 'border-gray-300 bg-white text-slate-700'}`}
              >
                <i className="fa-solid fa-sliders"></i>{' '}
                <span>{isFilterOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</span>
              </button>
              <h1 className="text-sm font-medium text-slate-600">
                Tìm thấy <span className="font-bold text-slate-900">{meta?.total ?? 0}</span> khóa
                học
              </h1>
            </div>
          </div>

          {/* Error state */}
          {isError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
              Không thể tải danh sách khóa học. Vui lòng thử lại.
            </div>
          )}

          {/* GRID HIỂN THỊ KHÓA HỌC */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {isLoading
              ? Array.from({ length: limit }).map((_, idx) => <CourseSkeleton key={idx} />)
              : courses.map((item) => <CourseCard key={item.id} course={toCourseType(item)} />)}
          </div>

          {/* Empty state */}
          {!isLoading && courses.length === 0 && !isError && (
            <div className="py-16 text-center text-sm text-slate-500">
              Không tìm thấy khóa học nào phù hợp.
            </div>
          )}

          {/* Phân trang */}
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              itemsPerPage={meta.limit}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
      </div>
    </>
  );
}
