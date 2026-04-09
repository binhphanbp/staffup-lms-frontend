import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: PaginationProps) => {
  return (
    <div className="mt-10 mb-4 flex w-full flex-col items-center">
      <div className="flex items-center justify-center gap-2">
        {/* Nút Previous */}
        <button
          className={`flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white transition-colors ${currentPage === 1 ? 'cursor-not-allowed text-slate-400 opacity-50' : 'hover:text-primary hover:border-primary text-slate-600'}`}
          disabled={currentPage === 1}
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>

        {/* Các trang (Tạm thời fix cứng để demo UI, sau này sẽ dùng vòng lặp render theo totalPages) */}
        <button className="border-primary bg-primary flex h-8 w-8 items-center justify-center rounded border text-xs font-medium text-white shadow-md shadow-blue-500/20 transition-colors">
          1
        </button>
        <button className="hover:text-primary hover:border-primary flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-xs font-medium text-slate-600 transition-colors">
          2
        </button>
        <button className="hover:text-primary hover:border-primary flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-xs font-medium text-slate-600 transition-colors">
          3
        </button>

        <span className="px-1 text-slate-400">...</span>

        <button className="hover:text-primary hover:border-primary flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-xs font-medium text-slate-600 transition-colors">
          {totalPages}
        </button>

        {/* Nút Next */}
        <button
          className={`flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white transition-colors ${currentPage === totalPages ? 'cursor-not-allowed text-slate-400 opacity-50' : 'hover:text-primary hover:border-primary text-slate-600'}`}
          disabled={currentPage === totalPages}
        >
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      {/* Hiển thị tóm tắt */}
      {totalItems && itemsPerPage && (
        <div className="mt-2 text-center text-[11px] text-slate-400">
          Hiển thị 1-{itemsPerPage} trong tổng số {totalItems} khóa học
        </div>
      )}
    </div>
  );
};
