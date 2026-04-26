import React, { useEffect, useRef } from 'react';
import { useCategories } from '@/hooks/useCourses';
import { useCourseStore } from '@/store/useCourseStore';

interface FilterSidebarProps {
  isOpen: boolean;
  onReset: () => void;
  onFilterChange: () => void;
}

export const FilterSidebar = ({ isOpen, onReset, onFilterChange }: FilterSidebarProps) => {
  const { filters, setFilters } = useCourseStore();
  const { data: categories = [], isLoading: loadingCats } = useCategories();
  const searchRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync controlled input when filters.search resets externally
  useEffect(() => {
    if (searchRef.current && filters.search === '') {
      searchRef.current.value = '';
    }
  }, [filters.search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFilters({ search: e.target.value });
      onFilterChange();
    }, 350);
  };

  const handleCategory = (id: string) => {
    setFilters({ category: filters.category === id ? '' : id });
    onFilterChange();
  };

  const handleReset = () => {
    if (searchRef.current) searchRef.current.value = '';
    onReset();
  };

  return (
    <div
      id="filterSidebarWrapper"
      className={`${isOpen ? 'filter-visible' : 'filter-hidden'} relative z-10 h-full shrink-0 overflow-hidden border-r border-gray-200 bg-white shadow-sm`}
    >
      <div className="custom-scrollbar flex h-full w-64 flex-col overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <i className="fa-solid fa-sliders text-primary text-xs"></i>
            Bộ lọc
          </h2>
          <button
            className="text-primary text-[12px] font-semibold hover:underline"
            onClick={handleReset}
          >
            Xóa hết
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Search */}
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
              Từ khoá
            </p>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-[11px] text-slate-400"></i>
              <input
                ref={searchRef}
                type="text"
                defaultValue={filters.search}
                placeholder="Tìm theo tên khóa..."
                onChange={handleSearch}
                className="focus:border-primary focus:ring-primary w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-xs transition-all outline-none focus:bg-white focus:ring-1"
              />
            </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Categories */}
          <div>
            <p className="mb-3 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
              Danh mục
            </p>

            {/* All option */}
            <label className="group mb-2 flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => handleCategory('')}
                className="accent-primary h-3.5 w-3.5"
              />
              <span
                className={`flex-1 text-[13px] transition-colors group-hover:text-slate-900 ${!filters.category ? 'text-primary font-semibold' : 'text-slate-600'}`}
              >
                Tất cả danh mục
              </span>
            </label>

            {loadingCats ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-100"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {categories
                  .filter((c) => c.isActive)
                  .map((cat) => (
                    <label key={cat.id} className="group flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.id}
                        onChange={() => handleCategory(cat.id)}
                        className="accent-primary h-3.5 w-3.5"
                      />
                      <span
                        className={`flex-1 text-[13px] transition-colors group-hover:text-slate-900 ${filters.category === cat.id ? 'text-primary font-semibold' : 'text-slate-600'}`}
                      >
                        {cat.name}
                      </span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
