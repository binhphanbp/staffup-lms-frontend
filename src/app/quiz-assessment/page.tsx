'use client';

import React, { useState, useEffect } from 'react';
import { QuizLeftSidebar } from '@/components/quiz/QuizLeftSidebar';
import { QuizHeader } from '@/components/quiz/QuizHeader';
import { QuestionContent } from '@/components/quiz/QuestionContent';
import { QuestionPalette } from '@/components/quiz/QuestionPalette';
import { SubmitModal, AntiCheatModal } from '@/components/quiz/QuizModals';

export default function QuizAssessmentPage() {
  // Đưa hàm nộp bài lên trên cùng để tránh lỗi ESLint (Cannot access variable before it is declared)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinishExam = () => {
    setIsSubmitting(true);
    // Giả lập xử lý nộp bài mất 1.5s rồi chuyển hướng về trang chủ
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  // 1. Logic Timer
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Đưa vào setTimeout để tránh lỗi gọi State đồng bộ trong Effect
      setTimeout(() => handleFinishExam(), 0);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 2. Logic Trạng thái Câu hỏi
  const [activeQuestion, setActiveQuestion] = useState(12);
  const [answeredQs, setAnsweredQs] = useState<number[]>([1, 2, 3, 4, 5, 6, 8, 10, 11]);
  const [reviewQs, setReviewQs] = useState<number[]>([4, 9]);

  const handleSelectOption = () => {
    if (!answeredQs.includes(activeQuestion)) {
      setAnsweredQs([...answeredQs, activeQuestion]);
    }
  };

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
  }, []);

  return (
    <div className="quiz-mode flex h-screen overflow-hidden bg-[#f0f2f5] text-slate-800">
      {/* Sidebar Trái */}
      <QuizLeftSidebar />

      <main className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <QuizHeader onShowSubmit={() => setShowSubmitModal(true)} />

        <div className="flex flex-1 overflow-hidden">
          {/* Cột Nội dung câu hỏi */}
          <QuestionContent
            activeQuestion={activeQuestion}
            setActiveQuestion={setActiveQuestion}
            answeredQs={answeredQs}
            onSelectOption={handleSelectOption}
            reviewQs={reviewQs}
            onToggleReview={handleToggleReview}
          />

          {/* Bảng điều khiển câu hỏi & Thời gian bên phải */}
          <QuestionPalette
            timeLeft={timeLeft}
            activeQuestion={activeQuestion}
            setActiveQuestion={setActiveQuestion}
            answeredQs={answeredQs}
            reviewQs={reviewQs}
            onShowSubmit={() => setShowSubmitModal(true)}
          />
        </div>
      </main>

      {/* Các Popup (Modals) */}
      <SubmitModal
        show={showSubmitModal}
        onHide={() => setShowSubmitModal(false)}
        onSubmit={handleFinishExam}
        isSubmitting={isSubmitting}
        answeredCount={answeredQs.length}
        reviewCount={reviewQs.length}
      />

      <AntiCheatModal
        show={showCheatModal}
        onAcknowledge={() => setShowCheatModal(false)}
        cheatCount={cheatWarnings}
      />
    </div>
  );
}
