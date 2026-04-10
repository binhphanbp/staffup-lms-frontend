import React from 'react';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

interface HeaderProps {
  breadcrumbs: BreadcrumbItem[];
  onMenuClick?: () => void;
}

export const Header = ({ breadcrumbs, onMenuClick }: HeaderProps) => {
  return (
    <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {/* Hamburger — only on mobile/tablet */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Mở menu điều hướng"
          >
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
        )}
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button className="text-primary hover:text-primary-hover bg-primary-bg hidden items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors md:flex">
          <i className="fa-solid fa-cloud-arrow-up"></i> Đóng góp tài liệu
        </button>
        <div className="hidden h-5 w-px bg-gray-200 md:block"></div>
        <button className="hover:text-primary relative text-slate-500 transition-colors">
          <i className="fa-regular fa-bell text-lg"></i>
        </button>
      </div>
    </header>
  );
};
