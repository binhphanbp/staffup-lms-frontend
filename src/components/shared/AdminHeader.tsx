'use client';

import React from 'react';
import { useMobileNav } from '@/context/MobileNavContext';

export const AdminHeader = () => {
  const { openMobileNav } = useMobileNav();
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#DADCE0] bg-white px-4 md:px-6">
      {/* Hamburger — mobile only */}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#5F6368]/5 lg:hidden"
        onClick={openMobileNav}
        aria-label="Mở menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
      <div className="hidden lg:block" />
      <div className="hidden h-11.5 max-w-sm flex-1 items-center rounded-lg border border-transparent bg-[#F1F3F4] px-4 transition-all focus-within:bg-white focus-within:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] md:flex">
        <span className="material-symbols-outlined text-[#5F6368]">search</span>
        <input
          type="text"
          className="h-full w-full border-none bg-transparent px-3 text-[15px] text-[#202124] placeholder-[#5F6368] outline-none"
          placeholder="Tìm kiếm cài đặt hệ thống..."
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#5F6368]/5">
          <span className="material-symbols-outlined">help</span>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#5F6368]/5">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="ml-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1A73E8] text-[15px] font-medium text-white">
          A
        </div>
      </div>
    </header>
  );
};
