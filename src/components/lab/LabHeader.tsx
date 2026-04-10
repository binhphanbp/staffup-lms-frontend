import React from 'react';
import Link from 'next/link';

interface LabHeaderProps {
  onRunCode: () => void;
}

export const LabHeader = ({ onRunCode }: LabHeaderProps) => {
  return (
    <header className="z-20 flex h-14 flex-shrink-0 items-center justify-between border-b border-black/50 bg-[#181a1f] px-4 text-white shadow-md lg:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/courses/detail/learning-room"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          title="Rời khỏi Lab"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div className="hidden h-6 w-px bg-slate-700 sm:block"></div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="rounded border border-purple-500/30 bg-purple-600/20 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-purple-400 uppercase">
              <i className="fa-solid fa-terminal mr-1"></i> Code Lab
            </span>
            <h1 className="truncate text-sm font-bold">Triển khai thuật toán Consistent Hashing</h1>
          </div>
          <div className="truncate font-mono text-[10px] text-slate-400">
            Khóa: System Design Phân tán | Mức độ: Khó
          </div>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-4">
        <div className="hidden items-center gap-1 font-mono text-[10px] text-slate-400 md:flex">
          <i className="fa-solid fa-cloud-arrow-up"></i> Đã tự động lưu
        </div>
        <button
          onClick={onRunCode}
          className="bg-success flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 active:scale-95"
        >
          <i className="fa-solid fa-paper-plane text-xs"></i> Nộp bài (Submit)
        </button>
        <div className="hover:border-primary ml-2 h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-slate-600 bg-slate-700 transition-colors">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ui-avatars.com/api/?name=Tran+Bao&background=1677ff&color=fff&bold=true"
            className="h-full w-full"
            alt="Avatar"
          />
        </div>
      </div>
    </header>
  );
};
