import React from 'react';

export const QuizLeftSidebar = () => {
  return (
    <aside className="z-20 flex hidden w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white shadow-sm md:flex">
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

      <div className="custom-scrollbar pointer-events-none flex-1 space-y-1.5 overflow-y-auto px-3 py-6 opacity-60">
        <div className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Học tập
        </div>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-600">
          <i className="fa-solid fa-house w-5 text-center"></i> Bảng điều khiển
        </div>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-600">
          <i className="fa-solid fa-book-open w-5 text-center"></i> Thư viện Khóa học
        </div>

        <div className="mt-6 mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Đánh giá & Thành tích
        </div>
        <div className="bg-primary-bg text-primary flex items-center gap-3 rounded-lg border border-blue-200 px-3 py-2.5 font-semibold">
          <i className="fa-solid fa-clipboard-check w-5 text-center"></i> Bài Test năng lực
          <span className="bg-primary ml-auto animate-pulse rounded px-2 py-0.5 text-[10px] font-bold text-white">
            Đang thi
          </span>
        </div>
      </div>

      <div className="border-t border-orange-100 bg-orange-50 p-4">
        <div className="flex items-start gap-2 text-xs text-orange-700">
          <i className="fa-solid fa-shield-halved mt-0.5"></i>
          <div className="font-medium">
            Chế độ thi nghiêm ngặt. Vui lòng không làm mới hoặc chuyển trang.
          </div>
        </div>
      </div>
    </aside>
  );
};
