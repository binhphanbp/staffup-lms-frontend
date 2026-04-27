'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';
import { useQuestionBanks, useDeleteQuestionBank } from '@/hooks/useQuestionBanks';
import type { QuestionBank } from '@/types';
import { AddQuestionModal } from '@/components/instructor/question-bank/AddQuestionModal';
import { AIQuestionModal } from '@/components/instructor/question-bank/AIQuestionModal';

export default function QuestionBankPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const { data, isLoading, isError } = useQuestionBanks({ search: searchQuery, page, limit: 10 });
  const deleteBank = useDeleteQuestionBank();

  const banks: QuestionBank[] = data?.data ?? [];
  const meta = data?.meta;
  const totalBanks = meta?.total ?? 0;
  const totalQuestions = banks.reduce((sum, b) => sum + b.questionsCount, 0);

  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    toast[type](message);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleDelete = (bank: QuestionBank) => {
    if (!confirm(`Xóa ngân hàng câu hỏi "${bank.name}"?`)) return;
    deleteBank.mutate(bank.id, {
      onSuccess: () => showToast(`Đã xóa ngân hàng "${bank.name}"`),
      onError: () => showToast('Xóa thất bại. Vui lòng thử lại.', 'error'),
    });
  };

  const handleSaveQuestion = () => {
    setIsAddModalOpen(false);
    showToast('Đã lưu câu hỏi thành công!');
  };

  const handleSaveAI = (createdCount: number) => {
    setIsAIModalOpen(false);
    showToast(`Đã thêm ${createdCount} câu hỏi từ AI vào Ngân hàng!`);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden px-4 py-4 md:px-8 md:py-6">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-[22px] font-normal text-[#202124]">
            Ngân hàng Câu hỏi (Question Bank)
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-2 rounded-[4px] border border-[#E8D3FD] bg-[#F3E8FD] px-4 py-2 text-[13px] font-medium text-[#9334E6] transition-all hover:bg-[#E8D3FD] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span> Tạo câu
              hỏi bằng AI
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-[4px] border border-transparent bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#174EA6]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Thêm thủ công
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FE] text-[#1A73E8]">
              <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                account_balance
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">
                {isLoading ? '—' : totalBanks}
              </h4>
              <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">
                Tổng số ngân hàng
              </p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4EA] text-[#34A853]">
              <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                source
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">
                {isLoading ? '—' : totalQuestions}
              </h4>
              <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">
                Tổng số câu hỏi
              </p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF7E0] text-[#B06000]">
              <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                pending_actions
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">—</h4>
              <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">Đang cập nhật</p>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="mb-4 flex items-center rounded-lg border border-[#DADCE0] bg-white p-3 px-4">
          <div className="relative flex w-[280px] items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[20px] text-[#5F6368]">
              search
            </span>
            <input
              type="text"
              className="w-full rounded border border-[#DADCE0] py-2 pr-3 pl-[36px] text-[13px] transition-colors outline-none focus:border-[#1A73E8]"
              placeholder="Tìm tên ngân hàng..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center p-16">
                <span className="material-symbols-outlined animate-spin text-[36px] text-[#1A73E8]">
                  progress_activity
                </span>
              </div>
            ) : isError ? (
              <div className="p-10 text-center text-[#EA4335]">
                <span className="material-symbols-outlined mb-2 block text-[36px]">error</span>
                <p className="text-[14px]">Không thể tải dữ liệu. Vui lòng thử lại.</p>
              </div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_#DADCE0]">
                  <tr>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-[12px] font-medium whitespace-nowrap text-[#5F6368]">
                      Tên ngân hàng
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-[12px] font-medium whitespace-nowrap text-[#5F6368]">
                      Mô tả
                    </th>
                    <th className="w-[120px] border-b border-[#DADCE0] px-4 py-3 text-center text-[12px] font-medium whitespace-nowrap text-[#5F6368]">
                      Số câu hỏi
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-[12px] font-medium whitespace-nowrap text-[#5F6368]">
                      Người tạo
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-[12px] font-medium whitespace-nowrap text-[#5F6368]">
                      Ngày tạo
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 pr-6 text-right text-[12px] font-medium text-[#5F6368]">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {banks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-[#5F6368]">
                        <span className="material-symbols-outlined mb-2 block text-[36px] text-[#DADCE0]">
                          inventory_2
                        </span>
                        Chưa có ngân hàng câu hỏi nào.
                      </td>
                    </tr>
                  ) : (
                    banks.map((bank) => (
                      <tr
                        key={bank.id}
                        className="group border-b border-[#DADCE0] transition-colors hover:bg-[#F1F3F4]"
                      >
                        <td className="px-4 py-4 align-middle">
                          <span className="text-[14px] font-medium text-[#202124]">
                            {bank.name}
                          </span>
                        </td>
                        <td className="max-w-[300px] px-4 py-4 align-middle">
                          {bank.description ? (
                            <span className="line-clamp-2 text-[13px] text-[#5F6368]">
                              {bank.description}
                            </span>
                          ) : (
                            <em className="text-[13px] text-[#BDBDBD]">Không có mô tả</em>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center align-middle">
                          <span className="inline-flex items-center gap-1 rounded border border-[#E8F0FE] bg-[#E8F0FE] px-2 py-0.5 text-[12px] font-medium text-[#1A73E8]">
                            <span className="material-symbols-outlined text-[14px]">quiz</span>
                            {bank.questionsCount}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <span className="text-[13px] text-[#5F6368]">
                            {bank.createdBy?.fullName ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <span className="text-[13px] text-[#5F6368]">
                            {formatDate(bank.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-4 pr-6 text-right align-middle">
                          <div className="flex justify-end gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-[#5F6368] transition-colors hover:bg-[#5F6368]/10 hover:text-[#202124]"
                              title="Xem chi tiết"
                              onClick={() => showToast(`Xem ngân hàng: ${bank.name}`)}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                open_in_new
                              </span>
                            </button>
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-[#5F6368] transition-colors hover:bg-[#5F6368]/10 hover:text-[#202124]"
                              title="Chỉnh sửa"
                              onClick={() => showToast(`Sửa ngân hàng: ${bank.name}`)}
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-[#5F6368] transition-colors hover:bg-[#EA4335]/10 hover:text-[#EA4335]"
                              title="Xóa"
                              onClick={() => handleDelete(bank)}
                              disabled={deleteBank.isPending}
                            >
                              <span className="material-symbols-outlined text-[20px] text-[#EA4335]">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between border-t border-[#DADCE0] bg-white px-6 py-3 text-[12px] text-[#5F6368]">
            <span>
              Tổng cộng <strong className="text-[#202124]">{meta?.total ?? 0}</strong> ngân hàng
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span>
                {page} / {meta?.totalPages ?? 1}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!meta || page >= meta.totalPages}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveQuestion}
      />

      <AIQuestionModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSave={handleSaveAI}
      />

      {/* TOAST NOTIFICATION */}
    </>
  );
}
