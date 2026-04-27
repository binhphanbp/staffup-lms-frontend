'use client';

import React, { useMemo, useState } from 'react';
import { toast } from '@/lib/toast';
import { GradingWorkspace } from '@/components/instructor/grading/GradingWorkspace';
import { useCourses } from '@/hooks/useCourses';
import { useAiGradeQuiz, useAllQuizAttempts } from '@/hooks/useQuiz';
import type { DerivedAiStatus, QuizAttemptAdminItem, QuizAttemptAdminListParams } from '@/types';

const PAGE_SIZE = 20;

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase();
}

const AI_STATUS_LABEL: Record<DerivedAiStatus, string> = {
  pending: 'Chờ chấm',
  ai_graded: 'AI đã gợi ý — chờ duyệt',
  finalized: 'Đã hoàn tất',
};

function csvEscape(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function exportToCsv(items: QuizAttemptAdminItem[]) {
  const header = [
    'Học viên',
    'Email',
    'Khóa học',
    'Bài kiểm tra',
    'Trạng thái',
    'Điểm tổng',
    'Điểm tự luận (manual)',
    'Điểm trắc nghiệm (auto)',
    'Nộp lúc',
    'Chấm xong lúc',
  ];
  const rows = items.map((a) => [
    a.enrollment.user.fullName,
    a.enrollment.user.email,
    a.enrollment.course.title,
    a.quiz.title,
    AI_STATUS_LABEL[a.derivedAiStatus],
    a.totalScore ?? '',
    a.manualScore ?? '',
    a.objectiveScore ?? '',
    a.submittedAt ?? '',
    a.gradedAt ?? '',
  ]);
  const csv = [header, ...rows].map((r) => r.map(csvEscape).join(',')).join('\r\n');
  // UTF-8 BOM for Excel compatibility
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `grading-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function GradingEvaluationPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [aiStatus, setAiStatus] = useState<'all' | DerivedAiStatus>('all');
  const [courseId, setCourseId] = useState<string>('');
  const [sortBy, setSortBy] =
    useState<NonNullable<QuizAttemptAdminListParams['sortBy']>>('submittedAt');
  const [sortOrder, setSortOrder] =
    useState<NonNullable<QuizAttemptAdminListParams['sortOrder']>>('desc');
  const [page, setPage] = useState(1);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState<{
    total: number;
    done: number;
    failed: number;
  } | null>(null);

  // Debounce search
  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const listParams: QuizAttemptAdminListParams = useMemo(
    () => ({
      aiStatus,
      courseId: courseId || undefined,
      search: search || undefined,
      sortBy,
      sortOrder,
      page,
      limit: PAGE_SIZE,
    }),
    [aiStatus, courseId, search, sortBy, sortOrder, page],
  );

  const { data, isLoading, isFetching, isError, refetch } = useAllQuizAttempts(listParams);
  const aiGradeQuiz = useAiGradeQuiz();

  // Separate totals query that always reflects the unfiltered pending count for the KPI card
  const { data: pendingTotals } = useAllQuizAttempts({ aiStatus: 'pending', limit: 1 });
  const { data: finalizedTotals } = useAllQuizAttempts({ aiStatus: 'finalized', limit: 1 });
  const { data: allTotals } = useAllQuizAttempts({ limit: 1 });

  const pendingCount = pendingTotals?.pagination.total ?? 0;
  const finalizedCount = finalizedTotals?.pagination.total ?? 0;
  const totalCount = allTotals?.pagination.total ?? 0;

  // Course dropdown — load once
  const { data: coursesPaginated } = useCourses({ page: 1, limit: 100 });
  const courseOptions = coursesPaginated?.data ?? [];

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const showToast = (message: string) => toast.success(message);

  const resetFilters = () => {
    setSearchInput('');
    setSearch('');
    setAiStatus('all');
    setCourseId('');
    setSortBy('submittedAt');
    setSortOrder('desc');
    setPage(1);
  };

  const handleBatchAiGrade = async () => {
    const pendingAttempts = items.filter(
      (a) => a.derivedAiStatus === 'pending' && a.essayQuestionCount > 0,
    );
    if (pendingAttempts.length === 0) {
      showToast('Không có bài tự luận nào đang chờ AI chấm ở trang hiện tại.');
      return;
    }
    setBatchProgress({ total: pendingAttempts.length, done: 0, failed: 0 });
    let done = 0;
    let failed = 0;
    for (const attempt of pendingAttempts) {
      try {
        await aiGradeQuiz.mutateAsync(attempt.id);
        done += 1;
      } catch {
        failed += 1;
      }
      setBatchProgress({ total: pendingAttempts.length, done: done + failed, failed });
    }
    setBatchProgress(null);
    await refetch();
    showToast(
      failed === 0
        ? `AI đã chấm xong ${done}/${pendingAttempts.length} bài.`
        : `AI chấm xong ${done}, thất bại ${failed} bài (xem log BE).`,
    );
  };

  const toggleSort = (column: NonNullable<QuizAttemptAdminListParams['sortBy']>) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const showEmpty = !isLoading && !isError && items.length === 0;

  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="m-0 text-[22px] font-normal text-[#202124]">
              Chấm bài tự luận & Đánh giá
            </h1>
            <p className="mt-1 text-[13px] text-[#5F6368]">
              Quản lý bài nộp của học viên, chấm điểm tự luận với sự hỗ trợ của AI.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCsv(items)}
              disabled={items.length === 0}
              className="flex items-center gap-2 rounded border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#202124] transition-all hover:bg-[#F8F9FA] disabled:cursor-not-allowed disabled:opacity-50"
              title="Xuất danh sách trang hiện tại ra CSV"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Xuất CSV
            </button>
            <button
              onClick={handleBatchAiGrade}
              disabled={aiGradeQuiz.isPending || batchProgress !== null}
              className="flex items-center gap-2 rounded border border-[#E8D3FD] bg-[#F3E8FD] px-4 py-2 text-[13px] font-medium text-[#9334E6] transition-all hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {batchProgress ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    progress_activity
                  </span>
                  AI đang chấm {batchProgress.done}/{batchProgress.total}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  Chấm AI trang hiện tại
                </>
              )}
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            icon="pending_actions"
            iconBg="bg-[#FEF7E0]"
            iconColor="text-[#B06000]"
            label="Bài nộp chờ chấm"
            value={pendingCount}
            loading={isLoading && !pendingTotals}
          />
          <KpiCard
            icon="rule"
            iconBg="bg-[#E8F0FE]"
            iconColor="text-[#1A73E8]"
            label="Đã chấm xong"
            value={finalizedCount}
            loading={isLoading && !finalizedTotals}
          />
          <KpiCard
            icon="robot_2"
            iconBg="bg-[#F3E8FD]"
            iconColor="text-[#9334E6]"
            label="Tổng bài nộp"
            value={totalCount}
            loading={isLoading && !allTotals}
            accent
          />
        </div>

        {/* TOOLBAR */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
            <span className="material-symbols-outlined text-[20px] text-[#5F6368]">search</span>
            <input
              type="text"
              className="flex-1 border-none bg-transparent text-[13px] outline-none placeholder:text-[#5F6368]"
              placeholder="Tìm theo tên hoặc email học viên..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="text-[#5F6368] hover:text-[#202124]"
                aria-label="Xoá tìm kiếm"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <select
            className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none"
            value={aiStatus}
            onChange={(e) => {
              setAiStatus(e.target.value as typeof aiStatus);
              setPage(1);
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ chấm</option>
            <option value="ai_graded">AI đã gợi ý</option>
            <option value="finalized">Đã hoàn tất</option>
          </select>
          <select
            className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none"
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả khóa học</option>
            {courseOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          {(search || aiStatus !== 'all' || courseId) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[13px] font-medium text-[#1A73E8] hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
              Xoá bộ lọc
            </button>
          )}
          {isFetching && !isLoading && (
            <span className="flex items-center gap-1 text-[12px] text-[#5F6368]">
              <span className="material-symbols-outlined animate-spin text-[16px]">
                progress_activity
              </span>
              Đang cập nhật...
            </span>
          )}
        </div>

        {/* ERROR */}
        {isError && !isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-[#D93025]">
            <span className="material-symbols-outlined text-[40px]">error</span>
            <p className="text-[14px]">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
            <button
              onClick={() => refetch()}
              className="mt-2 rounded border border-[#D93025] bg-white px-3 py-1 text-[12px] font-medium text-[#D93025] hover:bg-[#FCE8E6]"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* TABLE */}
        {!isError && (
          <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
            <table className="w-full border-collapse">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Học viên
                  </th>
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Bài kiểm tra / Khóa học
                  </th>
                  <SortableTh
                    label="Ngày nộp"
                    active={sortBy === 'submittedAt'}
                    order={sortOrder}
                    onClick={() => toggleSort('submittedAt')}
                  />
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                    Trạng thái
                  </th>
                  <SortableTh
                    label="Điểm"
                    active={sortBy === 'totalScore'}
                    order={sortOrder}
                    onClick={() => toggleSort('totalScore')}
                  />
                  <th className="border-b border-[#DADCE0] px-4 py-3 text-right text-[13px] font-medium text-[#5F6368]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={`sk-${i}`} />)}
                {showEmpty && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-[#5F6368]">
                        <span className="material-symbols-outlined text-[48px] text-[#DADCE0]">
                          task_alt
                        </span>
                        <p className="text-[14px] font-medium text-[#202124]">
                          Không có bài nộp nào khớp bộ lọc.
                        </p>
                        <p className="text-[12px]">Thử xoá bộ lọc hoặc chọn trạng thái khác.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  items.map((attempt) => (
                    <AttemptRow
                      key={attempt.id}
                      attempt={attempt}
                      onOpen={() => setActiveAttemptId(attempt.id)}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!isError && pagination && pagination.total > 0 && (
          <div className="mt-4 flex items-center justify-between text-[12px] text-[#5F6368]">
            <span>
              Hiển thị {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)} trên{' '}
              {pagination.total}
            </span>
            <div className="flex items-center gap-1">
              <PaginationButton
                disabled={page <= 1}
                onClick={() => setPage(1)}
                label="first_page"
              />
              <PaginationButton
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                label="chevron_left"
              />
              <span className="px-2 text-[13px] text-[#202124]">
                {page}/{totalPages}
              </span>
              <PaginationButton
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                label="chevron_right"
              />
              <PaginationButton
                disabled={page >= totalPages}
                onClick={() => setPage(totalPages)}
                label="last_page"
              />
            </div>
          </div>
        )}
      </div>

      {activeAttemptId && (
        <GradingWorkspace
          attemptId={activeAttemptId}
          onClose={() => setActiveAttemptId(null)}
          onGraded={() => refetch()}
        />
      )}
    </>
  );
}

// ============================================================
// Subcomponents
// ============================================================

function KpiCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  loading,
  accent,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  loading: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 items-center gap-4 rounded-lg border p-4 px-5 ${
        accent
          ? 'border-[#E8D3FD] bg-gradient-to-r from-white to-[#F3E8FD]'
          : 'border-[#DADCE0] bg-white'
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
      >
        <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
          {icon}
        </span>
      </div>
      <div>
        <h4
          className={`mb-1 text-[24px] leading-none font-normal ${
            accent ? 'text-[#9334E6]' : 'text-[#202124]'
          }`}
        >
          {loading ? '-' : value}
        </h4>
        <p
          className={`m-0 text-[12px] font-medium uppercase ${
            accent ? 'text-[#9334E6]' : 'text-[#5F6368]'
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function SortableTh({
  label,
  active,
  order,
  onClick,
}: {
  label: string;
  active: boolean;
  order: 'asc' | 'desc';
  onClick: () => void;
}) {
  return (
    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1 ${active ? 'text-[#1A73E8]' : ''}`}
      >
        {label}
        {active && (
          <span className="material-symbols-outlined text-[16px]">
            {order === 'asc' ? 'arrow_upward' : 'arrow_downward'}
          </span>
        )}
      </button>
    </th>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[#F1F3F4]">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 w-full animate-pulse rounded bg-[#F1F3F4]" />
        </td>
      ))}
    </tr>
  );
}

function PaginationButton({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded border border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F8F9FA] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="material-symbols-outlined text-[18px]">{label}</span>
    </button>
  );
}

function StatusBadge({ status }: { status: DerivedAiStatus }) {
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF3E0] px-2 py-1 text-[11px] font-medium text-[#E65100]">
        <span className="material-symbols-outlined text-[12px]">schedule</span>
        Chờ chấm
      </span>
    );
  }
  if (status === 'ai_graded') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FD] px-2 py-1 text-[11px] font-medium text-[#9334E6]">
        <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
        AI đã gợi ý
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EA] px-2 py-1 text-[11px] font-medium text-[#137333]">
      <span className="material-symbols-outlined text-[12px]">done_all</span>
      Đã hoàn tất
    </span>
  );
}

function ScoreCell({ attempt }: { attempt: QuizAttemptAdminItem }) {
  const pass = attempt.quiz.passScorePercent;
  if (attempt.totalScore !== null) {
    const isPassed = attempt.isPassed;
    return (
      <div className="flex flex-col">
        <span className={`font-medium ${isPassed ? 'text-[#137333]' : 'text-[#D93025]'}`}>
          {Number(attempt.totalScore).toFixed(1)}
          <span className="ml-1 text-[11px] font-normal text-[#5F6368]">/ 100</span>
        </span>
        <span className="text-[11px] text-[#5F6368]">Đạt ≥ {pass}</span>
      </div>
    );
  }
  if (attempt.objectiveScore !== null) {
    return (
      <div className="flex flex-col">
        <span className="flex items-center gap-1 font-medium text-[#1A73E8]">
          <span className="material-symbols-outlined text-[16px]">rule</span>
          {Number(attempt.objectiveScore).toFixed(1)}
          <span className="ml-1 text-[11px] font-normal text-[#5F6368]">trắc nghiệm</span>
        </span>
        {attempt.essayQuestionCount > 0 && (
          <span className="text-[11px] text-[#E65100]">
            Còn {attempt.essayQuestionCount} câu tự luận
          </span>
        )}
      </div>
    );
  }
  return <span className="text-[#5F6368]">-</span>;
}

function AttemptRow({ attempt, onOpen }: { attempt: QuizAttemptAdminItem; onOpen: () => void }) {
  const isFinalized = attempt.derivedAiStatus === 'finalized';
  return (
    <tr className="border-b border-[#F1F3F4] hover:bg-[#F8F9FA]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F0FE] text-[13px] font-medium text-[#1A73E8] uppercase">
            {getInitials(attempt.enrollment.user.fullName)}
          </div>
          <div>
            <p className="m-0 text-[13px] font-medium text-[#202124]">
              {attempt.enrollment.user.fullName}
            </p>
            <span className="text-[11px] text-[#5F6368]">{attempt.enrollment.user.email}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onOpen}
          className="text-left text-[13px] font-medium text-[#1A73E8] hover:underline"
        >
          {attempt.quiz.title}
        </button>
        <div className="mt-0.5 text-[11px] text-[#5F6368]">
          Khóa: {attempt.enrollment.course.title}
        </div>
        {attempt.essayQuestionCount > 0 && (
          <div className="mt-1 flex items-center gap-2 text-[11px] text-[#5F6368]">
            <span className="inline-flex items-center gap-1 rounded bg-[#F1F3F4] px-1.5 py-0.5">
              <span className="material-symbols-outlined text-[12px]">edit_note</span>
              {attempt.essayQuestionCount} câu tự luận
            </span>
            {attempt.aiGradedEssayCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[#9334E6]">
                <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                {attempt.aiGradedEssayCount} đã có AI
              </span>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-[13px] text-[#202124]">
        {formatRelativeDate(attempt.submittedAt)}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={attempt.derivedAiStatus} />
      </td>
      <td className="px-4 py-3">
        <ScoreCell attempt={attempt} />
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={onOpen}
          className={`inline-flex items-center justify-center gap-2 rounded-[4px] px-4 py-2 text-[13px] font-medium transition-colors ${
            isFinalized
              ? 'border border-[#DADCE0] bg-transparent text-[#5F6368] hover:bg-[#F1F3F4]'
              : 'bg-[#1A73E8] text-white hover:bg-[#174EA6]'
          }`}
        >
          {isFinalized ? 'Xem lại' : 'Chấm bài'}
        </button>
      </td>
    </tr>
  );
}
