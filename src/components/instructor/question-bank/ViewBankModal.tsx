'use client';

import { useQuery } from '@tanstack/react-query';
import { questionBankService } from '@/services/question-bank.service';
import type { QuestionBank } from '@/types';

interface ViewBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bank: QuestionBank | null;
  onEdit: (bank: QuestionBank) => void;
}

export const ViewBankModal = ({ isOpen, onClose, bank, onEdit }: ViewBankModalProps) => {
  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['question-bank-questions', bank?.id],
    queryFn: () => questionBankService.listQuestions(bank!.id, { limit: 100 }),
    enabled: isOpen && !!bank?.id,
  });

  const questions = questionsData?.data || [];

  if (!isOpen || !bank) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="flex h-[85vh] w-[900px] max-w-[95vw] flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DADCE0] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-medium text-[#202124]">Chi tiết Ngân hàng</h2>
            <p className="mt-1 text-[12px] text-[#5F6368]">
              {bank._count?.questions ?? bank.questionsCount ?? 0} câu hỏi
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#5F6368] hover:text-[#202124]"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 gap-6 overflow-hidden p-6">
          {/* Left: Info */}
          <div className="w-[320px] flex-shrink-0">
            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-medium text-[#5F6368]">
                Tên ngân hàng
              </label>
              <p className="text-[16px] font-medium text-[#202124]">{bank.title || bank.name}</p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-medium text-[#5F6368]">Mô tả</label>
              <p className="text-[14px] text-[#5F6368]">
                {bank.description || <em className="text-[#BDBDBD]">Không có mô tả</em>}
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-medium text-[#5F6368]">
                Số câu hỏi
              </label>
              <p className="text-[14px] text-[#202124]">
                {bank._count?.questions ?? bank.questionsCount ?? 0} câu
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-medium text-[#5F6368]">Người tạo</label>
              <p className="text-[14px] text-[#202124]">{bank.createdBy?.fullName || '—'}</p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-medium text-[#5F6368]">Ngày tạo</label>
              <p className="text-[14px] text-[#202124]">{formatDate(bank.createdAt)}</p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-medium text-[#5F6368]">Cập nhật</label>
              <p className="text-[14px] text-[#202124]">{formatDate(bank.updatedAt)}</p>
            </div>
          </div>

          {/* Right: Questions List */}
          <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto rounded-lg border border-[#DADCE0] bg-[#FAFAFA] p-4">
            <h3 className="mb-3 text-[14px] font-medium text-[#202124]">
              Danh sách câu hỏi ({questionsData?.pagination?.total || 0})
            </h3>

            {isLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-[32px] text-[#1A73E8]">
                  progress_activity
                </span>
              </div>
            ) : !questions || questions.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-center text-[#9AA0A6]">
                <div>
                  <span className="material-symbols-outlined mb-2 block text-[40px] opacity-50">
                    quiz
                  </span>
                  <p className="text-[13px]">Chưa có câu hỏi nào</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="rounded-lg border border-[#DADCE0] bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#E8F0FE] px-2 py-0.5 text-[11px] font-medium text-[#1A73E8]">
                          Câu {idx + 1}
                        </span>
                        <span className="text-[11px] text-[#5F6368]">
                          {q.questionType === 'single_choice'
                            ? 'Chọn 1'
                            : q.questionType === 'multiple_choice'
                              ? 'Chọn nhiều'
                              : 'Tự luận'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5F6368]">{q.defaultPoints} điểm</span>
                    </div>
                    <p className="mb-2 text-[13px] text-[#202124]">{q.content}</p>
                    {q.options && q.options.length > 0 && (
                      <div className="space-y-1">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`flex items-start gap-2 rounded px-2 py-1 text-[12px] ${
                              opt.isCorrect
                                ? 'bg-[#E6F4EA] text-[#34A853]'
                                : 'bg-[#F1F3F4] text-[#5F6368]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {opt.isCorrect
                                ? q.questionType === 'single_choice'
                                  ? 'radio_button_checked'
                                  : 'check_box'
                                : q.questionType === 'single_choice'
                                  ? 'radio_button_unchecked'
                                  : 'check_box_outline_blank'}
                            </span>
                            <span className="flex-1">{opt.content}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#DADCE0] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] hover:bg-[#F1F3F4]"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onEdit(bank);
              onClose();
            }}
            className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#174EA6]"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};
