'use client';

import { useState } from 'react';

export default function CertificatesManagementPage() {
  const [toast, setToast] = useState({ visible: false, message: '' });

  const certificates = [
    {
      id: 'CERT-2026-001',
      initial: 'N',
      name: 'Nguyễn Văn An',
      email: 'nguyen.an@company.com',
      course: 'Kỹ năng Bán hàng B2B',
      issueDate: '20/03/2026',
      status: 'valid',
    },
    {
      id: 'CERT-2026-002',
      initial: 'T',
      name: 'Trần Thị Bình',
      email: 'tran.binh@company.com',
      course: 'Onboarding Công ty',
      issueDate: '15/03/2026',
      status: 'valid',
    },
    {
      id: 'CERT-2026-003',
      initial: 'L',
      name: 'Lê Minh Dương',
      email: 'le.duong@company.com',
      course: 'An toàn Thông tin',
      issueDate: '10/03/2026',
      status: 'valid',
    },
    {
      id: 'CERT-2026-004',
      initial: 'P',
      name: 'Phạm Thu Dung',
      email: 'pham.dung@company.com',
      course: 'Kỹ năng Bán hàng B2B',
      issueDate: '05/03/2026',
      status: 'expired',
    },
    {
      id: 'CERT-2026-005',
      initial: 'H',
      name: 'Hoàng Tùng',
      email: 'hoang.tung@company.com',
      course: 'Onboarding Công ty',
      issueDate: '01/03/2026',
      status: 'valid',
    },
  ];

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 md:px-8 py-4 md:py-6">
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
              <option>Kỹ năng Bán hàng B2B</option>
              <option>Onboarding Công ty</option>
              <option>An toàn Thông tin</option>
            </select>
            <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
              <option>Tất cả Trạng thái</option>
              <option>Hợp lệ</option>
              <option>Đã thu hồi</option>
            </select>
          </div>
          <div className="text-[13px] text-[#5F6368]">Tổng số: 5 chứng chỉ đã cấp</div>
        </div>

        {/* Table */}
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
              {certificates.map((cert) => (
                <tr key={cert.id} className="transition-colors hover:bg-[#F8F9FA]">
                  <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] font-medium text-[#202124]">
                    {cert.id}
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]">
                        {cert.initial}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-[#202124]">{cert.name}</div>
                        <div className="text-[12px] text-[#5F6368]">{cert.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                    {cert.course}
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                    {cert.issueDate}
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium ${
                        cert.status === 'valid'
                          ? 'bg-[#E6F4EA] text-[#34A853]'
                          : 'bg-[#FCE8E6] text-[#EA4335]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {cert.status === 'valid' ? 'check_circle' : 'cancel'}
                      </span>
                      {cert.status === 'valid' ? 'Hợp lệ' : 'Đã thu hồi'}
                    </span>
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
            <div className="text-[13px] text-[#5F6368]">Đang hiển thị 5 bản ghi</div>
            <div className="flex gap-1">
              <button className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4]">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4]">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
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
