'use client';

import React, { useState } from 'react';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const AddQuestionModal = ({ isOpen, onClose, onSave }: AddQuestionModalProps) => {
  const [qType, setQType] = useState('MCQ');

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-[#202124]/60 transition-opacity duration-200 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div
        className={`flex w-[700px] flex-col rounded-lg bg-white shadow-[0_4px_6px_0_rgba(60,64,67,0.15),0_12px_16px_0_rgba(60,64,67,0.15)] transition-transform duration-200 ${isOpen ? 'translate-y-0' : 'translate-y-5'}`}
      >
        <div className="flex items-center justify-between border-b border-[#DADCE0] px-6 py-5">
          <h2 className="m-0 flex items-center gap-2 text-[18px] font-medium text-[#202124]">
            <span className="material-symbols-outlined">edit_square</span> Thêm câu hỏi mới
          </h2>
          <button
            onClick={onClose}
            className="flex cursor-pointer border-none bg-transparent text-[#5F6368]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="custom-scrollbar max-h-[70vh] overflow-y-auto p-6">
          <form>
            <div className="mb-5 flex gap-4">
              <div className="flex-1">
                <label className="mb-2 block text-[13px] font-medium text-[#202124]">
                  Loại câu hỏi
                </label>
                <select
                  className="w-full rounded border border-[#DADCE0] bg-white px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
                  value={qType}
                  onChange={(e) => setQType(e.target.value)}
                >
                  <option value="MCQ">Trắc nghiệm (Một đáp án đúng)</option>
                  <option value="Essay">Tự luận (Cần GV chấm)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-[13px] font-medium text-[#202124]">
                  Mức độ khó
                </label>
                <select className="w-full rounded border border-[#DADCE0] bg-white px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]">
                  <option value="Easy">Dễ</option>
                  <option value="Medium">Trung bình</option>
                  <option value="Hard">Khó</option>
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-[13px] font-medium text-[#202124]">
                Nội dung câu hỏi (*)
              </label>
              <textarea
                className="min-h-[80px] w-full resize-y rounded border border-[#DADCE0] px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
                placeholder="Nhập câu hỏi của bạn vào đây..."
                required
              ></textarea>
            </div>

            {qType === 'MCQ' && (
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#202124]">
                  Các phương án (Chọn ô tròn cho đáp án đúng)
                </label>
                <div className="mb-3 flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    className="h-5 w-5 cursor-pointer accent-[#34A853]"
                    defaultChecked
                  />
                  <input
                    type="text"
                    className="w-full rounded border border-[#DADCE0] px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
                    placeholder="Phương án A"
                    defaultValue="Đáp án đúng"
                  />
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    className="h-5 w-5 cursor-pointer accent-[#34A853]"
                  />
                  <input
                    type="text"
                    className="w-full rounded border border-[#DADCE0] px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
                    placeholder="Phương án B"
                  />
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    className="h-5 w-5 cursor-pointer accent-[#34A853]"
                  />
                  <input
                    type="text"
                    className="w-full rounded border border-[#DADCE0] px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
                    placeholder="Phương án C"
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 flex items-center gap-1 rounded border-none bg-transparent px-2 py-1 text-[13px] font-medium text-[#1A73E8] hover:bg-[#F1F3F4]"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span> Thêm phương án
                </button>
              </div>
            )}

            {qType === 'Essay' && (
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#202124]">
                  Gợi ý trả lời / Rubric chấm điểm
                </label>
                <textarea
                  className="min-h-[120px] w-full resize-y rounded border border-[#DADCE0] px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
                  placeholder="Nhập các ý chính học viên cần có để đạt điểm tối đa..."
                ></textarea>
              </div>
            )}

            <div className="mt-6 mb-0">
              <label className="mb-2 block text-[13px] font-medium text-[#202124]">
                Gắn thẻ (Tags) / Khóa học
              </label>
              <input
                type="text"
                className="w-full rounded border border-[#DADCE0] px-3 py-2.5 text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
                placeholder="Ví dụ: Python, Sales, Bài 1..."
              />
            </div>
          </form>
        </div>
        <div className="flex justify-end gap-3 rounded-b-lg border-t border-[#DADCE0] bg-[#FAFAFA] px-6 py-4">
          <button
            className="rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]"
            onClick={onClose}
          >
            Hủy bỏ
          </button>
          <button
            className="rounded-[4px] border border-transparent bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#174EA6]"
            onClick={onSave}
          >
            Lưu câu hỏi
          </button>
        </div>
      </div>
    </div>
  );
};
