'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/lib/toast';
import type { QuizAttemptQuestionDetail, AiGradingFeedback } from '@/types';
import {
  useQuizAttemptDetail,
  useAiGradeEssay,
  useManualGradeResponse,
  useFinalizeGrading,
} from '@/hooks/useQuiz';

interface GradingWorkspaceProps {
  attemptId: string | null;
  onClose: () => void;
  onGraded?: () => void;
}

export const GradingWorkspace = ({ attemptId, onClose, onGraded }: GradingWorkspaceProps) => {
  const { data: attemptDetail, isLoading, refetch } = useQuizAttemptDetail(attemptId);
  const aiGradeEssay = useAiGradeEssay();
  const manualGrade = useManualGradeResponse();
  const finalizeGrading = useFinalizeGrading();

  // Active question index (for essay questions only)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [draftScore, setDraftScore] = useState('');
  const [draftFeedback, setDraftFeedback] = useState('');
  const [confirmFinalizeOpen, setConfirmFinalizeOpen] = useState(false);
  const [pendingNavIndex, setPendingNavIndex] = useState<number | null>(null);

  // Get essay questions only
  const essayQuestions =
    attemptDetail?.questions.filter(
      (q) =>
        q.questionSnapshot.questionType === 'essay' ||
        q.questionSnapshot.questionType === 'short_answer',
    ) || [];

  const activeQuestion: QuizAttemptQuestionDetail | undefined = essayQuestions[activeQuestionIndex];

  // Reset state when attemptId changes — valid prop-sync pattern
  const prevAttemptIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (attemptId && attemptId !== prevAttemptIdRef.current) {
      prevAttemptIdRef.current = attemptId;

      setActiveQuestionIndex(0);

      setDraftScore('');

      setDraftFeedback('');
    }
  }, [attemptId]);

  // When active question changes, populate draft from existing data
  const prevQuestionIdRef = useRef<string | null>(null);
  const initialFeedbackRef = useRef<string>('');
  useEffect(() => {
    const currentId = activeQuestion?.id ?? null;
    if (currentId && currentId !== prevQuestionIdRef.current) {
      prevQuestionIdRef.current = currentId;
      const resp = activeQuestion?.response;
      if (resp?.awardedPoints !== null && resp?.awardedPoints !== undefined) {
        setDraftScore(resp.awardedPoints.toString());
      } else {
        setDraftScore('');
      }

      setDraftFeedback('');
      initialFeedbackRef.current = '';
    }
  }, [activeQuestion]);

  const hasUnsavedFeedback = draftFeedback.trim() !== initialFeedbackRef.current.trim();

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => toast[type](message),
    [],
  );

  // AI Grade single essay
  const handleAiGrade = async () => {
    if (!activeQuestion) return;
    try {
      await aiGradeEssay.mutateAsync(activeQuestion.id);
      await refetch();
      showToast('AI đã phân tích và đánh giá bài viết!');
    } catch {
      showToast('Lỗi khi gọi AI chấm bài. Vui lòng thử lại.', 'error');
    }
  };

  // Navigate with unsaved-change guard
  const requestNavigate = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex > essayQuestions.length - 1) return;
      if (hasUnsavedFeedback) {
        setPendingNavIndex(nextIndex);
      } else {
        setActiveQuestionIndex(nextIndex);
      }
    },
    [essayQuestions.length, hasUnsavedFeedback],
  );

  // Apply AI score/feedback to draft
  const handleApplyAI = () => {
    if (!activeQuestion?.response?.aiFeedback) return;
    const aiFeedback = activeQuestion.response.aiFeedback as AiGradingFeedback;
    const aiScore = activeQuestion.response.aiSuggestedScore;

    if (aiScore !== null && aiScore !== undefined) {
      setDraftScore(aiScore.toString());
    }

    // Build feedback string from AI data
    const parts: string[] = [];
    if (aiFeedback.feedback) parts.push(aiFeedback.feedback);
    if (aiFeedback.strengths?.length) {
      parts.push('\n\n📗 Điểm mạnh:\n' + aiFeedback.strengths.map((s) => `• ${s}`).join('\n'));
    }
    if (aiFeedback.weaknesses?.length) {
      parts.push('\n\n📕 Cần cải thiện:\n' + aiFeedback.weaknesses.map((w) => `• ${w}`).join('\n'));
    }
    setDraftFeedback(parts.join(''));
    showToast('Đã áp dụng điểm và nhận xét của AI!');
  };

  // Submit manual grade
  const handleSubmitGrade = async (options?: { advance?: boolean }) => {
    if (!draftScore) {
      showToast('Vui lòng nhập điểm số trước khi lưu.', 'error');
      return;
    }
    if (!activeQuestion?.response) return;

    const maxPoints = activeQuestion.maxPoints;
    const parsed = Number(draftScore);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > maxPoints) {
      showToast(`Điểm phải nằm trong khoảng 0 – ${maxPoints}.`, 'error');
      return;
    }

    try {
      await manualGrade.mutateAsync({
        responseId: activeQuestion.response.id,
        awardedPoints: parsed,
        feedback: draftFeedback || undefined,
      });
      initialFeedbackRef.current = draftFeedback;
      await refetch();
      showToast('Đã lưu điểm thành công!');
      if (options?.advance) {
        const nextIndex = activeQuestionIndex + 1;
        if (nextIndex <= essayQuestions.length - 1) {
          setActiveQuestionIndex(nextIndex);
        } else {
          showToast('Đây là câu cuối — đã lưu xong.', 'success');
        }
      }
    } catch {
      showToast('Lỗi khi lưu điểm. Vui lòng thử lại.', 'error');
    }
  };

  // Finalize all grading (confirmed via modal)
  const handleFinalize = async () => {
    if (!attemptId) return;
    setConfirmFinalizeOpen(false);
    try {
      await finalizeGrading.mutateAsync(attemptId);
      showToast('Đã hoàn tất chấm bài và gửi kết quả!');
      onGraded?.();
      setTimeout(() => onClose(), 1500);
    } catch {
      showToast('Lỗi khi hoàn tất. Vui lòng thử lại.', 'error');
    }
  };

  // Keyboard shortcuts: ←/→ navigate, Ctrl/Cmd+Enter save, Esc close
  useEffect(() => {
    if (!attemptId) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTextInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        void handleSubmitGrade();
        return;
      }
      if (isTextInput) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        requestNavigate(activeQuestionIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        requestNavigate(activeQuestionIndex + 1);
      } else if (e.key === 'Escape' && !confirmFinalizeOpen && pendingNavIndex === null) {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleSubmitGrade is stable per question
  }, [attemptId, activeQuestionIndex, requestNavigate, confirmFinalizeOpen, pendingNavIndex]);

  const aiFeedback = activeQuestion?.response?.aiFeedback as AiGradingFeedback | null;
  const hasAiResult = !!aiFeedback && activeQuestion?.response?.aiGradedAt;

  if (!attemptId) return null;

  return (
    <div
      className={`fixed inset-0 z-[2000] flex flex-col bg-[#F8F9FA] transition-opacity duration-200 ${attemptId ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      {/* === TOP BAR === */}
      <div className="z-10 flex h-[64px] flex-shrink-0 items-center justify-between border-b border-[#DADCE0] bg-white px-6 shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#F1F3F4]"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <div>
            <h2 className="m-0 text-[18px] leading-tight font-medium text-[#202124]">
              {isLoading ? 'Đang tải...' : attemptDetail?.quiz.title || 'Chấm bài'}
            </h2>
            <span className="text-[13px] text-[#5F6368]">
              {essayQuestions.length > 0
                ? `Câu ${activeQuestionIndex + 1} / ${essayQuestions.length} (tự luận)`
                : 'Không có câu tự luận'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-[#5F6368] md:inline">
            Phím tắt: ← → chuyển câu · Ctrl+Enter lưu · Esc đóng
          </span>
          <button
            onClick={() => requestNavigate(activeQuestionIndex - 1)}
            disabled={activeQuestionIndex === 0}
            className="flex items-center gap-2 rounded border-none bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] hover:bg-[#F1F3F4] disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span> Trước
          </button>
          <button
            onClick={() => requestNavigate(activeQuestionIndex + 1)}
            disabled={activeQuestionIndex >= essayQuestions.length - 1}
            className="flex items-center gap-2 rounded border-none bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] hover:bg-[#F1F3F4] disabled:opacity-40"
          >
            Sau <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-[40px] text-[#1A73E8]">
            progress_activity
          </span>
        </div>
      ) : !activeQuestion ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-[#5F6368]">
          <span className="material-symbols-outlined text-[48px]">quiz</span>
          <p className="text-[14px]">Không có câu tự luận nào cần chấm.</p>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Student Answer */}
          <div className="custom-scrollbar flex flex-[2] justify-center overflow-y-auto bg-[#E8EAED] p-6">
            <div className="min-h-full w-full max-w-[800px] space-y-6">
              {/* Question */}
              <div className="rounded-lg border border-[#DADCE0] bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-[12px] font-medium tracking-wide text-[#5F6368] uppercase">
                  <span className="material-symbols-outlined text-[18px]">help_outline</span>
                  Câu hỏi (tối đa {activeQuestion.maxPoints} điểm)
                </div>
                <div className="text-[15px] leading-[1.7] text-[#202124]">
                  {activeQuestion.questionSnapshot.questionText}
                </div>
              </div>

              {/* Student Response */}
              <div className="rounded-lg bg-white px-[40px] py-[32px] shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]">
                <div className="mb-4 flex items-center gap-2 text-[12px] font-medium tracking-wide text-[#1A73E8] uppercase">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  Bài làm của học viên
                </div>
                {activeQuestion.response?.responseText ? (
                  <div className="text-justify text-[14px] leading-[1.8] whitespace-pre-wrap text-[#202124]">
                    {activeQuestion.response.responseText}
                  </div>
                ) : (
                  <div className="py-8 text-center text-[14px] text-[#9AA0A6] italic">
                    Học viên chưa trả lời câu hỏi này.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Grading */}
          <div className="custom-scrollbar flex max-w-[500px] min-w-[400px] flex-1 flex-col overflow-y-auto border-l border-[#DADCE0] bg-white">
            {/* AI Section */}
            <div className="border-b border-[#DADCE0] bg-[#FAFAFA] p-6">
              <div className="mb-4 flex items-center gap-2 text-[13px] font-medium tracking-[0.5px] text-[#5F6368] uppercase">
                <span className="material-symbols-outlined text-[20px] text-[#9334E6]">
                  auto_awesome
                </span>
                Đánh giá từ Trợ lý AI
              </div>

              {hasAiResult ? (
                /* AI Result Available */
                <div className="rounded-lg border border-[#E8D3FD] bg-gradient-to-br from-[#F3E8FD] to-white p-4">
                  <div className="text-[12px] text-[#5F6368] uppercase">Điểm đề xuất</div>
                  <div className="my-2 text-[32px] font-normal text-[#9334E6]">
                    {activeQuestion.response?.aiSuggestedScore ?? '-'} / {activeQuestion.maxPoints}
                  </div>

                  {/* Feedback */}
                  {aiFeedback?.feedback && (
                    <div className="mb-3 rounded bg-white/70 p-3 text-[13px] leading-relaxed text-[#202124]">
                      <strong>Tóm tắt nhận xét:</strong> {aiFeedback.feedback}
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  {aiFeedback?.strengths?.length || aiFeedback?.weaknesses?.length ? (
                    <div className="mb-3 rounded bg-white/70 p-3 text-[13px] leading-relaxed">
                      {aiFeedback?.strengths?.length ? (
                        <ul className="mb-2 list-disc space-y-1 pl-5">
                          {aiFeedback.strengths.map((s, i) => (
                            <li key={i} className="text-[#34A853]">
                              {s}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {aiFeedback?.weaknesses?.length ? (
                        <ul className="list-disc space-y-1 pl-5">
                          {aiFeedback.weaknesses.map((w, i) => (
                            <li key={i} className="text-[#EA4335]">
                              {w}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Rubric Breakdown */}
                  {aiFeedback?.rubricBreakdown?.length ? (
                    <div className="mb-3">
                      <div className="mb-2 text-[12px] font-medium text-[#5F6368] uppercase">
                        Chi tiết theo tiêu chí
                      </div>
                      <div className="space-y-2">
                        {aiFeedback.rubricBreakdown.map((item, i) => (
                          <div key={i} className="rounded border border-[#E8EAED] bg-white p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] font-medium text-[#202124]">
                                {item.criterion}
                              </span>
                              <span className="rounded-full bg-[#F3E8FD] px-2 py-0.5 text-[12px] font-medium text-[#9334E6]">
                                {item.score}/{item.maxScore}
                              </span>
                            </div>
                            {item.comment && (
                              <p className="mt-1 text-[12px] text-[#5F6368]">{item.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex gap-2">
                    <button
                      onClick={handleApplyAI}
                      className="flex flex-1 items-center justify-center gap-2 rounded-[4px] border border-[#E8D3FD] bg-transparent py-2 font-medium text-[#9334E6] transition-all hover:bg-[#E8D3FD] hover:shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                    >
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      Áp dụng điểm & nhận xét
                    </button>
                    <button
                      onClick={handleAiGrade}
                      disabled={aiGradeEssay.isPending}
                      className="flex items-center justify-center gap-2 rounded-[4px] border border-[#E8D3FD] bg-white px-3 py-2 font-medium text-[#9334E6] transition-all hover:bg-[#F3E8FD] disabled:opacity-50"
                      title="Yêu cầu AI chấm lại"
                    >
                      {aiGradeEssay.isPending ? (
                        <span className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* No AI Result — Trigger Button */
                <div className="rounded-lg border border-dashed border-[#E8D3FD] bg-[#FDFBFE] p-6 text-center">
                  <span className="material-symbols-outlined mb-2 text-[36px] text-[#9334E6]/40">
                    auto_awesome
                  </span>
                  <p className="mb-4 text-[13px] text-[#5F6368]">
                    {activeQuestion.response?.responseText
                      ? 'Sử dụng AI để phân tích và đánh giá bài làm tự động.'
                      : 'Học viên chưa trả lời. Không thể chấm bằng AI.'}
                  </p>
                  <button
                    onClick={handleAiGrade}
                    disabled={aiGradeEssay.isPending || !activeQuestion.response?.responseText}
                    className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-gradient-to-r from-[#9334E6] to-[#7B2CBF] py-3 font-medium text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {aiGradeEssay.isPending ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        AI đang phân tích...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        Chấm bài bằng AI
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Manual Grading Section */}
            <div className="flex-1 p-6">
              <div className="mb-4 flex items-center gap-2 text-[13px] font-medium tracking-[0.5px] text-[#5F6368] uppercase">
                <span className="material-symbols-outlined text-[20px]">edit</span>
                Điểm số & Nhận xét chính thức
              </div>
              <div className="mb-6 flex items-center gap-4">
                <input
                  type="number"
                  className="w-[100px] rounded-lg border-2 border-[#DADCE0] p-3 text-center text-[20px] font-medium transition-colors outline-none focus:border-[#1A73E8]"
                  placeholder="--"
                  min={0}
                  max={activeQuestion.maxPoints}
                  value={draftScore}
                  onChange={(e) => setDraftScore(e.target.value)}
                />
                <span className="text-[20px] text-[#5F6368]">/ {activeQuestion.maxPoints}</span>
              </div>
              <div className="mb-2 text-[13px] font-medium text-[#202124]">
                Nhận xét cho học viên (Phản hồi)
              </div>
              <textarea
                className="h-[150px] w-full resize-y rounded-lg border border-[#DADCE0] p-3 text-[13px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
                placeholder="Nhập nhận xét của bạn vào đây..."
                value={draftFeedback}
                onChange={(e) => setDraftFeedback(e.target.value)}
              ></textarea>
            </div>

            {/* Footer Actions */}
            <div className="mt-auto flex flex-col gap-3 border-t border-[#DADCE0] bg-[#FAFAFA] p-6">
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmitGrade()}
                  disabled={manualGrade.isPending || !draftScore}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[4px] bg-[#1A73E8] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#174EA6] disabled:opacity-50"
                >
                  {manualGrade.isPending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Lưu điểm câu này
                    </>
                  )}
                </button>
                {activeQuestionIndex < essayQuestions.length - 1 && (
                  <button
                    onClick={() => handleSubmitGrade({ advance: true })}
                    disabled={manualGrade.isPending || !draftScore}
                    className="flex h-11 items-center justify-center gap-2 rounded-[4px] border border-[#1A73E8] bg-white px-3 font-medium text-[#1A73E8] transition-colors hover:bg-[#E8F0FE] disabled:opacity-50"
                    title="Lưu rồi chuyển câu kế tiếp"
                  >
                    <span className="material-symbols-outlined text-[18px]">double_arrow</span>
                    Lưu & tiếp theo
                  </button>
                )}
              </div>

              {/* Show Finalize button only if we're on the last question or all are graded */}
              {essayQuestions.every(
                (q) =>
                  q.response?.awardedPoints !== null && q.response?.awardedPoints !== undefined,
              ) && (
                <button
                  onClick={() => setConfirmFinalizeOpen(true)}
                  disabled={finalizeGrading.isPending}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-[#34A853] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#2D8E47] disabled:opacity-50"
                >
                  {finalizeGrading.isPending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      Hoàn tất & Gửi kết quả
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unsaved-nav warning modal */}
      {pendingNavIndex !== null && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-[16px] font-medium text-[#202124]">
              Bạn có nhận xét chưa lưu
            </h3>
            <p className="mb-5 text-[13px] leading-relaxed text-[#5F6368]">
              Nếu chuyển câu bây giờ, phần nhận xét đang soạn sẽ bị mất. Bạn muốn tiếp tục?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingNavIndex(null)}
                className="rounded border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#202124] hover:bg-[#F8F9FA]"
              >
                Ở lại câu này
              </button>
              <button
                onClick={() => {
                  setActiveQuestionIndex(pendingNavIndex);
                  setPendingNavIndex(null);
                }}
                className="rounded bg-[#D93025] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#B71C1C]"
              >
                Bỏ nhận xét & chuyển câu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finalize confirm modal */}
      {confirmFinalizeOpen && (
        <div className="fixed inset-0 z-[3500] flex items-center justify-center bg-black/40">
          <div className="w-[460px] rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-3 flex items-center gap-2 text-[#E65100]">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <h3 className="m-0 text-[16px] font-medium text-[#202124]">Hoàn tất chấm bài?</h3>
            </div>
            <p className="mb-5 text-[13px] leading-relaxed text-[#5F6368]">
              Sau khi hoàn tất, kết quả & điểm sẽ được gửi đến học viên và không thể hoàn tác. Hãy
              đảm bảo mọi câu đã được chấm đúng.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmFinalizeOpen(false)}
                disabled={finalizeGrading.isPending}
                className="rounded border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#202124] hover:bg-[#F8F9FA]"
              >
                Huỷ
              </button>
              <button
                onClick={handleFinalize}
                disabled={finalizeGrading.isPending}
                className="flex items-center gap-2 rounded bg-[#34A853] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2D8E47] disabled:opacity-60"
              >
                {finalizeGrading.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">
                      progress_activity
                    </span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">done_all</span>
                    Xác nhận hoàn tất
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
