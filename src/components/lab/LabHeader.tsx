import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

interface LabHeaderProps {
  onRunCode: () => void;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backTitle?: string;
  rightSlot?: React.ReactNode;
}

export const LabHeader = ({
  onRunCode,
  title = 'Triển khai thuật toán Consistent Hashing',
  subtitle = 'Khóa: System Design Phân tán | Mức độ: Khó',
  backHref = '/courses/detail/learning-room',
  backTitle = 'Rời khỏi Lab',
  rightSlot,
}: LabHeaderProps) => {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.fullName ?? 'Người dùng';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1677ff&color=fff&bold=true`;
  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b border-black/50 bg-[#181a1f] px-4 text-white shadow-md lg:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <Link
          href={backHref}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#181a1f] focus-visible:outline-none"
          title={backTitle}
          aria-label={backTitle}
        >
          <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
        </Link>
        <div className="hidden h-6 w-px bg-slate-700 sm:block"></div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="hidden rounded border border-purple-500/30 bg-purple-600/20 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-purple-400 uppercase sm:inline-block">
              <i className="fa-solid fa-terminal mr-1" aria-hidden="true"></i> Code Lab
            </span>
            <h1 className="truncate text-sm font-bold">{title}</h1>
          </div>
          <div className="hidden truncate font-mono text-[10px] text-slate-400 sm:block">
            {subtitle}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {rightSlot}
        <div className="hidden items-center gap-1 font-mono text-[10px] text-slate-400 lg:flex">
          <i className="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> Đã tự động lưu
        </div>
        <button
          onClick={onRunCode}
          className="bg-success flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#181a1f] focus-visible:outline-none active:scale-95 sm:px-4"
          aria-label="Nộp bài"
        >
          <i className="fa-solid fa-paper-plane text-xs" aria-hidden="true"></i>
          <span className="hidden sm:inline">Nộp bài (Submit)</span>
          <span className="sm:hidden">Nộp</span>
        </button>
        <div className="hover:border-primary hidden h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-slate-600 bg-slate-700 transition-colors sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarUrl} className="h-full w-full" alt={`Avatar của ${displayName}`} />
        </div>
      </div>
    </header>
  );
};
