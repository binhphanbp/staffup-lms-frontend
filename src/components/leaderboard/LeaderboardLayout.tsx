'use client';

import { Crown, Medal, Trophy } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export type LeaderboardScope = 'global' | 'department';

interface LeaderboardRow {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  positionTitle: string | null;
  department: { id: string; name: string } | null;
  primaryValue: string;
  primaryLabel: string;
  secondaryStats: Array<{ label: string; value: string }>;
  badge?: string | null;
  lastAt: string | null;
}

interface LeaderboardLayoutProps {
  title: string;
  subtitle: string;
  accentClass: string;
  rows: LeaderboardRow[];
  scope: LeaderboardScope;
  onScopeChange: (scope: LeaderboardScope) => void;
  loading?: boolean;
  emptyText?: string;
}

const RANK_DECOR: Record<number, { icon: React.ReactNode; bg: string }> = {
  1: {
    icon: <Crown className="h-4 w-4" />,
    bg: 'bg-amber-400 text-white',
  },
  2: {
    icon: <Medal className="h-4 w-4" />,
    bg: 'bg-slate-300 text-slate-800',
  },
  3: {
    icon: <Trophy className="h-4 w-4" />,
    bg: 'bg-orange-400 text-white',
  },
};

export function LeaderboardLayout({
  title,
  subtitle,
  accentClass,
  rows,
  scope,
  onScopeChange,
  loading,
  emptyText,
}: LeaderboardLayoutProps) {
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => onScopeChange('global')}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              scope === 'global'
                ? 'bg-indigo-500 text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Toàn công ty
          </button>
          <button
            type="button"
            onClick={() => onScopeChange('department')}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              scope === 'department'
                ? 'bg-indigo-500 text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Phòng ban
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <Trophy className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {emptyText ?? 'Chưa có dữ liệu xếp hạng. Hãy là người đầu tiên!'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            {podium.map((row) => (
              <PodiumCard
                key={row.userId}
                row={row}
                accentClass={accentClass}
                isMe={row.userId === currentUserId}
              />
            ))}
          </div>

          {rest.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-500 uppercase dark:border-slate-700 dark:text-slate-400">
                  <tr>
                    <th className="w-16 px-4 py-3">Hạng</th>
                    <th className="px-4 py-3">Học viên</th>
                    <th className="px-4 py-3">Phòng ban</th>
                    <th className="px-4 py-3 text-right">{rest[0]?.primaryLabel}</th>
                    <th className="px-4 py-3 text-right">Số phiên</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((row) => (
                    <tr
                      key={row.userId}
                      className={`border-b border-slate-100 transition last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/30 ${
                        row.userId === currentUserId ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                        #{row.rank}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar row={row} size={32} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900 dark:text-white">
                              {row.fullName}
                              {row.userId === currentUserId && (
                                <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                                  BẠN
                                </span>
                              )}
                            </p>
                            {row.positionTitle && (
                              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {row.positionTitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {row.department?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                        {row.primaryValue}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                        {row.secondaryStats.find((s) => s.label === 'Phiên')?.value ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PodiumCard({
  row,
  accentClass,
  isMe,
}: {
  row: LeaderboardRow;
  accentClass: string;
  isMe: boolean;
}) {
  const decor = RANK_DECOR[row.rank];
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-900 ${
        row.rank === 1 ? 'md:order-2 md:col-span-1 md:scale-105' : ''
      } ${row.rank === 2 ? 'md:order-1' : ''} ${row.rank === 3 ? 'md:order-3' : ''} ${
        isMe ? 'ring-2 ring-indigo-400 dark:ring-indigo-500' : ''
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${accentClass}`} />
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-bold ${
            decor?.bg ?? 'bg-slate-200 text-slate-700'
          }`}
        >
          {decor?.icon}
          Hạng {row.rank}
        </span>
        {row.badge && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-300">
            {row.badge}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Avatar row={row} size={48} />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
            {row.fullName}
            {isMe && (
              <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                BẠN
              </span>
            )}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {row.positionTitle ?? '—'}
            {row.department && ` · ${row.department.name}`}
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
        <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {row.primaryLabel}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{row.primaryValue}</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {row.secondaryStats.map((s) => (
          <div key={s.label} className="rounded-lg bg-slate-50 px-2 py-1.5 dark:bg-slate-800">
            <p className="text-[10px] tracking-wide text-slate-500 uppercase dark:text-slate-400">
              {s.label}
            </p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Avatar({ row, size }: { row: LeaderboardRow; size: number }) {
  const url =
    row.avatarUrl ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(row.fullName)}&background=4F46E5&color=fff&bold=true`;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={url}
      alt={row.fullName}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
    />
  );
}
