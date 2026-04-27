'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, BarChart3, Brain, CheckCircle2, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useAdaptiveAdminBanks } from '@/hooks/useAdaptiveQuiz';
import type { AdaptiveAdminBank, DifficultyDistribution } from '@/types/adaptive-quiz';

const DIFFICULTY_COLORS: Record<keyof DifficultyDistribution, string> = {
  '1': 'bg-emerald-500',
  '2': 'bg-lime-500',
  '3': 'bg-amber-500',
  '4': 'bg-orange-500',
  '5': 'bg-rose-500',
};

function DistributionBar({ dist }: { dist: DifficultyDistribution }) {
  const max = Math.max(1, ...(Object.values(dist) as number[]));
  return (
    <div className="flex items-end gap-1" aria-label="Phân bố độ khó">
      {(['1', '2', '3', '4', '5'] as const).map((level) => {
        const count = dist[level];
        const heightPct = (count / max) * 100;
        return (
          <div key={level} className="flex flex-1 flex-col items-center gap-1">
            <div className="relative flex h-12 w-full items-end overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
              <div
                className={`w-full ${DIFFICULTY_COLORS[level]}`}
                style={{ height: `${heightPct}%` }}
                title={`${count} câu độ ${level}`}
              />
            </div>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {level}
            </span>
            <span className="text-[10px] text-slate-700 dark:text-slate-300">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

function BankCard({ bank }: { bank: AdaptiveAdminBank }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
              bank.isEligibleForAdaptive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            <Brain className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
              {bank.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {bank.category?.name ?? 'Chưa phân loại'}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            bank.isEligibleForAdaptive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
          }`}
        >
          {bank.isEligibleForAdaptive ? 'Sẵn sàng' : 'Cần tinh chỉnh'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <DistributionBar dist={bank.difficultyDistribution} />
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-3.5" />
            <span>{bank.totalQuestions} câu tổng</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5" />
            <span>{bank.eligibleQuestions} câu trắc nghiệm</span>
          </div>
        </div>

        {!bank.isEligibleForAdaptive ? (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Cần ≥5 câu trắc nghiệm và ≥2 mức độ khó. Vào trang chi tiết để Auto-spread hoặc chỉnh
              từng câu.
            </span>
          </div>
        ) : null}
      </div>

      <div className="border-t border-slate-100 px-5 py-3 dark:border-slate-800">
        <Link
          href={`/adaptive-quiz-admin/${bank.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Tinh chỉnh độ khó
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

type FilterMode = 'all' | 'eligible' | 'needs-tuning';

export default function AdaptiveQuizAdminPage() {
  const { data: banks, isLoading, error } = useAdaptiveAdminBanks();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  const filteredBanks = useMemo(() => {
    if (!banks) return [];
    const t = search.trim().toLowerCase();
    return banks.filter((b) => {
      if (filter === 'eligible' && !b.isEligibleForAdaptive) return false;
      if (filter === 'needs-tuning' && b.isEligibleForAdaptive) return false;
      if (!t) return true;
      return (
        b.title.toLowerCase().includes(t) || (b.category?.name.toLowerCase().includes(t) ?? false)
      );
    });
  }, [banks, search, filter]);

  const stats = useMemo(() => {
    if (!banks) return null;
    return {
      total: banks.length,
      eligible: banks.filter((b) => b.isEligibleForAdaptive).length,
      needsTuning: banks.filter((b) => !b.isEligibleForAdaptive).length,
    };
  }, [banks]);

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Adaptive Quiz · Quản lý ngân hàng
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Tinh chỉnh độ khó câu hỏi (1..5) để bật adaptive quiz. Một bank cần ≥5 câu trắc nghiệm và
          phủ ≥2 mức độ khó.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Tổng bank
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {stats?.total ?? '—'}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <p className="text-xs tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            Sẵn sàng adaptive
          </p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
            {stats?.eligible ?? '—'}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <p className="text-xs tracking-wide text-amber-800 uppercase dark:text-amber-300">
            Cần tinh chỉnh
          </p>
          <p className="mt-1 text-2xl font-semibold text-amber-800 dark:text-amber-300">
            {stats?.needsTuning ?? '—'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { v: 'all', label: 'Tất cả' },
              { v: 'eligible', label: 'Sẵn sàng' },
              { v: 'needs-tuning', label: 'Cần tinh chỉnh' },
            ] as Array<{ v: FilterMode; label: string }>
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setFilter(opt.v)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filter === opt.v
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên / nhóm…"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Tìm bank"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={<Brain className="size-10" />}
          title="Không tải được danh sách"
          description={(error as Error).message}
        />
      ) : filteredBanks.length === 0 ? (
        <EmptyState
          icon={<Brain className="size-10" />}
          title="Không có bank phù hợp"
          description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBanks.map((b) => (
            <BankCard key={b.id} bank={b} />
          ))}
        </div>
      )}
    </div>
  );
}
