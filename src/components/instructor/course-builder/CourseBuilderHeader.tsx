import React from 'react';
import Link from 'next/link';

export const CourseBuilderHeader = () => {
  return (
    <header className="z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/instructor-dashboard"
          className="text-slate-400 transition-colors hover:text-slate-800"
          title="Thoát"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </Link>
        <div className="hidden h-5 w-px bg-slate-200 sm:block"></div>
        <div className="truncate">
          <h1 className="truncate text-[14px] font-bold text-slate-800">
            Course Builder: GoLang Microservices
          </h1>
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span> Draft (Chưa xuất bản)
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-[11px] text-slate-400 md:inline-block">
          Đã lưu tự động lúc 14:02
        </span>
        <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-1.5 text-[12px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
          <i className="fa-solid fa-eye"></i> Xem trước
        </button>
      </div>
    </header>
  );
};
