'use client';

import type { RiskAssessmentListItem, RiskLevel } from '@/services/risk.service';
import { RiskScoreGauge } from './RiskScoreGauge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

interface RiskLearnerTableProps {
  assessments: RiskAssessmentListItem[];
  isLoading: boolean;
  onView: (enrollmentId: string) => void;
  onRecalculate: (enrollmentId: string) => void;
  recalculatingIds: Set<string>;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total: number;
}

const LEVEL_BADGE: Record<RiskLevel, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const LEVEL_LABEL: Record<RiskLevel, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

export function RiskLearnerTable({
  assessments,
  isLoading,
  onView,
  onRecalculate,
  recalculatingIds,
  page,
  totalPages,
  onPageChange,
  total,
}: RiskLearnerTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E8EAED] bg-white">
      <div className="flex items-center justify-between border-b border-[#E8EAED] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[#202124]">Danh sách học viên rủi ro</h2>
          <p className="mt-1 text-[12px] text-[#5F6368]">
            {total > 0
              ? `Hiển thị ${assessments.length} trong tổng ${total} assessment`
              : 'Chưa có assessment nào khớp bộ lọc'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] text-[11px] font-medium tracking-wide text-[#5F6368] uppercase">
              <th className="px-4 py-3 text-left">Học viên</th>
              <th className="px-4 py-3 text-left">Khóa học</th>
              <th className="px-4 py-3 text-center">Điểm rủi ro</th>
              <th className="px-4 py-3 text-center">Mức</th>
              <th className="px-4 py-3 text-left">Cập nhật</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && assessments.length === 0 && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-[#F1F3F4]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-2 w-40" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-3 w-36" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Skeleton className="mx-auto h-10 w-10 rounded-full" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Skeleton className="mx-auto h-5 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-3 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="ml-auto h-8 w-20" />
                    </td>
                  </tr>
                ))}
              </>
            )}

            {!isLoading && assessments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10">
                  <EmptyState
                    icon={
                      <span className="material-symbols-outlined text-[28px]">filter_alt_off</span>
                    }
                    title="Không có assessment nào khớp bộ lọc"
                    description="Thử bỏ bớt bộ lọc để xem nhiều học viên hơn."
                    variant="compact"
                  />
                </td>
              </tr>
            )}

            {assessments.map((a) => {
              const enrollmentId = a.enrollment.id;
              const isRecalculating = recalculatingIds.has(enrollmentId);
              return (
                <tr
                  key={a.id}
                  className="border-t border-[#F1F3F4] transition-colors hover:bg-[#F8F9FA]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#1A73E8] text-[13px] font-semibold text-white">
                        {getInitial(a.enrollment.user.fullName)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-[#202124]">
                          {a.enrollment.user.fullName}
                        </div>
                        <div className="truncate text-[12px] text-[#5F6368]">
                          {a.enrollment.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[240px] px-4 py-3">
                    <div className="truncate text-[13px] text-[#202124]">
                      {a.enrollment.course.title}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <RiskScoreGauge score={a.riskScore} level={a.riskLevel} size="md" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${LEVEL_BADGE[a.riskLevel]}`}
                    >
                      {LEVEL_LABEL[a.riskLevel]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#5F6368]">
                    {formatDate(a.calculatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onView(enrollmentId)}
                        className="inline-flex items-center gap-1 rounded-md border border-[#DADCE0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#1A73E8] transition-colors hover:bg-[#E8F0FE]"
                      >
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                        Chi tiết
                      </button>
                      <button
                        type="button"
                        onClick={() => onRecalculate(enrollmentId)}
                        disabled={isRecalculating}
                        className="inline-flex items-center gap-1 rounded-md border border-[#DADCE0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span
                          className={`material-symbols-outlined text-[15px] ${isRecalculating ? 'animate-spin' : ''}`}
                        >
                          {isRecalculating ? 'progress_activity' : 'refresh'}
                        </span>
                        Tính lại
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#E8EAED] px-5 py-3 text-[13px]">
          <div className="text-[#5F6368]">
            Trang {page} / {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-md border border-[#DADCE0] bg-white px-3 py-1.5 text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="rounded-md border border-[#DADCE0] bg-white px-3 py-1.5 text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
