'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BarChart3, Brain, Clock, Layers, Sparkles, TrendingUp } from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from '@/lib/toast';
import {
  useAdaptiveBanks,
  useMyAdaptiveSessions,
  useStartAdaptiveSession,
} from '@/hooks/useAdaptiveQuiz';
import type { AdaptiveBank, AdaptiveSessionSummary } from '@/types/adaptive-quiz';

const breadcrumbs = [{ label: 'Trang chủ', href: '/' }, { label: 'Quiz thích nghi' }];

const STATUS_LABELS = {
  in_progress: 'Đang làm',
  completed: 'Hoàn tất',
  abandoned: 'Đã hủy',
} as const;

const STATUS_STYLES = {
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  abandoned: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
} as const;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

function DifficultyDots({ levels }: { levels: number[] }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((d) => (
        <span
          key={d}
          aria-label={`Độ ${d}${levels.includes(d) ? ' có' : ' thiếu'}`}
          className={`size-2 rounded-full ${
            levels.includes(d) ? 'bg-blue-500 dark:bg-blue-400' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        />
      ))}
    </div>
  );
}

function BankCard({
  bank,
  onStart,
  isStarting,
}: {
  bank: AdaptiveBank;
  onStart: (id: string) => void;
  isStarting: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            <Brain className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {bank.title}
            </h3>
            {bank.category ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">{bank.category.name}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        {bank.description ? (
          <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
            {bank.description}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="size-3.5" />
            <span>{bank.questionCount} câu</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="size-3.5" />
            <DifficultyDots levels={bank.difficultyCoverage} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onStart(bank.id)}
          disabled={isStarting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          <Sparkles className="size-4" />
          Bắt đầu phiên thích nghi
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}

function SessionRow({ session }: { session: AdaptiveSessionSummary }) {
  return (
    <Link
      href={
        session.status === 'in_progress'
          ? `/adaptive-quiz/session/${session.id}`
          : `/adaptive-quiz/session/${session.id}/result`
      }
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700/50 dark:hover:bg-blue-950/20"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900 dark:text-slate-100">
          {session.questionBankTitle}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <Clock className="mr-1 inline size-3" />
          {formatDate(session.startedAt)} · {session.answeredCount}/{session.maxQuestions} câu
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {session.abilityScore.toFixed(2)}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            STATUS_STYLES[session.status]
          }`}
        >
          {STATUS_LABELS[session.status]}
        </span>
        <ArrowRight className="size-4 text-slate-400" />
      </div>
    </Link>
  );
}

export default function AdaptiveQuizPage() {
  const router = useRouter();
  const { data: banks, isLoading: loadingBanks, error: banksErr } = useAdaptiveBanks();
  const { data: sessions, isLoading: loadingSessions } = useMyAdaptiveSessions();
  const startMutation = useStartAdaptiveSession();
  const [filter, setFilter] = useState('');

  const filteredBanks = useMemo(() => {
    if (!banks) return [];
    const t = filter.trim().toLowerCase();
    if (!t) return banks;
    return banks.filter(
      (b) =>
        b.title.toLowerCase().includes(t) || (b.category?.name.toLowerCase().includes(t) ?? false),
    );
  }, [banks, filter]);

  const stats = useMemo(() => {
    if (!sessions) return null;
    const completed = sessions.filter((s) => s.status === 'completed');
    const best = completed.reduce(
      (acc, s) => (s.abilityScore > acc.abilityScore ? s : acc),
      completed[0] ?? null,
    );
    return {
      total: sessions.length,
      completed: completed.length,
      best,
    };
  }, [sessions]);

  const handleStart = async (bankId: string) => {
    try {
      const session = await startMutation.mutateAsync({ questionBankId: bankId });
      toast.success('Đã tạo phiên thích nghi');
      router.push(`/adaptive-quiz/session/${session.id}`);
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response
        ?.data?.message;
      toast.error(msg || 'Không thể bắt đầu phiên');
    }
  };

  return (
    <div className="space-y-6">
      <StudentHeader breadcrumbs={breadcrumbs} />

      <section className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 py-7 text-white shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-wide text-blue-100 uppercase">
              Adaptive Quiz · GMAT-style
            </p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Đánh giá năng lực bằng quiz tự điều chỉnh độ khó
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-50">
              Trả lời đúng &rarr; câu khó hơn. Sai &rarr; câu dễ hơn. Hệ thống ước lượng năng lực
              theo thuật toán Elo và xếp band sau khi hoàn tất.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center sm:gap-6">
            <div>
              <p className="text-xs text-blue-100 uppercase">Phiên</p>
              <p className="text-2xl font-semibold">{stats?.total ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-blue-100 uppercase">Hoàn tất</p>
              <p className="text-2xl font-semibold">{stats?.completed ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-blue-100 uppercase">Best ability</p>
              <p className="text-2xl font-semibold">
                {stats?.best ? stats.best.abilityScore.toFixed(2) : '—'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Ngân hàng câu hỏi đủ điều kiện
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Cần ≥5 câu trắc nghiệm và phủ ≥2 mức độ khó.
            </p>
          </div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Tìm theo tên / nhóm…"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none sm:w-64 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Tìm ngân hàng"
          />
        </div>

        {loadingBanks ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : banksErr ? (
          <EmptyState
            icon={<Brain className="size-10" />}
            title="Không tải được ngân hàng"
            description={(banksErr as Error).message}
          />
        ) : filteredBanks.length === 0 ? (
          <EmptyState
            icon={<Brain className="size-10" />}
            title="Chưa có ngân hàng phù hợp"
            description="Trainer cần tạo bank với ≥5 câu trắc nghiệm và ≥2 mức độ khó để bật adaptive quiz."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBanks.map((b) => (
              <BankCard
                key={b.id}
                bank={b}
                onStart={handleStart}
                isStarting={startMutation.isPending}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Lịch sử phiên gần đây
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            <TrendingUp className="mr-1 inline size-3" /> 50 phiên gần nhất
          </span>
        </div>
        {loadingSessions ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.map((s) => (
              <SessionRow key={s.id} session={s} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Sparkles className="size-10" />}
            title="Chưa có phiên nào"
            description="Bắt đầu một phiên adaptive quiz từ ngân hàng phía trên để xem lịch sử."
            variant="compact"
          />
        )}
      </section>
    </div>
  );
}
