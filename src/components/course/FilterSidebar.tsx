import React from 'react';

// Định nghĩa các props để nhận tín hiệu từ trang chính
interface FilterSidebarProps {
  isOpen: boolean;
  onReset: () => void;
  onFilterChange: () => void;
}

export const FilterSidebar = ({ isOpen, onReset, onFilterChange }: FilterSidebarProps) => {
  return (
    <div
      id="filterSidebarWrapper"
      // Dùng logic điều kiện (ternary operator) để thêm class ẩn/hiện
      className={`${isOpen ? 'filter-visible' : 'filter-hidden'} relative z-10 h-full shrink-0 overflow-hidden border-gray-200 bg-white shadow-sm`}
    >
      <div className="custom-scrollbar flex h-full w-64 flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-800">
            <i className="fa-solid fa-filter text-xs text-slate-400"></i> Bộ lọc
          </h2>
          <button className="text-primary text-xs font-medium hover:underline" onClick={onReset}>
            Xóa hết
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-xs text-slate-400"></i>
              <input
                type="text"
                id="searchKeyword"
                placeholder="Tìm theo tên khóa..."
                className="focus:border-primary focus:ring-primary w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-xs transition-all outline-none focus:bg-white focus:ring-1"
                onChange={onFilterChange}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-bold tracking-wide text-slate-800 uppercase">
              Phòng ban
            </h3>
            <div className="space-y-2.5">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  defaultChecked
                  onChange={onFilterChange}
                />
                <span className="flex-1 text-[13px] text-slate-600 transition-colors group-hover:text-slate-900">
                  Engineering
                </span>
                <span className="rounded bg-slate-100 px-1.5 text-[10px] text-slate-400">124</span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="filter-checkbox" onChange={onFilterChange} />
                <span className="flex-1 text-[13px] text-slate-600 transition-colors group-hover:text-slate-900">
                  Data Science
                </span>
                <span className="rounded bg-slate-100 px-1.5 text-[10px] text-slate-400">45</span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="filter-checkbox" onChange={onFilterChange} />
                <span className="flex-1 text-[13px] text-slate-600 transition-colors group-hover:text-slate-900">
                  Security (Infosec)
                </span>
                <span className="rounded bg-slate-100 px-1.5 text-[10px] text-slate-400">18</span>
              </label>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100"></div>

          <div>
            <h3 className="mb-3 text-[11px] font-bold tracking-wide text-slate-800 uppercase">
              Công nghệ
            </h3>
            <div className="space-y-2.5">
              <label className="group flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="filter-checkbox" onChange={onFilterChange} />
                <span className="flex-1 font-mono text-[13px] text-slate-600 transition-colors group-hover:text-slate-900">
                  React / NextJS
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  defaultChecked
                  onChange={onFilterChange}
                />
                <span className="flex-1 font-mono text-[13px] text-slate-600 transition-colors group-hover:text-slate-900">
                  AWS / Cloud
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="filter-checkbox" onChange={onFilterChange} />
                <span className="flex-1 font-mono text-[13px] text-slate-600 transition-colors group-hover:text-slate-900">
                  Docker / K8s
                </span>
              </label>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100"></div>

          <div>
            <h3 className="mb-3 text-[11px] font-bold tracking-wide text-slate-800 uppercase">
              Cấp độ yêu cầu
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                className="hover:border-primary hover:text-primary active:bg-primary rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors active:text-white"
                onClick={onFilterChange}
              >
                Fresher
              </button>
              <button
                className="border-primary bg-primary-bg text-primary rounded border px-3 py-1.5 text-xs font-medium transition-colors"
                onClick={onFilterChange}
              >
                Junior
              </button>
              <button
                className="hover:border-primary hover:text-primary rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors"
                onClick={onFilterChange}
              >
                Middle
              </button>
              <button
                className="hover:border-primary hover:text-primary rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors"
                onClick={onFilterChange}
              >
                Senior
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
