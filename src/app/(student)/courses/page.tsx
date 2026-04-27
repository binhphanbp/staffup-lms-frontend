'use client';
import React, { useState, useMemo } from 'react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { FilterSidebar } from '@/components/course/FilterSidebar';
import { CourseSkeleton } from '@/components/course/CourseSkeleton';
import { CourseCard, type CourseType } from '@/components/course/CourseCard';
import { AiRecommendationsSection } from '@/components/course/AiRecommendationsSection';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { useQueryClient } from '@tanstack/react-query';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useCourseStore } from '@/store/useCourseStore';
import { enrollmentService } from '@/services/enrollment.service';
import type { CourseListItem, EnrollmentListItem } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất', sortBy: 'createdAt', sortOrder: 'desc' },
  { value: 'oldest', label: 'Cũ nhất', sortBy: 'createdAt', sortOrder: 'asc' },
  { value: 'az', label: 'A → Z', sortBy: 'title', sortOrder: 'asc' },
  { value: 'za', label: 'Z → A', sortBy: 'title', sortOrder: 'desc' },
] as const;
type SortValue = (typeof SORT_OPTIONS)[number]['value'];
type MainTab = 'all' | 'inProgress' | 'completed';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtDuration(mins: number | null): string | undefined {
  if (!mins) return undefined;
  const h = Math.floor(mins / 60),
    m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function toCourseType(item: CourseListItem, enrollment?: EnrollmentListItem | null): CourseType {
  return {
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    imageUrl: item.thumbnailUrl ?? undefined,
    level: item.category?.name ?? 'All Levels',
    tags: (item.tags ?? []).map((t) => ({ label: t.name, colorClass: 'bg-blue-500' })),
    author: item.trainer
      ? {
          name: item.trainer.fullName,
          avatar:
            item.trainer.avatarUrl ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.trainer.fullName)}&background=f1f5f9&color=475569`,
        }
      : undefined,
    duration: fmtDuration(item.estimatedDurationMinutes),
    progress: enrollment?.status === 'in_progress' ? enrollment.progressPercent : undefined,
    isCompleted: enrollment?.status === 'completed',
  };
}

function enrollToCourseType(e: EnrollmentListItem): CourseType {
  return {
    id: e.courseId,
    title: e.course.title,
    description: '',
    imageUrl: e.course.thumbnailUrl ?? undefined,
    level: '',
    tags: [],
    author: {
      name: e.course.trainer.fullName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(e.course.trainer.fullName)}&background=f1f5f9&color=475569`,
    },
    progress: e.status === 'in_progress' ? e.progressPercent : undefined,
    isCompleted: e.status === 'completed',
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CourseCatalog() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<MainTab>('all');
  const [sort, setSort] = useState<SortValue>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const limit = 12;

  const { filters, resetFilters } = useCourseStore();

  const sortCfg = SORT_OPTIONS.find((o) => o.value === sort)!;

  const { data, isLoading, isError } = useCourses({
    search: filters.search || undefined,
    categoryId: filters.category || undefined,
    status: 'published',
    page,
    limit,
    sortBy: sortCfg.sortBy,
    sortOrder: sortCfg.sortOrder,
  });

  const queryClient = useQueryClient();
  const patchedRef = React.useRef<Set<string>>(new Set());

  // limit max = 100 (per API docs); backend auto-scopes to current user for learner role
  const { data: enrollmentData } = useEnrollments({ limit: 100 });
  const allEnrollments = enrollmentData?.data ?? [];

  // Auto-complete enrollments stuck at 100% (e.g. completed before this fix was in place)
  React.useEffect(() => {
    allEnrollments.forEach((e) => {
      if (e.progressPercent >= 100 && e.status === 'in_progress' && !patchedRef.current.has(e.id)) {
        patchedRef.current.add(e.id);
        enrollmentService
          .updateStatus(e.id, 'completed')
          .then(() => queryClient.invalidateQueries({ queryKey: ['enrollments'] }))
          .catch(() => patchedRef.current.delete(e.id));
      }
    });
  }, [allEnrollments, queryClient]);

  const enrollmentMap = useMemo<Record<string, EnrollmentListItem>>(() => {
    return allEnrollments.reduce((acc, e) => ({ ...acc, [e.courseId]: e }), {});
  }, [allEnrollments]);

  const inProgressList = useMemo(
    () => allEnrollments.filter((e) => e.status === 'in_progress' || e.status === 'assigned'),
    [allEnrollments],
  );
  const completedList = useMemo(
    () => allEnrollments.filter((e) => e.status === 'completed'),
    [allEnrollments],
  );

  const courses = data?.data ?? [];
  const meta = data?.meta;

  const handleReset = () => {
    resetFilters();
    setPage(1);
  };
  const handleFilterChange = () => setPage(1);

  const activeFilterCount = [filters.search, filters.category].filter(Boolean).length;

  return (
    <>
      <StudentHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Thư viện Khóa học' }]}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <FilterSidebar
          isOpen={isFilterOpen}
          onReset={handleReset}
          onFilterChange={handleFilterChange}
        />

        <div className="custom-scrollbar relative flex h-full flex-1 flex-col overflow-y-auto scroll-smooth bg-[#f8fafc]">
          <div className="p-5 lg:p-7">
            {/* ── Stats ── */}
            {(() => {
              const assignedCount = allEnrollments.filter((e) => e.status === 'assigned').length;
              const statItems = [
                {
                  label: 'Tổng khóa học',
                  value: isLoading ? '—' : (meta?.total ?? 0),
                  icon: 'fa-book-open',
                  iconBg: 'bg-blue-50',
                  iconColor: 'text-primary',
                  decor: 'bg-blue-50',
                },
                {
                  label: 'Đang học',
                  value: isLoading ? '—' : inProgressList.length,
                  icon: 'fa-spinner',
                  iconBg: 'bg-amber-50',
                  iconColor: 'text-amber-500',
                  decor: 'bg-amber-50',
                },
                {
                  label: 'Hoàn thành',
                  value: isLoading ? '—' : completedList.length,
                  icon: 'fa-circle-check',
                  iconBg: 'bg-green-50',
                  iconColor: 'text-green-500',
                  decor: 'bg-green-50',
                },
                {
                  label: 'Được giao',
                  value: isLoading ? '—' : assignedCount,
                  icon: 'fa-list-check',
                  iconBg: 'bg-violet-50',
                  iconColor: 'text-violet-500',
                  decor: 'bg-violet-50',
                },
              ];
              return (
                <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {statItems.map((s) => (
                    <div
                      key={s.label}
                      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div
                        className={`absolute -top-4 -right-4 h-20 w-20 rounded-full opacity-60 ${s.decor}`}
                      />
                      <div className="relative z-10">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                            {s.label}
                          </span>
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconBg}`}
                          >
                            <i className={`fa-solid ${s.icon} text-sm ${s.iconColor}`}></i>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* ── AI Recommendations (only on "All" tab) ── */}
            {tab === 'all' && <AiRecommendationsSection />}

            {/* ── Tab bar ── */}
            <div className="mb-4 flex gap-1 border-b border-gray-200">
              {(
                [
                  { key: 'all', label: 'Tất cả', icon: 'fa-layer-group', count: null },
                  {
                    key: 'inProgress',
                    label: 'Đang học',
                    icon: 'fa-spinner',
                    count: inProgressList.length,
                  },
                  {
                    key: 'completed',
                    label: 'Hoàn thành',
                    icon: 'fa-circle-check',
                    count: completedList.length,
                  },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <i className={`fa-solid ${t.icon} text-[11px]`}></i>
                  {t.label}
                  {t.count !== null && (
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t.key ? 'bg-primary text-white' : 'bg-gray-100 text-slate-500'}`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Toolbar ── */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-all ${isFilterOpen ? 'border-primary bg-primary-bg text-primary' : 'hover:border-primary/40 border-gray-200 bg-white text-slate-700'}`}
                >
                  <i className="fa-solid fa-sliders text-xs"></i>
                  Bộ lọc
                  {activeFilterCount > 0 && (
                    <span className="bg-primary rounded-full px-1.5 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {tab === 'all' && (
                  <span className="text-[13px] text-slate-500">
                    <span className="font-bold text-slate-800">
                      {isLoading ? '...' : (meta?.total ?? 0)}
                    </span>{' '}
                    khóa học
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {tab === 'all' && (
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as SortValue);
                      setPage(1);
                    }}
                    className="focus:border-primary rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
                <div className="flex rounded-lg border border-gray-200 bg-white p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded px-2.5 py-1.5 text-xs transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <i className="fa-solid fa-grip"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded px-2.5 py-1.5 text-xs transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <i className="fa-solid fa-list"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Error ── */}
            {isError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                Không thể tải danh sách khóa học. Vui lòng thử lại.
              </div>
            )}

            {/* ── Content ── */}
            {tab === 'all' && (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'flex flex-col gap-3'
                  }
                >
                  {isLoading
                    ? Array.from({ length: limit }).map((_, i) => <CourseSkeleton key={i} />)
                    : courses.map((c) => (
                        <CourseCard key={c.id} course={toCourseType(c, enrollmentMap[c.id])} />
                      ))}
                </div>
                {!isLoading && courses.length === 0 && !isError && (
                  <EmptyState
                    icon={<i className="fa-solid fa-book-open text-xl" />}
                    title="Không tìm thấy khóa học phù hợp"
                    description="Thử thay đổi từ khoá hoặc bộ lọc để xem nhiều kết quả hơn."
                    action={
                      <button
                        onClick={handleReset}
                        className="bg-primary hover:bg-primary-hover rounded-lg px-4 py-2 text-sm font-semibold text-white"
                      >
                        Xóa bộ lọc
                      </button>
                    }
                  />
                )}
                {meta && meta.totalPages > 1 && (
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    totalItems={meta.total}
                    itemsPerPage={meta.limit}
                    onPageChange={(p) => setPage(p)}
                  />
                )}
              </>
            )}

            {tab === 'inProgress' && (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'flex flex-col gap-3'
                  }
                >
                  {inProgressList.map((e) => (
                    <CourseCard key={e.id} course={enrollToCourseType(e)} />
                  ))}
                </div>
                {inProgressList.length === 0 && (
                  <EmptyState
                    icon={<i className="fa-solid fa-spinner text-xl" />}
                    title="Bạn chưa bắt đầu khóa học nào"
                    description="Đăng ký và bắt đầu học ngay để tiến bộ mỗi ngày."
                    action={
                      <button
                        onClick={() => setTab('all')}
                        className="bg-primary hover:bg-primary-hover rounded-lg px-4 py-2 text-sm font-semibold text-white"
                      >
                        <i className="fa-solid fa-compass mr-2 text-xs" />
                        Khám phá khóa học
                      </button>
                    }
                  />
                )}
              </>
            )}

            {tab === 'completed' && (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'flex flex-col gap-3'
                  }
                >
                  {completedList.map((e) => (
                    <CourseCard key={e.id} course={enrollToCourseType(e)} />
                  ))}
                </div>
                {completedList.length === 0 && (
                  <EmptyState
                    icon={<i className="fa-solid fa-circle-check text-xl" />}
                    title="Bạn chưa hoàn thành khóa học nào"
                    description="Tiếp tục học để nhận chứng chỉ đầu tiên của bạn."
                    action={
                      <button
                        onClick={() => setTab('inProgress')}
                        className="bg-primary hover:bg-primary-hover rounded-lg px-4 py-2 text-sm font-semibold text-white"
                      >
                        <i className="fa-solid fa-play mr-2 text-xs" />
                        Các khóa đang học
                      </button>
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
