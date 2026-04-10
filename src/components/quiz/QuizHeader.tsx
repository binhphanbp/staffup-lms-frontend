/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface QuizHeaderProps {
  onShowSubmit: () => void;
}

export const QuizHeader = ({ onShowSubmit }: QuizHeaderProps) => {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.fullName ?? 'Thí sinh';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1677ff&color=fff&bold=true`;
  return (
    <header className="z-20 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex flex-col">
        <h1 className="text-[15px] font-bold text-slate-800">
          Đánh giá năng lực: AWS Cloud Architect (Level 2)
        </h1>
        <div className="text-[11px] font-medium text-slate-500">
          Mã đề: AWS-ARCH-2026-V1 • Điểm đạt: 80/100
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-slate-50 px-3 py-1.5">
          <img src={avatarUrl} className="h-6 w-6 rounded-full" alt="Avatar" />
          <span className="hidden text-xs font-bold text-slate-700 sm:inline-block">
            {displayName}
          </span>
        </div>
        <button
          onClick={onShowSubmit}
          className="bg-primary rounded px-3 py-1.5 text-xs font-bold text-white md:hidden"
        >
          Nộp bài
        </button>
      </div>
    </header>
  );
};
