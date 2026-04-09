/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

export const InstructorSidebar = () => {
  return (
    <aside className="z-20 flex w-64 flex-shrink-0 flex-col bg-[#0f172a] text-slate-300">
      <div className="flex h-16 flex-shrink-0 items-center border-b border-slate-800/50 px-6">
        <div className="flex items-center gap-2.5 text-lg font-bold text-white">
          <div className="bg-primary flex h-7 w-7 items-center justify-center rounded text-white">
            <i className="fa-solid fa-layer-group text-[11px]"></i>
          </div>
          <span>
            TechLearn{' '}
            <span className="ml-1 rounded bg-slate-800 px-1.5 py-0.5 text-xs font-normal text-slate-400">
              Lead
            </span>
          </span>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <div className="mb-3 px-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Dashboard
        </div>

        <Link
          href="/instructor-dashboard"
          className="bg-primary/10 flex items-center gap-3 rounded-md px-3 py-2 font-medium text-white transition-colors"
        >
          <i className="fa-solid fa-chart-simple text-primary w-4 text-center text-sm"></i> Tổng
          quan
        </Link>

        <div className="mt-8 mb-3 px-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Đào tạo
        </div>

        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
        >
          <i className="fa-solid fa-book-open w-4 text-center text-sm"></i> Quản lý Khóa học
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
        >
          <i className="fa-solid fa-users w-4 text-center text-sm"></i> Quản lý Học viên
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
        >
          <i className="fa-solid fa-chart-column w-4 text-center text-sm"></i> Báo cáo & Thống kê
        </Link>

        <div className="mt-8 mb-3 px-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Tác vụ cần xử lý
        </div>

        <Link
          href="#"
          className="group flex items-center justify-between rounded-md px-3 py-2 font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
        >
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-code-pull-request group-hover:text-danger w-4 text-center text-sm transition-colors"></i>{' '}
            Chấm Code Lab
          </div>
          <span className="text-danger text-[11px] font-bold">12</span>
        </Link>
        <Link
          href="#"
          className="group flex items-center justify-between rounded-md px-3 py-2 font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
        >
          <div className="flex items-center gap-3">
            <i className="fa-regular fa-message group-hover:text-primary w-4 text-center text-sm transition-colors"></i>{' '}
            Giải đáp Q&A
          </div>
          <span className="text-[11px] font-bold text-slate-300">5</span>
        </Link>
      </div>

      <div className="border-t border-slate-800/50 p-4">
        <Link
          href="/"
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-800 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700"
        >
          <i className="fa-solid fa-arrow-right-arrow-left"></i> Chế độ Học viên
        </Link>
        <div className="flex items-center gap-3 px-2">
          <img
            src="https://ui-avatars.com/api/?name=L+N&background=334155&color=fff"
            className="h-8 w-8 rounded-full border border-slate-600"
            alt="Avatar"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-white">Lê Hoài Nam</div>
            <div className="truncate text-[10px] text-slate-500">Engineering Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
