'use client';

import React, { useState, useEffect } from 'react';

interface AIQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const AIQuestionModal = ({ isOpen, onClose, onSave }: AIQuestionModalProps) => {
  const [aiContext, setAiContext] = useState('');
  const [aiState, setAiState] = useState<'empty' | 'loading' | 'result'>('empty');

  // Reset state mỗi khi mở lại modal
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAiContext('');

      setAiState('empty');
    }
  }, [isOpen]);

  const handleGenerateAI = () => {
    if (!aiContext.trim()) {
      alert('Vui lòng nhập nội dung tài liệu để AI có thể đọc.');
      return;
    }
    setAiState('loading');
    setTimeout(() => {
      setAiState('result');
    }, 2000);
  };

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-[#202124]/60 transition-opacity duration-200 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div
        className={`flex w-[900px] flex-col rounded-lg bg-white shadow-[0_4px_6px_0_rgba(60,64,67,0.15),0_12px_16px_0_rgba(60,64,67,0.15)] transition-transform duration-200 ${isOpen ? 'translate-y-0' : 'translate-y-5'}`}
      >
        <div className="flex items-center justify-between border-b border-[#DADCE0] px-6 py-5">
          <h2 className="m-0 flex items-center gap-2 text-[18px] font-medium text-[#202124]">
            <span className="material-symbols-outlined text-[#9334E6]">auto_awesome</span> Trợ lý AI
            tạo câu hỏi
          </h2>
          <button
            onClick={onClose}
            className="flex cursor-pointer border-none bg-transparent text-[#5F6368]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex h-[60vh] gap-6 p-6">
          {/* Cột trái: Form nhập liệu AI */}
          <div className="flex flex-1 flex-col border-r border-[#DADCE0] pr-6">
            <label className="mb-2 block text-[13px] font-medium text-[#202124]">
              1. Cung cấp nội dung hoặc chủ đề bài học
            </label>
            <textarea
              className="custom-scrollbar mb-4 w-full flex-1 resize-none rounded border border-[#DADCE0] px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
              placeholder="Dán nội dung tài liệu (văn bản) hoặc gõ chủ đề vào đây. Ví dụ: 'Tạo câu hỏi về nguyên lý hoạt động của mô hình TCP/IP'"
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value)}
            ></textarea>

            <div className="mb-4 flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-[#202124]">
                  Số lượng
                </label>
                <input
                  type="number"
                  className="w-full rounded border border-[#DADCE0] px-3 py-2 text-[14px] transition-all outline-none focus:border-[#1A73E8]"
                  defaultValue={5}
                  min={1}
                  max={10}
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-[#202124]">Độ khó</label>
                <select className="w-full rounded border border-[#DADCE0] bg-white px-3 py-2 text-[14px] transition-all outline-none focus:border-[#1A73E8]">
                  <option>Hỗn hợp</option>
                  <option>Toàn bộ Dễ</option>
                  <option>Toàn bộ Khó</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              className="flex h-10 items-center justify-center gap-2 rounded-[4px] border border-[#E8D3FD] bg-[#F3E8FD] px-4 text-[13px] font-medium text-[#9334E6] transition-all hover:bg-[#E8D3FD] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <span className="material-symbols-outlined">magic_button</span> Bắt đầu tạo (Generate)
            </button>
          </div>

          {/* Cột phải: Kết quả AI */}
          <div className="custom-scrollbar relative flex flex-1 flex-col overflow-y-auto rounded-lg border border-[#DADCE0] bg-[#FAFAFA] p-4">
            {aiState === 'empty' && (
              <div className="m-auto text-center text-[#9AA0A6]">
                <span className="material-symbols-outlined mb-2 block text-[48px] opacity-50">
                  science
                </span>
                <p className="text-[14px]">Kết quả từ AI sẽ hiển thị ở đây.</p>
              </div>
            )}

            {aiState === 'loading' && (
              <div className="mt-10 text-center text-[#9334E6]">
                <span className="material-symbols-outlined animate-[spin_2s_linear_infinite] text-[40px]">
                  autorenew
                </span>
                <p className="mt-3 text-[13px] text-[#5F6368]">
                  AI đang đọc tài liệu và biên soạn câu hỏi... (Có thể mất vài giây)
                </p>
              </div>
            )}

            {aiState === 'result' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#34A853]">
                    Đã tạo thành công 2 câu hỏi!
                  </span>
                </div>

                <div className="mb-4 rounded-[6px] border border-[#DADCE0] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <div className="mb-3 text-[14px] font-medium text-[#202124]">
                    Câu 1: Giao thức TCP hoạt động ở tầng nào của mô hình OSI?
                  </div>
                  <div className="mb-1 flex items-center gap-2 text-[13px] text-[#5F6368]">
                    <span className="material-symbols-outlined text-[16px]">
                      radio_button_unchecked
                    </span>{' '}
                    A. Tầng Ứng dụng (Application)
                  </div>
                  <div className="mb-1 flex items-center gap-2 text-[13px] font-medium text-[#34A853]">
                    <span className="material-symbols-outlined text-[16px]">
                      radio_button_checked
                    </span>{' '}
                    B. Tầng Giao vận (Transport)
                  </div>
                  <div className="mb-1 flex items-center gap-2 text-[13px] text-[#5F6368]">
                    <span className="material-symbols-outlined text-[16px]">
                      radio_button_unchecked
                    </span>{' '}
                    C. Tầng Mạng (Network)
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#5F6368]">
                    <span className="material-symbols-outlined text-[16px]">
                      radio_button_unchecked
                    </span>{' '}
                    D. Tầng Liên kết dữ liệu (Data Link)
                  </div>
                </div>

                <div className="rounded-[6px] border border-[#DADCE0] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <div className="mb-3 text-[14px] font-medium text-[#202124]">
                    Câu 2: Đặc điểm nào sau đây KHÔNG phải của TCP?
                  </div>
                  <div className="mb-1 flex items-center gap-2 text-[13px] text-[#5F6368]">
                    <span className="material-symbols-outlined text-[16px]">
                      radio_button_unchecked
                    </span>{' '}
                    A. Đảm bảo dữ liệu đến nơi an toàn
                  </div>
                  <div className="mb-1 flex items-center gap-2 text-[13px] font-medium text-[#34A853]">
                    <span className="material-symbols-outlined text-[16px]">
                      radio_button_checked
                    </span>{' '}
                    B. Tốc độ truyền tải nhanh hơn UDP
                  </div>
                  <div className="mb-1 flex items-center gap-2 text-[13px] text-[#5F6368]">
                    <span className="material-symbols-outlined text-[16px]">
                      radio_button_unchecked
                    </span>{' '}
                    C. Yêu cầu thiết lập kết nối (Connection-oriented)
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#5F6368]">
                    <span className="material-symbols-outlined text-[16px]">
                      radio_button_unchecked
                    </span>{' '}
                    D. Kiểm tra lỗi bằng Checksum
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 rounded-b-lg border-t border-[#DADCE0] bg-[#FAFAFA] px-6 py-4">
          <button
            className="rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]"
            onClick={onClose}
          >
            Đóng
          </button>
          <button
            className={`rounded-[4px] px-4 py-2 text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all ${aiState === 'result' ? 'bg-[#1A73E8] text-white hover:bg-[#174EA6]' : 'cursor-not-allowed bg-[#DADCE0] text-[#9AA0A6] shadow-none'}`}
            disabled={aiState !== 'result'}
            onClick={onSave}
          >
            Lưu vào Ngân hàng
          </button>
        </div>
      </div>
    </div>
  );
};
