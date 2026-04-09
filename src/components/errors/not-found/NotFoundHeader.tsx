import React from 'react';
import Link from 'next/link';

export const NotFoundHeader = () => {
  return (
    <header className="relative z-10 flex w-full flex-shrink-0 items-center justify-between px-6 py-6 lg:px-12">
      <Link
        href="/"
        className="flex items-center gap-2.5 text-xl font-bold text-slate-800 transition-opacity hover:opacity-80"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1677ff] text-white shadow-md shadow-blue-500/30">
          <i className="fa-solid fa-laptop-code text-sm"></i>
        </div>
        <span>TechLearn</span>
      </Link>

      <a
        href="mailto:it-helpdesk@techcorp.com"
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-500 shadow-sm transition-colors hover:text-[#1677ff]"
      >
        <i className="fa-solid fa-headset"></i> Báo lỗi hệ thống
      </a>
    </header>
  );
};
