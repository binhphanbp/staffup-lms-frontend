'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, Mic, Sparkles, Trophy, TrendingUp } from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from '@/lib/toast';
import {
  useMyRoleplaySessions,
  useRoleplayScenarios,
  useStartRoleplaySession,
} from '@/hooks/useRoleplay';
import type {
  RoleplayCategory,
  RoleplayDifficulty,
  RoleplayScenarioListItem,
  RoleplaySessionSummary,
} from '@/types/roleplay';

const breadcrumbs = [{ label: 'Trang chủ', href: '/' }, { label: 'Voice Roleplay' }];

const CATEGORY_LABELS: Record<RoleplayCategory, string> = {
  communication: 'Giao tiếp',
  sales: 'Bán hàng',
  leadership: 'Lãnh đạo',
  conflict: 'Xử lý xung đột',
  interview: 'Phỏng vấn',
  support: 'Chăm sóc khách hàng',
};

const CATEGORY_STYLES: Record<RoleplayCategory, string> = {
  communication: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  sales: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  leadership: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  conflict: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  interview: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  support: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
};

const DIFFICULTY_LABELS: Record<RoleplayDifficulty, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

const DIFFICULTY_STYLES: Record<RoleplayDifficulty, string> = {
  easy: 'text-emerald-600 dark:text-emerald-400',
  medium: 'text-amber-600 dark:text-amber-400',
  hard: 'text-rose-600 dark:text-rose-400',
};

const FILTERS: Array<{ value: 'all' | RoleplayCategory; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'communication', label: 'Giao tiếp' },
  { value: 'leadership', label: 'Lãnh đạo' },
  { value: 'support', label: 'CSKH' },
  { value: 'interview', label: 'Phỏng vấn' },
  { value: 'sales', label: 'Bán hàng' },
];

function ScenarioCard({
  scenario,
  onStart,
  isStarting,
}: {
  scenario: RoleplayScenarioListItem;
  onStart: (id: string) => void;
  isStarting: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
              CATEGORY_STYLES[scenario.category] ?? CATEGORY_STYLES.communication
            }`}
            aria-hidden
          >
            {scenario.personaName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
              {scenario.personaName}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {scenario.personaRole}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            CATEGORY_STYLES[scenario.category] ?? CATEGORY_STYLES.communication
          }`}
        >
          {CATEGORY_LABELS[scenario.category] ?? scenario.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-4 pb-5">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-800 dark:text-slate-100">
          {scenario.title}
        </h3>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
          {scenario.description}
        </p>

        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          {scenario.objectives.slice(0, 3).map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="bg-primary/10 text-primary dark:bg-primary/20 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                {idx + 1}
              </span>
              <span className="line-clamp-1">{obj}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />~{scenario.estimatedMinutes} phút
          </span>
          <span
            className={`flex items-center gap-1.5 font-medium ${DIFFICULTY_STYLES[scenario.difficulty]}`}
          >
            <Sparkles className="size-3.5" />
            {DIFFICULTY_LABELS[scenario.difficulty]}
          </span>
          {scenario.attemptCount > 0 && (
            <span className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5" />
              {scenario.attemptCount} lượt
            </span>
          )}
          {scenario.bestScore !== null && (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Trophy className="size-3.5" />
              Best {scenario.bestScore}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onStart(scenario.id)}
          disabled={isStarting}
          className="bg-primary hover:bg-primary/90 mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Mic className="size-4" />
          {isStarting ? 'Đang khởi tạo…' : 'Bắt đầu luyện tập'}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </article>
  );
}

function HistoryRow({ session }: { session: RoleplaySessionSummary }) {
  const date = new Date(session.startedAt);
  const formatted = date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const score = session.evaluation?.overallScore ?? null;
  const band = session.evaluation?.band ?? null;

  const bandStyle =
    band === 'excellent'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
      : band === 'good'
        ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
        : band === 'needs_improvement'
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
          : band === 'poor'
            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';

  const bandLabel =
    band === 'excellent'
      ? 'Xuất sắc'
      : band === 'good'
        ? 'Tốt'
        : band === 'needs_improvement'
          ? 'Cần cải thiện'
          : band === 'poor'
            ? 'Yếu'
            : 'Chưa đánh giá';

  const detailHref =
    session.status === 'completed'
      ? `/voice-roleplay/session/${session.id}/result`
      : `/voice-roleplay/session/${session.id}`;

  return (
    <Link
      href={detailHref}
      className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
          {session.scenario.title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {formatted} • {session.turnCount} lượt
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${bandStyle}`}>
          {bandLabel}
        </span>
        {score !== null && (
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{score}</span>
        )}
        <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default function VoiceRoleplayListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | RoleplayCategory>('all');

  const scenariosQuery = useRoleplayScenarios();
  const sessionsQuery = useMyRoleplaySessions();
  const startSession = useStartRoleplaySession();

  const filtered = useMemo(() => {
    const data = scenariosQuery.data ?? [];
    if (filter === 'all') return data;
    return data.filter((s) => s.category === filter);
  }, [scenariosQuery.data, filter]);

  const recentSessions = useMemo(() => {
    return (sessionsQuery.data ?? []).slice(0, 5);
  }, [sessionsQuery.data]);

  const handleStart = (scenarioId: string) => {
    startSession.mutate(scenarioId, {
      onSuccess: (data) => {
        router.push(`/voice-roleplay/session/${data.session.id}`);
      },
      onError: (err: unknown) => {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
              null)
            : null;
        toast.error(message ?? 'Không thể bắt đầu phiên roleplay. Vui lòng thử lại.');
      },
    });
  };

  return (
    <>
      <StudentHeader breadcrumbs={breadcrumbs} />
      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f0f2f5] px-4 py-6 md:px-8 md:py-8 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <header className="rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-md md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium tracking-wider uppercase">
                    Soft skills practice
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium tracking-wider uppercase">
                    AI-powered
                  </span>
                </div>
                <h1 className="mt-3 text-2xl font-semibold md:text-3xl">Voice Roleplay với AI</h1>
                <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
                  Luyện kỹ năng giao tiếp, lãnh đạo, xử lý xung đột với các tình huống mô phỏng thực
                  tế. AI sẽ đóng vai khách hàng, đồng nghiệp hoặc ứng viên — bạn chỉ cần bấm mic và
                  đối thoại.
                </p>
              </div>
              <div className="hidden md:flex md:items-center md:justify-center">
                <div className="flex size-24 items-center justify-center rounded-full bg-white/15 shadow-inner">
                  <Mic className="size-10" />
                </div>
              </div>
            </div>
          </header>

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Tình huống luyện tập
              </h2>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lọc theo lĩnh vực">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.value}
                    onClick={() => setFilter(f.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      filter === f.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {scenariosQuery.isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 w-full rounded-2xl" />
                ))}
              </div>
            ) : scenariosQuery.isError ? (
              <EmptyState
                title="Không tải được tình huống"
                description="Vui lòng thử lại sau hoặc liên hệ admin."
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Mic className="size-6" />}
                title="Chưa có tình huống nào"
                description={
                  filter === 'all'
                    ? 'Quản trị viên chưa thêm tình huống roleplay nào. Vui lòng quay lại sau.'
                    : 'Không có tình huống ở lĩnh vực này. Thử chọn lĩnh vực khác.'
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((s) => (
                  <ScenarioCard
                    key={s.id}
                    scenario={s}
                    onStart={handleStart}
                    isStarting={startSession.isPending && startSession.variables === s.id}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Lịch sử phiên gần đây
            </h2>
            {sessionsQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : recentSessions.length === 0 ? (
              <EmptyState
                variant="compact"
                title="Bạn chưa có phiên nào"
                description="Hãy bắt đầu một tình huống ở trên để xem lịch sử."
              />
            ) : (
              <div className="space-y-2">
                {recentSessions.map((s) => (
                  <HistoryRow key={s.id} session={s} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
