'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { SkillRadarChart } from '@/components/skill-gap/SkillRadarChart';
import { toast } from '@/lib/toast';
import { useMyGap, useSetMySkillLevel } from '@/hooks/useSkillGap';
import type { SkillGapEntry } from '@/types/skill-gap';

const breadcrumbs = [{ label: 'Trang chủ', href: '/' }, { label: 'Hồ sơ kỹ năng' }];

const BAND_STYLES: Record<string, string> = {
  Mastery: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  Proficient: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  Competent: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  Developing: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  'Needs Significant Development':
    'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  'Not Set': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const BAND_VI: Record<string, string> = {
  Mastery: 'Thành thạo xuất sắc',
  Proficient: 'Thành thạo',
  Competent: 'Đủ năng lực',
  Developing: 'Đang phát triển',
  'Needs Significant Development': 'Cần phát triển nhiều',
  'Not Set': 'Chưa thiết lập',
};

export default function SkillProfilePage() {
  const { data, isLoading, error } = useMyGap();
  const setLevelMutation = useSetMySkillLevel();
  const [savingId, setSavingId] = useState<string | null>(null);

  const radarPoints = useMemo(
    () =>
      (data?.entries ?? []).map((e) => ({
        label: e.skill.name,
        current: e.currentLevel,
        target: e.targetLevel,
      })),
    [data?.entries],
  );

  const handleSetLevel = async (entry: SkillGapEntry, level: number) => {
    setSavingId(entry.skillId);
    try {
      await setLevelMutation.mutateAsync({ skillId: entry.skillId, level });
      toast.success(`Đã cập nhật ${entry.skill.name}`);
    } catch (e) {
      toast.error((e as Error).message || 'Cập nhật thất bại');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <StudentHeader breadcrumbs={breadcrumbs} />
      <div className="px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Hồ sơ kỹ năng của tôi
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            So sánh trình độ hiện tại với yêu cầu vị trí. Tự đánh giá bằng thang 1-5 để hệ thống đề
            xuất khoá học phù hợp.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-72" />
            <Skeleton className="h-72 lg:col-span-2" />
          </div>
        ) : error ? (
          <EmptyState
            icon={<Target className="size-10" />}
            title="Không tải được hồ sơ"
            description={(error as Error).message}
          />
        ) : !data || !data.positionTitle ? (
          <EmptyState
            icon={<Target className="size-10" />}
            title="Chưa thiết lập vị trí"
            description="Liên hệ quản trị viên để gán vị trí cho tài khoản của bạn."
          />
        ) : data.totalSkills === 0 ? (
          <EmptyState
            icon={<Lightbulb className="size-10" />}
            title={`Vị trí "${data.positionTitle}" chưa có kỹ năng yêu cầu`}
            description="Quản trị viên/Trainer cần thiết lập kỹ năng yêu cầu cho vị trí này trước."
          />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Vị trí</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {data.positionTitle}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      BAND_STYLES[data.band] ?? BAND_STYLES['Not Set']
                    }`}
                  >
                    {BAND_VI[data.band] ?? data.band}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Mức độ sẵn sàng</span>
                    <span className="font-semibold">{data.readiness}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500 transition-all"
                      style={{ width: `${data.readiness}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Stat icon={Target} label="Kỹ năng" value={String(data.totalSkills)} />
                  <Stat icon={TrendingUp} label="Hiện tại" value={data.averageCurrent.toFixed(1)} />
                  <Stat icon={Award} label="Yêu cầu" value={data.averageTarget.toFixed(1)} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Bản đồ kỹ năng
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Vùng xanh: trình độ hiện tại · Đường gạch tím: mức yêu cầu
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <span className="inline-block h-3 w-3 rounded bg-emerald-500/40 ring-1 ring-emerald-500" />
                      Hiện tại
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <span className="inline-block h-3 w-3 rounded border border-dashed border-indigo-500" />
                      Yêu cầu
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <SkillRadarChart points={radarPoints} size={420} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Tự đánh giá kỹ năng
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Thang 1 (Mới biết) → 5 (Master)
                </span>
              </div>

              <div className="space-y-3">
                {data.entries.map((e) => (
                  <div
                    key={e.skillId}
                    className="rounded-xl border border-slate-200 p-4 transition hover:shadow-sm dark:border-slate-800"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {e.skill.name}
                          </h3>
                          {e.isCore && (
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                              CỐT LÕI
                            </span>
                          )}
                          {e.skill.category && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {e.skill.category}
                            </span>
                          )}
                          {e.gap > 0 && (
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                              Gap {e.gap}
                            </span>
                          )}
                        </div>
                        {e.skill.description && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {e.skill.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {e.currentLevel}/{e.targetLevel}
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((lvl) => {
                            const isCurrent = e.currentLevel === lvl;
                            const isTargetOrBelow = lvl <= e.targetLevel;
                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => handleSetLevel(e, lvl)}
                                disabled={savingId === e.skillId}
                                aria-label={`Đặt ${e.skill.name} mức ${lvl}`}
                                className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                                  isCurrent
                                    ? 'bg-emerald-500 text-white ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900'
                                    : isTargetOrBelow
                                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-500 dark:hover:bg-slate-800'
                                }`}
                              >
                                {lvl}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {e.recommendedCourses.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Khoá học gợi ý:
                        </span>
                        {e.recommendedCourses.map((c) => (
                          <Link
                            key={c.id}
                            href={`/courses/${c.slug}`}
                            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/60"
                          >
                            {c.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50 p-6 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-sky-950/20">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Xác minh năng lực bằng Adaptive Quiz
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Hệ thống sẽ chọn câu hỏi phù hợp với trình độ hiện tại để đánh giá khách quan.
                      Kết quả sẽ tự động cập nhật vào hồ sơ kỹ năng.
                    </p>
                    <Link
                      href="/adaptive-quiz"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-slate-900"
                    >
                      Bắt đầu Adaptive Quiz
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-indigo-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Mẹo</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Tự đánh giá thật trung thực giúp hệ thống đề xuất lộ trình chính xác hơn. Quản
                      lý của bạn cũng có thể đánh giá lại mỗi kỹ năng và sẽ ghi đè đánh giá cá nhân.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 text-center dark:bg-slate-800">
      <Icon className="mx-auto mb-1 h-4 w-4 text-slate-500 dark:text-slate-400" />
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="text-[10px] tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
