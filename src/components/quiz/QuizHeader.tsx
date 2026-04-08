/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface QuizHeaderProps {
  onShowSubmit: () => void;
}

export const QuizHeader = ({ onShowSubmit }: QuizHeaderProps) => {
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
          <img
            src="https://ui-avatars.com/api/?name=Tran+Bao&background=1677ff&color=fff&bold=true"
            className="h-6 w-6 rounded-full"
            alt="Avatar"
          />
          <span className="hidden text-xs font-bold text-slate-700 sm:inline-block">
            Trần Bảo (Candidate)
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
