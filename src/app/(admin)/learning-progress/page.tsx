'use client';

import { useState } from 'react';

export default function LearningProgressPage() {
  const [toast, setToast] = useState({ visible: false, message: '' });

  const students = [
    {
      id: 1,
      initial: 'N',
      name: 'Nguyễn Văn An',
      email: 'nguyen.an@company.com',
      course: 'Kỹ năng Bán hàng B2B',
      progress: 45,
      deadline: '20/03/2026',
      risk: 'high',
      riskPercent: 92,
    },
    {
      id: 2,
      initial: 'T',
      name: 'Trần Thị Bình',
      email: 'tran.binh@company.com',
      course: 'Onboarding Công ty',
      progress: 100,
      deadline: '15/03/2026',
      risk: 'low',
      riskPercent: 5,
    },
    {
      id: 3,
      initial: 'L',
      name: 'Lê Minh Dương',
      email: 'le.duong@company.com',
      course: 'An toàn Thông tin',
      progress: 60,
      deadline: '25/03/2026',
      risk: 'medium',
      riskPercent: 45,
    },
    {
      id: 4,
      initial: 'P',
      name: 'Phạm Thu Dung',
      email: 'pham.dung@company.com',
      course: 'Kỹ năng Bán hàng B2B',
      progress: 10,
      deadline: '12/03/2026',
      risk: 'high',
      riskPercent: 88,
    },
    {
      id: 5,
      initial: 'H',
      name: 'Hoàng Tùng',
      email: 'hoang.tung@company.com',
      course: 'Onboarding Công ty',
      progress: 85,
      deadline: '18/03/2026',
      risk: 'low',
      riskPercent: 12,
    },
    {
      id: 6,
      initial: 'Đ',
      name: 'Đỗ Mai Anh',
      email: 'do.maianh@company.com',
      course: 'An toàn Thông tin',
      progress: 0,
      deadline: '15/03/2026',
      risk: 'high',
      riskPercent: 95,
    },
  ];

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#34A853';
    if (progress >= 60) return '#1A73E8';
    if (progress >= 40) return '#F9AB00';
    return '#EA4335';
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 md:px-8 py-4 md:py-6">
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
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#FCE8E6] bg-[#FEF3F2] p-4">
          <div className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full bg-[#EA4335]">
            <span className="material-symbols-outlined text-[24px] text-white">warning</span>
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-[14px] font-semibold text-[#EA4335]">
              Cảnh báo AI: Nguy cơ bỏ học (Dropout Risk) cao
            </h3>
            <p className="text-[13px] leading-[1.5] text-[#5F6368]">
              Mô hình AI phát hiện có <strong>3 học viên</strong> có nguy cơ trên{' '}
              <strong>80% không hoàn thành khóa học trước deadline</strong>. Nguyên nhân: Không đăng
              nhập trong 5 ngày và điểm quiz &lt; 50%.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
            <span className="material-symbols-outlined text-[20px] text-[#5F6368]">search</span>
            <input
              type="text"
              placeholder="Tìm tên, email học viên..."
              className="flex-1 border-none bg-transparent text-[13px] text-[#202124] outline-none placeholder:text-[#5F6368]"
            />
          </div>
          <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
            <option>Tất cả Khóa học</option>
            <option>Kỹ năng Bán hàng B2B</option>
            <option>Onboarding Công ty</option>
            <option>An toàn Thông tin</option>
          </select>
          <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
            <option>Tất cả Mức độ Rủi ro</option>
            <option>High Risk</option>
            <option>Medium Risk</option>
            <option>Low Risk</option>
          </select>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
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
                  Dự báo Rủi ro (AI)
                </th>
                <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-[#F8F9FA]">
                  <td className="border-b border-[#F1F3F4] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]">
                        {student.initial}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-[#202124]">{student.name}</div>
                        <div className="text-[12px] text-[#5F6368]">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                    {student.course}
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[#202124]">
                        {student.progress}%
                      </span>
                      <div className="h-2 w-[120px] overflow-hidden rounded-full bg-[#F1F3F4]">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${student.progress}%`,
                            backgroundColor: getProgressColor(student.progress),
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                    {student.deadline}
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium ${
                        student.risk === 'high'
                          ? 'bg-[#FCE8E6] text-[#EA4335]'
                          : student.risk === 'medium'
                            ? 'bg-[#FEF7E0] text-[#F9AB00]'
                            : 'bg-[#E6F4EA] text-[#34A853]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {student.risk === 'high'
                          ? 'warning'
                          : student.risk === 'medium'
                            ? 'error'
                            : 'check_circle'}
                      </span>
                      {student.risk === 'high'
                        ? `High Risk (${student.riskPercent}%)`
                        : student.risk === 'medium'
                          ? `Medium (${student.riskPercent}%)`
                          : `Low (${student.riskPercent}%)`}
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
            <div className="text-[13px] text-[#5F6368]">Đang hiển thị 6 bản ghi</div>
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
