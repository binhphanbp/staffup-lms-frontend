import React from 'react';
import Link from 'next/link';

export const QueueWidgets = () => {
  return (
    <div className="flex w-full flex-shrink-0 flex-col gap-6 lg:w-[300px] xl:w-[340px]">
      {/* Hàng đợi chấm code */}
      <div className="clean-card flex flex-col">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/50 px-5 py-3">
          <span className="bg-danger h-2 w-2 rounded-full"></span>
          <h3 className="text-[13px] font-bold text-slate-800">Chờ Code Review (12)</h3>
        </div>

        <div className="space-y-1 p-2">
          <Link
            href="#"
            className="group flex items-start gap-3 rounded-md border border-transparent p-3 transition-colors hover:border-slate-200 hover:bg-slate-50"
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] font-bold text-slate-500">
              HN
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center justify-between">
                <div className="group-hover:text-primary truncate text-[12px] font-semibold text-slate-800">
                  Hải Nam
                </div>
                <span className="text-[9px] whitespace-nowrap text-slate-400">2h trước</span>
              </div>
              <div className="truncate font-mono text-[11px] text-slate-500">
                Lab: Consistent Hash
              </div>
            </div>
          </Link>
          <Link
            href="#"
            className="group flex items-start gap-3 rounded-md border border-transparent p-3 transition-colors hover:border-slate-200 hover:bg-slate-50"
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] font-bold text-slate-500">
              BT
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center justify-between">
                <div className="group-hover:text-primary truncate text-[12px] font-semibold text-slate-800">
                  Bảo Trần
                </div>
                <span className="text-danger text-[9px] font-semibold whitespace-nowrap">
                  Quá hạn
                </span>
              </div>
              <div className="truncate font-mono text-[11px] text-slate-500">Lab: Rate Limiter</div>
            </div>
          </Link>
        </div>

        <div className="border-t border-slate-100 p-3 text-center">
          <Link
            href="#"
            className="text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-800"
          >
            Xem tất cả hàng đợi
          </Link>
        </div>
      </div>

      {/* Tỷ lệ hoàn thành & AI */}
      <div className="clean-card p-5">
        <h3 className="mb-4 text-[13px] font-bold text-slate-800">Tỷ lệ hoàn thành</h3>
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between text-[11px]">
              <span className="truncate font-medium text-slate-600">System Design</span>
              <span className="font-semibold text-slate-800">85% Pass</span>
            </div>
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-slate-400" style={{ width: '85%' }}></div>
              <div className="bg-danger/60 h-full" style={{ width: '5%' }} title="Rớt"></div>
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[11px]">
              <span className="truncate font-medium text-slate-600">GoLang Backend</span>
              <span className="font-semibold text-slate-800">40% Pass</span>
            </div>
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-slate-400" style={{ width: '40%' }}></div>
              <div className="h-full bg-slate-200" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-start gap-2 text-slate-600">
            <i className="fa-solid fa-lightbulb text-warning mt-0.5 text-xs"></i>
            <p className="text-[11px] leading-relaxed">
              <strong className="text-slate-800">AI Insight:</strong> Học viên thường mắc kẹt ở Bài
              4 (GoLang). Đề xuất bổ sung tài liệu về Goroutines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
