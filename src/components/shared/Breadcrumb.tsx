import React from 'react';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho 1 mục trong thanh điều hướng
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Trang điều hướng dạng breadcrumb.
 * Trên màn nhỏ (<sm) các mục ở giữa được thu gọn thành "..." để tránh wrap
 * gây khó đọc; mục đầu (Home) và mục cuối (trang hiện tại) luôn hiển thị.
 */
export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  if (items.length === 0) return null;

  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-nowrap items-center gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        {items.map((item, index) => {
          const isLast = index === lastIndex;
          const isFirst = index === 0;
          // Hide intermediate items on small screens to prevent ugly wrapping;
          // they remain available to assistive tech via the aria-label.
          const isIntermediate = !isFirst && !isLast;
          // Only the last (current page) item should truncate when space runs
          // out. Earlier items stay full-width so labels like "Trang chủ" never
          // get clipped to gibberish like "Tra…".
          return (
            <li
              key={index}
              className={`items-center ${isLast ? 'flex min-w-0' : 'flex shrink-0'} ${isIntermediate ? 'hidden sm:flex' : ''}`}
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:hover:text-sky-400"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`truncate ${isLast ? 'font-bold text-slate-800 dark:text-slate-100' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="mx-2 shrink-0" aria-hidden="true">
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </span>
              )}

              {/* Trên mobile, sau mục đầu tiên (nếu có mục giữa bị ẩn) hiển thị "…" */}
              {isFirst && items.length > 2 && (
                <span className="mx-2 shrink-0 text-slate-400 sm:hidden" aria-hidden="true">
                  …<i className="fa-solid fa-chevron-right ml-2 text-[10px]"></i>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
