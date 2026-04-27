'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';
import { useCertificates, useRevokeCertificate } from '@/hooks/useCertificates';

const LIMIT = 10;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

export default function CertificatesManagementPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCertificates({ page, limit: LIMIT });
  const revokeMutation = useRevokeCertificate();

  const certificates = data?.certificates ?? [];
  const pagination = data?.pagination;

  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    toast[type](message);

  const handleRevoke = (id: string) => {
    revokeMutation.mutate(id, {
      onSuccess: () => showToast('Thu hồi chứng chỉ thành công'),
      onError: () => showToast('Có lỗi xảy ra khi thu hồi chứng chỉ', 'error'),
    });
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">
            Quản lý Chứng chỉ (Certificates)
          </h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]">
              <span className="material-symbols-outlined text-[18px]">description</span>
              Thiết lập Mẫu (Templates)
            </button>
            <button
              onClick={() => showToast('Thao tác thành công')}
              className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#174EA6]"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất dữ liệu
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
                placeholder="Tìm kiếm chứng chỉ..."
                className="w-[300px] border-none bg-transparent text-[13px] text-[#202124] outline-none placeholder:text-[#5F6368]"
              />
            </div>
            <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
              <option>Tất cả Khóa học</option>
            </select>
            <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
              <option>Tất cả Trạng thái</option>
              <option>Hợp lệ</option>
              <option>Đã thu hồi</option>
            </select>
          </div>
          <div className="text-[13px] text-[#5F6368]">
            {pagination ? `Tổng số: ${pagination.total} chứng chỉ đã cấp` : ''}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DADCE0] border-t-[#1A73E8]" />
              <span className="text-[13px] text-[#5F6368]">Đang tải dữ liệu...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="material-symbols-outlined text-[48px] text-[#EA4335]">error</span>
              <span className="text-[14px] text-[#5F6368]">Không thể tải dữ liệu chứng chỉ</span>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && certificates.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="material-symbols-outlined text-[48px] text-[#DADCE0]">
                workspace_premium
              </span>
              <span className="text-[14px] text-[#5F6368]">Chưa có chứng chỉ nào được cấp</span>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && certificates.length > 0 && (
          <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
            <table className="w-full border-collapse">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Mã Chứng chỉ
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Học viên nhận
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Thuộc Khóa học
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Ngày cấp
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
                {certificates.map((cert) => {
                  const user = cert.enrollment.user;
                  const course = cert.enrollment.course;
                  const isRevoked = !!cert.revokedAt;

                  return (
                    <tr key={cert.id} className="transition-colors hover:bg-[#F8F9FA]">
                      <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] font-medium text-[#202124]">
                        {cert.certificateCode}
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]">
                            {getInitial(user.fullName)}
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-[#202124]">
                              {user.fullName}
                            </div>
                            <div className="text-[12px] text-[#5F6368]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                        {course.title}
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                        {formatDate(cert.issuedAt)}
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium ${
                            isRevoked
                              ? 'bg-[#FCE8E6] text-[#EA4335]'
                              : 'bg-[#E6F4EA] text-[#34A853]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {isRevoked ? 'cancel' : 'check_circle'}
                          </span>
                          {isRevoked ? 'Đã thu hồi' : 'Hợp lệ'}
                        </span>
                      </td>
                      <td className="border-b border-[#F1F3F4] px-4 py-3">
                        <div className="flex items-center gap-2">
                          {cert.pdfUrl && (
                            <a
                              href={cert.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="material-symbols-outlined text-[20px] text-[#5F6368] transition-colors hover:text-[#1A73E8]"
                              title="Tải PDF"
                            >
                              download
                            </a>
                          )}
                          {!isRevoked && (
                            <button
                              onClick={() => handleRevoke(cert.id)}
                              disabled={revokeMutation.isPending}
                              className="material-symbols-outlined text-[20px] text-[#5F6368] transition-colors hover:text-[#EA4335] disabled:opacity-50"
                              title="Thu hồi"
                            >
                              block
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between border-t border-[#DADCE0] px-6 py-3">
                <div className="text-[13px] text-[#5F6368]">
                  Trang {pagination.page} / {pagination.totalPages} — {pagination.total} bản ghi
                </div>
                <div className="flex gap-1">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
