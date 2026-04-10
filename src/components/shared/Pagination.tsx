import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  // Build the page numbers to show: always show first, last, current ±1, with ellipsis
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis')[] = [];
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <div className="mt-10 mb-4 flex w-full flex-col items-center">
      <div className="flex items-center justify-center gap-2">
        {/* Nút Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white transition-colors ${currentPage === 1 ? 'cursor-not-allowed text-slate-400 opacity-50' : 'hover:text-primary hover:border-primary text-slate-600'}`}
          disabled={currentPage === 1}
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>

        {/* Số trang */}
        {getPageNumbers().map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 items-center justify-center rounded border text-xs font-medium transition-colors ${
                page === currentPage
                  ? 'border-primary bg-primary text-white shadow-md shadow-blue-500/20'
                  : 'hover:text-primary hover:border-primary border-gray-200 bg-white text-slate-600'
              }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Nút Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white transition-colors ${currentPage === totalPages ? 'cursor-not-allowed text-slate-400 opacity-50' : 'hover:text-primary hover:border-primary text-slate-600'}`}
          disabled={currentPage === totalPages}
        >
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      {/* Hiển thị tóm tắt */}
      {startItem && endItem && totalItems && (
        <div className="mt-2 text-center text-[11px] text-slate-400">
          Hiển thị {startItem}–{endItem} trong tổng số {totalItems} khóa học
        </div>
      )}
    </div>
  );
};
