'use client';

import { Fragment, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronDown,
  ChevronUp,
  Flame,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { AdminHeader } from '@/components/shared/AdminHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { departmentService } from '@/services/department.service';
import { useTeamRollUp, useUserGap } from '@/hooks/useSkillGap';
import { useQuery } from '@tanstack/react-query';
import { SkillRadarChart } from '@/components/skill-gap/SkillRadarChart';
import type { TeamMemberGap } from '@/types/skill-gap';

const BAND_COLORS: Record<string, string> = {
  Mastery: 'bg-emerald-500',
  Proficient: 'bg-emerald-400',
  Competent: 'bg-sky-400',
  Developing: 'bg-amber-400',
  'Needs Significant Development': 'bg-rose-400',
  'Not Set': 'bg-slate-400',
};

const HEAT_COLORS = ['bg-emerald-500/15', 'bg-amber-300/40', 'bg-amber-500/50', 'bg-rose-500/60'];
function heatColor(gap: number): string {
  if (gap <= 0.3) return HEAT_COLORS[0];
  if (gap <= 1.0) return HEAT_COLORS[1];
  if (gap <= 2.0) return HEAT_COLORS[2];
  return HEAT_COLORS[3];
}

export default function ManagerSkillGapPage() {
  const { data: departments, isLoading: deptLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.list(),
  });
  const [pickedDeptId, setPickedDeptId] = useState<string | null>(null);
  const departmentId = useMemo(
    () =>
      pickedDeptId ?? (departments && departments.length > 0 ? String(departments[0].id) : null),
    [pickedDeptId, departments],
  );

  const { data: rollUp, isLoading, error } = useTeamRollUp(departmentId);
  const [drillUserId, setDrillUserId] = useState<string | null>(null);
  const { data: drillGap, isLoading: drillLoading } = useUserGap(drillUserId);

  const sortedMembers = useMemo<TeamMemberGap[]>(
    () => (rollUp?.members ?? []).slice().sort((a, b) => a.readiness - b.readiness),
    [rollUp?.members],
  );

  const drillRadar = useMemo(
    () =>
      (drillGap?.entries ?? []).map((e) => ({
        label: e.skill.name,
        current: e.currentLevel,
        target: e.targetLevel,
      })),
    [drillGap?.entries],
  );

  return (
    <>
      <AdminHeader />
      <div className="px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skill Gap đội</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Đánh giá năng lực toàn đội theo yêu cầu vị trí, xác định kỹ năng cần đào tạo trước
              tiên.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            {deptLoading ? (
              <Skeleton className="h-9 w-56" />
            ) : (
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={departmentId ?? ''}
                onChange={(e) => {
                  setPickedDeptId(e.target.value || null);
                  setDrillUserId(null);
                }}
              >
                {departments?.map((d) => (
                  <option key={String(d.id)} value={String(d.id)}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : error ? (
          <EmptyState
            icon={<Target className="size-10" />}
            title="Không tải được dữ liệu"
            description={(error as Error).message}
          />
        ) : !rollUp || rollUp.totalMembers === 0 ? (
          <EmptyState
            icon={<Users className="size-10" />}
            title="Phòng ban chưa có thành viên active"
            description="Hãy chọn phòng ban khác hoặc thêm nhân sự."
          />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="Tổng thành viên"
                value={rollUp.totalMembers.toString()}
                tone="indigo"
              />
              <StatCard
                icon={<Sparkles className="h-5 w-5" />}
                label="Sẵn sàng trung bình"
                value={`${rollUp.averageReadiness}%`}
                tone="emerald"
              />
              <StatCard
                icon={<Flame className="h-5 w-5" />}
                label="Kỹ năng cần đào tạo nhất"
                value={rollUp.skillHeatmap.length > 0 ? rollUp.skillHeatmap[0].skillName : '—'}
                tone="rose"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Heatmap kỹ năng
              </h2>
              {rollUp.skillHeatmap.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Chưa có dữ liệu kỹ năng. Hãy thiết lập kỹ năng yêu cầu cho các vị trí trước.
                </p>
              ) : (
                <div className="space-y-2">
                  {rollUp.skillHeatmap.map((s) => (
                    <div key={s.skillId} className="flex items-center gap-3">
                      <div className="w-48 shrink-0 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                        {s.skillName}
                      </div>
                      <div className="flex-1">
                        <div className="h-6 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`flex h-full items-center justify-end pr-2 text-xs font-semibold text-slate-800 transition-all ${heatColor(s.averageGap)}`}
                            style={{
                              width: `${Math.min(100, (s.averageGap / 4) * 100 + 8)}%`,
                            }}
                          >
                            Gap {s.averageGap.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="w-32 shrink-0 text-right text-xs text-slate-500 dark:text-slate-400">
                        {s.affectedMembers}/{rollUp.totalMembers} cần phát triển
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Thành viên đội ({sortedMembers.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-500 uppercase dark:border-slate-700 dark:text-slate-400">
                    <tr>
                      <th className="py-3 pr-3">Họ tên</th>
                      <th className="py-3 pr-3">Vị trí</th>
                      <th className="py-3 pr-3">Sẵn sàng</th>
                      <th className="py-3 pr-3">Mức</th>
                      <th className="py-3 pr-3">Top kỹ năng cần đào tạo</th>
                      <th className="py-3 pr-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMembers.map((m) => {
                      const isOpen = drillUserId === m.userId;
                      return (
                        <Fragment key={m.userId}>
                          <tr className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 pr-3 font-medium text-slate-900 dark:text-white">
                              {m.fullName}
                            </td>
                            <td className="py-3 pr-3 text-slate-600 dark:text-slate-300">
                              {m.positionTitle ?? '—'}
                            </td>
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                  <div
                                    className={`h-full ${BAND_COLORS[m.band] ?? BAND_COLORS['Not Set']}`}
                                    style={{ width: `${m.readiness}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                  {m.readiness}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 pr-3">
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {m.band}
                              </span>
                            </td>
                            <td className="py-3 pr-3">
                              <div className="flex flex-wrap gap-1">
                                {m.topGapSkills.length === 0 ? (
                                  <span className="text-xs text-slate-400">Không có gap</span>
                                ) : (
                                  m.topGapSkills.map((s) => (
                                    <span
                                      key={s.skillId}
                                      className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                                    >
                                      {s.skillName} (+{s.gap})
                                    </span>
                                  ))
                                )}
                              </div>
                            </td>
                            <td className="py-3 pr-3 text-right">
                              <button
                                type="button"
                                onClick={() => setDrillUserId(isOpen ? null : m.userId)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                              >
                                {isOpen ? (
                                  <>
                                    Thu gọn <ChevronUp className="h-3.5 w-3.5" />
                                  </>
                                ) : (
                                  <>
                                    Chi tiết <ChevronDown className="h-3.5 w-3.5" />
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                          {isOpen && (
                            <tr className="bg-slate-50 dark:bg-slate-950/40">
                              <td colSpan={6} className="px-4 py-4">
                                {drillLoading || !drillGap ? (
                                  <Skeleton className="h-72" />
                                ) : drillGap.entries.length === 0 ? (
                                  <p className="text-sm text-slate-500">
                                    Chưa có kỹ năng yêu cầu cho vị trí này.
                                  </p>
                                ) : (
                                  <div className="grid gap-4 lg:grid-cols-5">
                                    <div className="lg:col-span-2">
                                      <SkillRadarChart points={drillRadar} size={300} />
                                    </div>
                                    <div className="space-y-2 lg:col-span-3">
                                      {drillGap.entries.map((e) => (
                                        <div
                                          key={e.skillId}
                                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                                        >
                                          <div className="flex flex-1 items-center gap-2">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                              {e.skill.name}
                                            </span>
                                            {e.isCore && (
                                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                                                CORE
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-3 text-xs">
                                            <span className="text-slate-500">
                                              {e.currentLevel} / {e.targetLevel}
                                            </span>
                                            {e.gap > 0 ? (
                                              <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                                +{e.gap}
                                              </span>
                                            ) : (
                                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                Đạt
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 text-sm dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-indigo-500" />
            <p className="text-slate-700 dark:text-slate-300">
              Cần thiết lập kỹ năng yêu cầu cho vị trí?{' '}
              <a
                href="/admin/skills"
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Đến trang Quản lý Skill <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'indigo' | 'emerald' | 'rose';
}) {
  const toneClass = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
  }[tone];
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {label}
        </p>
        <p className="truncate text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
