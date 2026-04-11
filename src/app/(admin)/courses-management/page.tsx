'use client';

import { useState } from 'react';
import { useCourses, useDeleteCourse, useUpdateCourseStatus } from '@/hooks/useCourses';
import type { CourseListParams, CourseStatus } from '@/types';

const STATUS_MAP: Record<string, { label: string; badgeClass: string }> = {
  published: { label: 'Đã xuất bản', badgeClass: 'bg-[#2E7D32] text-white' },
  draft: { label: 'Bản nháp', badgeClass: 'bg-[#616161] text-white' },
  archived: { label: 'Đã lưu trữ', badgeClass: 'bg-[#C62828] text-white' },
};

const BG_COLORS = [
  { bg: 'bg-[#E3F2FD]', icon: 'text-[#1976D2]' },
  { bg: 'bg-[#E8F5E9]', icon: 'text-[#388E3C]' },
  { bg: 'bg-[#FFF9C4]', icon: 'text-[#F57C00]' },
  { bg: 'bg-[#F3E5F5]', icon: 'text-[#7B1FA2]' },
  { bg: 'bg-[#FFEBEE]', icon: 'text-[#D32F2F]' },
  { bg: 'bg-[#E0F7FA]', icon: 'text-[#00838F]' },
];

export default function CoursesManagementPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | ''>('');
  const [page, setPage] = useState(1);

  const params: CourseListParams = {
    page,
    limit: 12,
    expand: 'counts',
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
  };

  const { data, isLoading, error } = useCourses(params);
  const deleteCourse = useDeleteCourse();
  const updateStatus = useUpdateCourseStatus();

  const courses = data?.data ?? [];
  const meta = data?.meta;

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa khóa học này?')) return;
    deleteCourse.mutate(id, {
      onSuccess: () => showToast('Đã xóa khóa học'),
    });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate({ id, status }, { onSuccess: () => showToast('Đã cập nhật trạng thái') });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() : `${m}m`;
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">Kho Khóa học Đào tạo</h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Nhập SCORM/xAPI
            </button>
            <button
              onClick={() => showToast('Chuyển sang trang tạo khóa học')}
              className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#174EA6]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tạo khóa học mới
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
              <span className="material-symbols-outlined text-[20px] text-[#5F6368]">search</span>
              <input
                type="text"
                placeholder="Tìm tên khóa học..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-[300px] border-none bg-transparent text-[13px] text-[#202124] outline-none placeholder:text-[#5F6368]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as CourseStatus | '');
                setPage(1);
              }}
              className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none"
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-[36px] w-[36px] items-center justify-center rounded border transition-all ${viewMode === 'grid' ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]' : 'border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4]'}`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex h-[36px] w-[36px] items-center justify-center rounded border transition-all ${viewMode === 'list' ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]' : 'border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4]'}`}
            >
              <span className="material-symbols-outlined text-[20px]">list</span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A73E8] border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-[14px] text-red-600">
            Không thể tải danh sách khóa học. Vui lòng thử lại.
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="mb-4 text-[13px] text-[#5F6368]">
              Đang hiển thị {courses.length} / {meta?.total ?? 0} khóa học
            </div>

            {courses.length === 0 ? (
              <div className="py-20 text-center text-[14px] text-[#5F6368]">
                Chưa có khóa học nào.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {courses.map((course, idx) => {
                  const colors = BG_COLORS[idx % BG_COLORS.length];
                  const statusInfo = STATUS_MAP[course.status] ?? STATUS_MAP.draft;
                  return (
                    <div
                      key={course.id}
                      className="overflow-hidden rounded-lg border border-[#E0E0E0] bg-white transition-shadow hover:shadow-lg"
                    >
                      <div
                        className={`relative flex h-[120px] items-center justify-center ${colors.bg} p-4`}
                      >
                        <span
                          className={`absolute top-4 left-4 inline-flex items-center rounded px-2 py-1 text-[10px] font-semibold uppercase ${statusInfo.badgeClass}`}
                        >
                          {statusInfo.label}
                        </span>
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <span className={`material-symbols-outlined text-[80px] ${colors.icon}`}>
                            school
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-2 text-[10px] font-semibold tracking-wide text-[#757575] uppercase">
                          {course.category?.name ?? 'Chưa phân loại'}
                        </div>
                        <h3 className="mb-3 line-clamp-2 text-[14px] leading-[1.4] font-medium text-[#212121]">
                          {course.title}
                        </h3>
                        <div className="mb-3 text-[12px] text-[#757575]">
                          Giảng viên: {course.trainer?.fullName ?? '—'}
                        </div>
                        <div className="mb-4 flex flex-wrap gap-3 text-[12px] text-[#616161]">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">folder</span>
                            {course.counts?.modules ?? 0} modules
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {formatDuration(course.estimatedDurationMinutes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">group</span>
                            {course.counts?.enrollments ?? 0} học viên
                          </span>
                        </div>
                        <div className="flex gap-2 border-t border-[#F0F0F0] pt-3">
                          <button
                            onClick={() => showToast('Xem chi tiết')}
                            className="flex-1 rounded bg-[#F1F3F4] py-1.5 text-[12px] font-medium text-[#5F6368] transition-all hover:bg-[#E0E0E0]"
                          >
                            Chi tiết
                          </button>
                          {course.status === 'draft' && (
                            <button
                              onClick={() => handleStatusChange(course.id, 'published')}
                              className="flex-1 rounded bg-[#1A73E8] py-1.5 text-[12px] font-medium text-white transition-all hover:bg-[#174EA6]"
                            >
                              Xuất bản
                            </button>
                          )}
                          {course.status === 'published' && (
                            <button
                              onClick={() => handleStatusChange(course.id, 'archived')}
                              className="flex-1 rounded bg-[#F9AB00] py-1.5 text-[12px] font-medium text-white transition-all hover:bg-[#E69500]"
                            >
                              Lưu trữ
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="rounded bg-red-50 px-3 py-1.5 text-[12px] font-medium text-red-600 transition-all hover:bg-red-100"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {meta && meta.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded border border-[#DADCE0] px-3 py-1.5 text-[13px] disabled:opacity-50"
                >
                  ← Trước
                </button>
                <span className="text-[13px] text-[#5F6368]">
                  Trang {meta.page} / {meta.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="rounded border border-[#DADCE0] px-3 py-1.5 text-[13px] disabled:opacity-50"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {toast.visible && (
        <div className="fixed right-6 bottom-8 z-50 flex items-center gap-3 rounded-lg bg-[#323232] px-5 py-3.5 text-[14px] text-white shadow-2xl">
          <span className="material-symbols-outlined text-[20px] text-[#81C784]">check_circle</span>
          {toast.message}
        </div>
      )}
    </>
  );
}
