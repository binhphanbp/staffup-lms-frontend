'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, History, Sparkles, TrendingDown, TrendingUp, UserCheck } from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useMyAssessmentHistory } from '@/hooks/useSkillGap';
import type { SkillAssessmentHistoryEntry } from '@/types/skill-gap';

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Hồ sơ kỹ năng', href: '/skill-profile' },
  { label: 'Lịch sử đánh giá' },
];

const SOURCE_LABEL: Record<string, string> = {
  self: 'Tự đánh giá',
  manager: 'Quản lý đánh giá',
  auto: 'Hệ thống',
};

const SOURCE_BADGE: Record<string, string> = {
  self: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  manager: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  auto: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateShort = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};

interface SkillProgressChartProps {
  entries: SkillAssessmentHistoryEntry[];
}

function SkillProgressChart({ entries }: SkillProgressChartProps) {
  // entries are newest-first; for chart we want oldest-first
  const sorted = [...entries].sort(
    (a, b) => new Date(a.assessedAt).getTime() - new Date(b.assessedAt).getTime(),
  );
  const width = 320;
  const height = 80;
  const padX = 24;
  const padY = 12;
  const n = sorted.length;
  if (n === 0) return null;

  const xStep = n > 1 ? (width - padX * 2) / (n - 1) : 0;
  const yMax = 5;
  const yMin = 0;
  const yScale = (v: number) => height - padY - ((v - yMin) / (yMax - yMin)) * (height - padY * 2);

  const pts = sorted.map((e, i) => ({
    x: padX + i * xStep,
    y: yScale(e.level),
    level: e.level,
    iso: e.assessedAt,
  }));

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-20 w-full"
        role="img"
        aria-label="Tiến triển level theo thời gian"
      >
        {/* baseline grid */}
        {[1, 2, 3, 4, 5].map((lvl) => (
          <line
            key={lvl}
            x1={padX}
            x2={width - padX}
            y1={yScale(lvl)}
            y2={yScale(lvl)}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeWidth={0.5}
            strokeDasharray={lvl === 3 ? '0' : '2 2'}
          />
        ))}
        {n > 1 && <path d={path} stroke="#6366f1" strokeWidth={2} fill="none" />}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} className="fill-indigo-500" />
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              className="fill-slate-600 text-[10px] font-semibold dark:fill-slate-300"
            >
              {p.level}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <span>{formatDateShort(sorted[0].assessedAt)}</span>
        <span>{formatDateShort(sorted[sorted.length - 1].assessedAt)}</span>
      </div>
    </div>
  );
}

export default function SkillHistoryPage() {
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'self' | 'manager'>('all');

  const { data: rawData, isLoading } = useMyAssessmentHistory({
    skillId: skillFilter !== 'all' ? skillFilter : undefined,
    source: sourceFilter !== 'all' ? sourceFilter : undefined,
  });

  const entries = useMemo(() => rawData ?? [], [rawData]);

  const skillOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of entries) {
      if (!map.has(e.skillId)) map.set(e.skillId, e.skillName);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [entries]);

  const stats = useMemo(() => {
    if (entries.length === 0) {
      return { total: 0, distinctSkills: 0, totalDelta: 0, latestAt: null as string | null };
    }
    const skills = new Set(entries.map((e) => e.skillId));
    const totalDelta = entries.reduce((sum, e) => sum + (e.delta ?? 0), 0);
    const latest = entries[0].assessedAt;
    return {
      total: entries.length,
      distinctSkills: skills.size,
      totalDelta,
      latestAt: latest,
    };
  }, [entries]);

  const groupedBySkill = useMemo(() => {
    const map = new Map<string, SkillAssessmentHistoryEntry[]>();
    for (const e of entries) {
      const arr = map.get(e.skillId) ?? [];
      arr.push(e);
      map.set(e.skillId, arr);
    }
    return Array.from(map.entries())
      .map(([skillId, list]) => ({
        skillId,
        skillName: list[0].skillName,
        skillCategory: list[0].skillCategory,
        entries: list,
      }))
      .sort((a, b) => b.entries.length - a.entries.length);
  }, [entries]);

  return (
    <>
      <StudentHeader breadcrumbs={breadcrumbs} />
      <div className="px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Lịch sử đánh giá kỹ năng
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Theo dõi tiến triển level theo thời gian — bao gồm cả tự đánh giá và đánh giá từ quản
            lý.
          </p>
        </div>

        {/* Hero stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : (
            <>
              <StatCard
                icon={<History className="h-5 w-5 text-indigo-500" />}
                label="Lượt đánh giá"
                value={stats.total.toString()}
              />
              <StatCard
                icon={<Sparkles className="h-5 w-5 text-purple-500" />}
                label="Kỹ năng đã track"
                value={stats.distinctSkills.toString()}
              />
              <StatCard
                icon={
                  stats.totalDelta >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-rose-500" />
                  )
                }
                label="Tổng bước cải thiện"
                value={`${stats.totalDelta >= 0 ? '+' : ''}${stats.totalDelta}`}
                accent={stats.totalDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}
              />
              <StatCard
                icon={<Calendar className="h-5 w-5 text-sky-500" />}
                label="Lần gần nhất"
                value={stats.latestAt ? formatDateShort(stats.latestAt) : '—'}
              />
            </>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Kỹ năng:
            </label>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">Tất cả ({skillOptions.length})</option>
              {skillOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Nguồn:</label>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-900">
              {(['all', 'self', 'manager'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSourceFilter(s)}
                  className={`rounded-md px-3 py-1 font-medium transition ${
                    sourceFilter === s
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {s === 'all' ? 'Tất cả' : s === 'self' ? 'Tự đánh giá' : 'Quản lý'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={<History className="h-10 w-10" />}
            title="Chưa có lịch sử đánh giá"
            description="Hãy vào trang Hồ sơ kỹ năng để tự đánh giá lần đầu — mỗi lần thay đổi level sẽ được ghi nhận tại đây."
            action={
              <Link
                href="/skill-profile"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
              >
                <Sparkles className="h-4 w-4" />
                Đến Hồ sơ kỹ năng
              </Link>
            }
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Per-skill progress chart cards */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                Tiến triển theo kỹ năng
              </h2>
              {groupedBySkill.map((g) => {
                const latest = g.entries[0];
                const oldest = g.entries[g.entries.length - 1];
                const totalDelta = latest.level - oldest.level;
                return (
                  <article
                    key={g.skillId}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {g.skillName}
                        </h3>
                        {g.skillCategory && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {g.skillCategory}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] tracking-wide text-slate-500 uppercase dark:text-slate-400">
                          Hiện tại
                        </p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {latest.level}
                          <span className="text-sm font-normal text-slate-400"> / 5</span>
                        </p>
                        {totalDelta !== 0 && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              totalDelta > 0
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                            }`}
                          >
                            {totalDelta > 0 ? '+' : ''}
                            {totalDelta} bước
                          </span>
                        )}
                      </div>
                    </div>
                    <SkillProgressChart entries={g.entries} />
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      {g.entries.length} lượt đánh giá · Lần đầu{' '}
                      {formatDateShort(oldest.assessedAt)} · Lần gần nhất{' '}
                      {formatDateShort(latest.assessedAt)}
                    </p>
                  </article>
                );
              })}
            </section>

            {/* Timeline */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                Dòng thời gian
              </h2>
              <ol className="space-y-3 border-l-2 border-indigo-100 pl-4 dark:border-indigo-900/40">
                {entries.map((e) => (
                  <li
                    key={e.id}
                    className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span
                      className="absolute top-5 -left-[22px] h-3 w-3 rounded-full border-2 border-white bg-indigo-500 dark:border-slate-950"
                      aria-hidden
                    />
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {e.skillName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(e.assessedAt)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                          SOURCE_BADGE[e.source] ?? SOURCE_BADGE.auto
                        }`}
                      >
                        {SOURCE_LABEL[e.source] ?? e.source}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-baseline gap-2">
                        {e.previousLevel !== null && (
                          <>
                            <span className="text-sm text-slate-400 line-through">
                              {e.previousLevel}
                            </span>
                            <span className="text-slate-400">→</span>
                          </>
                        )}
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {e.level}
                        </span>
                        <span className="text-xs text-slate-400">/ 5</span>
                      </div>
                      {e.delta !== null && e.delta !== 0 && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            e.delta > 0
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          }`}
                        >
                          {e.delta > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {e.delta > 0 ? '+' : ''}
                          {e.delta}
                        </span>
                      )}
                    </div>
                    {e.assessor && e.source === 'manager' && (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <UserCheck className="h-3 w-3" />
                        Đánh giá bởi {e.assessor.fullName}
                      </p>
                    )}
                    {e.notes && (
                      <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {e.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}
      </div>
    </>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {label}
        </span>
      </div>
      <p className={`mt-2 text-2xl font-bold text-slate-900 dark:text-white ${accent ?? ''}`}>
        {value}
      </p>
    </div>
  );
}
