import React from 'react';
import { NotFoundHeader } from '@/components/errors/not-found/NotFoundHeader';
import { NotFoundMessage } from '@/components/errors/not-found/NotFoundMessage';
import { NotFoundTerminal } from '@/components/errors/not-found/NotFoundTerminal';
import { NotFoundFooter } from '@/components/errors/not-found/NotFoundFooter';

// Khai báo metadata cho Next.js để sửa thẻ title
export const metadata = {
  title: '404 Không tìm thấy trang - Staffup LMS',
};

export default function GlobalNotFound() {
  return (
    <div className="page-404-container relative flex h-full w-full flex-col text-slate-800">
      {/* Background Patterns */}
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 z-0"></div>
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-blue-400 opacity-20 mix-blend-multiply blur-[100px] filter"></div>
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-purple-400 opacity-20 mix-blend-multiply blur-[100px] filter"></div>

      <NotFoundHeader />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-10 px-6 py-10 lg:flex-row lg:gap-20 lg:px-12">
        <NotFoundMessage />
        <NotFoundTerminal />
      </main>

      <NotFoundFooter />
    </div>
  );
}
