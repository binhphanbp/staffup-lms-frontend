'use client';

import React from 'react';
import { useMobileNav } from '@/context/MobileNavContext';
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export const AdminHeader = () => {
  const { openMobileNav } = useMobileNav();
  const user = useAuthStore((s) => s.user);
  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? 'U';
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#DADCE0] bg-white px-4 md:px-6 dark:border-slate-800 dark:bg-slate-900">
      {/* Hamburger — mobile only */}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#5F6368]/5 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={openMobileNav}
        aria-label="Mở menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
      <div className="hidden lg:block" />
      <div className="hidden h-11.5 max-w-sm flex-1 items-center rounded-lg border border-transparent bg-[#F1F3F4] px-4 transition-all focus-within:bg-white focus-within:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] md:flex dark:bg-slate-800 dark:focus-within:bg-slate-800/70">
        <span className="material-symbols-outlined text-[#5F6368] dark:text-slate-400">search</span>
        <input
          type="text"
          className="h-full w-full border-none bg-transparent px-3 text-[15px] text-[#202124] placeholder-[#5F6368] outline-none dark:text-slate-100 dark:placeholder-slate-500"
          placeholder="Tìm kiếm cài đặt hệ thống..."
          aria-label="Tìm kiếm"
        />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#5F6368]/5 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Trợ giúp"
        >
          <span className="material-symbols-outlined">help</span>
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#5F6368]/5 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Cài đặt"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="ml-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1A73E8] text-[15px] font-medium text-white">
          {initial}
        </div>
      </div>
    </header>
  );
};
