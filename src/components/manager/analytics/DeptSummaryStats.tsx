'use client';

import { ArrowDown, ArrowUp, Minus, TrendingUp, Users, Target, AlertTriangle } from 'lucide-react';
import type { DepartmentAnalyticsSummary } from '@/services/department-analytics.service';

interface DeptSummaryStatsProps {
  summary: DepartmentAnalyticsSummary;
}

function DeltaBadge({
  delta,
  inverted = false,
}: {
  delta: number;
  /** When true, negative is good (e.g. at-risk rate going down). */
  inverted?: boolean;
}) {
  const isZero = Math.abs(delta) < 0.05;
  const isPositive = delta > 0;
  const isGood = inverted ? !isPositive : isPositive;

  if (isZero) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <Minus className="h-3 w-3" />
        ngang công ty
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        isGood
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
      }`}
    >
      {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {Math.abs(delta).toFixed(1)} pp vs công ty
    </span>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  helper,
  benchmark,
  delta,
  inverted,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  helper?: string;
  benchmark?: { value: number; unit?: string };
  delta?: number;
  inverted?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-[#5F6368] dark:text-slate-400">{label}</span>
        <div className="rounded-xl bg-[#E8F0FE] p-2 text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold text-[#202124] dark:text-white">{value}</span>
        {unit && <span className="text-sm text-[#5F6368] dark:text-slate-400">{unit}</span>}
      </div>
      {helper && <p className="mt-1 text-xs text-[#5F6368] dark:text-slate-400">{helper}</p>}
      {benchmark !== undefined && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#5F6368] dark:text-slate-400">
            Công ty:{' '}
            <span className="font-medium">
              {benchmark.value}
              {benchmark.unit ?? ''}
            </span>
          </span>
          {delta !== undefined && <DeltaBadge delta={delta} inverted={inverted} />}
        </div>
      )}
    </div>
  );
}

export function DeptSummaryStats({ summary }: DeptSummaryStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Tổng học viên"
        value={String(summary.totalLearners)}
        icon={Users}
        helper={`${summary.activeLast7Days} hoạt động trong 7 ngày · ${summary.activeLast30Days} trong 30 ngày`}
      />
      <StatCard
        label="Tiến độ trung bình"
        value={summary.averageProgressPercent.toFixed(1)}
        unit="%"
        icon={TrendingUp}
        benchmark={{ value: summary.benchmark.averageProgressPercent, unit: '%' }}
        delta={summary.benchmark.deltaAverageProgressPercent}
      />
      <StatCard
        label="Tỉ lệ hoàn thành"
        value={summary.completionRate.toFixed(1)}
        unit="%"
        icon={Target}
        benchmark={{ value: summary.benchmark.completionRate, unit: '%' }}
        delta={summary.benchmark.deltaCompletionRate}
      />
      <StatCard
        label="Tỉ lệ rủi ro"
        value={summary.atRiskRate.toFixed(1)}
        unit="%"
        icon={AlertTriangle}
        benchmark={{ value: summary.benchmark.atRiskRate, unit: '%' }}
        delta={summary.benchmark.deltaAtRiskRate}
        inverted
      />
    </div>
  );
}
