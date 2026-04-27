'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StudentHeader } from '@/components/shared/StudentHeader';
import {
  LeaderboardLayout,
  type LeaderboardScope,
} from '@/components/leaderboard/LeaderboardLayout';
import { roleplayLeaderboardService } from '@/services/roleplay.service';

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Bảng xếp hạng', href: '/achievements' },
  { label: 'Voice Roleplay' },
];

const BAND_VI: Record<string, string> = {
  Excellent: 'Xuất sắc',
  Good: 'Tốt',
  Average: 'Trung bình',
  'Needs Practice': 'Cần luyện tập',
};

export default function VoiceRoleplayLeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>('global');

  const { data, isLoading } = useQuery({
    queryKey: ['roleplay-leaderboard', scope],
    queryFn: () => roleplayLeaderboardService.list({ scope, limit: 50 }),
  });

  const rows = (data ?? []).map((entry) => ({
    rank: entry.rank,
    userId: entry.userId,
    fullName: entry.fullName,
    avatarUrl: entry.avatarUrl,
    positionTitle: entry.positionTitle,
    department: entry.department,
    primaryValue: `${entry.averageScore.toFixed(1)} / 100`,
    primaryLabel: 'Điểm trung bình',
    badge: entry.bestBand ? (BAND_VI[entry.bestBand] ?? entry.bestBand) : null,
    secondaryStats: [
      { label: 'Phiên', value: String(entry.completedSessions) },
      { label: 'Cao nhất', value: String(entry.bestScore) },
    ],
    lastAt: entry.lastCompletedAt,
  }));

  return (
    <>
      <StudentHeader breadcrumbs={breadcrumbs} />
      <div className="px-4 py-6 md:px-8">
        <LeaderboardLayout
          title="Bảng xếp hạng — Voice Roleplay"
          subtitle="Xếp hạng theo điểm trung bình (0 - 100) qua tất cả các phiên đã đánh giá."
          accentClass="bg-gradient-to-r from-rose-500 to-orange-500"
          rows={rows}
          scope={scope}
          onScopeChange={setScope}
          loading={isLoading}
          emptyText="Chưa có ai hoàn thành phiên Voice Roleplay. Hãy là người đầu tiên!"
        />
      </div>
    </>
  );
}
