import React, { useState } from 'react';
import type { QuizAttemptQuestionDetail } from '@/types';

interface QuestionContentProps {
  activeQuestion: number;
  setActiveQuestion: React.Dispatch<React.SetStateAction<number>>;
  answeredQs: number[];
  onSelectOption: (optionIds: string[]) => void;
  reviewQs: number[];
  onToggleReview: () => void;
  questionData?: QuizAttemptQuestionDetail;
  totalQuestions: number;
}

export const QuestionContent = ({
  activeQuestion,
  setActiveQuestion,
  answeredQs,
  onSelectOption,
  reviewQs,
  onToggleReview,
  questionData,
  totalQuestions,
}: QuestionContentProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    questionData?.response?.selectedOptionIds ?? [],
  );

  // Sync selection when active question changes
  React.useEffect(() => {
    setSelectedOptions(questionData?.response?.selectedOptionIds ?? []);
  }, [questionData?.id, questionData?.response?.selectedOptionIds]);

  const isMultiSelect = questionData?.questionSnapshot?.questionType === 'multiple_choice';

  const handleOptionChange = (optionId: string) => {
    let newSelection: string[];
    if (isMultiSelect) {
      newSelection = selectedOptions.includes(optionId)
        ? selectedOptions.filter((id) => id !== optionId)
        : [...selectedOptions, optionId];
    } else {
      newSelection = [optionId];
    }
    setSelectedOptions(newSelection);
    onSelectOption(newSelection);
  };

  return (
    <div className="relative flex h-full flex-1 flex-col bg-white">
      {/* Thanh công cụ nhỏ trên câu hỏi */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-slate-50 px-4 py-3 md:px-8 md:py-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary rounded px-3 py-1 text-[13px] font-bold text-white shadow-sm">
            Câu hỏi {activeQuestion}
          </span>
          {questionData && (
            <span className="text-[12px] font-bold text-slate-500">
              <i className="fa-solid fa-star text-yellow-400"></i> Điểm: {questionData.maxPoints}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <label className="group flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={reviewQs.includes(activeQuestion)}
              onChange={onToggleReview}
              className="cbx"
            />
            <span className="group-hover:text-warning text-[12px] font-semibold text-slate-600 transition-colors select-none">
              Đánh dấu xem lại
            </span>
          </label>
        </div>
      </div>

      {/* Nội dung câu hỏi */}
      <div className="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto w-full max-w-3xl pb-10">
          {questionData ? (
            <>
              <div
                className="mb-6 text-[15px] leading-relaxed font-medium text-slate-800"
                dangerouslySetInnerHTML={{ __html: questionData.questionSnapshot.questionText }}
              />

              <div className="mb-4 text-[13px] font-bold text-slate-700">
                {isMultiSelect ? 'Chọn tất cả đáp án đúng:' : 'Chọn 1 đáp án đúng nhất:'}
              </div>

              <form className="space-y-3">
                {questionData.optionsSnapshot?.map((opt) => {
                  const isChecked = selectedOptions.includes(opt.optionId);
                  const inputType = isMultiSelect ? 'checkbox' : 'radio';
                  return (
                    <div key={opt.optionId} className="relative">
                      <input
                        type={inputType}
                        name="answer"
                        id={`opt-${opt.optionId}`}
                        className="option-input absolute h-0 w-0 opacity-0"
                        onChange={() => handleOptionChange(opt.optionId)}
                        checked={isChecked}
                      />
                      <label htmlFor={`opt-${opt.optionId}`} className="option-label">
                        <div className="radio-circle"></div>
                        <div className="flex-1">
                          <div className="text-[14px] font-medium text-slate-800">
                            {opt.optionText}
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })}

                {/* Short answer / essay */}
                {(questionData.questionSnapshot.questionType === 'short_answer' ||
                  questionData.questionSnapshot.questionType === 'essay') && (
                  <textarea
                    className="focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 p-3 text-[13px] outline-none focus:ring-1"
                    placeholder="Nhập câu trả lời..."
                    rows={questionData.questionSnapshot.questionType === 'essay' ? 6 : 2}
                    defaultValue={questionData.response?.responseText ?? ''}
                  />
                )}
              </form>
            </>
          ) : (
            <div className="text-center text-sm text-slate-400">Không có câu hỏi.</div>
          )}
        </div>
      </div>

      {/* Điều hướng Trái / Phải */}
      <div className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-8 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveQuestion((prev) => Math.max(1, prev - 1))}
          disabled={activeQuestion <= 1}
          className="hover:text-primary hover:border-primary flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-[13px] font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
        >
          <i className="fa-solid fa-arrow-left"></i> Câu trước
        </button>
        <button
          onClick={() => setActiveQuestion((prev) => Math.min(totalQuestions, prev + 1))}
          disabled={activeQuestion >= totalQuestions}
          className="bg-primary hover:bg-primary-hover flex transform items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-bold text-white shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          Câu tiếp theo <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};
