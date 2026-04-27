'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Lightbulb, RefreshCcw, Sparkles, Trophy } from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoleplaySession, useStartRoleplaySession } from '@/hooks/useRoleplay';
import type { RoleplayBand } from '@/types/roleplay';
import { toast } from '@/lib/toast';

const BAND_META: Record<RoleplayBand, { label: string; tone: string; gradient: string }> = {
  excellent: {
    label: 'Xuất sắc',
    tone: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
  },
  good: {
    label: 'Tốt',
    tone: 'text-sky-600 dark:text-sky-400',
    gradient: 'from-sky-500 to-blue-500',
  },
  needs_improvement: {
    label: 'Cần cải thiện',
    tone: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
  },
  poor: {
    label: 'Yếu',
    tone: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-500 to-pink-500',
  },
};

function ScoreGauge({ score, band }: { score: number; band: RoleplayBand }) {
  const meta = BAND_META[band];
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  return (
    <div className="relative flex size-44 items-center justify-center">
      <svg viewBox="0 0 200 200" className="size-44 -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          strokeWidth="14"
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`bg-gradient-to-br ${meta.gradient} stroke-current ${meta.tone}`}
          style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${meta.tone}`}>{score}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
        <span
          className={`mt-1 rounded-full bg-current/10 px-2 py-0.5 text-[11px] font-medium ${meta.tone}`}
        >
          {meta.label}
        </span>
      </div>
    </div>
  );
}

function CriterionBar({
  label,
  score,
  feedback,
}: {
  label: string;
  score: number;
  feedback: string;
}) {
  const tone =
    score >= 85
      ? 'bg-emerald-500'
      : score >= 70
        ? 'bg-sky-500'
        : score >= 50
          ? 'bg-amber-500'
          : 'bg-rose-500';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{score}/100</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all ${tone}`}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
      {feedback && (
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {feedback}
        </p>
      )}
    </div>
  );
}

export default function VoiceRoleplayResultPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const sessionId = params?.id ?? '';

  const sessionQuery = useRoleplaySession(sessionId);
  const startSession = useStartRoleplaySession();

  const session = sessionQuery.data;
  const evaluation = session?.evaluation ?? null;

  const breadcrumbs = useMemo(
    () => [
      { label: 'Trang chủ', href: '/' },
      { label: 'Voice Roleplay', href: '/voice-roleplay' },
      { label: 'Kết quả' },
    ],
    [],
  );

  const handleRetry = () => {
    if (!session) return;
    startSession.mutate(session.scenarioId, {
      onSuccess: (data) => {
        router.push(`/voice-roleplay/session/${data.session.id}`);
      },
      onError: () => {
        toast.error('Không khởi tạo được phiên mới. Vui lòng thử lại.');
      },
    });
  };

  if (sessionQuery.isLoading) {
    return (
      <>
        <StudentHeader breadcrumbs={breadcrumbs} />
        <div className="flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (sessionQuery.isError || !session) {
    return (
      <>
        <StudentHeader breadcrumbs={breadcrumbs} />
        <div className="flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/40 dark:bg-rose-950/30">
            <p className="text-sm text-rose-600 dark:text-rose-400">
              Không tải được kết quả. Phiên có thể đã bị xóa.
            </p>
            <button
              type="button"
              onClick={() => router.push('/voice-roleplay')}
              className="bg-primary mt-3 rounded-lg px-4 py-2 text-sm font-medium text-white"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!evaluation) {
    return (
      <>
        <StudentHeader breadcrumbs={breadcrumbs} />
        <div className="flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900/40 dark:bg-amber-950/30">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Phiên này chưa được đánh giá. Có thể bạn đã hủy giữa chừng.
            </p>
            <Link
              href={`/voice-roleplay/session/${sessionId}`}
              className="bg-primary mt-3 inline-block rounded-lg px-4 py-2 text-sm font-medium text-white"
            >
              Mở phiên
            </Link>
          </div>
        </div>
      </>
    );
  }

  const meta = BAND_META[evaluation.band];

  return (
    <>
      <StudentHeader breadcrumbs={breadcrumbs} />
      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f0f2f5] px-4 py-6 md:px-8 md:py-8 dark:bg-slate-950">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          {/* Hero */}
          <div
            className={`overflow-hidden rounded-2xl bg-gradient-to-br ${meta.gradient} p-6 text-white shadow-md md:p-8`}
          >
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium tracking-wider uppercase opacity-90">
                  Kết quả Voice Roleplay
                </p>
                <h1 className="mt-1 text-xl font-semibold md:text-2xl">{session.scenario.title}</h1>
                <p className="mt-2 text-sm opacity-95">
                  Đối tác AI: <strong>{session.scenario.personaName}</strong> —{' '}
                  {session.scenario.personaRole}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-95">
                  {evaluation.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={startSession.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/30 disabled:opacity-60"
                  >
                    <RefreshCcw className="size-4" />
                    {startSession.isPending ? 'Đang tạo phiên…' : 'Luyện lại tình huống này'}
                  </button>
                  <Link
                    href="/voice-roleplay"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                  >
                    <ArrowLeft className="size-4" />
                    Tình huống khác
                  </Link>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-2 rounded-2xl bg-white/15 p-5 backdrop-blur">
                <ScoreGauge score={evaluation.overallScore} band={evaluation.band} />
              </div>
            </div>
          </div>

          {/* Criterion breakdown */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
              <Sparkles className="size-4" />
              Đánh giá theo từng tiêu chí
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {evaluation.criterionScores.map((c) => (
                <CriterionBar key={c.key} label={c.label} score={c.score} feedback={c.feedback} />
              ))}
            </div>
          </section>

          {/* Strengths & improvements */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <Trophy className="size-4" />
                Điểm mạnh
              </h3>
              {evaluation.strengths.length === 0 ? (
                <p className="mt-2 text-sm text-emerald-700/80 dark:text-emerald-300/80">
                  Chưa có ghi nhận nổi bật. Hãy thử thêm vài lượt nữa nhé.
                </p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm text-emerald-900 dark:text-emerald-200">
                  {evaluation.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/30">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
                <Lightbulb className="size-4" />
                Cần cải thiện
              </h3>
              {evaluation.improvements.length === 0 ? (
                <p className="mt-2 text-sm text-amber-700/80 dark:text-amber-300/80">
                  Bạn đã làm tốt — chưa có gợi ý cải thiện nào.
                </p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm text-amber-900 dark:text-amber-200">
                  {evaluation.improvements.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Transcript review */}
          <section>
            <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">
              Xem lại hội thoại ({session.turnCount} lượt)
            </h2>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              {session.turns
                .filter((t) => t.role !== 'system')
                .map((t) => {
                  const isUser = t.role === 'user';
                  return (
                    <div
                      key={t.id}
                      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm shadow-sm ${
                          isUser
                            ? 'bg-primary/10 text-slate-800 dark:text-slate-100'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                        }`}
                      >
                        <p className="mb-0.5 text-[10px] font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                          {isUser ? 'Bạn' : session.scenario.personaName}
                        </p>
                        <p className="leading-relaxed whitespace-pre-wrap">{t.content}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
