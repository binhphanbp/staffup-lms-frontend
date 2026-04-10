/* eslint-disable @next/next/no-img-element */
import React from 'react';

export const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900 text-white">
      <div className="bg-tech-pattern absolute inset-0 opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-6 md:gap-8 md:px-8 md:py-12 lg:flex-row">
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded border border-blue-500/30 bg-blue-500/20 px-2.5 py-1 text-[10px] font-bold tracking-widest text-blue-300 uppercase">
              Engineering
            </span>
            <span className="rounded border border-yellow-500/30 bg-yellow-500/20 px-2.5 py-1 text-[10px] font-bold text-yellow-300">
              Mức độ: Senior
            </span>
            <span className="rounded border border-red-500/30 bg-red-500/20 px-2.5 py-1 text-[10px] font-bold text-red-300">
              Bắt buộc
            </span>
          </div>

          <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight lg:text-4xl">
            System Design: Phân tích và Thiết kế Hệ thống Lớn
          </h1>
          <p className="mb-6 max-w-2xl text-[15px] leading-relaxed font-light text-slate-300">
            Nắm vững nghệ thuật thiết kế kiến trúc phần mềm (Software Architecture). Học cách mở
            rộng hệ thống từ 1,000 lên 1,000,000 người dùng đồng thời, xử lý bottleneck và đảm bảo
            tính High Availability.
          </p>

          <div className="flex items-center gap-6 text-[13px] text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-yellow-400">
              4.9 <i className="fa-solid fa-star text-[11px]"></i>
              <span className="ml-1 font-normal text-slate-400">(128 đánh giá)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-users text-slate-400"></i> 450+ nhân viên đã học
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-rotate text-slate-400"></i> Cập nhật: Thg 3/2026
            </div>
          </div>
        </div>

        <div className="group relative w-full shrink-0 cursor-pointer overflow-hidden rounded-xl border border-slate-700 shadow-2xl shadow-blue-900/20 lg:w-[380px] xl:w-[420px]">
          <img
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Preview"
            className="h-[220px] w-full object-cover opacity-80 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 transition-colors group-hover:bg-slate-900/20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110">
              <i className="fa-solid fa-play ml-1 text-2xl text-white"></i>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
            Xem Preview (3:45)
          </div>
        </div>
      </div>
    </div>
  );
};
