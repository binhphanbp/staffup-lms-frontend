'use client';

import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Left: App title / breadcrumb placeholder */}
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded text-white shadow-sm">
            <i className="fa-solid fa-laptop-code text-xs"></i>
          </div>
          <span>
            Tech<span className="font-light text-slate-500">Learn</span>
          </span>
        </Link>
      </div>

      {/* Right: Actions */}
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
