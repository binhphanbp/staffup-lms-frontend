import React from 'react';

export const LearningPath = () => {
  return (
    <div className="card flex h-full flex-col">
      <div className="flex items-center justify-between rounded-t-lg border-b border-gray-100 bg-gray-50/50 px-5 py-4">
        <div>
          <h3 className="font-bold text-slate-800">Lộ trình: Senior Cloud Architect</h3>
          <div className="mt-0.5 text-[11px] text-slate-500">Tiến độ lộ trình: 2/4 level</div>
        </div>
        <button className="hover:text-primary text-slate-400">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
        <div className="relative mx-auto flex w-full max-w-2xl justify-between px-2">
          <div className="step-item step-active group cursor-pointer">
            <div className="step-circle !bg-success !border-success">
              <i className="fa-solid fa-check"></i>
            </div>
            <div className="mt-2 text-[11px] font-bold text-slate-800">Cloud Practitioner</div>
            <div className="text-[10px] text-slate-400">Đã hoàn thành</div>
          </div>

          <div className="step-item step-active group cursor-pointer">
            <div className="step-circle ring-primary/20 ring-4">2</div>
            <div className="text-primary mt-2 text-[11px] font-bold">SysOps Admin</div>
            <div className="text-[10px] text-slate-500">Đang học tập</div>
          </div>

          <div className="step-item group opacity-50">
            <div className="step-circle">3</div>
            <div className="mt-2 text-[11px] font-semibold text-slate-500">Solutions Architect</div>
            <div className="text-[10px] text-slate-400">Khóa (Yêu cầu LV2)</div>
          </div>

          <div className="step-item group opacity-50">
            <div className="step-circle">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-slate-500">Professional</div>
            <div className="text-[10px] text-slate-400">Mục tiêu cuối</div>
          </div>
        </div>
      </div>
    </div>
  );
};
