import React from 'react';

interface ReviewQueueProps {
  activeQueue: number;
  setActiveQueue: (index: number) => void;
}

export const ReviewQueue = ({ activeQueue, setActiveQueue }: ReviewQueueProps) => {
  return (
    <div className="z-10 flex hidden h-full w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
        <h3 className="text-[13px] font-bold text-slate-800">Chờ Review (12)</h3>
        <button className="hover:text-primary text-slate-400">
          <i className="fa-solid fa-filter text-xs"></i>
        </button>
      </div>
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {activeQueue === 0 && (
          <div
            onClick={() => setActiveQueue(0)}
            className={`flex cursor-pointer flex-col border-b border-l-4 border-slate-100 p-4 transition-colors ${activeQueue === 0 ? 'border-l-primary bg-[#f1f5f9]' : 'border-l-transparent hover:bg-slate-50'}`}
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://ui-avatars.com/api/?name=Hai+Nam&background=e2e8f0&color=475569"
                  className="h-6 w-6 rounded-full"
                  alt="Student"
                />
                <span className="text-[13px] font-bold text-slate-800">Hải Nam</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">2h ago</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <i className="fa-solid fa-code-commit text-slate-400"></i> Nộp lần 1
            </div>
          </div>
        )}

        <div
          onClick={() => setActiveQueue(1)}
          className={`flex cursor-pointer flex-col border-b border-l-4 border-slate-100 p-4 transition-colors ${activeQueue === 1 ? 'border-l-primary bg-[#f1f5f9]' : 'border-l-transparent hover:bg-slate-50'}`}
        >
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://ui-avatars.com/api/?name=Bao+Tran&background=e2e8f0&color=475569"
                className="h-6 w-6 rounded-full"
                alt="Student"
              />
              <span className="text-[13px] font-bold text-slate-800">Bảo Trần</span>
            </div>
            <span className="text-danger text-[10px] font-bold">Trễ SLA</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <i className="fa-solid fa-rotate-left text-warning"></i> Nộp lại lần 2
          </div>
        </div>

        <div
          onClick={() => setActiveQueue(2)}
          className={`flex cursor-pointer flex-col border-b border-l-4 border-slate-100 p-4 opacity-70 transition-colors ${activeQueue === 2 ? 'border-l-primary bg-[#f1f5f9]' : 'border-l-transparent hover:bg-slate-50'}`}
        >
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                MT
              </div>
              <span className="text-[13px] font-bold text-slate-800">Minh Tuấn</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">1 day</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <i className="fa-solid fa-code-commit text-slate-400"></i> Nộp lần 1
          </div>
        </div>
      </div>
    </div>
  );
};
