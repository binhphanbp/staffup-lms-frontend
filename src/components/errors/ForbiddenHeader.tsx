import React from 'react';
import Link from 'next/link';

export const ForbiddenHeader = () => {
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

      <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://ui-avatars.com/api/?name=User+Guest&background=f1f5f9&color=64748b"
          className="h-6 w-6 rounded-full border border-gray-200"
          alt="Avatar"
        />
        <span className="hidden text-xs font-semibold text-slate-600 sm:inline-block">
          user.guest@techcorp.com
        </span>
        <div className="mx-1 hidden h-4 w-px bg-gray-300 sm:block"></div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">Role: Learner</span>
      </div>
    </header>
  );
};
