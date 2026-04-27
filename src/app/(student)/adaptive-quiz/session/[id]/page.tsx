'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/lib/toast';
import {
  useAbandonAdaptiveSession,
  useAdaptiveSession,
  useEndAdaptiveSession,
  useSubmitAdaptiveAnswer,
} from '@/hooks/useAdaptiveQuiz';
import type { AdaptiveAnsweredItem } from '@/types/adaptive-quiz';

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

function AbilityGauge({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, (value / 5) * 100));
  return (
    <div className="space-y-2" aria-label={`Năng lực ước lượng ${value.toFixed(2)} trên 5`}>
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>Năng lực ước lượng</span>
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {value.toFixed(2)} / 5
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function FeedbackPanel({ item }: { item: AdaptiveAnsweredItem }) {
  const correctIds = item.question.options.filter((o) => o.isCorrect).map((o) => o.id);
  return (
    <div
      className={`mt-4 rounded-xl border p-4 text-sm ${
        item.isCorrect
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
          : 'border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/20'
      }`}
    >
      <div className="flex items-start gap-2">
        {item.isCorrect ? (
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <XCircle className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
        )}
        <div className="space-y-1">
          <p
            className={`font-semibold ${
              item.isCorrect
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-rose-700 dark:text-rose-300'
            }`}
          >
            {item.isCorrect ? 'Trả lời đúng' : 'Trả lời chưa đúng'}
          </p>
          {!item.isCorrect && correctIds.length > 0 ? (
            <p className="text-slate-600 dark:text-slate-400">
              Đáp án đúng:{' '}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {item.question.options
                  .filter((o) => o.isCorrect)
                  .map((o) => o.content)
                  .join(', ')}
              </span>
            </p>
          ) : null}
          {item.question.explanation ? (
            <p className="text-slate-700 dark:text-slate-300">{item.question.explanation}</p>
          ) : null}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Năng lực: {item.abilityBefore.toFixed(2)} → {item.abilityAfter.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdaptiveQuizSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = use(params);
  const router = useRouter();
  const { data: session, isLoading, error } = useAdaptiveSession(sessionId);
  const submitMutation = useSubmitAdaptiveAnswer(sessionId);
  const endMutation = useEndAdaptiveSession(sessionId);
  const abandonMutation = useAbandonAdaptiveSession(sessionId);
  const [selected, setSelected] = useState<string[]>([]);
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(0);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);

  const currentItemId = session?.currentItem?.itemId;

  useEffect(() => {
    if (!currentItemId) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelected([]);
    setQuestionStartedAt(Date.now());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [currentItemId]);

  useEffect(() => {
    if (session?.status === 'completed' || session?.status === 'abandoned') {
      router.replace(`/adaptive-quiz/session/${sessionId}/result`);
    }
  }, [session?.status, sessionId, router]);

  const lastFeedback = useMemo(() => {
    if (!session || session.answeredItems.length === 0) return null;
    return session.answeredItems[session.answeredItems.length - 1];
  }, [session]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
        <p className="font-semibold">Không tải được phiên</p>
        <p className="text-sm">{(error as Error)?.message ?? 'Phiên không tồn tại.'}</p>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Quiz thích nghi', href: '/adaptive-quiz' },
    { label: `Phiên #${session.id}` },
  ];

  const item = session.currentItem;
  const isMulti =
    (item?.question.options.length ?? 0) > 0 && item?.question.questionType === 'multiple_choice';
  const progressPct =
    session.maxQuestions > 0 ? (session.answeredCount / session.maxQuestions) * 100 : 0;

  const toggleSelected = (optId: string) => {
    setSelected((prev) => {
      if (isMulti) {
        return prev.includes(optId) ? prev.filter((x) => x !== optId) : [...prev, optId];
      }
      return [optId];
    });
  };

  const handleSubmit = async () => {
    if (!item || selected.length === 0) {
      toast.error('Hãy chọn ít nhất một đáp án');
      return;
    }
    try {
      await submitMutation.mutateAsync({
        itemId: item.itemId,
        selectedOptionIds: selected,
        timeSpentMs: Date.now() - questionStartedAt,
      });
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response
        ?.data?.message;
      toast.error(msg || 'Không gửi được đáp án');
    }
  };

  const handleEnd = async () => {
    try {
      await endMutation.mutateAsync();
      router.push(`/adaptive-quiz/session/${sessionId}/result`);
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response
        ?.data?.message;
      toast.error(msg || 'Không kết thúc được phiên');
    }
  };

  const handleAbandon = async () => {
    try {
      await abandonMutation.mutateAsync();
      router.push('/adaptive-quiz');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response
        ?.data?.message;
      toast.error(msg || 'Không hủy được phiên');
    }
  };

  return (
    <div className="space-y-5">
      <StudentHeader breadcrumbs={breadcrumbs} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
              {session.questionBankTitle}
            </p>
            <h1 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Câu {session.answeredCount + (item ? 1 : 0)} / {session.maxQuestions}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAbandonDialog(true)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Hủy phiên
            </button>
            <button
              type="button"
              onClick={handleEnd}
              disabled={endMutation.isPending || session.answeredCount === 0}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-60"
            >
              Kết thúc & xem kết quả
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Tiến độ</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {Math.round(progressPct)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <AbilityGauge value={session.abilityScore} />
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/40">
            <p className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Đúng / Đã trả lời
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {session.correctCount}
              <span className="ml-1 text-base text-slate-500 dark:text-slate-400">
                / {session.answeredCount}
              </span>
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <BarChart3 className="size-3.5" />
              Mức độ tới: <span className="font-semibold">{session.currentDifficulty}</span>
            </p>
          </div>
        </div>
      </section>

      {item ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                DIFFICULTY_BG[item.question.difficulty] ?? DIFFICULTY_BG[3]
              }`}
            >
              Độ {item.question.difficulty} · {DIFFICULTY_LABEL[item.question.difficulty]}
            </span>
            {isMulti ? (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Nhiều đáp án
              </span>
            ) : null}
          </div>
          <h2 className="text-base leading-relaxed font-semibold text-slate-900 dark:text-slate-100">
            {item.question.content}
          </h2>

          <div className="mt-5 space-y-2">
            {item.question.options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleSelected(opt.id)}
                  disabled={submitMutation.isPending}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-100'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected ? <CheckCircle2 className="size-3.5" /> : null}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">{opt.content}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selected.length === 0
                ? 'Chọn đáp án bạn cho là đúng nhất'
                : `${selected.length} đáp án đã chọn`}
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitMutation.isPending || selected.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              {submitMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
              Gửi câu trả lời
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Đã trả lời hết câu hỏi khả dụng. Bấm “Kết thúc & xem kết quả” để xem điểm năng lực.
          </p>
          <button
            type="button"
            onClick={handleEnd}
            disabled={endMutation.isPending}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            Xem kết quả
          </button>
        </section>
      )}

      {lastFeedback ? <FeedbackPanel item={lastFeedback} /> : null}

      {showAbandonDialog ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 size-5 text-amber-500" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Hủy phiên này?
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Phiên đang dở sẽ được đánh dấu là đã hủy và không thể tiếp tục. Năng lực hiện tại
                  sẽ không được lưu lại.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAbandonDialog(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Tiếp tục làm
              </button>
              <button
                type="button"
                onClick={handleAbandon}
                disabled={abandonMutation.isPending}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-500 disabled:opacity-60"
              >
                Hủy phiên
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
