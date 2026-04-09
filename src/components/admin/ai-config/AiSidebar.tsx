import React from 'react';
import Link from 'next/link';

export const AiSidebar = () => {
  return (
    <aside className="z-[100] flex w-[260px] flex-shrink-0 flex-col border-r border-[#DADCE0] bg-white">
      <div className="flex h-[64px] items-center border-b border-[#DADCE0] px-6 text-[20px] font-medium text-[#202124]">
        <span className="material-symbols-outlined mr-3 text-[28px] text-[#1A73E8] [font-variation-settings:'FILL'_1]">
          hub
        </span>
        LMS Workspace
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto py-3">
        <div className="mb-2 border-b border-[#DADCE0] pb-2">
          <div className="flex items-center gap-2 px-6 py-3 text-[12px] font-medium tracking-[0.8px] text-[#5F6368] uppercase">
            Tổng quan Hệ thống
          </div>
          <div className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]">
            <span className="material-symbols-outlined mr-4 text-[20px]">dashboard</span> Bảng điều
            khiển (Admin)
          </div>
          <div className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]">
            <span className="material-symbols-outlined mr-4 text-[20px]">analytics</span> Báo cáo &
            Thống kê
          </div>
        </div>

        <div className="mb-2 border-b border-[#DADCE0] pb-2">
          <div className="flex items-center gap-2 px-6 py-3 text-[12px] font-medium tracking-[0.8px] text-[#5F6368] uppercase">
            Phân hệ Học viên
          </div>
          <div className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]">
            <span className="material-symbols-outlined mr-4 text-[20px]">school</span> Danh sách Học
            viên
          </div>
          <div className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]">
            <span className="material-symbols-outlined mr-4 text-[20px]">local_library</span> Tiến
            độ & Lộ trình học
          </div>
          <div className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]">
            <span className="material-symbols-outlined mr-4 text-[20px]">workspace_premium</span>{' '}
            Quản lý Chứng chỉ
          </div>
        </div>

        <div className="mb-2 border-b border-[#DADCE0] pb-2">
          <div className="flex items-center gap-2 px-6 py-3 text-[12px] font-medium tracking-[0.8px] text-[#5F6368] uppercase">
            Phân hệ Giảng viên
          </div>
          <div className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]">
            <span className="material-symbols-outlined mr-4 text-[20px]">menu_book</span> Quản lý
            Khóa học
          </div>
          <Link
            href="/grading-evaluation"
            className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]"
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">grading</span> Chấm bài &
            Đánh giá
          </Link>
          <Link
            href="/question-bank"
            className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]"
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">quiz</span> Ngân hàng câu
            hỏi
          </Link>
        </div>

        <div className="mb-2 border-b border-[#DADCE0] pb-2">
          <div className="flex items-center gap-2 px-6 py-3 text-[12px] font-medium tracking-[0.8px] text-[#5F6368] uppercase">
            Hệ thống & AI
          </div>
          <div className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full bg-[#E8F0FE] px-6 font-medium text-[#1A73E8] transition-colors">
            <span className="material-symbols-outlined mr-4 text-[20px] [font-variation-settings:'FILL'_1]">
              robot_2
            </span>{' '}
            Cấu hình AI (Gemini)
          </div>
          <div className="mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]">
            <span className="material-symbols-outlined mr-4 text-[20px]">admin_panel_settings</span>{' '}
            Phân quyền (Roles)
          </div>
        </div>
      </div>
    </aside>
  );
};
