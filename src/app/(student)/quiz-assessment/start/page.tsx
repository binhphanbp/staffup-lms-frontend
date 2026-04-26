'use client';

import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { useCourseDetail } from '@/hooks/useCourses';
import { useQuizHistory, useStartQuiz } from '@/hooks/useQuiz';
import type { QuizAttemptHistoryItem } from '@/types';

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

function statusMeta(item: QuizAttemptHistoryItem): { label: string; cls: string; icon: string } {
  if (item.status === 'in_progress') {
    return {
      label: 'Đang làm',
      cls: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: 'fa-clock',
    };
  }
  if (item.status === 'expired') {
    return {
      label: 'Hết giờ',
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'fa-hourglass-end',
    };
  }
  if (item.status === 'abandoned') {
    return {
      label: 'Đã hủy',
      cls: 'bg-slate-50 text-slate-500 border-slate-200',
      icon: 'fa-ban',
    };
  }
  if (item.isPassed === true) {
    return {
      label: 'Đạt',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'fa-circle-check',
    };
  }
  if (item.isPassed === false) {
    return {
      label: 'Chưa đạt',
      cls: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: 'fa-circle-xmark',
    };
  }
  return {
    label: 'Đã nộp',
    cls: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: 'fa-paper-plane',
  };
}

export default function QuizStartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const lessonId = searchParams.get('lessonId');
  const quizId = searchParams.get('quizId');
  const enrollmentId = searchParams.get('enrollmentId');

  const { data: course, isLoading: courseLoading } = useCourseDetail(courseId);
  const { data: history, isLoading: historyLoading } = useQuizHistory(
    quizId && enrollmentId ? { quizId, enrollmentId } : undefined,
  );
  const startQuiz = useStartQuiz();

  // Find quiz from lesson
  const quizInfo = useMemo(() => {
    const matches = (course?.modules ?? []).flatMap((mod) =>
      mod.lessons
        .filter((lesson) => lesson.id === lessonId && lesson.quiz?.id === quizId)
        .map((lesson) => ({
          quiz: lesson.quiz!,
          moduleTitle: mod.title,
          lessonTitle: lesson.title,
        })),
    );
    return matches[0] ?? null;
  }, [course, lessonId, quizId]);

  const inProgress = useMemo(
    () => history?.find((h) => h.status === 'in_progress') ?? null,
    [history],
  );
  const finishedAttempts = useMemo(
    () => history?.filter((h) => h.status !== 'in_progress') ?? [],
    [history],
  );

  const passScorePercent = quizInfo?.quiz.passScorePercent ?? 70;
  const bestAttempt = useMemo(() => {
    if (!finishedAttempts.length) return null;
    const scored = finishedAttempts
      .filter((a) => a.totalScore !== null)
      .sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
    return scored[0] ?? null;
  }, [finishedAttempts]);

  const maxAttempts = quizInfo?.quiz.maxAttempts ?? null;
  const usedAttempts = finishedAttempts.length + (inProgress ? 1 : 0);
  const attemptsLeft = maxAttempts === null ? null : Math.max(maxAttempts - usedAttempts, 0);
  const canStartNew = attemptsLeft === null || attemptsLeft > 0;

  const handleStart = () => {
    if (!quizId || !enrollmentId) return;
    startQuiz.mutate(
      { quizId, enrollmentId },
      {
        onSuccess: (data) => {
          router.push(`/quiz-assessment?attemptId=${data.attemptId}`);
        },
      },
    );
  };

  const handleResume = () => {
    if (!inProgress) return;
    router.push(`/quiz-assessment?attemptId=${inProgress.id}`);
  };

  // ── Missing params guard
  if (!quizId || !enrollmentId || !courseId || !lessonId) {
    return (
      <>
        <StudentHeader breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài test' }]} />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5] p-6">
          <div className="max-w-lg rounded-xl border border-amber-200 bg-white p-6 text-center shadow-sm">
            <i className="fa-solid fa-circle-exclamation mb-3 text-3xl text-amber-500"></i>
            <div className="mb-2 text-lg font-bold text-slate-800">Thiếu thông tin bài test</div>
            <p className="mb-4 text-sm text-slate-500">
              Hãy mở bài học có quiz và bấm &quot;Bắt đầu bài test&quot; từ đó.
            </p>
            <Link href="/courses" className="text-primary text-sm font-medium hover:underline">
              → Mở thư viện khóa học
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ── Loading
  if (courseLoading || (historyLoading && !history)) {
    return (
      <>
        <StudentHeader breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài test' }]} />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5]">
          <div className="text-sm text-slate-500">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang chuẩn bị bài test...
          </div>
        </div>
      </>
    );
  }

  if (!quizInfo) {
    return (
      <>
        <StudentHeader breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài test' }]} />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5] p-6">
          <div className="max-w-lg rounded-xl border border-rose-200 bg-white p-6 text-center shadow-sm">
            <i className="fa-solid fa-circle-xmark mb-3 text-3xl text-rose-500"></i>
            <div className="mb-2 text-lg font-bold text-slate-800">Không tìm thấy bài test</div>
            <p className="mb-4 text-sm text-slate-500">
              Có thể bài test đã bị xóa hoặc bạn không có quyền truy cập.
            </p>
            <Link
              href={`/courses/detail?id=${courseId}`}
              className="text-primary text-sm font-medium hover:underline"
            >
              ← Quay lại khóa học
            </Link>
          </div>
        </div>
      </>
    );
  }

  const quiz = quizInfo.quiz;

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: course?.title ?? 'Khóa học', href: `/courses/detail?id=${courseId}` },
          { label: quiz.title },
        ]}
      />

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f0f2f5]">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8 lg:py-10">
          {/* ── Hero card ─────────────────────────────────────── */}
          <div className="from-primary relative overflow-hidden rounded-2xl bg-gradient-to-br to-blue-700 p-6 text-white shadow-lg lg:p-8">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-44 w-44 rounded-full bg-white/10"></div>
            <div className="absolute bottom-0 left-0 -mb-16 h-32 w-32 rounded-full bg-white/5"></div>
            <div className="relative z-10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur">
                <i className="fa-solid fa-flask-vial"></i> {quizInfo.moduleTitle}
              </div>
              <h1 className="mb-2 text-2xl leading-tight font-bold lg:text-3xl">{quiz.title}</h1>
              {quiz.description && (
                <p className="mb-4 max-w-3xl text-sm text-blue-50/90 lg:text-base">
                  {quiz.description}
                </p>
              )}
              <div className="text-xs text-blue-100/80">
                <i className="fa-solid fa-book-open mr-1"></i> Bài học liên quan:{' '}
                <span className="font-semibold text-white">{quizInfo.lessonTitle}</span>
              </div>
            </div>
          </div>

          {/* ── Info grid ─────────────────────────────────────── */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <InfoCard
              icon="fa-list-ol"
              label="Số câu hỏi"
              value={`${quiz.totalQuestions}`}
              suffix="câu"
              accent="blue"
            />
            <InfoCard
              icon="fa-stopwatch"
              label="Thời gian"
              value={quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes}` : '—'}
              suffix={quiz.timeLimitMinutes ? 'phút' : 'không giới hạn'}
              accent="amber"
            />
            <InfoCard
              icon="fa-bullseye"
              label="Điểm đạt"
              value={`${passScorePercent}`}
              suffix="%"
              accent="violet"
            />
            <InfoCard
              icon="fa-rotate"
              label="Lượt làm còn lại"
              value={attemptsLeft === null ? '∞' : `${attemptsLeft}`}
              suffix={maxAttempts ? `/ ${maxAttempts}` : 'không giới hạn'}
              accent="emerald"
            />
          </div>

          {/* ── Best score (if any past attempts) ─────────────── */}
          {bestAttempt && (
            <div className="mt-6 flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 lg:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                <i className="fa-solid fa-trophy text-lg"></i>
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase">
                  Điểm cao nhất của bạn
                </div>
                <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-900">
                    {bestAttempt.totalScore?.toFixed(1) ?? '—'}
                  </span>
                  <span className="text-sm text-emerald-700">
                    Lần {bestAttempt.attemptNo} ·{' '}
                    {bestAttempt.isPassed ? (
                      <span className="font-semibold">Đã đạt</span>
                    ) : (
                      <span>Chưa đạt</span>
                    )}
                  </span>
                </div>
              </div>
              <Link
                href={`/quiz-assessment/result?attemptId=${bestAttempt.id}`}
                className="hidden rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 sm:inline-flex"
              >
                Xem chi tiết
              </Link>
            </div>
          )}

          {/* ── Rules / instructions ──────────────────────────── */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
              <i className="fa-solid fa-circle-info text-primary"></i> Lưu ý quan trọng
            </h2>
            <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <RuleItem
                icon="fa-clock"
                text="Thời gian sẽ chạy ngay khi bạn bắt đầu, không thể tạm dừng."
              />
              <RuleItem icon="fa-floppy-disk" text="Câu trả lời sẽ tự động lưu khi bạn chọn." />
              <RuleItem
                icon="fa-eye-slash"
                text="Hệ thống cảnh báo khi bạn rời cửa sổ; quá 3 lần sẽ tự nộp bài."
              />
              <RuleItem
                icon="fa-arrows-rotate"
                text="Bạn có thể quay lại sửa câu trả lời cho đến khi nộp bài."
              />
              <RuleItem
                icon="fa-list-check"
                text="Theo dõi tiến độ qua bảng điều khiển bên phải."
              />
              <RuleItem
                icon="fa-check"
                text="Sau khi nộp, bạn sẽ thấy đáp án đúng và lời giải thích."
              />
            </ul>
          </div>

          {/* ── Action: Start / Resume ────────────────────────── */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/courses/detail/learning-room?courseId=${courseId}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <i className="fa-solid fa-arrow-left"></i> Quay lại bài học
            </Link>

            <div className="flex flex-col gap-2 sm:flex-row">
              {inProgress && (
                <button
                  onClick={handleResume}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-amber-500 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 shadow-sm transition-all hover:bg-amber-100"
                >
                  <i className="fa-solid fa-play"></i> Tiếp tục bài đang làm dở
                </button>
              )}
              <button
                onClick={handleStart}
                disabled={!canStartNew || startQuiz.isPending}
                className="bg-primary hover:bg-primary-hover inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {startQuiz.isPending ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Đang tạo bài test...
                  </>
                ) : !canStartNew ? (
                  <>
                    <i className="fa-solid fa-ban"></i> Đã hết lượt làm bài
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-rocket"></i>{' '}
                    {finishedAttempts.length > 0 ? 'Làm lại bài' : 'Bắt đầu làm bài'}
                  </>
                )}
              </button>
            </div>
          </div>

          {startQuiz.isError && (
            <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <i className="fa-solid fa-circle-xmark mr-1"></i> Không thể tạo bài test. Vui lòng thử
              lại sau.
            </div>
          )}

          {/* ── History ───────────────────────────────────────── */}
          {finishedAttempts.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
                <i className="fa-solid fa-clock-rotate-left text-slate-400"></i> Lịch sử làm bài
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                  {finishedAttempts.length}
                </span>
              </h2>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="hidden grid-cols-12 gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase sm:grid">
                  <div className="col-span-1">Lần</div>
                  <div className="col-span-3">Trạng thái</div>
                  <div className="col-span-2">Điểm</div>
                  <div className="col-span-3">Thời gian làm</div>
                  <div className="col-span-2">Nộp lúc</div>
                  <div className="col-span-1 text-right">Hành động</div>
                </div>
                {finishedAttempts.map((item) => {
                  const meta = statusMeta(item);
                  const passScore = item.quiz.passScorePercent ?? passScorePercent;
                  const score = item.totalScore;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-2 gap-2 border-b border-slate-100 px-4 py-3 text-sm last:border-0 hover:bg-slate-50 sm:grid-cols-12 sm:items-center"
                    >
                      <div className="col-span-1 sm:col-span-1">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {item.attemptNo}
                        </span>
                      </div>
                      <div className="col-span-1 sm:col-span-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.cls}`}
                        >
                          <i className={`fa-solid ${meta.icon} text-[10px]`}></i> {meta.label}
                        </span>
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        {score !== null && score !== undefined ? (
                          <span
                            className={`font-bold ${item.isPassed ? 'text-emerald-600' : 'text-rose-600'}`}
                          >
                            {score.toFixed(1)}
                            <span className="ml-1 text-[10px] font-medium text-slate-400">
                              / pass {passScore}%
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Chưa chấm</span>
                        )}
                      </div>
                      <div className="col-span-2 text-xs text-slate-500 sm:col-span-3">
                        <i className="fa-regular fa-clock mr-1"></i>
                        {formatDuration(item.timeSpentSeconds)}
                      </div>
                      <div className="col-span-1 text-xs text-slate-500 sm:col-span-2">
                        {formatDateTime(item.submittedAt)}
                      </div>
                      <div className="col-span-1 text-right sm:col-span-1">
                        <Link
                          href={`/quiz-assessment/result?attemptId=${item.id}`}
                          className="text-primary text-xs font-semibold hover:underline"
                        >
                          Xem →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────
type Accent = 'blue' | 'amber' | 'violet' | 'emerald';
const accentMap: Record<Accent, { bg: string; iconBg: string; text: string }> = {
  blue: { bg: 'bg-blue-50/60', iconBg: 'bg-blue-100 text-blue-600', text: 'text-blue-700' },
  amber: { bg: 'bg-amber-50/60', iconBg: 'bg-amber-100 text-amber-600', text: 'text-amber-700' },
  violet: {
    bg: 'bg-violet-50/60',
    iconBg: 'bg-violet-100 text-violet-600',
    text: 'text-violet-700',
  },
  emerald: {
    bg: 'bg-emerald-50/60',
    iconBg: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-700',
  },
};

function InfoCard({
  icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  suffix?: string;
  accent: Accent;
}) {
  const a = accentMap[accent];
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${a.bg}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          {label}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.iconBg}`}>
          <i className={`fa-solid ${icon} text-sm`}></i>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        {suffix && <span className="text-xs font-medium text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}

function RuleItem({ icon, text }: { icon: string; text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <i className={`fa-solid ${icon} text-primary mt-0.5 text-xs`}></i>
      <span>{text}</span>
    </li>
  );
}
