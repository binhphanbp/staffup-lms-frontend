'use client';

import { useMemo } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  Loader2,
  PartyPopper,
  Rocket,
  SkipForward,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useMyActiveOnboardingPlan, useUpdateOnboardingTaskStatus } from '@/hooks/useOnboarding';
import { toast } from '@/lib/toast';
import type {
  OnboardingTaskCategory,
  OnboardingTaskPriority,
  OnboardingTaskStatus,
} from '@/types/onboarding';

const CATEGORY_LABELS: Record<OnboardingTaskCategory, { label: string; classes: string }> = {
  learning: { label: 'Học tập', classes: 'bg-blue-50 text-blue-700' },
  admin: { label: 'Hành chính', classes: 'bg-slate-100 text-slate-700' },
  meeting: { label: 'Họp 1-1', classes: 'bg-amber-50 text-amber-700' },
  practice: { label: 'Thực hành', classes: 'bg-emerald-50 text-emerald-700' },
  review: { label: 'Đánh giá', classes: 'bg-violet-50 text-violet-700' },
  other: { label: 'Khác', classes: 'bg-slate-100 text-slate-700' },
};

const PRIORITY_BADGE: Record<OnboardingTaskPriority, string> = {
  high: 'border-rose-300 text-rose-600',
  medium: 'border-amber-300 text-amber-600',
  low: 'border-slate-200 text-slate-500',
};

function formatDate(iso: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d;
}

function StageStatusBadge({ start, end, today }: { start: Date; end: Date; today: Date }) {
  if (today < start) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        Sắp tới
      </span>
    );
  }
  if (today > end) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        Đã hết hạn
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
      Đang trong giai đoạn
    </span>
  );
}

export default function StudentOnboardingPage() {
  const { data, isLoading, error } = useMyActiveOnboardingPlan();
  const updateStatus = useUpdateOnboardingTaskStatus();

  const today = useMemo(() => new Date(), []);

  const handleToggle = async (planId: string, taskId: string, current: OnboardingTaskStatus) => {
    const next: OnboardingTaskStatus = current === 'done' ? 'pending' : 'done';
    try {
      await updateStatus.mutateAsync({
        planId,
        taskId,
        input: { status: next },
      });
      toast.success(next === 'done' ? 'Hoàn thành task' : 'Đã đánh dấu chưa làm');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không cập nhật được';
      toast.error('Lỗi cập nhật', { description: msg });
    }
  };

  const handleSkip = async (planId: string, taskId: string) => {
    try {
      await updateStatus.mutateAsync({
        planId,
        taskId,
        input: { status: 'skipped' },
      });
      toast.success('Đã bỏ qua task');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không cập nhật được';
      toast.error('Lỗi cập nhật', { description: msg });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#1A73E8]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <h2 className="text-lg font-semibold text-[#202124] dark:text-slate-100">
          Không tải được kế hoạch
        </h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F0FE] text-[#1A73E8]">
          <Rocket className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold text-[#202124] dark:text-slate-100">
          Chưa có kế hoạch onboarding nào dành cho bạn
        </h2>
        <p className="mt-2 text-sm text-[#5F6368] dark:text-slate-400">
          Liên hệ manager để được giao kế hoạch hội nhập 30/60/90 ngày phù hợp với vị trí của bạn.
        </p>
      </div>
    );
  }

  const planEnd = addDays(data.startDate, data.totalDays);
  const dayElapsed = Math.max(
    0,
    Math.floor((today.getTime() - new Date(data.startDate).getTime()) / 86_400_000),
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      <header className="mb-6 rounded-2xl border border-[#E8EAED] bg-gradient-to-br from-[#E8F0FE] to-white p-6 dark:border-slate-800 dark:from-sky-950/40 dark:to-slate-900">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-[#1A73E8] uppercase dark:text-sky-300">
          <Rocket className="h-4 w-4" />
          Hành trình hội nhập của bạn
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-[#202124] dark:text-slate-100">
          {data.templateName}
        </h1>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-[#DADCE0] bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-xs text-[#5F6368] dark:text-slate-400">
              <Trophy className="h-3.5 w-3.5" /> Tiến độ
            </div>
            <div className="mt-0.5 text-xl font-semibold text-[#202124] dark:text-slate-100">
              {data.progressPercent}%
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${data.progressPercent}%` }}
              />
            </div>
          </div>
          <div className="rounded-xl border border-[#DADCE0] bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-xs text-[#5F6368] dark:text-slate-400">
              <CalendarDays className="h-3.5 w-3.5" /> Bắt đầu
            </div>
            <div className="mt-0.5 text-sm font-medium text-[#202124] dark:text-slate-100">
              {formatDate(data.startDate)}
            </div>
          </div>
          <div className="rounded-xl border border-[#DADCE0] bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-xs text-[#5F6368] dark:text-slate-400">
              <Flag className="h-3.5 w-3.5" /> Kết thúc dự kiến
            </div>
            <div className="mt-0.5 text-sm font-medium text-[#202124] dark:text-slate-100">
              {planEnd.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>
          <div className="rounded-xl border border-[#DADCE0] bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-xs text-[#5F6368] dark:text-slate-400">
              <Clock className="h-3.5 w-3.5" /> Đang ở ngày
            </div>
            <div className="mt-0.5 text-sm font-medium text-[#202124] dark:text-slate-100">
              {Math.min(dayElapsed, data.totalDays)} / {data.totalDays}
            </div>
          </div>
        </div>
        {data.notes && (
          <div className="mt-3 rounded-lg bg-white/80 p-3 text-sm text-[#5F6368] dark:bg-slate-900/60 dark:text-slate-400">
            <Sparkles className="mr-1 inline h-4 w-4 text-violet-600" />
            <span>Ghi chú từ manager: {data.notes}</span>
          </div>
        )}
        {data.status === 'completed' && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <PartyPopper className="h-4 w-4" /> Bạn đã hoàn thành onboarding 🎉
          </div>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.stages.map((stage) => {
          const start = addDays(data.startDate, stage.startOffsetDays);
          const end = addDays(data.startDate, stage.endOffsetDays);
          const done = stage.tasks.filter((t) => t.status === 'done').length;
          return (
            <section
              key={stage.id}
              className="flex flex-col rounded-2xl border border-[#E8EAED] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <header className="border-b border-[#E8EAED] p-4 dark:border-slate-800">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-[#202124] dark:text-slate-100">
                    {stage.name}
                  </h2>
                  <StageStatusBadge start={start} end={end} today={today} />
                </div>
                {stage.description && (
                  <p className="text-xs text-[#5F6368] dark:text-slate-400">{stage.description}</p>
                )}
                <div className="mt-2 flex items-center justify-between text-xs text-[#5F6368] dark:text-slate-400">
                  <span>
                    {formatDate(start.toISOString())} → {formatDate(end.toISOString())}
                  </span>
                  <span className="font-medium">
                    {done}/{stage.tasks.length}
                  </span>
                </div>
              </header>
              <ul className="flex-1 space-y-2 p-3">
                {stage.tasks.length === 0 && (
                  <li className="rounded-xl border border-dashed border-[#DADCE0] p-4 text-center text-xs text-[#9AA0A6] dark:border-slate-700 dark:text-slate-500">
                    Chưa có task nào
                  </li>
                )}
                {stage.tasks.map((task) => {
                  const isDone = task.status === 'done';
                  const isSkipped = task.status === 'skipped';
                  const cat = CATEGORY_LABELS[task.category];
                  return (
                    <li
                      key={task.id}
                      className={`group rounded-xl border p-3 transition ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                          : isSkipped
                            ? 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800/40'
                            : 'border-[#E8EAED] bg-white hover:border-[#1A73E8] hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-600'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => handleToggle(data.id, task.id, task.status)}
                          disabled={updateStatus.isPending}
                          className="mt-0.5 transition hover:scale-110 disabled:opacity-50"
                          aria-label={isDone ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300 group-hover:text-[#1A73E8] dark:text-slate-600" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-sm font-medium ${
                              isDone
                                ? 'text-[#5F6368] line-through dark:text-slate-500'
                                : 'text-[#202124] dark:text-slate-100'
                            }`}
                          >
                            {task.title}
                          </div>
                          {task.description && (
                            <p className="mt-0.5 text-xs text-[#5F6368] dark:text-slate-400">
                              {task.description}
                            </p>
                          )}
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cat.classes} dark:bg-opacity-30`}
                            >
                              {cat.label}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_BADGE[task.priority]}`}
                            >
                              {task.priority === 'high'
                                ? 'Ưu tiên cao'
                                : task.priority === 'medium'
                                  ? 'Trung bình'
                                  : 'Linh hoạt'}
                            </span>
                            <span className="text-[10px] text-[#9AA0A6] dark:text-slate-500">
                              ⏱ {task.estimatedHours}h
                            </span>
                            {task.completedAt && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                ✓ {formatDate(task.completedAt)}
                              </span>
                            )}
                          </div>
                          {task.managerNote && (
                            <div className="mt-1.5 rounded-lg bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                              💬 Note manager: {task.managerNote}
                            </div>
                          )}
                        </div>
                        {!isDone && !isSkipped && (
                          <button
                            onClick={() => handleSkip(data.id, task.id)}
                            disabled={updateStatus.isPending}
                            className="rounded p-1 text-[#9AA0A6] transition hover:bg-slate-100 hover:text-[#5F6368] disabled:opacity-50 dark:hover:bg-slate-800"
                            aria-label="Bỏ qua task"
                            title="Bỏ qua task"
                          >
                            <SkipForward className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
