'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  useQuestionBanks,
  useGenerateAiQuestions,
  useSaveAiQuestions,
} from '@/hooks/useQuestionBanks';
import type {
  AiDifficulty,
  AiDraftOption,
  AiDraftQuestion,
  AiQuestionType,
} from '@/services/question-bank.service';

interface AIQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (createdCount: number) => void;
  defaultBankId?: string;
}

interface DraftRow extends AiDraftQuestion {
  localId: string;
  approved: boolean;
}

const DIFFICULTY_OPTIONS: { value: AiDifficulty; label: string }[] = [
  { value: 'mixed', label: 'Hỗn hợp' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

const TYPE_OPTIONS: { value: AiQuestionType; label: string }[] = [
  { value: 'single_choice', label: 'Chọn 1 đáp án' },
  { value: 'multiple_choice', label: 'Chọn nhiều đáp án' },
  { value: 'essay', label: 'Tự luận' },
];

const TYPE_LABEL: Record<AiQuestionType, string> = {
  single_choice: 'Chọn 1 đáp án',
  multiple_choice: 'Chọn nhiều đáp án',
  essay: 'Tự luận',
};

const newLocalId = () => `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const toRows = (drafts: AiDraftQuestion[]): DraftRow[] =>
  drafts.map((d) => ({ ...d, localId: newLocalId(), approved: true }));

const extractApiError = (err: unknown): string => {
  if (typeof err === 'object' && err && 'response' in err) {
    const resp = (err as { response?: { data?: { message?: string } } }).response;
    if (resp?.data?.message) return resp.data.message;
  }
  if (err instanceof Error) return err.message;
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
};

export const AIQuestionModal = ({
  isOpen,
  onClose,
  onSave,
  defaultBankId,
}: AIQuestionModalProps) => {
  // ─── Form state ─────────────────────────────────────────────────────────────
  const [bankId, setBankId] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<AiDifficulty>('mixed');
  const [questionTypes, setQuestionTypes] = useState<AiQuestionType[]>(['single_choice']);

  // ─── Result state ───────────────────────────────────────────────────────────
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─── Data hooks ─────────────────────────────────────────────────────────────
  const { data: banksData, isLoading: banksLoading } = useQuestionBanks({ page: 1, limit: 100 });
  const banks = useMemo(() => banksData?.data ?? [], [banksData]);

  const generate = useGenerateAiQuestions();
  const save = useSaveAiQuestions();

  // ─── Reset on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setTopic('');
    setCount(5);
    setDifficulty('mixed');
    setQuestionTypes(['single_choice']);
    setDrafts([]);
    setErrorMessage(null);
    generate.reset();
    save.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ─── Auto-pick first bank when banks load ──────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (defaultBankId) {
      setBankId(defaultBankId);
      return;
    }
    if (!bankId && banks.length > 0) {
      setBankId(banks[0].id);
    }
  }, [isOpen, defaultBankId, banks, bankId]);

  // ─── Derived ────────────────────────────────────────────────────────────────
  const aiState: 'empty' | 'loading' | 'result' | 'error' = useMemo(() => {
    if (generate.isPending) return 'loading';
    if (errorMessage) return 'error';
    if (drafts.length > 0) return 'result';
    return 'empty';
  }, [generate.isPending, errorMessage, drafts.length]);

  const approvedCount = drafts.filter((d) => d.approved).length;

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const toggleType = (t: AiQuestionType) => {
    setQuestionTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleGenerate = async () => {
    setErrorMessage(null);
    if (!bankId) {
      setErrorMessage('Vui lòng chọn ngân hàng câu hỏi đích.');
      return;
    }
    if (!topic.trim()) {
      setErrorMessage('Vui lòng nhập chủ đề hoặc dán nội dung tài liệu.');
      return;
    }
    if (questionTypes.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một loại câu hỏi.');
      return;
    }

    try {
      const result = await generate.mutateAsync({
        bankId,
        payload: {
          // Heuristic: long input → treat as source content; short input → treat as topic.
          topic: topic.trim().length < 200 ? topic.trim() : undefined,
          sourceContent: topic.trim().length >= 200 ? topic.trim() : undefined,
          count,
          difficulty,
          questionTypes,
          language: 'vi',
        },
      });
      setDrafts(toRows(result.questions));
    } catch (err) {
      setErrorMessage(extractApiError(err));
    }
  };

  const updateDraft = (localId: string, patch: Partial<DraftRow>) => {
    setDrafts((prev) => prev.map((d) => (d.localId === localId ? { ...d, ...patch } : d)));
  };

  const updateOption = (localId: string, optIdx: number, patch: Partial<AiDraftOption>) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.localId !== localId) return d;
        const options = (d.options ?? []).map((o, idx) =>
          idx === optIdx ? { ...o, ...patch } : o,
        );
        // For single_choice: ensure only one option is correct
        if (d.questionType === 'single_choice' && patch.isCorrect === true) {
          return {
            ...d,
            options: options.map((o, idx) => ({ ...o, isCorrect: idx === optIdx })),
          };
        }
        return { ...d, options };
      }),
    );
  };

  const removeDraft = (localId: string) => {
    setDrafts((prev) => prev.filter((d) => d.localId !== localId));
  };

  const handleSave = async () => {
    setErrorMessage(null);
    const toSave: AiDraftQuestion[] = drafts
      .filter((d) => d.approved)
      .map(({ localId: _ignore, approved: _approved, ...rest }) => rest);

    if (toSave.length === 0) {
      setErrorMessage('Vui lòng phê duyệt ít nhất một câu hỏi để lưu.');
      return;
    }

    try {
      const result = await save.mutateAsync({ bankId, questions: toSave });
      onSave(result.createdCount);
    } catch (err) {
      setErrorMessage(extractApiError(err));
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-[#202124]/60 transition-opacity duration-200 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div
        className={`flex max-h-[92vh] w-[1000px] max-w-[95vw] flex-col rounded-lg bg-white shadow-[0_4px_6px_0_rgba(60,64,67,0.15),0_12px_16px_0_rgba(60,64,67,0.15)] transition-transform duration-200 ${isOpen ? 'translate-y-0' : 'translate-y-5'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DADCE0] px-6 py-5">
          <h2 className="m-0 flex items-center gap-2 text-[18px] font-medium text-[#202124]">
            <span className="material-symbols-outlined text-[#9334E6]">auto_awesome</span> Trợ lý AI
            tạo câu hỏi
          </h2>
          <button
            onClick={onClose}
            className="flex cursor-pointer border-none bg-transparent text-[#5F6368]"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex h-[68vh] gap-6 p-6">
          {/* Left column: form */}
          <div className="flex w-[360px] flex-col border-r border-[#DADCE0] pr-6">
            <label className="mb-2 block text-[13px] font-medium text-[#202124]">
              1. Chọn ngân hàng đích
            </label>
            <select
              className="mb-4 w-full rounded border border-[#DADCE0] bg-white px-3 py-2 text-[14px] transition-all outline-none focus:border-[#1A73E8]"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              disabled={banksLoading || banks.length === 0}
            >
              {banksLoading && <option>Đang tải...</option>}
              {!banksLoading && banks.length === 0 && (
                <option value="">Chưa có ngân hàng — hãy tạo trước</option>
              )}
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <label className="mb-2 block text-[13px] font-medium text-[#202124]">
              2. Chủ đề / nội dung tài liệu
            </label>
            <textarea
              className="custom-scrollbar mb-4 min-h-[140px] w-full flex-1 resize-none rounded border border-[#DADCE0] px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
              placeholder='Ví dụ: "Quy trình onboarding nhân viên mới" hoặc dán nguyên đoạn tài liệu vào đây...'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="mb-4 flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-[#202124]">
                  Số lượng
                </label>
                <input
                  type="number"
                  className="w-full rounded border border-[#DADCE0] px-3 py-2 text-[14px] transition-all outline-none focus:border-[#1A73E8]"
                  value={count}
                  min={1}
                  max={15}
                  onChange={(e) => setCount(Math.min(15, Math.max(1, Number(e.target.value) || 1)))}
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-[#202124]">Độ khó</label>
                <select
                  className="w-full rounded border border-[#DADCE0] bg-white px-3 py-2 text-[14px] transition-all outline-none focus:border-[#1A73E8]"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as AiDifficulty)}
                >
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="mb-2 block text-[11px] font-medium text-[#202124]">
              Loại câu hỏi
            </label>
            <div className="mb-4 flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((t) => {
                const active = questionTypes.includes(t.value);
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => toggleType(t.value)}
                    className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-all ${active ? 'border-[#9334E6] bg-[#F3E8FD] text-[#9334E6]' : 'border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4]'}`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generate.isPending || !bankId}
              className="mt-auto flex h-10 items-center justify-center gap-2 rounded-[4px] border border-[#E8D3FD] bg-[#F3E8FD] px-4 text-[13px] font-medium text-[#9334E6] transition-all hover:bg-[#E8D3FD] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined">
                {generate.isPending ? 'autorenew' : 'magic_button'}
              </span>
              {generate.isPending
                ? 'AI đang sinh câu hỏi...'
                : drafts.length > 0
                  ? 'Sinh lại bộ câu hỏi'
                  : 'Bắt đầu tạo (Generate)'}
            </button>
          </div>

          {/* Right column: results */}
          <div className="custom-scrollbar relative flex flex-1 flex-col overflow-y-auto rounded-lg border border-[#DADCE0] bg-[#FAFAFA] p-4">
            {aiState === 'empty' && (
              <div className="m-auto text-center text-[#9AA0A6]">
                <span className="material-symbols-outlined mb-2 block text-[48px] opacity-50">
                  science
                </span>
                <p className="text-[14px]">Kết quả từ AI sẽ hiển thị ở đây.</p>
                <p className="mt-1 text-[12px]">
                  Nhập chủ đề / tài liệu rồi bấm <strong>Generate</strong>.
                </p>
              </div>
            )}

            {aiState === 'loading' && (
              <div className="m-auto text-center text-[#9334E6]">
                <span className="material-symbols-outlined animate-[spin_2s_linear_infinite] text-[40px]">
                  autorenew
                </span>
                <p className="mt-3 text-[13px] text-[#5F6368]">
                  AI đang đọc nội dung và biên soạn câu hỏi... (có thể mất 10–30 giây)
                </p>
              </div>
            )}

            {aiState === 'error' && (
              <div className="m-auto max-w-[420px] text-center text-[#D93025]">
                <span className="material-symbols-outlined mb-2 block text-[40px]">error</span>
                <p className="text-[13px]">{errorMessage}</p>
              </div>
            )}

            {aiState === 'result' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#34A853]">
                    AI đã tạo {drafts.length} câu hỏi · {approvedCount} câu được duyệt
                  </span>
                  <span className="text-[12px] text-[#5F6368]">
                    Bạn có thể chỉnh sửa, bỏ duyệt hoặc xoá từng câu trước khi lưu.
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {drafts.map((q, qIdx) => (
                    <div
                      key={q.localId}
                      className={`rounded-[6px] border bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all ${q.approved ? 'border-[#DADCE0]' : 'border-[#F1F3F4] opacity-60'}`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 text-[12px] font-medium text-[#5F6368]">
                          <span className="rounded bg-[#F3E8FD] px-2 py-0.5 text-[#9334E6]">
                            Câu {qIdx + 1}
                          </span>
                          <span className="rounded bg-[#E8F0FE] px-2 py-0.5 text-[#1A73E8]">
                            {TYPE_LABEL[q.questionType]}
                          </span>
                          <span>· {q.defaultPoints} điểm</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateDraft(q.localId, { approved: !q.approved })}
                            className={`flex items-center gap-1 rounded px-2 py-1 text-[12px] font-medium transition-all ${q.approved ? 'bg-[#E6F4EA] text-[#34A853] hover:bg-[#CEEAD6]' : 'bg-[#F1F3F4] text-[#5F6368] hover:bg-[#E8EAED]'}`}
                            title={q.approved ? 'Bỏ duyệt' : 'Duyệt câu này'}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {q.approved ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            {q.approved ? 'Đã duyệt' : 'Bỏ duyệt'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeDraft(q.localId)}
                            className="rounded p-1 text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#D93025]"
                            title="Xoá câu này"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>

                      <textarea
                        className="mb-3 w-full resize-none rounded border border-transparent bg-transparent p-1 text-[14px] font-medium text-[#202124] outline-none hover:border-[#DADCE0] focus:border-[#1A73E8]"
                        rows={2}
                        value={q.content}
                        onChange={(e) => updateDraft(q.localId, { content: e.target.value })}
                      />

                      {q.questionType !== 'essay' && q.options && q.options.length > 0 && (
                        <div className="mb-2 flex flex-col gap-1">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className="group flex items-center gap-2 rounded px-1 py-0.5 hover:bg-[#F1F3F4]"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  updateOption(q.localId, optIdx, { isCorrect: !opt.isCorrect })
                                }
                                className="flex-shrink-0"
                                title={opt.isCorrect ? 'Đáp án đúng' : 'Đánh dấu đúng'}
                              >
                                <span
                                  className={`material-symbols-outlined text-[18px] ${opt.isCorrect ? 'text-[#34A853]' : 'text-[#9AA0A6]'}`}
                                >
                                  {opt.isCorrect
                                    ? q.questionType === 'single_choice'
                                      ? 'radio_button_checked'
                                      : 'check_box'
                                    : q.questionType === 'single_choice'
                                      ? 'radio_button_unchecked'
                                      : 'check_box_outline_blank'}
                                </span>
                              </button>
                              <input
                                className={`flex-1 rounded border border-transparent bg-transparent px-1 py-0.5 text-[13px] outline-none hover:border-[#DADCE0] focus:border-[#1A73E8] ${opt.isCorrect ? 'font-medium text-[#34A853]' : 'text-[#5F6368]'}`}
                                value={opt.content}
                                onChange={(e) =>
                                  updateOption(q.localId, optIdx, { content: e.target.value })
                                }
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {q.explanation && (
                        <details className="group mt-2 rounded bg-[#FAFAFA] p-2">
                          <summary className="cursor-pointer text-[12px] font-medium text-[#5F6368] group-open:mb-1">
                            {q.questionType === 'essay' ? 'Rubric chấm' : 'Giải thích đáp án'}
                          </summary>
                          <textarea
                            className="w-full resize-none rounded border border-[#DADCE0] bg-white p-1 text-[12px] text-[#5F6368] outline-none focus:border-[#1A73E8]"
                            rows={3}
                            value={q.explanation}
                            onChange={(e) =>
                              updateDraft(q.localId, { explanation: e.target.value })
                            }
                          />
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 rounded-b-lg border-t border-[#DADCE0] bg-[#FAFAFA] px-6 py-4">
          <div className="text-[12px] text-[#5F6368]">
            {drafts.length > 0 && (
              <span>
                {approvedCount}/{drafts.length} câu sẽ được lưu vào ngân hàng
              </span>
            )}
            {errorMessage && aiState !== 'error' && (
              <span className="text-[#D93025]">{errorMessage}</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]"
              onClick={onClose}
              disabled={save.isPending}
            >
              Đóng
            </button>
            <button
              className={`flex items-center gap-2 rounded-[4px] px-4 py-2 text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all ${approvedCount > 0 && !save.isPending ? 'bg-[#1A73E8] text-white hover:bg-[#174EA6]' : 'cursor-not-allowed bg-[#DADCE0] text-[#9AA0A6] shadow-none'}`}
              disabled={approvedCount === 0 || save.isPending}
              onClick={handleSave}
            >
              {save.isPending && (
                <span className="material-symbols-outlined animate-[spin_2s_linear_infinite] text-[16px]">
                  autorenew
                </span>
              )}
              Lưu {approvedCount > 0 ? `${approvedCount} câu` : ''} vào Ngân hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
