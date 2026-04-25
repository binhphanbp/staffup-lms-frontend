'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { useRoadmapAssignments, useAllRoadmaps } from '@/hooks/useRoadmaps';
import { useAuthStore } from '@/store/useAuthStore';
import type { RoadmapAssignment, RoadmapAssignmentStatus, RoadmapDetail } from '@/types';

// ─── Status configuration ────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  RoadmapAssignmentStatus,
  { label: string; textCls: string; bgCls: string; borderCls: string; barCls: string }
> = {
  assigned: {
    label: 'Chưa bắt đầu',
    textCls: 'text-blue-600',
    bgCls: 'bg-blue-50',
    borderCls: 'border-blue-200',
    barCls: 'bg-blue-400',
  },
  in_progress: {
    label: 'Đang học',
    textCls: 'text-amber-600',
    bgCls: 'bg-amber-50',
    borderCls: 'border-amber-200',
    barCls: 'bg-amber-500',
  },
  completed: {
    label: 'Hoàn thành',
    textCls: 'text-green-600',
    bgCls: 'bg-green-50',
    borderCls: 'border-green-200',
    barCls: 'bg-green-500',
  },
  dropped: {
    label: 'Bỏ dở',
    textCls: 'text-slate-500',
    bgCls: 'bg-slate-100',
    borderCls: 'border-slate-200',
    barCls: 'bg-slate-400',
  },
};

type FilterTab = 'all' | RoadmapAssignmentStatus;

const TABS: { key: FilterTab; label: string; icon: string }[] = [
  { key: 'all', label: 'Tất cả', icon: 'fa-layer-group' },
  { key: 'assigned', label: 'Chưa bắt đầu', icon: 'fa-hourglass-start' },
  { key: 'in_progress', label: 'Đang học', icon: 'fa-spinner' },
  { key: 'completed', label: 'Hoàn thành', icon: 'fa-circle-check' },
  { key: 'dropped', label: 'Bỏ dở', icon: 'fa-ban' },
];

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="h-1 w-full bg-gray-200"></div>
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="h-5 w-3/4 rounded bg-gray-200"></div>
          <div className="h-5 w-20 rounded-full bg-gray-200"></div>
        </div>
        <div className="mb-2 h-3 w-full rounded bg-gray-100"></div>
        <div className="mb-4 h-3 w-2/3 rounded bg-gray-100"></div>
        <div className="mb-4 h-2 w-full rounded bg-gray-200"></div>
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-md bg-gray-200"></div>
          <div className="h-5 w-16 rounded-md bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

// ─── Roadmap assignment card ──────────────────────────────────────────────────
function RoadmapCard({ assignment }: { assignment: RoadmapAssignment }) {
  const cfg = STATUS_CONFIG[assignment.status];
  const { roadmap } = assignment;

  const progressWidth =
    assignment.progressPercent !== null
      ? `${assignment.progressPercent}%`
      : assignment.status === 'completed'
        ? '100%'
        : assignment.status === 'in_progress'
          ? '45%'
          : '0%';

  const progressLabel =
    assignment.progressPercent !== null
      ? `${assignment.progressPercent}%`
      : assignment.status === 'completed'
        ? '100%'
        : assignment.status === 'in_progress'
          ? 'Đang tiến hành'
          : assignment.status === 'dropped'
            ? 'Bỏ dở'
            : 'Chưa bắt đầu';

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cfg.borderCls}`}
    >
      {/* Status accent strip */}
      <div className={`h-1 w-full ${cfg.barCls}`}></div>

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="group-hover:text-primary line-clamp-2 flex-1 text-sm leading-snug font-bold text-slate-800 transition-colors">
            {roadmap.title}
          </h3>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.textCls} ${cfg.bgCls} ${cfg.borderCls}`}
          >
            {cfg.label}
          </span>
        </div>

        {/* Description */}
        {roadmap.description && (
          <p className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-slate-500">
            {roadmap.description}
          </p>
        )}

        {/* Target position */}
        {roadmap.targetPosition && (
          <div className="text-purple mb-3 flex items-center gap-1.5 text-[11px] font-semibold">
            <i className="fa-solid fa-bullseye text-[10px]"></i>
            <span>{roadmap.targetPosition}</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-4">
          <div className="mb-1.5 flex justify-between text-[11px] text-slate-400">
            <span>Tiến độ</span>
            <span className={`font-semibold ${cfg.textCls}`}>{progressLabel}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cfg.barCls}`}
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            <i className="fa-solid fa-building text-[9px]"></i>
            {roadmap.department.name}
          </span>
          {roadmap.category && (
            <span className="bg-primary-bg text-primary flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium">
              <i className="fa-solid fa-tag text-[9px]"></i>
              {roadmap.category.name}
            </span>
          )}
          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            <i className="fa-solid fa-book-open text-[9px]"></i>
            {roadmap.coursesCount} khóa học
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-400">
            <i className="fa-regular fa-calendar mr-1"></i>
            {formatDate(assignment.assignedAt)}
          </div>
          <Link
            href={`/roadmaps/${roadmap.id}`}
            className="bg-primary hover:bg-primary-hover flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-colors"
          >
            Xem chi tiết
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Explore roadmap card ─────────────────────────────────────────────────────
function ExploreCard({ roadmap }: { roadmap: RoadmapDetail }) {
  return (
    <div className="group hover:border-primary/40 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Gradient top bar */}
      <div className="from-primary h-1 w-full bg-gradient-to-r to-blue-400"></div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start gap-3">
          <div className="bg-primary-bg text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <i className="fa-solid fa-route text-sm"></i>
          </div>
          <h3 className="group-hover:text-primary line-clamp-2 flex-1 text-sm leading-snug font-bold text-slate-800 transition-colors">
            {roadmap.title}
          </h3>
        </div>

        {roadmap.description && (
          <p className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-slate-500">
            {roadmap.description}
          </p>
        )}

        {roadmap.targetPosition && (
          <div className="text-purple mb-3 flex items-center gap-1.5 text-[11px] font-semibold">
            <i className="fa-solid fa-bullseye text-[10px]"></i>
            <span>{roadmap.targetPosition}</span>
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            <i className="fa-solid fa-building text-[9px]"></i>
            {roadmap.department.name}
          </span>
          {roadmap.category && (
            <span className="bg-primary-bg text-primary flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium">
              <i className="fa-solid fa-tag text-[9px]"></i>
              {roadmap.category.name}
            </span>
          )}
          {roadmap.courses && (
            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              <i className="fa-solid fa-book-open text-[9px]"></i>
              {roadmap.courses.length} khóa học
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${roadmap.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}
          >
            {roadmap.isActive ? 'Đang hoạt động' : 'Tạm ngưng'}
          </span>
          <Link
            href={`/roadmaps/${roadmap.id}`}
            className="bg-primary hover:bg-primary-hover flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-colors"
          >
            Xem lộ trình
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
type MainTab = 'mine' | 'explore';

export default function RoadmapsPage() {
  const [mainTab, setMainTab] = useState<MainTab>('mine');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, isError } = useRoadmapAssignments(
    user ? { userId: user.id, limit: 100 } : undefined,
  );
  const {
    data: allData,
    isLoading: loadingAll,
    isError: errorAll,
  } = useAllRoadmaps(mainTab === 'explore' ? { isActive: true, limit: 100 } : undefined);

  const assignments = data?.assignments ?? [];
  const allRoadmaps = allData?.roadmaps ?? [];

  const stats = {
    total: assignments.length,
    assigned: assignments.filter((a) => a.status === 'assigned').length,
    inProgress: assignments.filter((a) => a.status === 'in_progress').length,
    completed: assignments.filter((a) => a.status === 'completed').length,
    dropped: assignments.filter((a) => a.status === 'dropped').length,
  };

  const filtered =
    activeTab === 'all' ? assignments : assignments.filter((a) => a.status === activeTab);

  const tabCount = (key: FilterTab) => {
    if (key === 'all') return stats.total;
    if (key === 'assigned') return stats.assigned;
    if (key === 'in_progress') return stats.inProgress;
    if (key === 'completed') return stats.completed;
    return stats.dropped;
  };

  return (
    <>
      <StudentHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Lộ trình phát triển' }]}
      />

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800">Lộ trình phát triển</h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi lộ trình được giao và khám phá các lộ trình học tập mới
          </p>
        </div>

        {/* Main tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setMainTab('mine')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              mainTab === 'mine'
                ? 'bg-primary text-white shadow-sm shadow-blue-200'
                : 'hover:border-primary/30 hover:text-primary border border-gray-200 bg-white text-slate-600'
            }`}
          >
            <i className="fa-solid fa-bookmark text-xs"></i>
            Lộ trình của tôi
            {!isLoading && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${mainTab === 'mine' ? 'bg-white/20 text-white' : 'bg-gray-100 text-slate-500'}`}
              >
                {stats.total}
              </span>
            )}
          </button>
          <button
            onClick={() => setMainTab('explore')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              mainTab === 'explore'
                ? 'bg-primary text-white shadow-sm shadow-blue-200'
                : 'hover:border-primary/30 hover:text-primary border border-gray-200 bg-white text-slate-600'
            }`}
          >
            <i className="fa-solid fa-compass text-xs"></i>
            Khám phá lộ trình
          </button>
        </div>

        {/* ── MY ROADMAPS TAB ── */}
        {mainTab === 'mine' && (
          <>
            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                {
                  label: 'Tổng lộ trình',
                  value: stats.total,
                  icon: 'fa-route',
                  color: 'text-primary bg-primary-bg',
                },
                {
                  label: 'Chưa bắt đầu',
                  value: stats.assigned,
                  icon: 'fa-hourglass-start',
                  color: 'text-blue-600 bg-blue-50',
                },
                {
                  label: 'Đang học',
                  value: stats.inProgress,
                  icon: 'fa-spinner',
                  color: 'text-amber-600 bg-amber-50',
                },
                {
                  label: 'Hoàn thành',
                  value: stats.completed,
                  icon: 'fa-circle-check',
                  color: 'text-green-600 bg-green-50',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm ${s.color}`}
                  >
                    <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-800">
                      {isLoading ? '—' : s.value}
                    </div>
                    <div className="text-[11px] text-slate-500">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="mb-5 flex gap-1 overflow-x-auto border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <i className={`fa-solid ${tab.icon} text-[11px]`}></i>
                  {tab.label}
                  {!isLoading && (
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-gray-100 text-slate-500'}`}
                    >
                      {tabCount(tab.key)}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {isError && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                Không thể tải danh sách lộ trình. Vui lòng thử lại.
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : filtered.map((a) => <RoadmapCard key={a.id} assignment={a} />)}
            </div>

            {!isLoading && !isError && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <i className="fa-solid fa-route text-2xl"></i>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {activeTab === 'all'
                    ? 'Bạn chưa được giao lộ trình nào'
                    : 'Không có lộ trình nào trong mục này'}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Liên hệ quản lý để được giao lộ trình học tập phù hợp
                </p>
                <button
                  onClick={() => setMainTab('explore')}
                  className="bg-primary hover:bg-primary-hover mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
                >
                  <i className="fa-solid fa-compass text-xs"></i>
                  Khám phá lộ trình có sẵn
                </button>
              </div>
            )}
          </>
        )}

        {/* ── EXPLORE TAB ── */}
        {mainTab === 'explore' && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-800">
                  {loadingAll ? '...' : allRoadmaps.length}
                </span>{' '}
                lộ trình đang hoạt động
              </p>
            </div>

            {errorAll && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                Không thể tải danh sách lộ trình. Vui lòng thử lại.
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {loadingAll
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : allRoadmaps.map((r) => <ExploreCard key={r.id} roadmap={r} />)}
            </div>

            {!loadingAll && !errorAll && allRoadmaps.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <i className="fa-solid fa-compass text-2xl"></i>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Chưa có lộ trình nào được tạo
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
