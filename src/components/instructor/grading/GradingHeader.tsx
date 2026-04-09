import React from 'react';

export const GradingHeader = () => {
  return (
    <header className="flex h-[64px] flex-shrink-0 items-center justify-between border-b border-[#DADCE0] bg-white px-6">
      <div></div>
      <div className="flex h-[46px] w-[500px] items-center rounded-lg border border-transparent bg-[#F1F3F4] px-4 transition-all focus-within:bg-white focus-within:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]">
        <span className="material-symbols-outlined text-[#5F6368]">search</span>
        <input
          type="text"
          className="h-full w-full border-none bg-transparent px-3 text-[15px] text-[#202124] placeholder-[#5F6368] outline-none"
          placeholder="Tìm kiếm bài nộp, tên học viên hoặc tên bài tập..."
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#5F6368]/5">
          <span className="material-symbols-outlined">help</span>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#5F6368]/5">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#5F6368]/5">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="ml-3 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-[#1A73E8] text-[15px] font-medium text-white">
          G
        </div>
      </div>
    </header>
  );
};
