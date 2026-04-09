import React from 'react';

export const InstructorHeader = () => {
  return (
    <header className="z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
      <h1 className="text-[15px] font-bold text-slate-800">Tổng quan Quản lý Đào tạo</h1>

      <div className="flex items-center gap-6">
        <div className="focus-within:border-primary focus-within:ring-primary hidden w-64 items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 transition-all focus-within:ring-1 md:flex">
          <i className="fa-solid fa-magnifying-glass mr-2 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="w-full border-none bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
          />
        </div>
        <div className="hidden h-4 w-px bg-slate-200 md:block"></div>
        <button className="relative text-slate-500 transition-colors hover:text-slate-800">
          <i className="fa-regular fa-bell text-lg"></i>
          <span className="bg-danger absolute top-0 right-0 h-2 w-2 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
