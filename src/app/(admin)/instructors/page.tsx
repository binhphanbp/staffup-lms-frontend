'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';

function getInitial(fullName: string): string {
  const words = fullName.trim().split(/\s+/);
  if (words.length < 2) return words[0]?.[0]?.toUpperCase() ?? '';
  return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
}

export default function InstructorsPage() {
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search input
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    clearTimeout((handleSearch as any)._timer);
    (handleSearch as any)._timer = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const { data, isLoading, isError, error } = useUsers({
    roleCode: 'trainer',
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  const instructors = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit, totalPages: 1 };

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
            Quản lý Giảng viên & Tech Lead
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
              <span className="material-symbols-outlined text-[18px]">add</span>
              Thêm Giảng viên
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-[#E8F0FE]">
              <span className="material-symbols-outlined text-[24px] text-[#1A73E8]">
                co_present
              </span>
            </div>
            <div>
              <div className="text-[28px] font-normal text-[#202124]">
                {isLoading ? '—' : meta.total}
              </div>
              <div className="text-[12px] text-[#5F6368]">TỔNG GIẢNG VIÊN HOẠT ĐỘNG</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-[#E6F4EA]">
              <span className="material-symbols-outlined text-[24px] text-[#34A853]">school</span>
            </div>
            <div>
              <div className="text-[28px] font-normal text-[#202124]">—</div>
              <div className="text-[12px] text-[#5F6368]">KHÓA HỌC ĐANG PHỤ TRÁCH</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-[#FEF7E0]">
              <span className="material-symbols-outlined text-[24px] text-[#F9AB00]">
                assignment
              </span>
            </div>
            <div>
              <div className="text-[28px] font-normal text-[#202124]">—</div>
              <div className="text-[12px] text-[#5F6368]">BÀI TỰ LUẬN CHỜ CHẤM ĐIỂM</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
            <span className="material-symbols-outlined text-[20px] text-[#5F6368]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm tên, email giảng viên..."
              className="flex-1 border-none bg-transparent text-[13px] text-[#202124] outline-none placeholder:text-[#5F6368]"
            />
          </div>
        </div>

        {/* Loading / Error / Table */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DADCE0] border-t-[#1A73E8]" />
              <span className="text-[13px] text-[#5F6368]">Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="material-symbols-outlined text-[48px] text-[#EA4335]">error</span>
              <span className="text-[14px] text-[#202124]">Không thể tải danh sách giảng viên</span>
              <span className="text-[12px] text-[#5F6368]">
                {error instanceof Error ? error.message : 'Đã xảy ra lỗi'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
            <table className="w-full border-collapse">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Thông tin Giảng viên
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Đơn vị / Loại hình
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Chuyên môn
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Vai trò
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {instructors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-[13px] text-[#5F6368]">
                      Không tìm thấy giảng viên nào
                    </td>
                  </tr>
                ) : (
                  instructors.map((instructor) => (
                    <tr key={instructor.id} className="transition-colors hover:bg-[#F8F9FA]">
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <div className="flex items-center gap-3">
                          {instructor.avatarUrl ? (
                            <img
                              src={instructor.avatarUrl}
                              alt={instructor.fullName}
                              className="h-[32px] w-[32px] rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#FCE8E6] text-[12px] font-medium text-[#EA4335]">
                              {getInitial(instructor.fullName)}
                            </div>
                          )}
                          <div>
                            <div className="text-[13px] font-medium text-[#202124]">
                              {instructor.fullName}
                            </div>
                            <div className="text-[12px] text-[#5F6368]">{instructor.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <div className="text-[13px] font-medium text-[#202124]">
                          {instructor.department?.name ?? '—'}
                        </div>
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium ${
                            instructor.isActive
                              ? 'bg-[#E6F4EA] text-[#34A853]'
                              : 'bg-[#FEF7E0] text-[#F9AB00]'
                          }`}
                        >
                          {instructor.isActive ? 'Hoạt động' : 'Vô hiệu'}
                        </span>
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {instructor.positionTitle ? (
                            <span className="rounded bg-[#F1F3F4] px-2 py-1 text-[11px] text-[#5F6368]">
                              {instructor.positionTitle}
                            </span>
                          ) : (
                            <span className="text-[12px] text-[#5F6368]">—</span>
                          )}
                        </div>
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {instructor.roles.map((role) => (
                            <span
                              key={role.id}
                              className="rounded bg-[#E8F0FE] px-2 py-1 text-[11px] text-[#1A73E8]"
                            >
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <button className="material-symbols-outlined text-[20px] text-[#5F6368] transition-colors hover:text-[#202124]">
                          more_vert
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-[#DADCE0] px-6 py-3">
              <div className="text-[13px] text-[#5F6368]">
                Trang {meta.page} / {meta.totalPages} — Tổng {meta.total} giảng viên
              </div>
              <div className="flex gap-1">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <div
        className={`fixed bottom-6 left-6 z-[3000] flex items-center gap-3 rounded-[4px] bg-[#323232] px-6 py-[14px] text-white shadow-lg transition-transform duration-300 ${toast.visible ? 'translate-y-0' : 'translate-y-[100px]'}`}
      >
        <span className="material-symbols-outlined text-[24px] text-[#81C995]">check_circle</span>
        <span className="text-[14px]">{toast.message}</span>
      </div>
    </>
  );
}
