'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { QuestionContent } from '@/components/quiz/QuestionContent';
import { QuestionPalette } from '@/components/quiz/QuestionPalette';
import { SubmitModal, AntiCheatModal } from '@/components/quiz/QuizModals';
import {
  useQuizAttemptDetail,
  useStartQuiz,
  useSaveQuizResponse,
  useSubmitQuiz,
} from '@/hooks/useQuiz';
import type { QuizAttemptQuestionDetail } from '@/types';

export default function QuizAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptIdParam = searchParams.get('attemptId');
  const quizIdParam = searchParams.get('quizId');
  const enrollmentIdParam = searchParams.get('enrollmentId');
  const [startError, setStartError] = useState<string | null>(null);

  // If no attemptId, start a new quiz
  const startQuiz = useStartQuiz();
  const [attemptId, setAttemptId] = useState<string | null>(attemptIdParam);
  const startCalledRef = useRef(false);

  useEffect(() => {
    if (!attemptId && quizIdParam && enrollmentIdParam && !startCalledRef.current) {
      startCalledRef.current = true;
      setStartError(null);
      startQuiz.mutate(
        { quizId: quizIdParam, enrollmentId: enrollmentIdParam },
        {
          onSuccess: (data) => setAttemptId(data.attemptId),
          onError: (error: unknown) => {
            startCalledRef.current = false;
            const message =
              typeof error === 'object' &&
              error !== null &&
              'response' in error &&
              typeof (error as { response?: { data?: { message?: string } } }).response?.data
                ?.message === 'string'
                ? ((error as { response?: { data?: { message?: string } } }).response?.data
                    ?.message ?? null)
                : null;
            setStartError(message ?? 'Không thể khởi tạo bài test này.');
          },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, quizIdParam, enrollmentIdParam]);

  // Fetch attempt detail (contains questions)
  const { data: attempt, isLoading } = useQuizAttemptDetail(attemptId);

  const questions = useMemo(() => attempt?.questions ?? [], [attempt?.questions]);
  const totalQuestions = questions.length;
  const timeLimitSeconds = attempt?.timeLimitSeconds ?? null;
  const timeRemaining = attempt?.timeRemainingSeconds ?? timeLimitSeconds ?? 45 * 60;

  // Mutations
  const saveResponse = useSaveQuizResponse();
  const submitQuiz = useSubmitQuiz();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinishExam = useCallback(() => {
    if (!attemptId) return;
    setIsSubmitting(true);
    submitQuiz.mutate(attemptId, {
      onSuccess: () => {
        router.push(`/quiz-assessment/result?attemptId=${attemptId}`);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  }, [attemptId, router, submitQuiz]);

  // 1. Logic Timer
  const [timeLeft, setTimeLeft] = useState(timeRemaining);

  // Sync timer from API response
  useEffect(() => {
    if (attempt?.timeRemainingSeconds !== null && attempt?.timeRemainingSeconds !== undefined) {
      setTimeLeft(attempt.timeRemainingSeconds);
    } else if (timeLimitSeconds !== null && timeLimitSeconds !== undefined) {
      setTimeLeft(timeLimitSeconds);
    }
  }, [attempt?.timeRemainingSeconds, timeLimitSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeout(() => handleFinishExam(), 0);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleFinishExam]);

  // 2. Logic Trạng thái Câu hỏi (using 1-based display order)
  const [activeQuestion, setActiveQuestion] = useState(1);

  // Derive answered and review sets from API data
  const answeredQs = useMemo(
    () =>
      questions
        .filter((q) => q.response !== null && q.response !== undefined)
        .map((q) => q.displayOrder),
    [questions],
  );

  const [reviewQs, setReviewQs] = useState<number[]>([]);

  // Get the currently active question detail
  const activeQuestionData: QuizAttemptQuestionDetail | undefined = useMemo(
    () => questions.find((q) => q.displayOrder === activeQuestion),
    [questions, activeQuestion],
  );

  const handleSelectOption = useCallback(
    (optionIds: string[]) => {
      if (!activeQuestionData) return;
      saveResponse.mutate({
        attemptQuestionId: activeQuestionData.id,
        selectedOptionIds: optionIds,
      });
    },
    [activeQuestionData, saveResponse],
  );

  const handleAnswerText = useCallback(
    (value: string) => {
      if (!activeQuestionData) return;
      saveResponse.mutate({
        attemptQuestionId: activeQuestionData.id,
        responseText: value.trim(),
      });
    },
    [activeQuestionData, saveResponse],
  );

  const handleToggleReview = () => {
    if (reviewQs.includes(activeQuestion)) {
      setReviewQs(reviewQs.filter((q) => q !== activeQuestion));
    } else {
      setReviewQs([...reviewQs, activeQuestion]);
    }
  };

  // 3. Logic Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // 4. Logic Anti-Cheat
  const [cheatWarnings, setCheatWarnings] = useState(0);
  const [showCheatModal, setShowCheatModal] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatWarnings((prev) => {
          const newCount = prev + 1;
          if (newCount <= 3) {
            setShowCheatModal(true);
          } else {
            alert('Vi phạm quá 3 lần. Bài thi tự động bị hủy!');
            handleFinishExam();
          }
          return newCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [handleFinishExam]);

  if (isLoading || startQuiz.isPending) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài Test năng lực' }]}
        />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5]">
          <div className="text-sm text-slate-500">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải bài kiểm tra...
          </div>
        </div>
      </>
    );
  }

  if (!attemptId && (!quizIdParam || !enrollmentIdParam)) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài Test năng lực' }]}
        />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5] p-6">
          <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mb-3 text-lg font-bold text-slate-800">Chưa có bài test được chọn</div>
            <p className="mb-4 text-sm text-slate-500">
              Hãy mở bài học có quiz trong phòng học và bắt đầu bài test từ đó.
            </p>
            <Link href="/courses" className="text-primary text-sm font-medium hover:underline">
              → Mở thư viện khóa học
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (startError) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài Test năng lực' }]}
        />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5] p-6">
          <div className="max-w-lg rounded-xl border border-amber-200 bg-white p-6 text-center shadow-sm">
            <div className="mb-3 text-lg font-bold text-slate-800">Không thể mở bài test</div>
            <p className="mb-4 text-sm text-slate-600">{startError}</p>
            <Link href="/courses" className="text-primary text-sm font-medium hover:underline">
              → Quay lại khóa học
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
          { label: attempt?.quiz?.title ?? 'Bài Test năng lực' },
        ]}
      />

      <div className="flex flex-1 overflow-hidden bg-[#f0f2f5]">
        {/* Cột Nội dung câu hỏi */}
        <QuestionContent
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
          answeredQs={answeredQs}
          onSelectOption={handleSelectOption}
          onAnswerText={handleAnswerText}
          reviewQs={reviewQs}
          onToggleReview={handleToggleReview}
          questionData={activeQuestionData}
          totalQuestions={totalQuestions}
        />

        {/* Bảng điều khiển câu hỏi & Thời gian bên phải */}
        <QuestionPalette
          timeLeft={timeLeft}
          totalSeconds={timeLimitSeconds ?? 45 * 60}
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
          answeredQs={answeredQs}
          reviewQs={reviewQs}
          totalQuestions={totalQuestions}
          onShowSubmit={() => setShowSubmitModal(true)}
        />
      </div>

      {/* Các Popup (Modals) */}
      <SubmitModal
        show={showSubmitModal}
        onHide={() => setShowSubmitModal(false)}
        onSubmit={handleFinishExam}
        isSubmitting={isSubmitting}
        answeredCount={answeredQs.length}
        reviewCount={reviewQs.length}
        totalQuestions={totalQuestions}
      />

      <AntiCheatModal
        show={showCheatModal}
        onAcknowledge={() => setShowCheatModal(false)}
        cheatCount={cheatWarnings}
      />
    </>
  );
}
