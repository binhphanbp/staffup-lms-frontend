'use client';

import React, { useState } from 'react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { useMyBadges, useMyGamification, useMyXpTransactions } from '@/hooks/useGamification';
import type { BadgeDto, XpTransaction } from '@/services/gamification.service';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { LeaderboardCard } from '@/components/student/LeaderboardCard';

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thành tích', isActive: true },
];

const TIER_STYLES: Record<string, { bg: string; ring: string; text: string }> = {
  bronze: {
    bg: 'bg-amber-100 dark:bg-amber-950/40',
    ring: 'ring-amber-400/40',
    text: 'text-amber-700 dark:text-amber-300',
  },
  silver: {
    bg: 'bg-slate-200 dark:bg-slate-700/60',
    ring: 'ring-slate-400/50',
    text: 'text-slate-700 dark:text-slate-200',
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-200 to-amber-300 dark:from-yellow-700 dark:to-amber-700',
    ring: 'ring-yellow-400/50',
    text: 'text-amber-800 dark:text-amber-100',
  },
};

const SOURCE_LABEL: Record<string, string> = {
  lesson_completed: 'Hoàn thành bài học',
  quiz_passed: 'Vượt qua quiz',
  course_completed: 'Hoàn thành khóa học',
  certificate_earned: 'Nhận chứng chỉ',
  streak_bonus: 'Bonus streak',
  badge_unlocked: 'Mở khóa huy hiệu',
};

const SOURCE_ICON: Record<string, string> = {
  lesson_completed: 'fa-book-open',
  quiz_passed: 'fa-clipboard-check',
  course_completed: 'fa-graduation-cap',
  certificate_earned: 'fa-award',
  streak_bonus: 'fa-fire',
  badge_unlocked: 'fa-medal',
};

function BadgeCard({ badge, locked }: { badge: BadgeDto; locked: boolean }) {
  const style = TIER_STYLES[badge.tier] ?? TIER_STYLES.bronze;
  return (
    <div
      className={`group relative flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center transition-all dark:border-slate-700 ${
        locked
          ? 'opacity-50 grayscale hover:opacity-75'
          : 'hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0'
      }`}
      title={badge.description}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ring-4 ${style.bg} ${style.ring}`}
      >
        <span className={`material-symbols-outlined text-3xl ${style.text}`}>{badge.iconName}</span>
      </div>
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{badge.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{badge.description}</div>
      </div>
      <div
        className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${style.bg} ${style.text}`}
      >
        {badge.tier}
      </div>
      {!locked && badge.earnedAt && (
        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          Đạt được{' '}
          {new Date(badge.earnedAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
      )}
      {locked && (
        <div className="absolute top-2 right-2 text-slate-400 dark:text-slate-500">
          <i className="fa-solid fa-lock text-xs" aria-hidden="true" />
          <span className="sr-only">Chưa mở khóa</span>
        </div>
      )}
    </div>
  );
}

function XpRow({ tx }: { tx: XpTransaction }) {
  const label = SOURCE_LABEL[tx.source] ?? tx.source;
  const icon = SOURCE_ICON[tx.source] ?? 'fa-bolt';
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
        <i className={`fa-solid ${icon} text-sm`} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
          {tx.description || label}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {label} ·{' '}
          {new Date(tx.createdAt).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
          })}
        </div>
      </div>
      <div className="text-sm font-bold text-amber-600 dark:text-amber-300">+{tx.amount} XP</div>
    </div>
  );
}

export default function AchievementsPage() {
  const { data: stats, isLoading: statsLoading } = useMyGamification();
  const { data: badges, isLoading: badgesLoading } = useMyBadges();
  const { data: txs, isLoading: txsLoading } = useMyXpTransactions(20);
  const [tab, setTab] = useState<'all' | 'earned' | 'locked'>('all');

  const allBadges = [...(badges?.earned ?? []), ...(badges?.locked ?? [])];
  const visibleBadges =
    tab === 'earned'
      ? (badges?.earned ?? [])
      : tab === 'locked'
        ? (badges?.locked ?? [])
        : allBadges;
  const earnedSet = new Set((badges?.earned ?? []).map((b) => b.id));

  const progressPct = stats ? Math.round(stats.progressToNextLevel * 100) : 0;

  return (
    <div className="flex h-screen flex-col">
      <StudentHeader breadcrumbs={breadcrumbs} />
      <main className="custom-scrollbar flex-1 overflow-y-auto bg-[#f0f2f5] p-6 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Hero card */}
          <section className="card overflow-hidden p-0">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-6 text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold">Thành tích của bạn</h1>
                  <p className="text-sm text-white/80">
                    Tiếp tục học mỗi ngày để mở khóa huy hiệu và leo bảng xếp hạng.
                  </p>
                </div>
                {statsLoading || !stats ? (
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-24 bg-white/30" />
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-[10px] tracking-wider uppercase opacity-80">Cấp độ</div>
                      <div className="text-3xl font-bold">{stats.currentLevel}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] tracking-wider uppercase opacity-80">Tổng XP</div>
                      <div className="text-3xl font-bold">{stats.totalXp}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] tracking-wider uppercase opacity-80">Streak</div>
                      <div className="flex items-center justify-center gap-1 text-3xl font-bold">
                        <i className="fa-solid fa-fire text-orange-300" />
                        {stats.currentStreak}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* XP progress */}
            <div className="space-y-2 px-6 py-5">
              {statsLoading || !stats ? (
                <Skeleton className="h-3 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Cấp {stats.currentLevel} · {stats.xpInCurrentLevel} XP
                    </span>
                    <span>
                      Còn {stats.xpToNextLevel} XP để lên cấp {stats.currentLevel + 1}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all"
                      style={{ width: `${progressPct}%` }}
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progressPct}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      <i className="fa-solid fa-medal mr-1 text-amber-500" aria-hidden="true" />{' '}
                      {stats.badgesEarned}/{stats.badgesTotal} huy hiệu
                    </span>
                    <span>
                      <i className="fa-solid fa-fire mr-1 text-orange-500" aria-hidden="true" />{' '}
                      Streak dài nhất: {stats.longestStreak} ngày
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Badges grid */}
            <section className="card overflow-hidden p-0 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Huy hiệu</h2>
                <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs dark:bg-slate-800">
                  {(['all', 'earned', 'locked'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`rounded-md px-3 py-1 font-medium transition-colors ${
                        tab === t
                          ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {t === 'all' ? 'Tất cả' : t === 'earned' ? 'Đã mở' : 'Chưa mở'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5">
                {badgesLoading ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-44 w-full rounded-xl" />
                    ))}
                  </div>
                ) : visibleBadges.length === 0 ? (
                  <EmptyState
                    icon={<i className="fa-solid fa-medal text-2xl" />}
                    title="Chưa có huy hiệu"
                    description="Hoàn thành bài học, vượt qua quiz và duy trì streak để mở khóa huy hiệu."
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {visibleBadges.map((b) => (
                      <BadgeCard key={b.id} badge={b} locked={!earnedSet.has(b.id)} />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Right column */}
            <div className="space-y-6">
              {/* Recent XP feed */}
              <section className="card overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Lịch sử XP
                  </h2>
                  <span className="text-xs text-slate-400 dark:text-slate-500">20 gần nhất</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {txsLoading ? (
                    <div className="space-y-3 p-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : (txs ?? []).length === 0 ? (
                    <div className="p-4">
                      <EmptyState
                        variant="compact"
                        icon={<i className="fa-solid fa-bolt text-xl" />}
                        title="Chưa có hoạt động nào"
                        description="Hãy bắt đầu một bài học để nhận XP đầu tiên."
                      />
                    </div>
                  ) : (
                    (txs ?? []).map((tx) => <XpRow key={tx.id} tx={tx} />)
                  )}
                </div>
              </section>

              {/* Leaderboard widget */}
              <LeaderboardCard limit={5} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
