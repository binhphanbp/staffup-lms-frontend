'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { useQuizAttemptDetail, useQuizHistory } from '@/hooks/useQuiz';
import type {
  AiGradingFeedback,
  QuizAttemptQuestionDetail,
  QuizAttemptDetailResponse,
} from '@/types';

// The API may include isCorrect on each option snapshot after grading,
// even though the current TS type omits it. We narrow at runtime.
type OptionSnapshot = NonNullable<QuizAttemptQuestionDetail['optionsSnapshot']>[number] & {
  isCorrect?: boolean;
};

function formatDuration(s: number): string {
  if (!s || s < 0) return '—';
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function computeScorePercent(attempt: QuizAttemptDetailResponse): number {
  const totalAwarded = attempt.questions.reduce(
    (sum, q) => sum + (q.response?.awardedPoints ?? 0),
    0,
  );
  const totalMax = attempt.questions.reduce((sum, q) => sum + q.maxPoints, 0);
  if (totalMax === 0) return 0;
  return Math.round((totalAwarded / totalMax) * 1000) / 10;
}

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');

  const { data: attempt, isLoading, isError } = useQuizAttemptDetail(attemptId);
  const enrollmentId = attempt?.enrollmentId ?? null;
  const quizId = attempt?.quizId ?? null;

  const { data: history } = useQuizHistory(
    enrollmentId && quizId ? { enrollmentId, quizId } : undefined,
  );

  const totalAwarded = useMemo(
    () => attempt?.questions.reduce((sum, q) => sum + (q.response?.awardedPoints ?? 0), 0) ?? 0,
    [attempt?.questions],
  );
  const totalMax = useMemo(
    () => attempt?.questions.reduce((sum, q) => sum + q.maxPoints, 0) ?? 0,
    [attempt?.questions],
  );
  const scorePercent = attempt ? computeScorePercent(attempt) : 0;
  const passScorePercent = attempt?.quiz?.passScorePercent ?? 70;
  const isPassed = attempt?.isPassed ?? scorePercent >= passScorePercent;

  const correctCount = useMemo(
    () => attempt?.questions.filter((q) => q.response?.isCorrect === true).length ?? 0,
    [attempt?.questions],
  );
  const incorrectCount = useMemo(
    () => attempt?.questions.filter((q) => q.response?.isCorrect === false).length ?? 0,
    [attempt?.questions],
  );
  const ungradedCount = useMemo(
    () =>
      attempt?.questions.filter((q) => q.response?.isCorrect === null || !q.response).length ?? 0,
    [attempt?.questions],
  );

  // Attempts left
  const finishedAttempts = useMemo(
    () => history?.filter((h) => h.status !== 'in_progress') ?? [],
    [history],
  );
  const maxAttempts = attempt?.quiz?.maxAttempts ?? null;
  const attemptsLeft =
    maxAttempts === null ? null : Math.max(maxAttempts - finishedAttempts.length, 0);

  if (!attemptId) {
    return (
      <>
        <StudentHeader breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Kết quả' }]} />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5] p-6">
          <div className="max-w-lg rounded-xl border border-amber-200 bg-white p-6 text-center shadow-sm">
            <i className="fa-solid fa-circle-exclamation mb-3 text-3xl text-amber-500"></i>
            <div className="mb-2 text-lg font-bold text-slate-800">Thiếu mã bài thi</div>
            <p className="mb-4 text-sm text-slate-500">
              URL không hợp lệ. Hãy quay lại trang khóa học.
            </p>
            <Link href="/courses" className="text-primary text-sm font-medium hover:underline">
              → Mở thư viện khóa học
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <StudentHeader breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Kết quả' }]} />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5]">
          <div className="text-sm text-slate-500">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải kết quả...
          </div>
        </div>
      </>
    );
  }

  if (isError || !attempt) {
    return (
      <>
        <StudentHeader breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Kết quả' }]} />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5] p-6">
          <div className="max-w-lg rounded-xl border border-rose-200 bg-white p-6 text-center shadow-sm">
            <i className="fa-solid fa-circle-xmark mb-3 text-3xl text-rose-500"></i>
            <div className="mb-2 text-lg font-bold text-slate-800">Không tải được kết quả</div>
            <p className="mb-4 text-sm text-slate-500">Có lỗi xảy ra hoặc bài thi không tồn tại.</p>
            <Link href="/courses" className="text-primary text-sm font-medium hover:underline">
              ← Quay lại khóa học
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: attempt.quiz.title, href: '#' },
          { label: 'Kết quả' },
        ]}
      />

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f0f2f5]">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8 lg:py-10">
          {/* ── Score Hero ──────────────────────────────────── */}
          <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-xl lg:p-8 ${
              isPassed ? 'from-emerald-500 to-green-700' : 'from-rose-500 to-red-700'
            }`}
          >
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-52 w-52 rounded-full bg-white/10"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-10 h-40 w-40 rounded-full bg-white/5"></div>

            <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[auto_1fr_auto]">
              {/* Result icon */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur lg:h-28 lg:w-28">
                <i
                  className={`fa-solid ${isPassed ? 'fa-trophy' : 'fa-face-sad-tear'} text-5xl text-white lg:text-6xl`}
                ></i>
              </div>

              {/* Center text */}
              <div>
                <div className="mb-1 text-[11px] font-bold tracking-widest uppercase opacity-90">
                  {attempt.quiz.title} · Lần làm thứ {attempt.attemptNo}
                </div>
                <h1 className="mb-2 text-3xl font-bold lg:text-4xl">
                  {isPassed ? '🎉 Chúc mừng! Bạn đã đạt!' : '💪 Cố gắng thêm chút nữa!'}
                </h1>
                <p className="text-sm text-white/90 lg:text-base">
                  {isPassed
                    ? `Bạn đã vượt qua ngưỡng đạt ${passScorePercent}%. Tiếp tục chinh phục các bài học tiếp theo!`
                    : `Cần ít nhất ${passScorePercent}% để đạt. Đừng nản — xem lại lời giải bên dưới và thử lại nhé.`}
                </p>
              </div>

              {/* Score circle */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white/15 p-5 backdrop-blur">
                <div className="text-5xl font-extrabold lg:text-6xl">
                  {scorePercent.toFixed(scorePercent % 1 === 0 ? 0 : 1)}
                  <span className="text-2xl font-bold lg:text-3xl">%</span>
                </div>
                <div className="mt-1 text-[11px] font-semibold tracking-wider uppercase opacity-90">
                  {totalAwarded.toFixed(1)} / {totalMax} điểm
                </div>
              </div>
            </div>
          </div>

          {/* ── Stat strip ──────────────────────────────────── */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <ResultStat
              icon="fa-circle-check"
              label="Câu đúng"
              value={correctCount}
              total={attempt.questions.length}
              accent="emerald"
            />
            <ResultStat
              icon="fa-circle-xmark"
              label="Câu sai"
              value={incorrectCount}
              total={attempt.questions.length}
              accent="rose"
            />
            <ResultStat
              icon="fa-pen-clip"
              label="Chưa chấm"
              value={ungradedCount}
              total={attempt.questions.length}
              accent="amber"
            />
            <ResultStat
              icon="fa-stopwatch"
              label="Thời gian"
              value={formatDuration(attempt.timeSpentSeconds)}
              accent="blue"
            />
          </div>

          {/* ── Pending grading notice ───────────────────────── */}
          {attempt.status === 'submitted' && !attempt.gradedAt && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <i className="fa-solid fa-pen-clip mt-0.5 text-lg text-amber-600"></i>
              <div className="text-sm text-amber-800">
                <div className="mb-0.5 font-bold">Đang chờ giáo viên chấm điểm</div>
                <div className="text-xs">
                  Một số câu (tự luận / điền) cần được giáo viên chấm thủ công. Điểm tổng có thể
                  thay đổi sau khi chấm xong.
                </div>
              </div>
            </div>
          )}

          {/* ── CTAs ─────────────────────────────────────────── */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <i className="fa-solid fa-arrow-left"></i> Về thư viện khóa học
            </Link>

            <div className="flex flex-col gap-2 sm:flex-row">
              {attemptsLeft !== 0 && (
                <Link
                  href={`/courses`}
                  className="bg-primary hover:bg-primary-hover inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition-all active:scale-[0.98]"
                >
                  <i className="fa-solid fa-rotate"></i>{' '}
                  {attemptsLeft === null ? 'Làm lại bài' : `Làm lại (còn ${attemptsLeft} lượt)`}
                </Link>
              )}
            </div>
          </div>

          {/* ── Question Review ──────────────────────────────── */}
          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <i className="fa-solid fa-magnifying-glass-chart text-primary"></i> Chi tiết từng câu
              hỏi
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                {attempt.questions.length}
              </span>
            </h2>

            <div className="flex flex-col gap-4">
              {attempt.questions
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((q) => (
                  <QuestionReviewCard key={q.id} question={q} />
                ))}
            </div>
          </div>

          {/* ── Footer info ──────────────────────────────────── */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-500">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="font-bold tracking-wider text-slate-400 uppercase">Bắt đầu</div>
                <div className="mt-0.5">{formatDateTime(attempt.startedAt)}</div>
              </div>
              <div>
                <div className="font-bold tracking-wider text-slate-400 uppercase">Nộp bài</div>
                <div className="mt-0.5">{formatDateTime(attempt.submittedAt)}</div>
              </div>
              <div>
                <div className="font-bold tracking-wider text-slate-400 uppercase">Chấm xong</div>
                <div className="mt-0.5">{formatDateTime(attempt.gradedAt)}</div>
              </div>
              <div>
                <div className="font-bold tracking-wider text-slate-400 uppercase">Trạng thái</div>
                <div className="mt-0.5 capitalize">{attempt.status.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// Per-question review card
// ════════════════════════════════════════════════════════════════
function QuestionReviewCard({ question }: { question: QuizAttemptQuestionDetail }) {
  const r = question.response;
  const isCorrect = r?.isCorrect;
  const awardedPoints = r?.awardedPoints ?? 0;

  // Determine card border color
  const borderCls =
    isCorrect === true
      ? 'border-emerald-200'
      : isCorrect === false
        ? 'border-rose-200'
        : 'border-amber-200';
  const headerBg =
    isCorrect === true ? 'bg-emerald-50' : isCorrect === false ? 'bg-rose-50' : 'bg-amber-50';
  const badgeCls =
    isCorrect === true
      ? 'bg-emerald-500 text-white'
      : isCorrect === false
        ? 'bg-rose-500 text-white'
        : 'bg-amber-500 text-white';
  const badgeIcon =
    isCorrect === true ? 'fa-check' : isCorrect === false ? 'fa-xmark' : 'fa-pen-clip';
  const badgeLabel = isCorrect === true ? 'Đúng' : isCorrect === false ? 'Sai' : 'Chờ chấm';

  const isChoice =
    question.questionSnapshot.questionType === 'single_choice' ||
    question.questionSnapshot.questionType === 'multiple_choice' ||
    question.questionSnapshot.questionType === 'true_false';
  const isText =
    question.questionSnapshot.questionType === 'essay' ||
    question.questionSnapshot.questionType === 'short_answer';

  const selectedSet = new Set(r?.selectedOptionIds ?? []);

  return (
    <div className={`overflow-hidden rounded-xl border bg-white shadow-sm ${borderCls}`}>
      {/* Header */}
      <div className={`flex items-center justify-between gap-3 px-5 py-3 ${headerBg}`}>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${badgeCls}`}
          >
            <i className={`fa-solid ${badgeIcon}`}></i>
          </span>
          <div>
            <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Câu {question.displayOrder}
              <span className="mx-1.5 text-slate-300">·</span>
              {questionTypeLabel(question.questionSnapshot.questionType)}
            </div>
            <div className="text-xs font-semibold text-slate-700">
              {badgeLabel} · {awardedPoints.toFixed(1)} / {question.maxPoints} điểm
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {(question.questionSnapshot.questionType === 'essay' ||
            question.questionSnapshot.questionType === 'short_answer') &&
            r?.aiGradedAt && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                <i className="fa-solid fa-wand-magic-sparkles"></i> AI chấm
              </span>
            )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Question text */}
        <div
          className="mb-4 text-[15px] leading-relaxed font-medium text-slate-800"
          dangerouslySetInnerHTML={{ __html: question.questionSnapshot.questionText }}
        />

        {/* Options (choice questions) */}
        {isChoice && question.optionsSnapshot && (
          <div className="space-y-2">
            {question.optionsSnapshot
              .slice()
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((opt) => {
                const o = opt as OptionSnapshot;
                const isSelected = selectedSet.has(o.optionId);
                const isOptionCorrect = o.isCorrect === true;
                const isWrongChoice = isSelected && o.isCorrect === false;
                const isCorrectMissed = !isSelected && isOptionCorrect;

                let cls = 'border-slate-200 bg-white text-slate-700';
                let icon = '';
                if (isSelected && isOptionCorrect) {
                  cls = 'border-emerald-300 bg-emerald-50 text-emerald-900';
                  icon = 'fa-check text-emerald-600';
                } else if (isWrongChoice) {
                  cls = 'border-rose-300 bg-rose-50 text-rose-900';
                  icon = 'fa-xmark text-rose-600';
                } else if (isCorrectMissed) {
                  cls = 'border-emerald-200 bg-emerald-50/50 text-emerald-800';
                  icon = 'fa-circle-check text-emerald-500';
                } else if (isSelected) {
                  // Selected but isCorrect unknown (option.isCorrect not provided by API)
                  cls = 'border-blue-200 bg-blue-50 text-blue-900';
                  icon = 'fa-circle-dot text-blue-500';
                }

                return (
                  <div
                    key={o.optionId}
                    className={`flex items-start gap-3 rounded-lg border-2 px-4 py-3 ${cls}`}
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                      {icon ? (
                        <i className={`fa-solid ${icon} text-sm`}></i>
                      ) : (
                        <span className="block h-3 w-3 rounded-full border-2 border-slate-300"></span>
                      )}
                    </div>
                    <div className="flex-1 text-sm font-medium">{o.optionText}</div>
                    {(isSelected || isCorrectMissed) && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isSelected
                            ? isOptionCorrect
                              ? 'bg-emerald-500 text-white'
                              : isWrongChoice
                                ? 'bg-rose-500 text-white'
                                : 'bg-blue-500 text-white'
                            : 'bg-emerald-200 text-emerald-800'
                        }`}
                      >
                        {isSelected ? 'Bạn chọn' : 'Đáp án đúng'}
                      </span>
                    )}
                  </div>
                );
              })}

            {(!r?.selectedOptionIds || r.selectedOptionIds.length === 0) && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
                <i className="fa-regular fa-circle-question mr-1"></i> Bạn chưa chọn đáp án
              </div>
            )}
          </div>
        )}

        {/* Text response */}
        {isText && (
          <div className="space-y-3">
            <div>
              <div className="mb-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Câu trả lời của bạn
              </div>
              {r?.responseText ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm whitespace-pre-wrap text-slate-700">
                  {r.responseText}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-sm text-slate-400">
                  <i className="fa-regular fa-circle-question mr-1"></i> Bạn chưa trả lời câu này
                </div>
              )}
            </div>

            {/* AI Feedback */}
            {r?.aiFeedback && <AiFeedbackPanel feedback={r.aiFeedback} />}
          </div>
        )}

        {/* Explanation */}
        {question.questionSnapshot.explanation && (
          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-blue-800">
              <i className="fa-solid fa-lightbulb"></i> Lời giải thích
            </div>
            <div className="text-sm leading-relaxed text-blue-900">
              {question.questionSnapshot.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// AI Feedback Panel
// ════════════════════════════════════════════════════════════════
function AiFeedbackPanel({ feedback }: { feedback: AiGradingFeedback }) {
  return (
    <div className="rounded-lg border-2 border-violet-200 bg-violet-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-violet-800">
          <i className="fa-solid fa-wand-magic-sparkles"></i> Đánh giá từ AI
        </div>
        <div className="text-xs font-bold text-violet-700">
          Gợi ý: {feedback.suggestedScore.toFixed(1)} / {feedback.maxScore} điểm
        </div>
      </div>

      {feedback.feedback && (
        <div className="mb-3 text-sm leading-relaxed text-slate-700">{feedback.feedback}</div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="rounded-md border border-emerald-200 bg-white p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <i className="fa-solid fa-thumbs-up"></i> Điểm mạnh
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <i className="fa-solid fa-check mt-0.5 text-[10px] text-emerald-500"></i>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.weaknesses && feedback.weaknesses.length > 0 && (
          <div className="rounded-md border border-amber-200 bg-white p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <i className="fa-solid fa-circle-exclamation"></i> Cần cải thiện
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {feedback.weaknesses.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <i className="fa-solid fa-arrow-up mt-0.5 text-[10px] text-amber-500"></i>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {feedback.rubricBreakdown && feedback.rubricBreakdown.length > 0 && (
        <div className="mt-3">
          <div className="mb-2 text-[11px] font-bold tracking-wider text-violet-700 uppercase">
            Chi tiết tiêu chí chấm
          </div>
          <div className="overflow-hidden rounded-md border border-violet-200">
            {feedback.rubricBreakdown.map((rb, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto] gap-3 border-b border-violet-100 bg-white px-3 py-2 text-xs last:border-0"
              >
                <div>
                  <div className="font-bold text-slate-700">{rb.criterion}</div>
                  {rb.comment && <div className="mt-0.5 text-slate-500">{rb.comment}</div>}
                </div>
                <div className="text-right">
                  <span className="font-bold text-violet-700">
                    {rb.score} / {rb.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Helper components
// ════════════════════════════════════════════════════════════════
type StatAccent = 'emerald' | 'rose' | 'amber' | 'blue';
const statAccentMap: Record<StatAccent, { iconBg: string; valueColor: string }> = {
  emerald: { iconBg: 'bg-emerald-100 text-emerald-600', valueColor: 'text-emerald-700' },
  rose: { iconBg: 'bg-rose-100 text-rose-600', valueColor: 'text-rose-700' },
  amber: { iconBg: 'bg-amber-100 text-amber-600', valueColor: 'text-amber-700' },
  blue: { iconBg: 'bg-blue-100 text-blue-600', valueColor: 'text-blue-700' },
};

function ResultStat({
  icon,
  label,
  value,
  total,
  accent,
}: {
  icon: string;
  label: string;
  value: number | string;
  total?: number;
  accent: StatAccent;
}) {
  const a = statAccentMap[accent];
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          {label}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.iconBg}`}>
          <i className={`fa-solid ${icon} text-sm`}></i>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${a.valueColor}`}>{value}</span>
        {typeof value === 'number' && total !== undefined && (
          <span className="text-xs font-medium text-slate-500">/ {total}</span>
        )}
      </div>
    </div>
  );
}

function questionTypeLabel(type: string): string {
  switch (type) {
    case 'single_choice':
      return 'Chọn 1 đáp án';
    case 'multiple_choice':
      return 'Chọn nhiều đáp án';
    case 'true_false':
      return 'Đúng / Sai';
    case 'short_answer':
      return 'Câu trả lời ngắn';
    case 'essay':
      return 'Tự luận';
    default:
      return type;
  }
}
