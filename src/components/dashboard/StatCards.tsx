import React from 'react';

export const StatCards = () => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Card 1: Giờ học */}
      <div className="card group hover:border-primary relative overflow-hidden p-5 transition-colors">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-bl-full bg-blue-50 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <div className="mb-2 flex items-start justify-between">
            <div className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Giờ học tích lũy
            </div>
            <i className="fa-solid fa-clock-rotate-left text-primary/50 text-lg"></i>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">124</span>
            <span className="text-sm font-medium text-slate-500">giờ</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-green-600">
            <i className="fa-solid fa-arrow-trend-up"></i> Top 15% phòng Engineering
          </div>
        </div>
      </div>

      {/* Card 2: Khóa hoàn thành */}
      <div className="card group hover:border-primary relative overflow-hidden p-5 transition-colors">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-bl-full bg-orange-50 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <div className="mb-2 flex items-start justify-between">
            <div className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Khóa đã hoàn thành
            </div>
            <i className="fa-solid fa-graduation-cap text-warning/50 text-lg"></i>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">8</span>
            <span className="text-sm font-medium text-slate-500">khóa</span>
          </div>
          <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="bg-warning h-full w-[80%]"></div>
          </div>
          <div className="mt-1 text-right text-[10px] text-slate-400">Mục tiêu quý: 10 khóa</div>
        </div>
      </div>

      {/* Card 3: Sự kiện sắp tới (AWS) */}
      <div className="card relative overflow-hidden border-none bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-md">
        <i className="fa-brands fa-aws absolute -right-4 -bottom-4 text-8xl text-white/10"></i>
        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-blue-200 uppercase">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500"></span> Sắp diễn ra
          </div>
          <div className="mb-1 line-clamp-1 text-base font-bold">
            AWS Tech Talk: Serverless Arch
          </div>
          <div className="mb-auto text-[12px] text-blue-100">
            <i className="fa-regular fa-calendar mr-1"></i> 14:00, Chiều nay
          </div>
          <button className="mt-4 w-full rounded-md border border-white/20 bg-white/10 py-2 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
            Vào phòng họp Meet
          </button>
        </div>
      </div>
    </div>
  );
};
