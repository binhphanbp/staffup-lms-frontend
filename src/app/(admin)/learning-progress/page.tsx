'use client';

import { useState, useMemo } from 'react';
import { toast } from '@/lib/toast';
import { useEnrollments } from '@/hooks/useEnrollments';

const LIMIT = 10;

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả Trạng thái' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getInitial(fullName: string) {
  return fullName.charAt(0).toUpperCase();
}

function getProgressColor(progress: number) {
  if (progress === 100) return '#34A853';
  if (progress >= 60) return '#1A73E8';
  if (progress >= 40) return '#F9AB00';
  return '#EA4335';
}

export default function LearningProgressPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useEnrollments({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    limit: LIMIT,
  });

  const enrollments = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 1 };

  const overdueCount = useMemo(() => enrollments.filter((e) => e.isOverdue).length, [enrollments]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    toast[type](message);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">
            Tiến độ & Lộ trình Học viên
          </h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất dữ liệu
            </button>
            <button
              onClick={() => showToast('Thao tác thành công')}
              className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#174EA6]"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Gửi nhắc nhở (Bulk)
            </button>
          </div>
        </div>

        {/* AI Alert */}
        {overdueCount > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#FCE8E6] bg-[#FEF3F2] p-4">
            <div className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full bg-[#EA4335]">
              <span className="material-symbols-outlined text-[24px] text-white">warning</span>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-[14px] font-semibold text-[#EA4335]">
                Cảnh báo: Có học viên quá hạn
              </h3>
              <p className="text-[13px] leading-[1.5] text-[#5F6368]">
                Phát hiện có <strong>{overdueCount} học viên</strong> đã{' '}
                <strong>quá hạn hoàn thành khóa học</strong>. Vui lòng kiểm tra và gửi nhắc nhở.
              </p>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
            <span className="material-symbols-outlined text-[20px] text-[#5F6368]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm tên, email học viên..."
              className="flex-1 border-none bg-transparent text-[13px] text-[#202124] outline-none placeholder:text-[#5F6368]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DADCE0] border-t-[#1A73E8]" />
              <span className="ml-3 text-[13px] text-[#5F6368]">Đang tải dữ liệu...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="material-symbols-outlined mb-2 text-[40px] text-[#EA4335]">
                error
              </span>
              <p className="text-[13px] text-[#5F6368]">Không thể tải dữ liệu. Vui lòng thử lại.</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="material-symbols-outlined mb-2 text-[40px] text-[#5F6368]">
                school
              </span>
              <p className="text-[13px] text-[#5F6368]">Không tìm thấy bản ghi nào.</p>
            </div>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Học viên
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Khóa học
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Tiến độ
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Deadline
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Trạng thái
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="transition-colors hover:bg-[#F8F9FA]">
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]">
                            {getInitial(enrollment.user.fullName)}
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-[#202124]">
                              {enrollment.user.fullName}
                            </div>
                            <div className="text-[12px] text-[#5F6368]">
                              {enrollment.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                        {enrollment.course.title}
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-[#202124]">
                            {enrollment.progressPercent}%
                          </span>
                          <div className="h-2 w-[120px] overflow-hidden rounded-full bg-[#F1F3F4]">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${enrollment.progressPercent}%`,
                                backgroundColor: getProgressColor(enrollment.progressPercent),
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                        {formatDate(enrollment.dueAt)}
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        {enrollment.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EA] px-2 py-1 text-[12px] font-medium text-[#34A853]">
                            <span className="material-symbols-outlined text-[14px]">
                              check_circle
                            </span>
                            Hoàn thành
                          </span>
                        ) : enrollment.isOverdue ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FCE8E6] px-2 py-1 text-[12px] font-medium text-[#EA4335]">
                            <span className="material-symbols-outlined text-[14px]">warning</span>
                            Quá hạn
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EA] px-2 py-1 text-[12px] font-medium text-[#34A853]">
                            <span className="material-symbols-outlined text-[14px]">
                              check_circle
                            </span>
                            Đúng tiến độ
                          </span>
                        )}
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <button className="material-symbols-outlined text-[20px] text-[#5F6368] transition-colors hover:text-[#202124]">
                          more_vert
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-[#DADCE0] px-6 py-3">
                <div className="text-[13px] text-[#5F6368]">
                  Trang {meta.page} / {meta.totalPages} — Tổng {meta.total} bản ghi
                </div>
                <div className="flex gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40 disabled:hover:bg-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40 disabled:hover:bg-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
