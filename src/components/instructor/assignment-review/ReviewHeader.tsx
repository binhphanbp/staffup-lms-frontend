import React from 'react';
import Link from 'next/link';

export const ReviewHeader = () => {
  return (
    <header className="z-20 flex h-14 flex-shrink-0 items-center justify-between border-b border-black/50 bg-[#181a1f] px-4 text-white shadow-md">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/instructor-dashboard"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          title="Thoát chấm bài"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div className="hidden h-6 w-px bg-slate-700 sm:block"></div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="rounded border border-blue-500/30 bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              <i className="fa-solid fa-code-pull-request mr-1"></i> Review Mode
            </span>
            <h1 className="truncate text-sm font-bold">
              Lab: Thiết kế API Rate Limiter (Token Bucket)
            </h1>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[12px] font-medium text-slate-400">
        <div className="hidden items-center gap-2 md:flex">
          <i className="fa-solid fa-stopwatch"></i> SLA chấm bài:{' '}
          <span className="text-warning">Còn 12h</span>
        </div>
        <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-600 bg-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ui-avatars.com/api/?name=L+N&background=1677ff&color=fff"
            className="h-full w-full"
            alt="Avatar"
          />
        </div>
      </div>
    </header>
  );
};
