'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StudentHeader } from '@/components/shared/StudentHeader';
import {
  LeaderboardLayout,
  type LeaderboardScope,
} from '@/components/leaderboard/LeaderboardLayout';
import { adaptiveQuizLeaderboardService } from '@/services/adaptive-quiz.service';

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Bảng xếp hạng', href: '/achievements' },
  { label: 'Adaptive Quiz' },
];

const BAND_VI: Record<string, string> = {
  Beginner: 'Mới bắt đầu',
  'Pre-Intermediate': 'Cận sơ trung',
  Intermediate: 'Trung cấp',
  Advanced: 'Nâng cao',
  Expert: 'Chuyên gia',
};

export default function AdaptiveQuizLeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>('global');

  const { data, isLoading } = useQuery({
    queryKey: ['adaptive-quiz-leaderboard', scope],
    queryFn: () => adaptiveQuizLeaderboardService.list({ scope, limit: 50 }),
  });

  const rows = (data ?? []).map((entry) => ({
    rank: entry.rank,
    userId: entry.userId,
    fullName: entry.fullName,
    avatarUrl: entry.avatarUrl,
    positionTitle: entry.positionTitle,
    department: entry.department,
    primaryValue: entry.bestAbility.toFixed(2),
    primaryLabel: 'Ability cao nhất',
    badge: entry.bestBand ? (BAND_VI[entry.bestBand] ?? entry.bestBand) : null,
    secondaryStats: [
      { label: 'Phiên', value: String(entry.completedSessions) },
      { label: 'Độ chính xác', value: `${entry.accuracyPct}%` },
    ],
    lastAt: entry.lastCompletedAt,
  }));

  return (
    <>
      <StudentHeader breadcrumbs={breadcrumbs} />
      <div className="px-4 py-6 md:px-8">
        <LeaderboardLayout
          title="Bảng xếp hạng — Adaptive Quiz"
          subtitle="Xếp hạng theo điểm Ability cao nhất giữa các phiên đã hoàn thành (thang 0 - 5)."
          accentClass="bg-gradient-to-r from-indigo-500 to-purple-500"
          rows={rows}
          scope={scope}
          onScopeChange={setScope}
          loading={isLoading}
          emptyText="Chưa có ai hoàn thành phiên Adaptive Quiz. Hãy là người đầu tiên!"
        />
      </div>
    </>
  );
}
