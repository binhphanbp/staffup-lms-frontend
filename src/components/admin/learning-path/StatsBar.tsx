'use client';

import type { PreviewResult } from '@/services/learning-path.service';

interface Props {
  preview: PreviewResult | null;
}

export function StatsBar({ preview }: Props) {
  const items = [
    {
      label: 'Tổng bài',
      value: preview?.totalLessons ?? '—',
      icon: 'menu_book',
      color: 'text-slate-700 dark:text-slate-300',
    },
    {
      label: 'Đã miễn',
      value: preview?.exempted.length ?? '—',
      icon: 'check_circle',
      color: 'text-emerald-700 dark:text-emerald-300',
    },
    {
      label: 'Học ngay',
      value: preview?.available.length ?? '—',
      icon: 'play_circle',
      color: 'text-sky-700 dark:text-sky-300',
    },
    {
      label: 'Khóa',
      value: preview?.locked.length ?? '—',
      icon: 'lock',
      color: 'text-slate-500 dark:text-slate-400',
    },
    {
      label: 'Rút ngắn',
      value: preview ? `${preview.prunedPercent}%` : '—',
      icon: 'trending_down',
      color: 'text-violet-700 dark:text-violet-300',
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[16px] ${it.color}`}>{it.icon}</span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {it.label}
            </span>
          </div>
          <div className={`mt-0.5 text-lg font-bold ${it.color}`}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}
