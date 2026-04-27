'use client';

import { Trophy, AlertCircle } from 'lucide-react';
import type { PerformerEntry } from '@/services/department-analytics.service';

interface DeptPerformerListsProps {
  top: PerformerEntry[];
  bottom: PerformerEntry[];
}

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${clamped}%` }} />
    </div>
  );
}

function TopRow({ entry, rank }: { entry: PerformerEntry; rank: number }) {
  const rankColors = [
    'bg-amber-400 text-white',
    'bg-slate-300 text-slate-800',
    'bg-orange-400 text-white',
  ];
  const rankCls = rankColors[rank - 1] ?? 'bg-emerald-500 text-white';
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankCls}`}
      >
        #{rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm font-semibold text-[#202124] dark:text-white">
            {entry.fullName}
          </div>
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-300">
            {entry.totalProgressPercent.toFixed(1)}%
          </div>
        </div>
        <div className="text-xs text-[#5F6368] dark:text-slate-400">
          {entry.positionTitle ?? 'Chưa rõ vị trí'} · {entry.completedCount}/
          {entry.totalEnrollments} khóa hoàn thành · {entry.totalXp.toLocaleString('vi-VN')} XP
        </div>
        <div className="mt-1.5">
          <ProgressBar value={entry.totalProgressPercent} />
        </div>
      </div>
    </li>
  );
}

function BottomRow({ entry }: { entry: PerformerEntry }) {
  const idle = entry.daysSinceLastActivity;
  const idleLabel =
    idle === null ? 'Chưa có hoạt động' : idle === 0 ? 'Hôm nay' : `${idle} ngày không hoạt động`;
  const idleSeverity = idle === null ? 'rose' : idle >= 14 ? 'rose' : idle >= 7 ? 'amber' : 'slate';
  const severityCls: Record<string, string> = {
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
        <AlertCircle className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm font-semibold text-[#202124] dark:text-white">
            {entry.fullName}
          </div>
          <div className="text-xs font-medium text-rose-600 dark:text-rose-300">
            {entry.totalProgressPercent.toFixed(1)}%
          </div>
        </div>
        <div className="text-xs text-[#5F6368] dark:text-slate-400">
          {entry.positionTitle ?? 'Chưa rõ vị trí'} · {entry.completedCount}/
          {entry.totalEnrollments} khóa
        </div>
        <span
          className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${severityCls[idleSeverity]}`}
        >
          {idleLabel}
        </span>
      </div>
    </li>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border-t border-slate-100 px-4 py-6 text-center text-sm text-[#5F6368] dark:border-slate-800 dark:text-slate-400">
      {text}
    </div>
  );
}

export function DeptPerformerLists({ top, bottom }: DeptPerformerListsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="overflow-hidden rounded-2xl border border-[#E8EAED] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[#202124] dark:text-white">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top 5 học viên xuất sắc
          </h3>
          <span className="text-[11px] tracking-wide text-[#5F6368] uppercase dark:text-slate-400">
            Theo số khóa hoàn thành
          </span>
        </header>
        {top.length === 0 ? (
          <EmptyState text="Chưa có dữ liệu học viên" />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {top.map((p, idx) => (
              <TopRow key={p.userId} entry={p} rank={idx + 1} />
            ))}
          </ul>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E8EAED] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[#202124] dark:text-white">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            Cần hỗ trợ
          </h3>
          <span className="text-[11px] tracking-wide text-[#5F6368] uppercase dark:text-slate-400">
            Tiến độ thấp / lâu không hoạt động
          </span>
        </header>
        {bottom.length === 0 ? (
          <EmptyState text="Tất cả học viên đang tiến triển tốt" />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {bottom.map((p) => (
              <BottomRow key={p.userId} entry={p} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
