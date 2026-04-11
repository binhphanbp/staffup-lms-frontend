'use client';

import { useState, useMemo } from 'react';
import type { Student } from '@/components/admin/students/types';
import { StudentsTable } from '@/components/admin/students/StudentsTable';
import { Toast } from '@/components/shared/Toast';
import { useUsers } from '@/hooks/useUsers';

const LIMIT = 10;

export default function StudentsPage() {
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'inactive'>('');

  const { data, isLoading, isError } = useUsers({
    roleCode: 'employee',
    search: search || undefined,
    isActive: statusFilter === '' ? undefined : statusFilter === 'active',
    page,
    limit: LIMIT,
  });

  const students: Student[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((u, idx) => ({
      id: idx + 1 + (page - 1) * LIMIT,
      initial: (u.fullName ?? '?')[0].toUpperCase(),
      name: u.fullName,
      email: u.email,
      department: u.department?.name ?? '—',
      role: u.positionTitle ?? u.roles?.[0]?.name ?? '—',
      courses: 0,
      joinDate: new Date(u.createdAt).toLocaleDateString('vi-VN'),
      status: u.isActive ? ('active' as const) : ('inactive' as const),
    }));
  }, [data, page]);

  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">
            Danh sách Học viên (Learners)
          </h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Nhập từ Excel
            </button>
            <button
              onClick={() => showToast('Thao tác thành công')}
              className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#174EA6]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Thêm học viên
            </button>
          </div>
        </div>

        {/* Search & Filter toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-[#5F6368]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-[4px] border border-[#DADCE0] bg-white py-2 pr-4 pl-10 text-[13px] text-[#202124] transition-colors outline-none focus:border-[#1A73E8]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as '' | 'active' | 'inactive');
              setPage(1);
            }}
            className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] transition-colors outline-none focus:border-[#1A73E8]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
          {meta && <span className="text-[13px] text-[#5F6368]">{meta.total} học viên</span>}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DADCE0] border-t-[#1A73E8]" />
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20 text-[#D93025]">
            <span className="material-symbols-outlined text-[32px]">error</span>
            <span className="text-[14px]">Không thể tải danh sách học viên. Vui lòng thử lại.</span>
          </div>
        ) : (
          <>
            <StudentsTable students={students} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[13px] text-[#5F6368]">
                  Trang {page} / {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-1.5 text-[13px] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    Trước
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-1.5 text-[13px] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Toast visible={toast.visible} message={toast.message} />
    </>
  );
}
