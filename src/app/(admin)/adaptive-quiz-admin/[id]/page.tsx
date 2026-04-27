'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
  Wand2,
  XCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog } from '@/components/ui/dialog';
import { toast } from '@/lib/toast';
import {
  useAdaptiveAdminBank,
  useAutoTuneAdaptiveBank,
  useBulkSetDifficulty,
} from '@/hooks/useAdaptiveQuiz';
import type { AdaptiveAdminBankDetail, DifficultyDistribution } from '@/types/adaptive-quiz';

const DIFFICULTY_BG: Record<number, string> = {
  1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  2: 'bg-lime-100 text-lime-700 dark:bg-lime-950/40 dark:text-lime-300',
  3: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  4: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  5: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};
const DIFFICULTY_LABEL: Record<number, string> = {
  1: 'Rất dễ',
  2: 'Dễ',
  3: 'Trung bình',
  4: 'Khó',
  5: 'Rất khó',
};

const QTYPE_LABEL: Record<string, string> = {
  single_choice: 'Trắc nghiệm 1 đáp án',
  multiple_choice: 'Trắc nghiệm nhiều đáp án',
  essay: 'Tự luận',
};

function DistributionPanel({
  dist,
  total,
  eligible,
}: {
  dist: DifficultyDistribution;
  total: number;
  eligible: number;
}) {
  const max = Math.max(1, ...(Object.values(dist) as number[]));
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
      {(['1', '2', '3', '4', '5'] as const).map((level) => {
        const count = dist[level];
        const pct = total > 0 ? Math.round((count / Math.max(1, eligible)) * 100) : 0;
        return (
          <div
            key={level}
            className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  DIFFICULTY_BG[Number(level)]
                }`}
              >
                Độ {level}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {DIFFICULTY_LABEL[Number(level)]}
              </span>
            </div>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {count}
              <span className="ml-1 text-sm font-normal text-slate-500">câu</span>
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{pct}% trên tổng</p>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        ok
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
      }`}
    >
      {ok ? <CheckCircle2 className="size-3" /> : <AlertTriangle className="size-3" />}
      {label}
    </span>
  );
}

function DetailBody({ bank }: { bank: AdaptiveAdminBankDetail }) {
  const bulkMutation = useBulkSetDifficulty();
  const autoTuneMutation = useAutoTuneAdaptiveBank();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'single_choice' | 'multiple_choice' | 'essay'
  >('all');
  const [confirm, setConfirm] = useState<null | {
    title: string;
    body: string;
    onConfirm: () => Promise<void>;
  }>(null);

  const visibleQuestions = useMemo(() => {
    const t = search.trim().toLowerCase();
    return bank.questions.filter((q) => {
      if (typeFilter !== 'all' && q.questionType !== typeFilter) return false;
      if (!t) return true;
      return q.content.toLowerCase().includes(t);
    });
  }, [bank.questions, search, typeFilter]);

  const allVisibleSelected =
    visibleQuestions.length > 0 && visibleQuestions.every((q) => selected.has(q.id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        for (const q of visibleQuestions) next.delete(q.id);
      } else {
        for (const q of visibleQuestions) next.add(q.id);
      }
      return next;
    });
  };

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleBulkSet = async (difficulty: number) => {
    const ids = Array.from(selected);
    if (ids.length === 0) {
      toast.error('Hãy chọn ít nhất 1 câu hỏi');
      return;
    }
    try {
      const r = await bulkMutation.mutateAsync({ questionIds: ids, difficulty });
      toast.success(`Đã cập nhật ${r.updated} câu lên độ ${difficulty}`);
      setSelected(new Set());
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response
        ?.data?.message;
      toast.error(msg || 'Không cập nhật được');
    }
  };

  const handleAutoTune = async (strategy: 'spread' | 'reset') => {
    try {
      const r = await autoTuneMutation.mutateAsync({ bankId: bank.id, strategy });
      toast.success(
        strategy === 'spread'
          ? `Đã trải đều ${r.updated} câu qua độ 1..5`
          : `Đã reset ${r.updated} câu về độ 3`,
      );
      setSelected(new Set());
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response
        ?.data?.message;
      toast.error(msg || 'Không tinh chỉnh được');
    }
  };

  const handleSetSingle = async (questionId: string, difficulty: number) => {
    try {
      await bulkMutation.mutateAsync({ questionIds: [questionId], difficulty });
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response
        ?.data?.message;
      toast.error(msg || 'Không cập nhật được');
    }
  };

  return (
    <div className="space-y-5">
      <Link
        href="/adaptive-quiz-admin"
        className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft className="size-4" />
        Về danh sách
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {bank.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {bank.description ?? bank.category?.name ?? 'Không có mô tả.'}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <StatusBadge
              ok={bank.isEligibleForAdaptive}
              label={bank.isEligibleForAdaptive ? 'Sẵn sàng' : 'Chưa sẵn sàng'}
            />
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {bank.eligibleQuestions} / {bank.totalQuestions} câu
            </span>
          </div>
        </div>

        <div className="mt-4">
          <DistributionPanel
            dist={bank.difficultyDistribution}
            total={bank.totalQuestions}
            eligible={bank.eligibleQuestions}
          />
        </div>

        {!bank.isEligibleForAdaptive ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              Bank cần ≥5 câu trắc nghiệm <strong>và</strong> phủ ≥2 mức độ khó để học viên có thể
              bắt đầu adaptive session. Bấm “Auto-spread 1..5” để hệ thống chia đều, hoặc chỉnh từng
              câu phía dưới.
            </span>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() =>
              setConfirm({
                title: 'Auto-spread độ khó 1..5?',
                body: `Hệ thống sẽ gán round-robin độ 1,2,3,4,5,1,2,... cho ${bank.eligibleQuestions} câu trắc nghiệm trong bank. Hành động này ghi đè độ khó hiện có.`,
                onConfirm: () => handleAutoTune('spread'),
              })
            }
            disabled={autoTuneMutation.isPending || bank.eligibleQuestions === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            <Wand2 className="size-4" />
            Auto-spread 1..5
          </button>
          <button
            type="button"
            onClick={() =>
              setConfirm({
                title: 'Reset toàn bộ về độ 3?',
                body: `Hệ thống sẽ đặt lại độ khó của ${bank.eligibleQuestions} câu trắc nghiệm về 3 (trung bình).`,
                onConfirm: () => handleAutoTune('reset'),
              })
            }
            disabled={autoTuneMutation.isPending || bank.eligibleQuestions === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="size-4" />
            Reset về 3
          </button>
          <span className="ml-1 text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Đã chọn <strong>{selected.size}</strong> · Set độ:
          </span>
          {[1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleBulkSet(d)}
              disabled={bulkMutation.isPending || selected.size === 0}
              className={`inline-flex size-7 items-center justify-center rounded-md text-xs font-semibold transition ${
                DIFFICULTY_BG[d]
              } hover:scale-105 disabled:opacity-50`}
              aria-label={`Set độ ${d} cho ${selected.size} câu`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { v: 'all', label: 'Tất cả' },
                { v: 'single_choice', label: 'Trắc nghiệm 1 đáp án' },
                { v: 'multiple_choice', label: 'Trắc nghiệm nhiều đáp án' },
                { v: 'essay', label: 'Tự luận' },
              ] as Array<{ v: typeof typeFilter; label: string }>
            ).map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => setTypeFilter(opt.v)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  typeFilter === opt.v
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo nội dung câu hỏi…"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs tracking-wide text-slate-500 uppercase dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    aria-label="Chọn tất cả câu hiển thị"
                  />
                </th>
                <th className="px-3 py-2">Nội dung</th>
                <th className="w-32 px-3 py-2">Loại</th>
                <th className="w-20 px-3 py-2 text-center">Đáp án</th>
                <th className="w-56 px-3 py-2 text-center">Độ khó</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visibleQuestions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    Không có câu hỏi nào khớp bộ lọc.
                  </td>
                </tr>
              ) : (
                visibleQuestions.map((q) => {
                  const checked = selected.has(q.id);
                  const isEssay = q.questionType === 'essay';
                  return (
                    <tr
                      key={q.id}
                      className={`${
                        checked ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      } hover:bg-slate-50 dark:hover:bg-slate-800/40`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOne(q.id)}
                          disabled={isEssay}
                          aria-label={`Chọn câu ${q.id}`}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <p className="line-clamp-2 text-slate-900 dark:text-slate-100">
                          {q.content}
                        </p>
                        {!q.isActive ? (
                          <span className="mt-0.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Đã ẩn
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="size-3" />
                          {QTYPE_LABEL[q.questionType] ?? q.questionType}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-xs text-slate-600 dark:text-slate-400">
                        {q.correctOptionsCount > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="size-3 text-emerald-500" />
                            {q.correctOptionsCount}/{q.optionsCount}
                          </span>
                        ) : isEssay ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500">
                            <XCircle className="size-3" />
                            Thiếu
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {isEssay ? (
                          <span className="text-center text-xs text-slate-400">Không áp dụng</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => handleSetSingle(q.id, d)}
                                disabled={bulkMutation.isPending}
                                className={`size-7 rounded text-xs font-semibold transition ${
                                  q.difficulty === d
                                    ? `${DIFFICULTY_BG[d]} ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-900`
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                                }`}
                                aria-label={`Đặt độ khó ${d} cho câu ${q.id}`}
                                aria-pressed={q.difficulty === d}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {bulkMutation.isPending || autoTuneMutation.isPending ? (
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Loader2 className="size-3 animate-spin" />
            Đang lưu…
          </p>
        ) : null}
      </section>

      <Dialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        ariaLabel={confirm?.title ?? 'Xác nhận'}
      >
        <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          {confirm?.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{confirm?.body}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirm(null)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!confirm) return;
              const fn = confirm.onConfirm;
              setConfirm(null);
              await fn();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
          >
            <Sparkles className="size-4" />
            Xác nhận
          </button>
        </div>
      </Dialog>
    </div>
  );
}

export default function AdaptiveBankDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useAdaptiveAdminBank(id);

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<AlertTriangle className="size-10" />}
          title="Không tải được bank"
          description={(error as Error)?.message ?? 'Bank không tồn tại hoặc bạn không có quyền.'}
        />
      </div>
    );
  }
  return (
    <div className="p-6">
      <DetailBody bank={data} />
    </div>
  );
}
