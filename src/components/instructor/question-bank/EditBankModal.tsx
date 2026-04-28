'use client';

import { useState } from 'react';
import type { QuestionBank } from '@/types';

interface EditBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bank: QuestionBank | null;
  onSave: (id: string, data: { title: string; description: string }) => void;
  isSaving?: boolean;
}

const EditBankModalContent = ({
  bank,
  onClose,
  onSave,
  isSaving,
}: Omit<EditBankModalProps, 'isOpen'>) => {
  const [title, setTitle] = useState(bank?.title || bank?.name || '');
  const [description, setDescription] = useState(bank?.description || '');

  if (!bank) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(bank.id, { title: title.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="w-[600px] max-w-[90vw] rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DADCE0] px-6 py-4">
          <h2 className="text-[18px] font-medium text-[#202124]">Chỉnh sửa Ngân hàng</h2>
          <button
            onClick={onClose}
            className="text-[#5F6368] hover:text-[#202124]"
            aria-label="Đóng"
            disabled={isSaving}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="mb-2 block text-[13px] font-medium text-[#202124]">
              Tên ngân hàng <span className="text-[#EA4335]">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded border border-[#DADCE0] px-3 py-2 text-[14px] outline-none focus:border-[#1A73E8]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên ngân hàng..."
              required
              disabled={isSaving}
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-[13px] font-medium text-[#202124]">Mô tả</label>
            <textarea
              className="w-full resize-none rounded border border-[#DADCE0] px-3 py-2 text-[14px] outline-none focus:border-[#1A73E8]"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả (tùy chọn)..."
              disabled={isSaving}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-[#DADCE0] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] hover:bg-[#F1F3F4]"
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#174EA6] disabled:opacity-50"
              disabled={isSaving || !title.trim()}
            >
              {isSaving && (
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
              )}
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EditBankModal = ({ isOpen, onClose, bank, onSave, isSaving }: EditBankModalProps) => {
  if (!isOpen || !bank) return null;

  return (
    <EditBankModalContent
      key={bank.id}
      bank={bank}
      onClose={onClose}
      onSave={onSave}
      isSaving={isSaving}
    />
  );
};
