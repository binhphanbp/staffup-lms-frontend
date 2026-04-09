import React from 'react';
import Link from 'next/link';

export const LearningHeader = () => {
  return (
    <header className="z-20 flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 text-white lg:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/courses/detail"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          title="Quay lại chi tiết khóa học"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div className="hidden h-6 w-px bg-slate-700 sm:block"></div>
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-sm font-bold">
            System Design: Phân tích và Thiết kế Hệ thống Lớn
          </h1>
          <div className="truncate font-mono text-[10px] text-slate-400">
            Bài 4: Database Replication & Partitioning
          </div>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-5">
        <div className="hidden w-48 items-center gap-3 md:flex">
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-[10px] font-bold">
              <span className="text-slate-300">Tiến độ</span>
              <span className="text-primary">12%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="bg-primary h-full w-[12%] rounded-full shadow-[0_0_10px_rgba(22,119,255,0.8)]"></div>
            </div>
          </div>
          <i className="fa-solid fa-trophy text-sm text-slate-600"></i>
        </div>
        <div className="hidden h-6 w-px bg-slate-700 md:block"></div>
        <button
          className="text-slate-400 transition-colors hover:text-white"
          title="Báo lỗi bài giảng"
        >
          <i className="fa-solid fa-flag text-sm"></i>
        </button>
        <button className="bg-primary/20 text-primary hover:bg-primary/30 flex items-center gap-2 rounded px-3 py-1.5 text-xs font-bold transition-colors">
          <i className="fa-solid fa-check"></i> Đánh dấu hoàn thành
        </button>
      </div>
    </header>
  );
};
