'use client';

import { useState } from 'react';

export default function CoursesManagementPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const courses = [
    {
      id: 1,
      title: 'Onboarding - Giới thiệu công ty & Văn hóa',
      category: 'TOÀN CÔNG TY',
      instructor: 'Phòng HR',
      modules: 3,
      lessons: 6,
      duration: '4h 30m',
      students: 120,
      status: 'published',
      bgColor: 'bg-[#E3F2FD]',
      iconColor: 'text-[#1976D2]',
    },
    {
      id: 2,
      title: 'Kỹ năng Bán hàng cơ bản (B2B)',
      category: 'SALES',
      instructor: 'Đỗ Kiên Quốc',
      modules: 4,
      lessons: 8,
      duration: '12h 00m',
      students: 45,
      status: 'published',
      bgColor: 'bg-[#E8F5E9]',
      iconColor: 'text-[#388E3C]',
    },
    {
      id: 3,
      title: 'Lập trình Python Căn bản cho DA',
      category: 'TECH',
      instructor: 'Vũ Hải Đăng',
      modules: 5,
      lessons: 15,
      duration: '24h 00m',
      students: 28,
      status: 'published',
      bgColor: 'bg-[#FFF9C4]',
      iconColor: 'text-[#F57C00]',
    },
    {
      id: 4,
      title: 'Kỹ năng Giao tiếp & Trí tuệ Cảm xúc (EQ)',
      category: 'TOÀN CÔNG TY',
      instructor: 'Hoàng Ngọc Lan',
      modules: 3,
      lessons: 6,
      duration: '8h 00m',
      students: 85,
      status: 'published',
      bgColor: 'bg-[#E3F2FD]',
      iconColor: 'text-[#1976D2]',
    },
    {
      id: 5,
      title: 'An toàn Thông tin & GDPR 2026',
      category: 'TOÀN CÔNG TY',
      instructor: 'Phòng IT',
      modules: 2,
      lessons: 4,
      duration: '2h 15m',
      students: 0,
      status: 'draft',
      bgColor: 'bg-[#FFEBEE]',
      iconColor: 'text-[#D32F2F]',
    },
    {
      id: 6,
      title: '[Gỡ] Hướng dẫn sử dụng CRM v1.0',
      category: 'SALES',
      instructor: 'Admin',
      modules: 2,
      lessons: 5,
      duration: '3h 00m',
      students: 150,
      status: 'archived',
      bgColor: 'bg-[#FAFAFA]',
      iconColor: 'text-[#757575]',
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
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">Kho Khóa học Đào tạo</h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Nhập SCORM/xAPI
            </button>
            <button
              onClick={() => showToast('Thao tác thành công')}
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
                className="w-[300px] border-none bg-transparent text-[13px] text-[#202124] outline-none placeholder:text-[#5F6368]"
              />
            </div>
            <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
              <option>Tất cả Phòng ban</option>
              <option>Toàn công ty</option>
              <option>Sales</option>
              <option>Tech</option>
              <option>HR</option>
            </select>
            <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
              <option>Tất cả Trạng thái</option>
              <option>Đã xuất bản</option>
              <option>Bản nháp</option>
              <option>Đã lưu trữ</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-[36px] w-[36px] items-center justify-center rounded border transition-all ${
                viewMode === 'grid'
                  ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]'
                  : 'border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex h-[36px] w-[36px] items-center justify-center rounded border transition-all ${
                viewMode === 'list'
                  ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]'
                  : 'border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">list</span>
            </button>
          </div>
        </div>

        <div className="mb-4 text-[13px] text-[#5F6368]">Đang hiển thị 6 khóa học</div>

        {/* Grid View */}
        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-lg border border-[#E0E0E0] bg-white transition-shadow hover:shadow-lg"
            >
              {/* Header with icon */}
              <div
                className={`relative flex h-[120px] items-center justify-center ${course.bgColor} p-4`}
              >
                <span
                  className={`absolute top-4 left-4 inline-flex items-center rounded px-2 py-1 text-[10px] font-semibold uppercase ${
                    course.status === 'published'
                      ? 'bg-[#2E7D32] text-white'
                      : course.status === 'draft'
                        ? 'bg-[#616161] text-white'
                        : 'bg-[#C62828] text-white'
                  }`}
                >
                  {course.status === 'published'
                    ? 'Đã xuất bản'
                    : course.status === 'draft'
                      ? 'Bản nháp'
                      : 'Đã lưu trữ'}
                </span>
                <span className={`material-symbols-outlined text-[80px] ${course.iconColor}`}>
                  school
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 text-[10px] font-semibold tracking-wide text-[#757575] uppercase">
                  {course.category}
                </div>
                <h3 className="mb-3 line-clamp-2 text-[14px] leading-[1.4] font-medium text-[#212121]">
                  {course.title}
                </h3>

                <div className="mb-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-[12px] text-[#616161]">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    {course.instructor}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#616161]">
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    {course.modules} Modules • {course.lessons} Bài học
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#616161]">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {course.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E0E0E0] pt-3">
                  <span className="text-[13px] font-semibold text-[#1976D2]">
                    {course.students} Học viên
                  </span>
                  <button className="material-symbols-outlined text-[20px] text-[#757575] transition-colors hover:text-[#212121]">
                    more_vert
                  </button>
                </div>
              </div>
            </div>
          ))}
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
