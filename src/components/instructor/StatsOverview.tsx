import React from 'react';

export const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="clean-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Học viên tham gia</span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400">
            <i className="fa-solid fa-users text-sm"></i>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">452</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
          <span className="text-success font-medium">
            <i className="fa-solid fa-arrow-up"></i> 5.2%
          </span>{' '}
          so với tháng trước
        </div>
      </div>

      <div className="clean-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Đánh giá trung bình</span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400">
            <i className="fa-regular fa-star text-sm"></i>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-800">4.8</span>
          <span className="text-sm font-medium text-slate-400">/ 5.0</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">Dựa trên 128 lượt phản hồi</div>
      </div>

      <div className="clean-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Bài tập chờ chấm</span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400">
            <i className="fa-solid fa-code-pull-request text-sm"></i>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-danger text-2xl font-bold">12</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
          <span className="text-danger font-medium">3 bài</span> quá hạn SLA
        </div>
      </div>

      <div className="clean-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Tổng giờ giảng dạy</span>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400">
            <i className="fa-regular fa-clock text-sm"></i>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-800">1,240</span>
          <span className="text-sm font-medium text-slate-400">h</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
          <span className="text-success font-medium">
            <i className="fa-solid fa-arrow-up"></i> 12h
          </span>{' '}
          tuần này
        </div>
      </div>
    </div>
  );
};
