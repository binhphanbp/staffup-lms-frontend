/* eslint-disable @next/next/no-img-element */
import React from 'react';

export const Sidebar = () => {
  return (
    <aside className="z-30 flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex h-16 items-center border-b border-gray-100 px-6">
        <div className="flex items-center gap-2.5 text-lg font-bold text-slate-800">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded text-white shadow-sm">
            <i className="fa-solid fa-laptop-code text-xs"></i>
          </div>
          <span>
            Tech<span className="font-light text-slate-500">Learn</span>
          </span>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
        <div className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Học tập
        </div>

        <a
          href="#"
          className="hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <i className="fa-solid fa-house w-5 text-center"></i> Bảng điều khiển
        </a>
        <a
          href="#"
          className="bg-primary-bg text-primary flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold transition-colors"
        >
          <i className="fa-solid fa-book-open w-5 text-center"></i> Thư viện Khóa học
        </a>
        <a
          href="#"
          className="hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <i className="fa-solid fa-route w-5 text-center"></i> Lộ trình phát triển
        </a>
        <a
          href="#"
          className="hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <i className="fa-solid fa-code w-5 text-center"></i> Môi trường Thực hành
        </a>

        <div className="mt-6 mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Đánh giá & Thành tích
        </div>

        <a
          href="#"
          className="hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <i className="fa-solid fa-clipboard-check w-5 text-center"></i> Bài Test năng lực
          <span className="ml-auto rounded bg-red-100 px-1.5 text-[10px] font-bold text-red-600">
            1
          </span>
        </a>
        <a
          href="#"
          className="hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <i className="fa-solid fa-award w-5 text-center"></i> Chứng chỉ Nội bộ
        </a>
      </div>

      <div className="border-t border-gray-100 bg-slate-50 p-4">
        <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-gray-200 hover:bg-white">
          <img
            src="https://ui-avatars.com/api/?name=Tran+Bao&background=1677ff&color=fff&bold=true"
            alt="Avatar User"
            className="h-9 w-9 rounded-md border border-gray-200 shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-slate-700">Trần Khắc Bảo</div>
            <div className="truncate font-mono text-[11px] tracking-tight text-slate-500">
              DevOps Engineer
            </div>
          </div>
          <i className="fa-solid fa-gear text-xs text-slate-400"></i>
        </div>
      </div>
    </aside>
  );
};
