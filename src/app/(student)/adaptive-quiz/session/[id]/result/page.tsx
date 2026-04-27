'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, TrendingUp, XCircle } from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdaptiveSession } from '@/hooks/useAdaptiveQuiz';
import type { AdaptiveAnsweredItem, AdaptiveSession } from '@/types/adaptive-quiz';

const BAND_COLORS: Record<string, string> = {
  Beginner: 'from-emerald-500 to-emerald-600',
  'Pre-Intermediate': 'from-lime-500 to-lime-600',
  Intermediate: 'from-amber-500 to-amber-600',
  Advanced: 'from-orange-500 to-orange-600',
  Expert: 'from-rose-500 to-rose-600',
};

const BAND_DESCRIPTION: Record<string, string> = {
  Beginner: 'Bạn đang ở mức nhập môn. Hãy ôn lại kiến thức nền tảng và luyện thêm các câu dễ.',
  'Pre-Intermediate': 'Đã nắm cơ bản. Hãy luyện thêm câu trung bình để củng cố.',
  Intermediate: 'Năng lực ổn định ở mức trung bình. Đẩy thêm các câu khó để vượt rào.',
  Advanced: 'Năng lực nâng cao. Cố gắng giữ độ chính xác ở mức câu khó để tiến lên Expert.',
  Expert: 'Bạn ở top của ngân hàng này. Hãy thử các bank khó hơn hoặc đa lĩnh vực.',
};

function ScoreGauge({ ability, band }: { ability: number; band: string }) {
  const pct = Math.min(100, Math.max(0, (ability / 5) * 100));
  const grad = BAND_COLORS[band] ?? 'from-blue-500 to-purple-600';
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative size-48">
      <svg viewBox="0 0 180 180" className="size-full -rotate-90">
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="currentColor"
          strokeWidth="14"
          fill="none"
          className="text-slate-200 dark:text-slate-800"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="url(#scoreGrad)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              className={grad.includes('emerald') ? 'text-emerald-400' : 'text-blue-400'}
              stopColor="currentColor"
            />
            <stop offset="100%" className="text-purple-500" stopColor="currentColor" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
          Năng lực
        </span>
        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {ability.toFixed(2)}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">/ 5.00</span>
      </div>
    </div>
  );
}

function TrajectoryChart({ items }: { items: AdaptiveAnsweredItem[] }) {
  if (items.length === 0) return null;
  const w = 480;
  const h = 160;
  const pad = 24;
  const xs = (i: number) =>
    items.length === 1 ? w / 2 : pad + (i / (items.length - 1)) * (w - pad * 2);
  const ys = (d: number) => h - pad - ((d - 1) / 4) * (h - pad * 2);
  const linePoints = items.map((it, i) => `${xs(i)},${ys(it.difficulty)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Quỹ đạo độ khó">
      {/* gridlines */}
      {[1, 2, 3, 4, 5].map((d) => (
        <g key={d}>
          <line
            x1={pad}
            x2={w - pad}
            y1={ys(d)}
            y2={ys(d)}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeDasharray="4 4"
          />
          <text x={4} y={ys(d) + 3} className="fill-slate-400 text-[10px] dark:fill-slate-500">
            {d}
          </text>
        </g>
      ))}
      <polyline
        points={linePoints}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-blue-500"
      />
      {items.map((it, i) => (
        <circle
          key={it.id}
          cx={xs(i)}
          cy={ys(it.difficulty)}
          r="5"
          className={it.isCorrect ? 'fill-emerald-500' : 'fill-rose-500'}
          stroke="white"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

function ItemRow({ item, index }: { item: AdaptiveAnsweredItem; index: number }) {
  const correctOpts = item.question.options.filter((o) => o.isCorrect);
  return (
    <details className="group rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 truncate">
          {item.isCorrect ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span className="font-medium text-slate-700 dark:text-slate-300">Câu {index + 1}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">độ {item.difficulty}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="truncate text-slate-700 dark:text-slate-300">
            {item.question.content}
          </span>
        </span>
        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
          {item.abilityBefore.toFixed(2)} → {item.abilityAfter.toFixed(2)}
        </span>
      </summary>
      <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
        {item.question.options.map((o) => (
          <div
            key={o.id}
            className={`flex items-start gap-2 rounded-lg px-2 py-1.5 ${
              o.isCorrect
                ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100'
                : item.selectedOptionIds.includes(o.id)
                  ? 'bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-100'
                  : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className="mt-0.5">
              {o.isCorrect ? (
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              ) : item.selectedOptionIds.includes(o.id) ? (
                <XCircle className="size-4 text-rose-600 dark:text-rose-400" />
              ) : (
                <span className="block size-4" />
              )}
            </span>
            <span>{o.content}</span>
          </div>
        ))}
        {item.question.explanation ? (
          <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
            <span className="font-semibold">Giải thích:</span> {item.question.explanation}
          </p>
        ) : null}
        {correctOpts.length === 0 ? (
          <p className="text-xs text-slate-400">Không có đáp án đúng được đánh dấu.</p>
        ) : null}
      </div>
    </details>
  );
}

function ResultBody({ session }: { session: AdaptiveSession }) {
  const accuracy =
    session.answeredCount > 0
      ? Math.round((session.correctCount / session.answeredCount) * 100)
      : 0;
  const items = session.answeredItems;
  const wasAbandoned = session.status === 'abandoned';

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-stretch">
          <div className="flex shrink-0 items-center justify-center">
            <ScoreGauge ability={session.abilityScore} band={session.band} />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {session.questionBankTitle}
              </p>
              <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                <Award className="size-6 text-amber-500" />
                Band: {session.band}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {BAND_DESCRIPTION[session.band] ?? 'Hoàn thành phiên adaptive quiz.'}
              </p>
              {wasAbandoned ? (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                  Phiên này đã bị hủy giữa chừng — năng lực hiển thị là ước lượng tới câu cuối cùng.
                </p>
              ) : null}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">Đúng</p>
                <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {session.correctCount}/{session.answeredCount}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">Tỉ lệ đúng</p>
                <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {accuracy}%
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">Số câu</p>
                <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {session.answeredCount}/{session.maxQuestions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {items.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              <TrendingUp className="mr-1 inline size-4" />
              Quỹ đạo độ khó
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chấm xanh = đúng · Chấm đỏ = sai
            </p>
          </div>
          <TrajectoryChart items={items} />
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Chi tiết từng câu
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Chưa có câu trả lời nào trong phiên này.
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((it, i) => (
              <ItemRow key={it.id} item={it} index={i} />
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/adaptive-quiz"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="size-4" />
          Về danh sách
        </Link>
        <Link
          href={`/adaptive-quiz`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Luyện thêm phiên mới
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export default function AdaptiveQuizResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = use(params);
  const { data, isLoading, error } = useAdaptiveSession(sessionId);
  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Quiz thích nghi', href: '/adaptive-quiz' },
    { label: `Kết quả #${sessionId}` },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
        <p className="font-semibold">Không tải được kết quả</p>
        <p className="text-sm">{(error as Error)?.message ?? 'Phiên không tồn tại.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <StudentHeader breadcrumbs={breadcrumbs} />
      <ResultBody session={data} />
    </div>
  );
}
