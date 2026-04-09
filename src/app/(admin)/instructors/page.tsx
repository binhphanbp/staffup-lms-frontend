'use client';

import { useState } from 'react';

export default function InstructorsPage() {
  const [toast, setToast] = useState({ visible: false, message: '' });

  const instructors = [
    {
      id: 1,
      initial: 'HĐ',
      name: 'Vũ Hải Đăng',
      email: 'dang.vu@company.com',
      role: 'Tech Lead',
      status: 'Nội bộ',
      department: 'Phòng Tech',
      expertise: ['Python', 'System Design'],
      courses: 3,
      students: 145,
      workload: 'high',
    },
    {
      id: 2,
      initial: 'NL',
      name: 'Hoàng Ngọc Lan',
      email: 'lan.hn@company.com',
      role: 'L&D Specialist',
      status: 'Nội bộ',
      department: 'Phòng HR',
      expertise: ['Onboarding', 'Soft Skills'],
      courses: 5,
      students: 320,
      workload: 'completed',
    },
    {
      id: 3,
      initial: 'KQ',
      name: 'Đỗ Kiên Quốc',
      email: 'quoc.dk@company.com',
      role: 'Giám đốc Kinh doanh',
      status: 'Nội bộ',
      department: 'Phòng Sales',
      expertise: ['B2B Sales', 'Negotiation'],
      courses: 2,
      students: 85,
      workload: 'medium',
    },
    {
      id: 4,
      initial: 'MP',
      name: 'Trần Mai Phương',
      email: 'mai.phuong@agency.com',
      role: 'Giảng viên thỉnh giảng',
      status: 'Thuê ngoài',
      department: 'Đối tác đào tạo',
      expertise: ['Digital Marketing', 'SEO'],
      courses: 1,
      students: 50,
      workload: 'high',
    },
    {
      id: 5,
      initial: 'LB',
      name: 'Nguyễn Lê Bảo',
      email: 'bao.nl@company.com',
      role: 'Senior Data Scientist',
      status: 'Nội bộ',
      department: 'Phòng Tech',
      expertise: ['Machine Learning'],
      courses: 1,
      students: 30,
      workload: 'completed',
    },
  ];

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-8 py-6">
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
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-[#E8F0FE]">
              <span className="material-symbols-outlined text-[24px] text-[#1A73E8]">
                co_present
              </span>
            </div>
            <div>
              <div className="text-[28px] font-normal text-[#202124]">5</div>
              <div className="text-[12px] text-[#5F6368]">TỔNG GIẢNG VIÊN HOẠT ĐỘNG</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-[#E6F4EA]">
              <span className="material-symbols-outlined text-[24px] text-[#34A853]">school</span>
            </div>
            <div>
              <div className="text-[28px] font-normal text-[#202124]">36</div>
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
              <div className="text-[28px] font-normal text-[#202124]">128</div>
              <div className="text-[12px] text-[#5F6368]">BÀI TỰ LUẬN CHỜ CHẤM ĐIỂM</div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
            <span className="material-symbols-outlined text-[20px] text-[#5F6368]">search</span>
            <input
              type="text"
              placeholder="Tìm tên, email chuyên gia..."
              className="flex-1 border-none bg-transparent text-[13px] text-[#202124] outline-none placeholder:text-[#5F6368]"
            />
          </div>
          <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
            <option>Tất cả Khóa/Phòng ban</option>
            <option>Phòng Tech</option>
            <option>Phòng HR</option>
            <option>Phòng Sales</option>
          </select>
          <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
            <option>Tất cả Phân loại</option>
            <option>Nội bộ</option>
            <option>Thuê ngoài</option>
          </select>
        </div>

        {/* Table */}
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
                  Chuyên môn (Expertise)
                </th>
                <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                  Tải lượng Công việc
                </th>
                <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.id} className="transition-colors hover:bg-[#F8F9FA]">
                  <td className="border-b border-[#F1F3F4] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#FCE8E6] text-[12px] font-medium text-[#EA4335]">
                        {instructor.initial}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-[#202124]">
                          {instructor.name}
                        </div>
                        <div className="text-[12px] text-[#5F6368]">{instructor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3">
                    <div className="text-[13px] font-medium text-[#202124]">{instructor.role}</div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium ${
                          instructor.status === 'Nội bộ'
                            ? 'bg-[#E6F4EA] text-[#34A853]'
                            : 'bg-[#FEF7E0] text-[#F9AB00]'
                        }`}
                      >
                        {instructor.status}
                      </span>
                      <span className="text-[12px] text-[#5F6368]">{instructor.department}</span>
                    </div>
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {instructor.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-[#F1F3F4] px-2 py-1 text-[11px] text-[#5F6368]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="border-b border-[#F1F3F4] px-4 py-3">
                    <div className="text-[13px] text-[#202124]">
                      {instructor.courses} khóa mở • {instructor.students} học viên
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          instructor.workload === 'high'
                            ? 'text-[#EA4335]'
                            : instructor.workload === 'medium'
                              ? 'text-[#F9AB00]'
                              : 'text-[#34A853]'
                        }`}
                      >
                        {instructor.workload === 'completed' ? 'check_circle' : 'schedule'}
                      </span>
                      <span
                        className={`text-[12px] ${
                          instructor.workload === 'high'
                            ? 'text-[#EA4335]'
                            : instructor.workload === 'medium'
                              ? 'text-[#F9AB00]'
                              : 'text-[#34A853]'
                        }`}
                      >
                        {instructor.workload === 'high'
                          ? '12 bài chờ'
                          : instructor.workload === 'medium'
                            ? '5 bài chờ'
                            : instructor.workload === 'completed'
                              ? 'Đã hoàn tất'
                              : '28 bài chờ'}
                      </span>
                    </div>
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
            <div className="text-[13px] text-[#5F6368]">Đang hiển thị 5 giảng viên</div>
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
