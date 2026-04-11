'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { QuestionContent } from '@/components/quiz/QuestionContent';
import { QuestionPalette } from '@/components/quiz/QuestionPalette';
import { SubmitModal, AntiCheatModal } from '@/components/quiz/QuizModals';
import {
  useQuizAttemptDetail,
  useStartQuiz,
  useSaveQuizResponse,
  useSubmitQuiz,
  useQuizAttemptHistory,
} from '@/hooks/useQuiz';
import { useQueryClient } from '@tanstack/react-query';
import type { QuizAttemptQuestionDetail } from '@/types';
import { Loader2 } from 'lucide-react';

function QuizAssessmentContent() {
  const searchParams = useSearchParams();
  const attemptIdParam = searchParams.get('attemptId');
  const quizIdParam = searchParams.get('quizId');
  const enrollmentIdParam = searchParams.get('enrollmentId');

  // If no attemptId but have quizId and enrollmentId, check for existing attempt or start new
  const startQuiz = useStartQuiz();
  const queryClient = useQueryClient();
  const [attemptId, setAttemptId] = useState<string | null>(attemptIdParam);
  const startCalledRef = React.useRef(false);
  const failedAttemptIdsRef = React.useRef<Set<string>>(new Set());

  // Check for existing in-progress attempts
  const { data: attemptHistory, isLoading: historyLoading } = useQuizAttemptHistory(
    quizIdParam && enrollmentIdParam ? { quizId: quizIdParam, enrollmentId: enrollmentIdParam } : undefined
  );

  useEffect(() => {
    // Don't do anything if we already have an attemptId or if history is still loading
    if (attemptId || !quizIdParam || !enrollmentIdParam || historyLoading) {
      return;
    }

    // Check if there's an in-progress attempt that we haven't already failed to load
    const inProgressAttempt = attemptHistory?.find(
      (a) => a.status === 'in_progress' && !failedAttemptIdsRef.current.has(a.id)
    );

    if (inProgressAttempt) {
      // Resume existing attempt
      console.log('Resuming existing attempt:', inProgressAttempt.id);
      setAttemptId(inProgressAttempt.id);
      return;
    }

    // No valid in-progress attempt, start new one (only once)
    if (!startCalledRef.current) {
      startCalledRef.current = true;
      console.log('Starting quiz with:', { quizId: quizIdParam, enrollmentId: enrollmentIdParam });
      startQuiz.mutate(
        { quizId: quizIdParam, enrollmentId: enrollmentIdParam },
        {
          onSuccess: (data) => {
            console.log('Quiz started successfully:', data);
            setAttemptId(data.attemptId);
          },
          onError: (error: any) => {
            console.error('Failed to start quiz:', error);
            console.error('Error status:', error?.response?.status);
            console.error('Error data:', error?.response?.data);
            console.error('Error message:', error?.message);
            alert(`Lỗi khi bắt đầu bài kiểm tra: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
            startCalledRef.current = false;
          },
        },
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, quizIdParam, enrollmentIdParam, attemptHistory, historyLoading]);

  // Fetch attempt detail (contains questions)
  const { data: attempt, isLoading, error: attemptError } = useQuizAttemptDetail(attemptId);

  // If attempt not found (404), reset and allow creating new attempt
  React.useEffect(() => {
    if (attemptError && 'response' in attemptError && (attemptError as any).response?.status === 404) {
      console.log('Attempt not found (404), clearing and will start new attempt');
      
      // Mark this attempt ID as failed so we don't try it again
      if (attemptId) {
        failedAttemptIdsRef.current.add(attemptId);
      }
      
      // Clear the invalid attemptId and reset the start flag
      // This will trigger the useEffect above to start a fresh quiz
      setAttemptId(null);
      startCalledRef.current = false;
      
      // Also clear the history query to prevent re-selecting the invalid attempt
      // This forces a fresh fetch of attempt history
      queryClient.invalidateQueries({ queryKey: ['quiz-history'] });
    }
  }, [attemptError, attemptId, queryClient]);

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
    () => questions.filter((q) => q.response != null).map((q) => q.displayOrder),
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

  if (isLoading || startQuiz.isPending || historyLoading) {
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

export default function QuizAssessmentPage() {
  return (
    <Suspense fallback={
      <>
        <StudentHeader
          breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài Test năng lực' }]}
        />
        <div className="flex flex-1 items-center justify-center bg-[#f0f2f5]">
          <div className="text-sm text-slate-500">
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
            Đang tải bài kiểm tra...
          </div>
        </div>
      </>
    }>
      <QuizAssessmentContent />
    </Suspense>
  );
}
