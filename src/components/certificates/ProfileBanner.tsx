/* eslint-disable @next/next/no-img-element */
import React from 'react';

export const ProfileBanner = () => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-8 text-white shadow-lg">
      <i className="fa-solid fa-award absolute -top-10 -right-10 rotate-12 transform text-[200px] text-white/5"></i>

      <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
        <div className="relative h-24 w-24 flex-shrink-0 rounded-full border-4 border-slate-700 shadow-xl">
          <img
            src="https://ui-avatars.com/api/?name=Tran+Bao&background=1677ff&color=fff&size=200"
            alt="Avatar"
            className="h-full w-full rounded-full object-cover"
          />
          <div className="absolute -right-2 -bottom-2 rounded-full border-2 border-slate-900 bg-gradient-to-r from-yellow-400 to-yellow-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
            Lvl 12
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="mb-1 text-2xl font-bold">Trần Khắc Bảo</h1>
          <div className="mb-4 font-mono text-xs text-slate-400">
            Mã NV: DEV-8829 • Khối: System Engineering
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:justify-start">
            <div>
              <div className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Tổng chứng chỉ
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                4 <i className="fa-solid fa-certificate text-lg text-yellow-400"></i>
              </div>
            </div>
            <div className="hidden w-px bg-slate-700 sm:block"></div>
            <div>
              <div className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Skill Badges
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                12 <i className="fa-solid fa-shield-cat text-primary text-lg"></i>
              </div>
            </div>
            <div className="hidden w-px bg-slate-700 sm:block"></div>
            <div>
              <div className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Xếp hạng phòng
              </div>
              <div className="text-success flex items-center gap-2 text-2xl font-bold">
                Top 5% <i className="fa-solid fa-arrow-trend-up text-lg"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden w-64 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur lg:block">
          <div className="mb-2 text-xs font-bold text-blue-200">Mục tiêu tiếp theo</div>
          <div className="mb-2 truncate text-sm font-semibold text-white">
            AWS Solutions Architect Prof.
          </div>
          <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="relative h-full w-[85%] bg-blue-400"></div>
          </div>
          <div className="text-right text-[10px] text-slate-300">Sắp hoàn thành!</div>
        </div>
      </div>
    </div>
  );
};
