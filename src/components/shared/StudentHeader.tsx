'use client';
import React from 'react';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';
import { useMobileNav } from '@/context/MobileNavContext';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export const StudentHeader = ({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) => {
  const { openMobileNav } = useMobileNav();
  return (
    <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8 dark:border-slate-800 dark:bg-slate-900 print:hidden">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          className="text-slate-500 hover:text-slate-800 lg:hidden dark:text-slate-300 dark:hover:text-white"
          onClick={openMobileNav}
          aria-label="Mở menu"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <ThemeToggle />
        <button
          className="text-primary hover:text-primary-hover bg-primary-bg hidden items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors md:flex dark:bg-blue-950/40 dark:text-sky-300"
          aria-label="Đóng góp tài liệu"
        >
          <i className="fa-solid fa-cloud-arrow-up"></i> Đóng góp tài liệu
        </button>
        <div className="hidden h-5 w-px bg-gray-200 md:block dark:bg-slate-700"></div>
        <button
          className="hover:text-primary relative text-slate-500 transition-colors dark:text-slate-400 dark:hover:text-sky-400"
          aria-label="Thông báo"
        >
          <i className="fa-regular fa-bell text-lg"></i>
        </button>
      </div>
    </header>
  );
};
