'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLeaderboard } from '@/hooks/useGamification';
import type { LeaderboardScope } from '@/services/gamification.service';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

interface LeaderboardCardProps {
  defaultScope?: LeaderboardScope;
  limit?: number;
  showScopeToggle?: boolean;
  highlightUserId?: string;
}

const RANK_BADGE: Record<number, string> = {
  1: 'bg-amber-400/90 text-white',
  2: 'bg-slate-300 text-slate-800',
  3: 'bg-orange-400 text-white',
};

export function LeaderboardCard({
  defaultScope = 'global',
  limit = 10,
  showScopeToggle = true,
  highlightUserId,
}: LeaderboardCardProps) {
  const [scope, setScope] = useState<LeaderboardScope>(defaultScope);
  const { data, isLoading } = useLeaderboard(scope, limit);

  return (
    <section className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
          <i className="fa-solid fa-trophy text-amber-500" aria-hidden="true" />
          Bảng xếp hạng
        </h2>
        {showScopeToggle && (
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs dark:bg-slate-800">
            <button
              onClick={() => setScope('global')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                scope === 'global'
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Toàn công ty
            </button>
            <button
              onClick={() => setScope('department')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                scope === 'department'
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Phòng ban
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="p-4">
          <EmptyState
            variant="compact"
            icon={<i className="fa-solid fa-trophy text-xl" />}
            title="Chưa có dữ liệu xếp hạng"
            description="Học viên cần kiếm XP để xuất hiện trên bảng xếp hạng."
          />
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((entry) => {
            const isMe = highlightUserId && entry.userId === highlightUserId;
            const rankCls =
              RANK_BADGE[entry.rank] ??
              'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200';
            return (
              <li
                key={entry.userId}
                className={`flex items-center gap-3 px-4 py-3 ${
                  isMe ? 'bg-amber-50/70 dark:bg-amber-950/20' : ''
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${rankCls}`}
                >
                  {entry.rank}
                </span>
                {entry.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.avatarUrl}
                    alt={entry.fullName}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(entry.fullName)}&background=1677ff&color=fff&bold=true&size=64`}
                    alt={entry.fullName}
                    className="h-8 w-8 shrink-0 rounded-full"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {entry.fullName}
                    {isMe && (
                      <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase dark:bg-amber-950/40 dark:text-amber-300">
                        Bạn
                      </span>
                    )}
                  </div>
                  <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {entry.departmentName ?? 'Chưa phòng ban'} · Lvl {entry.currentLevel}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-300">
                    {entry.totalXp.toLocaleString('vi-VN')} XP
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    <i className="fa-solid fa-fire mr-0.5" aria-hidden="true" />
                    {entry.currentStreak} ngày
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-center dark:border-slate-800 dark:bg-slate-900/40">
        <Link
          href="/achievements"
          className="text-primary text-[11px] font-semibold hover:underline"
        >
          Xem thành tích của tôi →
        </Link>
      </div>
    </section>
  );
}
