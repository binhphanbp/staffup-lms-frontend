'use client';

import React from 'react';
import Link from 'next/link';
import { useMyGamification } from '@/hooks/useGamification';

export function HeaderXpBadge() {
  const { data, isLoading } = useMyGamification();

  if (isLoading || !data) return null;

  return (
    <Link
      href="/achievements"
      className="hidden items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs transition-colors hover:bg-amber-100 md:flex dark:border-amber-900/60 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
      aria-label={`Cấp ${data.currentLevel} · ${data.totalXp} XP · Streak ${data.currentStreak} ngày`}
      title={`Cấp ${data.currentLevel} · ${data.totalXp} XP`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-pink-500 text-[10px] font-bold text-white">
        {data.currentLevel}
      </span>
      <span className="font-bold text-amber-700 dark:text-amber-300">
        {data.totalXp.toLocaleString('vi-VN')} XP
      </span>
      <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-300">
        <i className="fa-solid fa-fire" aria-hidden="true" />
        {data.currentStreak}
      </span>
    </Link>
  );
}
