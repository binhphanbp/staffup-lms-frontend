import React from 'react';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

export const Header = ({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) => {
  return (
    <header className="z-20 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex items-center gap-5">
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
