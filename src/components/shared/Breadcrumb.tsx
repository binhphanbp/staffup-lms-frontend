import React from 'react';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho 1 mục trong thanh điều hướng
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <div className="flex items-center text-xs font-medium text-slate-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {/* Nếu có link và không phải mục cuối cùng thì dùng thẻ Link */}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              // Nếu là mục cuối cùng (trang hiện tại) thì in đậm và không có link
              <span className={`font-bold ${isLast ? 'text-slate-800' : ''}`}>{item.label}</span>
            )}

            {/* Thêm icon mũi tên ngăn cách (trừ mục cuối cùng) */}
            {!isLast && (
              <span className="mx-2">
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
