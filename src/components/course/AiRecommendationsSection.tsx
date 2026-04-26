/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/media';
import { useMyRecommendations, useRefreshRecommendations } from '@/hooks/useRecommendations';
import type { RecommendationItem, RecommendationPriority } from '@/services/recommendation.service';

// ─── Helpers ────────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<
  RecommendationPriority,
  { label: string; className: string; icon: string }
> = {
  high: {
    label: 'Ưu tiên cao',
    className: 'bg-red-50 text-red-600 ring-1 ring-red-200',
    icon: 'fa-fire-flame-curved',
  },
  medium: {
    label: 'Nên học',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    icon: 'fa-star',
  },
  low: {
    label: 'Tham khảo',
    className: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
    icon: 'fa-bookmark',
  },
};

function formatDuration(mins: number | null): string | null {
  if (!mins || mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h} giờ ${m} phút`;
  if (h > 0) return `${h} giờ`;
  return `${m} phút`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: RecommendationPriority }) {
  const cfg = PRIORITY_STYLES[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      <i className={`fa-solid ${cfg.icon} text-[10px]`} aria-hidden />
      {cfg.label}
    </span>
  );
}

function BasedOnChips({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="text-primary inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function RecommendationCard({ item, index }: { item: RecommendationItem; index: number }) {
  const { course, priority, reasoning, basedOn } = item;
  const thumb =
    resolveMediaUrl(course.thumbnailUrl ?? undefined) ??
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80&auto=format&fit=crop';
  const duration = formatDuration(course.estimatedDurationMinutes);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Order badge — visual cue for "học theo thứ tự" */}
      <div className="text-primary absolute top-3 left-3 z-10 flex h-7 min-w-7 items-center justify-center rounded-full bg-white/95 px-2 text-xs font-bold shadow-sm ring-1 ring-blue-100">
        #{index + 1}
      </div>

      <div className="relative h-36 shrink-0 overflow-hidden bg-slate-100">
        <img
          src={thumb}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute top-3 right-3">
          <PriorityBadge priority={priority} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base leading-snug font-semibold text-slate-800">
            {course.title}
          </h3>
        </div>

        {/* AI reasoning — the key wow-factor */}
        <div className="rounded-lg bg-gradient-to-br from-blue-50/70 to-indigo-50/70 p-3 ring-1 ring-blue-100">
          <div className="text-primary mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase">
            <i className="fa-solid fa-wand-magic-sparkles" aria-hidden />
            <span>Vì sao đề xuất cho bạn</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{reasoning}</p>
        </div>

        <BasedOnChips tags={basedOn} />

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {course.category && (
              <span className="inline-flex items-center gap-1">
                <i className="fa-solid fa-folder-open" aria-hidden />
                {course.category.name}
              </span>
            )}
            {duration && (
              <span className="inline-flex items-center gap-1">
                <i className="fa-regular fa-clock" aria-hidden />
                {duration}
              </span>
            )}
          </div>
          <Link
            href={`/courses/detail?id=${course.id}`}
            className="bg-primary hover:bg-primary-hover inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
          >
            Xem chi tiết
            <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="h-36 animate-pulse bg-slate-100" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-5 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="h-20 animate-pulse rounded-lg bg-blue-50" />
        <div className="flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-blue-50" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-blue-50" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function AiRecommendationsSection() {
  const { data, isLoading, isError, isFetching, error } = useMyRecommendations({
    limit: 4,
  });
  const refresh = useRefreshRecommendations();

  const recommendations = data?.recommendations ?? [];
  const learner = data?.context.learner;
  const hasRecommendations = recommendations.length > 0;

  // Hide section entirely if backend returned an empty list AND there are no
  // candidate courses (cold-start tenant) — but show empty state if learner is
  // simply already enrolled in everything.
  if (!isLoading && !isError && data && !hasRecommendations && data.context.candidateCount === 0) {
    return null;
  }

  return (
    <section
      aria-label="Đề xuất AI cho bạn"
      className="relative mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 p-5 shadow-sm lg:p-6"
    >
      {/* Decorative blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-56 w-56 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-200/30 blur-3xl"
      />

      <header className="relative mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="from-primary inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br to-indigo-500 text-white shadow-sm">
              <i className="fa-solid fa-wand-magic-sparkles" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Đề xuất AI cho bạn</h2>
              <p className="text-sm text-slate-500">
                {learner ? (
                  <>
                    Dựa trên hồ sơ học tập, vị trí{' '}
                    <span className="font-medium text-slate-700">
                      {learner.positionTitle ?? 'của bạn'}
                    </span>
                    {learner.completedCount > 0 && (
                      <>
                        {' '}
                        và{' '}
                        <span className="font-medium text-slate-700">
                          {learner.completedCount} khoá đã hoàn thành
                        </span>
                      </>
                    )}
                    .
                  </>
                ) : (
                  'AI đang phân tích hồ sơ học tập của bạn…'
                )}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refresh()}
          disabled={isFetching}
          className="hover:text-primary inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i
            className={`fa-solid fa-arrows-rotate ${isFetching ? 'animate-spin' : ''}`}
            aria-hidden
          />
          {isFetching ? 'Đang sinh đề xuất…' : 'Làm mới đề xuất'}
        </button>
      </header>

      {/* States */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 text-center">
          <i
            className="fa-solid fa-triangle-exclamation mb-2 text-2xl text-amber-500"
            aria-hidden
          />
          <p className="mb-3 text-sm text-slate-700">
            Không tải được đề xuất AI lúc này.
            {error instanceof Error && error.message ? (
              <span className="block text-xs text-slate-500">{error.message}</span>
            ) : null}
          </p>
          <button
            type="button"
            onClick={() => refresh()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
          >
            <i className="fa-solid fa-arrows-rotate" aria-hidden />
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !isError && !hasRecommendations && (
        <div className="rounded-xl border border-dashed border-blue-200 bg-white/60 p-6 text-center">
          <i className="fa-solid fa-trophy mb-2 text-2xl text-amber-400" aria-hidden />
          <p className="text-sm font-medium text-slate-700">
            Bạn đã đăng ký tất cả khoá học phù hợp lúc này.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Hoàn tất các khoá đang học để AI đề xuất nội dung nâng cao tiếp theo.
          </p>
        </div>
      )}

      {!isLoading && !isError && hasRecommendations && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {recommendations.map((item, idx) => (
            <RecommendationCard key={item.course.id} item={item} index={idx} />
          ))}
        </div>
      )}

      {/* AI provenance footnote — important for trust */}
      {data && hasRecommendations && (
        <p className="relative mt-4 text-[11px] text-slate-400">
          <i className="fa-solid fa-circle-info mr-1" aria-hidden />
          Đề xuất do AI sinh tự động, có thể chưa hoàn hảo — bạn nên đối chiếu với mục tiêu cá nhân
          và quản lý trực tiếp trước khi quyết định.
        </p>
      )}
    </section>
  );
}
