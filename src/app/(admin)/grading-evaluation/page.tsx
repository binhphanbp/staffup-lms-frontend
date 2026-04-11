'use client';

import React, { useState, useMemo } from 'react';
import { GradingWorkspace } from '@/components/instructor/grading/GradingWorkspace';
import { useAllQuizAttempts, useAiGradeQuiz } from '@/hooks/useQuiz';
import type { QuizAttemptHistoryItem } from '@/types';

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

type StatusType = 'Pending' | 'AIGraded' | 'Graded';

interface MappedSubmission {
  id: number;
  attemptId: string;
  name: string;
  email: string;
  course: string;
  assignment: string;
  submitDate: string;
  status: StatusType;
  aiScore: number | null;
  manualScore: number | null;
}

function mapAttemptToSubmission(item: QuizAttemptHistoryItem, index: number): MappedSubmission {
  const status: StatusType =
    item.status === 'graded' ? 'Graded' : item.status === 'submitted' ? 'Pending' : 'Pending';
  return {
    id: index + 1,
    attemptId: item.id,
    name: item.enrollment.user.fullName,
    email: item.enrollment.user.email,
    course: item.enrollment.course.title,
    assignment: item.quiz.title,
    submitDate: formatRelativeDate(item.submittedAt),
    status,
    aiScore: item.objectiveScore,
    manualScore: item.manualScore,
  };
}

export default function GradingEvaluationPage() {
  const { data: attempts = [], isLoading, isError, refetch } = useAllQuizAttempts();
  const aiGradeQuiz = useAiGradeQuiz();

  const submissions: MappedSubmission[] = useMemo(
    () =>
      attempts
        .filter((a) => a.status === 'submitted' || a.status === 'graded')
        .map(mapAttemptToSubmission),
    [attempts],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Workspace State
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const pendingCount = submissions.filter((s) => s.status !== 'Graded').length;
  const gradedCount = submissions.filter((s) => s.status === 'Graded').length;

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleBatchAiGrade = async () => {
    const pendingSubs = submissions.filter((s) => s.status === 'Pending');
    if (pendingSubs.length === 0) {
      showToast('Không có bài nào cần chấm AI.');
      return;
    }

    showToast('AI đang quét và chấm điểm tất cả bài viết. Vui lòng đợi...');

    let successCount = 0;
    for (const sub of pendingSubs) {
      try {
        await aiGradeQuiz.mutateAsync(sub.attemptId);
        successCount++;
      } catch {
        // Continue with next attempt even if one fails
      }
    }

    await refetch();
    showToast(`AI đã chấm xong ${successCount}/${pendingSubs.length} bài!`);
  };

  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">
            Chấm bài tự luận & Đánh giá
          </h1>
          <button
            onClick={handleBatchAiGrade}
            disabled={aiGradeQuiz.isPending}
            className="flex items-center gap-2 rounded border border-[#E8D3FD] bg-[#F3E8FD] px-4 py-2 text-[13px] font-medium text-[#9334E6] transition-all hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3)] disabled:opacity-50"
          >
            {aiGradeQuiz.isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                AI đang chấm...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                Chấm tự động tất cả bằng AI
              </>
            )}
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF7E0] text-[#B06000]">
              <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                pending_actions
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">
                {isLoading ? '-' : pendingCount}
              </h4>
              <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">
                Bài nộp chờ chấm
              </p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FE] text-[#1A73E8]">
              <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                rule
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">
                {isLoading ? '-' : gradedCount}
              </h4>
              <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">Đã chấm xong</p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#E8D3FD] bg-gradient-to-r from-white to-[#F3E8FD] p-4 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E8FD] text-[#9334E6]">
              <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                robot_2
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-[24px] leading-none font-normal text-[#9334E6]">
                {submissions.length > 0 ? `${submissions.length}` : '0'}
              </h4>
              <p className="m-0 text-[12px] font-medium text-[#9334E6] uppercase">Tổng bài nộp</p>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
            <span className="material-symbols-outlined text-[20px] text-[#5F6368]">search</span>
            <input
              type="text"
              className="flex-1 border-none bg-transparent text-[13px] outline-none placeholder:text-[#5F6368]"
              placeholder="Tìm tên học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả Trạng thái</option>
            <option value="Pending">Chờ chấm</option>
            <option value="Graded">Đã hoàn tất</option>
          </select>
        </div>

        {/* LOADING / ERROR */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-16">
            <span className="material-symbols-outlined animate-spin text-[40px] text-[#1A73E8]">
              progress_activity
            </span>
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-[#D93025]">
            <span className="material-symbols-outlined text-[40px]">error</span>
            <p className="text-[14px]">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        )}

        {/* TABLE */}
        {!isLoading && !isError && (
          <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
            <table className="w-full border-collapse">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Học viên
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Bài tập / Khóa học
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Ngày nộp
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Trạng thái
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Điểm
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-[#5F6368]">
                      Không có bài nộp nào.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr
                      key={sub.attemptId}
                      className="border-b border-[#F1F3F4] hover:bg-[#F8F9FA]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F0FE] text-[13px] font-medium text-[#1A73E8] uppercase">
                            {sub.name
                              .split(' ')
                              .slice(-2)
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="m-0 text-[13px] font-medium text-[#202124]">{sub.name}</p>
                            <span className="text-[11px] text-[#5F6368]">{sub.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="cursor-pointer text-[13px] font-medium text-[#1A73E8] hover:underline"
                          onClick={() => setActiveAttemptId(sub.attemptId)}
                        >
                          {sub.assignment}
                        </span>
                        <div className="mt-0.5 text-[11px] text-[#5F6368]">Khóa: {sub.course}</div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#202124]">{sub.submitDate}</td>
                      <td className="px-4 py-3">
                        {sub.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF3E0] px-2 py-1 text-[11px] font-medium text-[#E65100]">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            Chờ chấm
                          </span>
                        )}
                        {sub.status === 'AIGraded' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FD] px-2 py-1 text-[11px] font-medium text-[#9334E6]">
                            <span className="material-symbols-outlined text-[12px]">
                              auto_awesome
                            </span>
                            AI đã chấm
                          </span>
                        )}
                        {sub.status === 'Graded' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EA] px-2 py-1 text-[11px] font-medium text-[#137333]">
                            <span className="material-symbols-outlined text-[12px]">done_all</span>
                            Đã hoàn tất
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {sub.manualScore !== null && sub.manualScore !== undefined ? (
                          <span className="font-medium text-[#34A853]">{sub.manualScore}</span>
                        ) : sub.aiScore !== null && sub.aiScore !== undefined ? (
                          <span className="flex items-center gap-1 font-medium text-[#9334E6]">
                            <span className="material-symbols-outlined text-[16px]">
                              auto_awesome
                            </span>
                            {sub.aiScore}
                          </span>
                        ) : (
                          <span className="text-[#5F6368]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setActiveAttemptId(sub.attemptId)}
                          className={`flex items-center justify-center gap-2 rounded-[4px] px-4 py-2 text-[13px] font-medium transition-colors ${sub.status === 'Graded' ? 'border border-[#DADCE0] bg-transparent text-[#5F6368] hover:bg-[#F1F3F4]' : 'bg-[#1A73E8] text-white hover:bg-[#174EA6]'}`}
                        >
                          {sub.status === 'Graded' ? 'Xem lại' : 'Chấm bài'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grading Workspace (Full Screen Overlay) */}
      {activeAttemptId && (
        <GradingWorkspace
          attemptId={activeAttemptId}
          onClose={() => setActiveAttemptId(null)}
          onGraded={() => refetch()}
        />
      )}

      {/* TOAST */}
      <div
        className={`fixed bottom-6 left-6 z-[3000] flex items-center gap-3 rounded-[4px] bg-[#323232] px-6 py-[14px] text-white shadow-lg transition-transform duration-300 ${toast.visible ? 'translate-y-0' : 'translate-y-[100px]'}`}
      >
        <span className="material-symbols-outlined text-[24px] text-[#81C995]">check_circle</span>
        <span className="text-[14px]">{toast.message}</span>
      </div>
    </>
  );
}
