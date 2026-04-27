'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useLeaderboard } from '@/hooks/useGamification';
import { useAuthStore } from '@/store/useAuthStore';
import { Skeleton } from '@/components/ui/skeleton';
import type { LeaderboardEntry } from '@/services/gamification.service';

interface MyRankCardProps {
  /**
   * How many leaderboard rows to fetch when looking up the current user.
   * The user's rank is only computed if they appear within this window.
   */
  windowSize?: number;
}

interface RankInfo {
  rank: number;
  totalXp: number;
  pool: LeaderboardEntry[];
}

/**
 * Lookup helper — find the current user in a leaderboard list.
 */
function findRank(
  entries: LeaderboardEntry[] | undefined,
  userId: string | undefined,
): RankInfo | null {
  if (!entries || !userId) return null;
  const me = entries.find((e) => String(e.userId) === String(userId));
  if (!me) return null;
  return { rank: me.rank, totalXp: me.totalXp, pool: entries };
}

function nextAheadGap(
  pool: LeaderboardEntry[],
  myRank: number,
): { name: string; xpGap: number } | null {
  if (myRank <= 1) return null;
  const ahead = pool.find((e) => e.rank === myRank - 1);
  if (!ahead) return null;
  const me = pool.find((e) => e.rank === myRank);
  if (!me) return null;
  const gap = ahead.totalXp - me.totalXp;
  return { name: ahead.fullName, xpGap: gap };
}

function rankBadgeStyle(rank: number) {
  if (rank === 1) return 'bg-amber-400 text-white';
  if (rank === 2) return 'bg-slate-300 text-slate-800';
  if (rank === 3) return 'bg-orange-400 text-white';
  if (rank <= 10) return 'bg-emerald-500 text-white';
  return 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100';
}

export function MyRankCard({ windowSize = 100 }: MyRankCardProps) {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  const { data: globalEntries, isLoading: globalLoading } = useLeaderboard('global', windowSize);
  const { data: deptEntries, isLoading: deptLoading } = useLeaderboard('department', windowSize);

  const globalRank = useMemo(() => findRank(globalEntries, userId), [globalEntries, userId]);
  const deptRank = useMemo(() => findRank(deptEntries, userId), [deptEntries, userId]);

  const isLoading = globalLoading || deptLoading;
  const ahead = globalRank ? nextAheadGap(globalRank.pool, globalRank.rank) : null;

  return (
    <section className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
          <i className="fa-solid fa-ranking-star text-indigo-500" aria-hidden="true" />
          Bảng xếp hạng của tôi
        </h2>
        <Link
          href="/leaderboards/adaptive-quiz"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <RankCell
          label="Toàn công ty"
          rank={globalRank?.rank ?? null}
          poolSize={globalEntries?.length ?? 0}
          totalXp={globalRank?.totalXp ?? null}
          loading={isLoading}
          notRanked={!isLoading && !globalRank}
        />
        <RankCell
          label="Trong phòng ban"
          rank={deptRank?.rank ?? null}
          poolSize={deptEntries?.length ?? 0}
          totalXp={deptRank?.totalXp ?? null}
          loading={isLoading}
          notRanked={!isLoading && !deptRank}
        />
      </div>

      {ahead && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/40">
          <span className="text-slate-600 dark:text-slate-300">
            Còn{' '}
            <span className="font-bold text-amber-600 dark:text-amber-300">
              {ahead.xpGap.toLocaleString('vi-VN')} XP
            </span>{' '}
            để vượt <span className="font-semibold">{ahead.name}</span> và leo lên hạng{' '}
            <span className="font-bold">{(globalRank?.rank ?? 0) - 1}</span>
          </span>
        </div>
      )}

      {!isLoading && !globalRank && !deptRank && (
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Bạn chưa nằm trong top {windowSize} của bảng xếp hạng. Hãy kiếm thêm XP qua bài học, quiz
          và streak hằng ngày để xuất hiện ở đây.
        </div>
      )}
    </section>
  );
}

function RankCell({
  label,
  rank,
  poolSize,
  totalXp,
  loading,
  notRanked,
}: {
  label: string;
  rank: number | null;
  poolSize: number;
  totalXp: number | null;
  loading: boolean;
  notRanked: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold shadow-sm ${rank ? rankBadgeStyle(rank) : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}
      >
        {rank ? `#${rank}` : '—'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {label}
        </div>
        {notRanked || !rank ? (
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Chưa xếp hạng
          </div>
        ) : (
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Hạng {rank}
            {poolSize > 0 ? <span className="text-slate-400"> / {poolSize}</span> : null}
            {totalXp !== null ? (
              <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">
                {totalXp.toLocaleString('vi-VN')} XP
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
