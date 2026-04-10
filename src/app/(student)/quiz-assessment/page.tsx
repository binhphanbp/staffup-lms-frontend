'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { QuestionContent } from '@/components/quiz/QuestionContent';
import { QuestionPalette } from '@/components/quiz/QuestionPalette';
import { SubmitModal, AntiCheatModal } from '@/components/quiz/QuizModals';
import { useQuizAttemptDetail, useStartQuiz, useSaveQuizResponse, useSubmitQuiz } from '@/hooks/useQuiz';
import type { QuizAttemptQuestionDetail } from '@/types';

export default function QuizAssessmentPage() {
  const searchParams = useSearchParams();
  const attemptIdParam = searchParams.get('attemptId');
  const quizIdParam = searchParams.get('quizId');
  const enrollmentIdParam = searchParams.get('enrollmentId');

  // If no attemptId, start a new quiz
  const startQuiz = useStartQuiz();
  const [attemptId, setAttemptId] = useState<string | null>(attemptIdParam);

  useEffect(() => {
    if (!attemptId && quizIdParam && enrollmentIdParam && !startQuiz.isPending) {
      startQuiz.mutate(
        { quizId: quizIdParam, enrollmentId: enrollmentIdParam },
        { onSuccess: (data) => setAttemptId(data.id) },
      );
    }
  }, [attemptId, quizIdParam, enrollmentIdParam]);

  // Fetch attempt detail (contains questions)
  const { data: attempt, isLoading } = useQuizAttemptDetail(attemptId);

  const questions = attempt?.questions ?? [];
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
        window.location.href = '/';
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  }, [attemptId, submitQuiz]);

  // 1. Logic Timer
  const [timeLeft, setTimeLeft] = useState(timeRemaining);

  // Sync timer from API response
  useEffect(() => {
    if (attempt?.timeRemainingSeconds != null) {
      setTimeLeft(attempt.timeRemainingSeconds);
    } else if (timeLimitSeconds != null) {
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
    () => questions
      .filter((q) => q.response != null)
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
      if (!attemptId || !activeQuestionData) return;
      saveResponse.mutate({
        attemptId,
        questionId: activeQuestionData.id,
        selectedOptionIds: optionIds,
      });
    },
    [attemptId, activeQuestionData, saveResponse],
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
        <StudentHeader breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài Test năng lực' }]} />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5]">
          <div className="text-sm text-slate-500">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải bài kiểm tra...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudentHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: attempt?.quiz?.title ?? 'Bài Test năng lực' }]}
      />

      <div className="flex flex-1 overflow-hidden bg-[#f0f2f5]">
        {/* Cột Nội dung câu hỏi */}
        <QuestionContent
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
          answeredQs={answeredQs}
          onSelectOption={handleSelectOption}
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
