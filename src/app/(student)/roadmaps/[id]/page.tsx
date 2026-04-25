'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentHeader } from '@/components/shared/StudentHeader';
import {
  useRoadmapDetail,
  useRoadmapAssignments,
  useUpdateAssignmentStatus,
} from '@/hooks/useRoadmaps';
import { useAuthStore } from '@/store/useAuthStore';
import type { RoadmapAssignmentStatus, RoadmapCourseItem } from '@/types';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  RoadmapAssignmentStatus,
  { label: string; textCls: string; bgCls: string; borderCls: string; dotCls: string }
> = {
  assigned: {
    label: 'Chưa bắt đầu',
    textCls: 'text-blue-600',
    bgCls: 'bg-blue-50',
    borderCls: 'border-blue-200',
    dotCls: 'bg-blue-500',
  },
  in_progress: {
    label: 'Đang học',
    textCls: 'text-amber-600',
    bgCls: 'bg-amber-50',
    borderCls: 'border-amber-200',
    dotCls: 'bg-amber-500',
  },
  completed: {
    label: 'Hoàn thành',
    textCls: 'text-green-600',
    bgCls: 'bg-green-50',
    borderCls: 'border-green-200',
    dotCls: 'bg-green-500',
  },
  dropped: {
    label: 'Bỏ dở',
    textCls: 'text-slate-500',
    bgCls: 'bg-slate-100',
    borderCls: 'border-slate-200',
    dotCls: 'bg-slate-400',
  },
};

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="animate-pulse p-6 lg:p-8">
      <div className="mb-6 h-40 rounded-2xl bg-gray-200"></div>
      <div className="mb-4 h-6 w-1/3 rounded bg-gray-200"></div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mb-3 flex gap-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200"></div>
          <div className="flex-1 rounded-lg bg-gray-200 py-8"></div>
        </div>
      ))}
    </div>
  );
}

// ─── Course step item ─────────────────────────────────────────────────────────
function CourseStep({
  item,
  index,
  isLast,
}: {
  item: RoadmapCourseItem;
  index: number;
  isLast: boolean;
}) {
  const isPublished = item.course.status === 'published';
  const thumbnail = item.course.thumbnailUrl;

  return (
    <div className="group relative flex gap-4">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute top-11 left-5 h-[calc(100%-4px)] w-px bg-gray-200"></div>
      )}

      {/* Step number */}
      <div
        className={`relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
          isPublished
            ? 'border-primary bg-primary text-white shadow-sm shadow-blue-200'
            : 'border-gray-300 bg-white text-slate-400'
        }`}
      >
        {index + 1}
      </div>

      {/* Content card */}
      <div
        className={`mb-3 flex flex-1 gap-3 overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 ${
          isPublished
            ? 'group-hover:border-primary/40 border-gray-200 group-hover:shadow-md'
            : 'border-dashed border-gray-200 opacity-60'
        }`}
      >
        {/* Thumbnail */}
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={item.course.title}
            className="h-full w-20 shrink-0 object-cover"
          />
        ) : (
          <div
            className={`flex w-16 shrink-0 items-center justify-center ${
              isPublished ? 'bg-primary-bg' : 'bg-slate-100'
            }`}
          >
            <i
              className={`fa-solid fa-book-open text-lg ${
                isPublished ? 'text-primary' : 'text-slate-300'
              }`}
            ></i>
          </div>
        )}

        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 py-3 pr-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              {item.isRequired ? (
                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                  Bắt buộc
                </span>
              ) : (
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  Tự chọn
                </span>
              )}
              {!isPublished && (
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <i className="fa-solid fa-lock text-[9px]"></i> Chưa mở
                </span>
              )}
            </div>
            <p className="text-sm leading-snug font-bold text-slate-800">{item.course.title}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{item.course.slug}</p>
          </div>

          {isPublished && (
            <Link
              href={`/courses/detail?id=${item.course.id}`}
              className="bg-primary hover:bg-primary-hover flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-colors"
            >
              Vào học
              <i className="fa-solid fa-play text-[9px]"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RoadmapDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { data: roadmap, isLoading, isError } = useRoadmapDetail(id);
  const { data: assignmentsData } = useRoadmapAssignments(
    user ? { userId: user.id, roadmapId: id } : undefined,
  );
  const { mutate: updateStatus, isPending } = useUpdateAssignmentStatus();

  const assignment = assignmentsData?.assignments?.[0] ?? null;
  const statusCfg = assignment ? STATUS_CONFIG[assignment.status] : null;

  const _pct = assignment?.progressPercent;
  const completedCourses =
    _pct !== null && _pct !== undefined
      ? Math.round((_pct / 100) * (roadmap?.courses?.length ?? 0))
      : assignment?.status === 'completed'
        ? (roadmap?.courses?.length ?? 0)
        : 0;

  const progressPct = assignment?.progressPercent ?? (assignment?.status === 'completed' ? 100 : 0);

  const handleStart = () => {
    if (!assignment) return;
    updateStatus({ assignmentId: assignment.id, status: 'in_progress' });
  };

  if (isLoading) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Lộ trình phát triển', href: '/roadmaps' },
            { label: 'Đang tải...' },
          ]}
        />
        <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f8fafc]">
          <PageSkeleton />
        </div>
      </>
    );
  }

  if (isError || !roadmap) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Lộ trình phát triển', href: '/roadmaps' },
          ]}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#f8fafc]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-400">
            <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <p className="text-sm text-slate-600">Không tìm thấy lộ trình này.</p>
          <button
            onClick={() => router.push('/roadmaps')}
            className="text-primary hover:text-primary-hover text-sm font-semibold"
          >
            ← Quay lại danh sách
          </button>
        </div>
      </>
    );
  }

  const sortedCourses = [...(roadmap.courses ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lộ trình phát triển', href: '/roadmaps' },
          { label: roadmap.title },
        ]}
      />

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          Quay lại
        </button>

        {/* Hero card */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1677ff] to-[#0950cc] p-6 text-white shadow-lg lg:p-8">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <i className="fa-solid fa-route text-xl text-white"></i>
            </div>
            {statusCfg && (
              <span
                className={`rounded-full border px-3 py-1 text-[12px] font-bold ${statusCfg.textCls} ${statusCfg.bgCls} ${statusCfg.borderCls}`}
              >
                <span
                  className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${statusCfg.dotCls}`}
                ></span>
                {statusCfg.label}
              </span>
            )}
          </div>

          <h1 className="mb-2 text-xl leading-snug font-bold lg:text-2xl">{roadmap.title}</h1>
          {roadmap.description && (
            <p className="mb-4 text-sm leading-relaxed text-blue-100 opacity-90">
              {roadmap.description}
            </p>
          )}

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2">
            {roadmap.targetPosition && (
              <span className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur-sm">
                <i className="fa-solid fa-bullseye text-[10px]"></i>
                {roadmap.targetPosition}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur-sm">
              <i className="fa-solid fa-building text-[10px]"></i>
              {roadmap.department.name}
            </span>
            {roadmap.category && (
              <span className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur-sm">
                <i className="fa-solid fa-tag text-[10px]"></i>
                {roadmap.category.name}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur-sm">
              <i className="fa-solid fa-book-open text-[10px]"></i>
              {sortedCourses.length} khóa học
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: courses timeline */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">
                <i className="fa-solid fa-list-ol text-primary mr-2"></i>
                Danh sách khóa học ({sortedCourses.length})
              </h2>
              <span className="text-[12px] text-slate-500">
                {sortedCourses.filter((c) => c.isRequired).length} bắt buộc ·{' '}
                {sortedCourses.filter((c) => !c.isRequired).length} tự chọn
              </span>
            </div>

            {sortedCourses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-slate-400">
                <i className="fa-solid fa-inbox mb-2 block text-2xl"></i>
                Lộ trình này chưa có khóa học nào
              </div>
            ) : (
              <div className="flex flex-col">
                {sortedCourses.map((item, idx) => (
                  <CourseStep
                    key={item.id}
                    item={item}
                    index={idx}
                    isLast={idx === sortedCourses.length - 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: always-visible info panel */}
          <div className="flex flex-col gap-4">
            {/* ── Roadmap overview ── */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Tổng quan lộ trình
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <i className="fa-solid fa-book-open text-primary w-4 text-center"></i>Tổng khóa
                    học
                  </span>
                  <span className="font-bold text-slate-800">{sortedCourses.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <i className="fa-solid fa-circle-exclamation w-4 text-center text-red-500"></i>
                    Bắt buộc
                  </span>
                  <span className="font-bold text-slate-800">
                    {sortedCourses.filter((c) => c.isRequired).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <i className="fa-solid fa-circle-dot w-4 text-center text-slate-400"></i>Tự chọn
                  </span>
                  <span className="font-bold text-slate-800">
                    {sortedCourses.filter((c) => !c.isRequired).length}
                  </span>
                </div>
                {roadmap.department && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <i className="fa-solid fa-building w-4 text-center text-slate-400"></i>Phòng
                      ban
                    </span>
                    <span className="max-w-[120px] truncate text-right font-semibold text-slate-700">
                      {roadmap.department.name}
                    </span>
                  </div>
                )}
                {roadmap.createdBy && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <i className="fa-solid fa-user-pen w-4 text-center text-slate-400"></i>Tạo bởi
                    </span>
                    <span className="max-w-[120px] truncate text-right font-semibold text-slate-700">
                      {roadmap.createdBy.fullName}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <i className="fa-solid fa-circle-check w-4 text-center text-green-500"></i>Trạng
                    thái
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      roadmap.isActive
                        ? 'bg-green-50 text-green-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {roadmap.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Progress card (if assigned) ── */}
            {assignment && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Tiến độ của bạn
                </h3>
                <div className="mb-4 flex items-center justify-center">
                  <div className="relative flex h-24 w-24 items-center justify-center">
                    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#1677ff"
                        strokeWidth="2.5"
                        strokeDasharray={`${progressPct} ${100 - progressPct}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-xl font-bold text-slate-800">{progressPct}%</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hoàn thành</span>
                    <span className="font-bold text-slate-700">
                      {completedCourses}/{sortedCourses.length} khóa
                    </span>
                  </div>
                  {assignment.assignedAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ngày giao</span>
                      <span className="text-slate-600">{formatDate(assignment.assignedAt)}</span>
                    </div>
                  )}
                  {assignment.startedAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bắt đầu</span>
                      <span className="text-slate-600">{formatDate(assignment.startedAt)}</span>
                    </div>
                  )}
                  {assignment.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hoàn thành</span>
                      <span className="font-bold text-green-600">
                        {formatDate(assignment.completedAt)}
                      </span>
                    </div>
                  )}
                </div>
                {assignment.status === 'assigned' && (
                  <button
                    onClick={handleStart}
                    disabled={isPending}
                    className="bg-primary hover:bg-primary-hover mt-4 w-full rounded-lg py-2.5 text-sm font-bold text-white transition-colors disabled:opacity-60"
                  >
                    {isPending ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-play mr-2 text-xs"></i>Bắt đầu học
                      </>
                    )}
                  </button>
                )}
                {assignment.status === 'in_progress' && (
                  <Link
                    href={`/courses/detail?id=${sortedCourses[0]?.course.id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600"
                  >
                    <i className="fa-solid fa-play text-xs"></i>Tiếp tục học
                  </Link>
                )}
                {assignment.status === 'completed' && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-50 py-2.5 text-sm font-bold text-green-600">
                    <i className="fa-solid fa-circle-check"></i>Đã hoàn thành!
                  </div>
                )}
              </div>
            )}

            {/* ── Not assigned notice ── */}
            {!assignment && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-400">
                  <i className="fa-solid fa-user-clock"></i>
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  Bạn chưa được giao lộ trình này
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
                  Liên hệ quản lý hoặc admin để được tham gia lộ trình học tập này.
                </p>
              </div>
            )}

            {/* ── Assigned by ── */}
            {assignment?.assignedBy && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Được giao bởi
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-primary-bg text-primary flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold">
                    {assignment.assignedBy.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      {assignment.assignedBy.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400">{assignment.assignedBy.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Back ── */}
            <Link
              href="/roadmaps"
              className="hover:border-primary/30 hover:text-primary flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-slate-600 transition-all hover:shadow-sm"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              Xem tất cả lộ trình
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
