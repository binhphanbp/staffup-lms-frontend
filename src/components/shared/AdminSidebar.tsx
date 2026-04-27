'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileNav } from '@/context/MobileNavContext';
import { useAuthStore } from '@/store/useAuthStore';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { closeMobileNav } = useMobileNav();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roleCodes?.includes('admin') ?? false;

  return (
    <aside className="z-100 flex h-full w-65 shrink-0 flex-col border-r border-[#DADCE0] bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center justify-between border-b border-[#DADCE0] px-6 text-[20px] font-medium text-[#202124] dark:border-slate-800 dark:text-slate-100">
        <div className="flex items-center">
          <span className="material-symbols-outlined mr-3 text-[28px] text-[#1A73E8] [font-variation-settings:'FILL'_1]">
            hub
          </span>
          LMS Workspace
        </div>
        {/* Mobile close button */}
        <button
          className="text-[#5F6368] hover:text-[#202124] lg:hidden dark:text-slate-300 dark:hover:text-white"
          onClick={closeMobileNav}
          aria-label="Đóng menu"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto py-3">
        {/* Tổng quan Hệ thống */}
        <div className="mb-2 border-b border-[#DADCE0] pb-2 dark:border-slate-800">
          <div className="flex items-center gap-2 px-6 py-3 text-[12px] font-medium tracking-[0.8px] text-[#5F6368] uppercase dark:text-slate-500">
            Tổng quan Hệ thống
          </div>
          <Link
            href="/admin-dashboard"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/admin-dashboard'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname === '/admin-dashboard' ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              dashboard
            </span>{' '}
            Bảng điều khiển (Admin)
          </Link>
          <Link
            href="/reports"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/reports'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname === '/reports' ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              analytics
            </span>{' '}
            Báo cáo & Thống kê
          </Link>
          <Link
            href="/manager/onboarding/templates"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname.startsWith('/manager/onboarding/templates')
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname.startsWith('/manager/onboarding/templates') ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              flight_takeoff
            </span>
            Mẫu Onboarding
            <span className="ml-auto rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
              MỚI
            </span>
          </Link>
          <Link
            href="/manager/onboarding/plans"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname.startsWith('/manager/onboarding/plans')
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname.startsWith('/manager/onboarding/plans') ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              checklist
            </span>
            Kế hoạch Onboarding
          </Link>
          <Link
            href="/manager/coach"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/manager/coach'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname === '/manager/coach' ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              psychology
            </span>
            Manager Coach
            <span className="ml-auto rounded-full bg-[#E8F0FE] px-2 py-0.5 text-[10px] font-semibold text-[#1A73E8]">
              AI
            </span>
          </Link>
          <Link
            href="/risk-assessment"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/risk-assessment'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname === '/risk-assessment' ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              warning
            </span>
            Quản lý Rủi ro
            <span className="ml-auto rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
              MỚI
            </span>
          </Link>
        </div>

        {/* Phân hệ Học viên */}
        <div className="mb-2 border-b border-[#DADCE0] pb-2 dark:border-slate-800">
          <div className="flex items-center gap-2 px-6 py-3 text-[12px] font-medium tracking-[0.8px] text-[#5F6368] uppercase dark:text-slate-500">
            Phân hệ Học viên
          </div>
          <Link
            href="/students"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/students'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">school</span> Danh sách Học
            viên
          </Link>
          <Link
            href="/learning-progress"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/learning-progress'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">local_library</span> Tiến
            độ & Lộ trình học
          </Link>
          <Link
            href="/certificates-management"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/certificates-management'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">workspace_premium</span>{' '}
            Quản lý Chứng chỉ
          </Link>
        </div>

        {/* Phân hệ Giảng viên */}
        <div className="mb-2 border-b border-[#DADCE0] pb-2 dark:border-slate-800">
          <div className="flex items-center gap-2 px-6 py-3 text-[12px] font-medium tracking-[0.8px] text-[#5F6368] uppercase dark:text-slate-500">
            Phân hệ Giảng viên
          </div>
          <Link
            href="/instructors"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/instructors'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">co_present</span> Danh sách
            Giảng viên
          </Link>
          <Link
            href="/courses-management"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/courses-management'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">menu_book</span> Quản lý
            Khóa học
          </Link>
          <Link
            href="/grading-evaluation"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/grading-evaluation'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">grading</span> Chấm bài &
            Đánh giá
          </Link>
          <Link
            href="/question-bank"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/question-bank'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">quiz</span> Ngân hàng câu
            hỏi
          </Link>
          <Link
            href="/adaptive-quiz-admin"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname.startsWith('/adaptive-quiz-admin')
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname.startsWith('/adaptive-quiz-admin') ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              psychology_alt
            </span>
            Adaptive Quiz
            <span className="ml-auto rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
              MỚI
            </span>
          </Link>
          <Link
            href="/admin/skills"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname.startsWith('/admin/skills')
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname.startsWith('/admin/skills') ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              hub
            </span>
            Quản lý Skill
            <span className="ml-auto rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
              MỚI
            </span>
          </Link>
          <Link
            href="/manager/skill-gap"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname.startsWith('/manager/skill-gap')
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname.startsWith('/manager/skill-gap') ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              radar
            </span>
            Skill Gap đội
          </Link>
        </div>

        {/* Hệ thống & AI */}
        <div className="mb-2 border-b border-[#DADCE0] pb-2 dark:border-slate-800">
          <div className="flex items-center gap-2 px-6 py-3 text-[12px] font-medium tracking-[0.8px] text-[#5F6368] uppercase dark:text-slate-500">
            Hệ thống & AI
          </div>
          {isAdmin && (
            <Link
              href="/departments"
              className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
                pathname === '/departments'
                  ? 'bg-[#E8F0FE] text-[#1A73E8]'
                  : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124]'
              }`}
            >
              <span
                className={`material-symbols-outlined mr-4 text-[20px] ${pathname === '/departments' ? "[font-variation-settings:'FILL'_1]" : ''}`}
              >
                apartment
              </span>{' '}
              Quáº£n lÃ½ PhÃ²ng ban
            </Link>
          )}
          <Link
            href="/company-documents"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/company-documents'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname === '/company-documents' ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              description
            </span>{' '}
            Tài liệu Công ty
          </Link>
          <Link
            href="/ai-configuration"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/ai-configuration'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname === '/ai-configuration' ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              robot_2
            </span>{' '}
            Cấu hình AI (Gemini)
          </Link>
          <Link
            href="/role-permission"
            className={`mr-4 flex h-10 cursor-pointer items-center rounded-r-full px-6 font-medium transition-colors ${
              pathname === '/role-permission'
                ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined mr-4 text-[20px] ${pathname === '/role-permission' ? "[font-variation-settings:'FILL'_1]" : ''}`}
            >
              admin_panel_settings
            </span>{' '}
            Phân quyền (Roles)
          </Link>
        </div>
      </div>
    </aside>
  );
};
