'use client';

import { useMemo, useState } from 'react';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { RiskHeatmap } from '@/components/admin/risk/RiskHeatmap';
import { RiskLearnerTable } from '@/components/admin/risk/RiskLearnerTable';
import { RiskDrillDownModal } from '@/components/admin/risk/RiskDrillDownModal';
import { useBatchCalculateRisk, useCalculateRisk, useRiskList } from '@/hooks/useRiskAssessments';
import type { RiskAssessmentListItem, RiskLevel } from '@/services/risk.service';
import { useAuthStore } from '@/store/useAuthStore';

const TABLE_PAGE_SIZE = 20;
const HEATMAP_FETCH_LIMIT = 500;

function downloadCsv(filename: string, rows: string[][]) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(escape).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function RiskAssessmentPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roleCodes?.includes('admin') ?? false;

  // Filters
  const [riskLevelFilter, setRiskLevelFilter] = useState<RiskLevel | ''>('');
  const [courseIdFilter, setCourseIdFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  // UI state
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessmentListItem | null>(null);
  const [recalculatingIds, setRecalculatingIds] = useState<Set<string>>(new Set());
  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    toast[type](message);

  // Heatmap: fetch a wide slice (latest-only) to build aggregations
  const heatmapQuery = useRiskList({
    latestOnly: true,
    limit: HEATMAP_FETCH_LIMIT,
    page: 1,
  });

  // Table: filtered + paginated (server-side)
  const tableQuery = useRiskList({
    latestOnly: true,
    riskLevel: riskLevelFilter || undefined,
    courseId: courseIdFilter || undefined,
    page,
    limit: TABLE_PAGE_SIZE,
  });

  const heatmapAssessments = heatmapQuery.data?.assessments ?? [];
  const tableAssessments = tableQuery.data?.assessments ?? [];
  const tablePagination = tableQuery.data?.pagination;

  // Stats from heatmap fetch (full picture, unfiltered)
  const stats = useMemo(() => {
    const result = { total: 0, high: 0, medium: 0, low: 0 };
    for (const a of heatmapAssessments) {
      result.total += 1;
      result[a.riskLevel] += 1;
    }
    return result;
  }, [heatmapAssessments]);

  // Unique courses list derived from heatmap slice (used for course select)
  const courseOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of heatmapAssessments) {
      if (!map.has(a.enrollment.course.id)) {
        map.set(a.enrollment.course.id, a.enrollment.course.title);
      }
    }
    return Array.from(map.entries())
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [heatmapAssessments]);

  // Mutations
  const recalcMutation = useCalculateRisk();
  const batchMutation = useBatchCalculateRisk();

  const handleRecalculate = async (enrollmentId: string) => {
    setRecalculatingIds((prev) => {
      const next = new Set(prev);
      next.add(enrollmentId);
      return next;
    });
    try {
      await recalcMutation.mutateAsync(enrollmentId);
      showToast('Đã tính toán lại điểm rủi ro');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tính toán lại';
      showToast(msg, 'error');
    } finally {
      setRecalculatingIds((prev) => {
        const next = new Set(prev);
        next.delete(enrollmentId);
        return next;
      });
    }
  };

  const handleBatch = async () => {
    try {
      const result = await batchMutation.mutateAsync();
      showToast(
        `Batch xong: ${result.processed} xử lý (${result.highRisk} cao • ${result.mediumRisk} TB • ${result.lowRisk} thấp • ${result.errors} lỗi)`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Batch thất bại';
      showToast(msg, 'error');
    }
  };

  const handleHeatmapCellClick = (courseId: string, lvl: RiskLevel) => {
    setCourseIdFilter(courseId);
    setRiskLevelFilter(lvl);
    setPage(1);
  };

  const handleExportCsv = () => {
    const all = heatmapAssessments;
    if (all.length === 0) {
      showToast('Không có dữ liệu để xuất', 'error');
      return;
    }
    const rows: string[][] = [
      [
        'Học viên',
        'Email',
        'Khóa học',
        'Enrollment ID',
        'Risk Score',
        'Risk Level',
        'Calculated At',
      ],
      ...all.map((a) => [
        a.enrollment.user.fullName,
        a.enrollment.user.email,
        a.enrollment.course.title,
        a.enrollment.id,
        String(a.riskScore),
        a.riskLevel,
        a.calculatedAt,
      ]),
    ];
    downloadCsv(`risk-assessments-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    showToast(`Đã xuất ${all.length} dòng ra CSV`);
  };

  const handleView = (enrollmentId: string) => {
    const found = tableAssessments.find((a) => a.enrollment.id === enrollmentId);
    if (found) setSelectedAssessment(found);
  };

  const handleRemind = (enrollmentId: string, learnerName: string) => {
    // Placeholder until a dedicated reminder endpoint is wired in.
    showToast(`Đã xếp nhắc nhở cho ${learnerName}`);
  };

  const clearFilters = () => {
    setRiskLevelFilter('');
    setCourseIdFilter('');
    setPage(1);
  };

  const isHeatmapLoading = heatmapQuery.isLoading;

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="m-0 text-[22px] font-normal text-[#202124]">
                Quản lý Rủi ro Học viên
              </h1>
              <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
                AI
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[#5F6368]">
              Theo dõi rủi ro bỏ học, drill-down tín hiệu, và triển khai can thiệp dựa trên AI.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất CSV
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={handleBatch}
                disabled={batchMutation.isPending}
                className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#174EA6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${batchMutation.isPending ? 'animate-spin' : ''}`}
                >
                  {batchMutation.isPending ? 'progress_activity' : 'bolt'}
                </span>
                {batchMutation.isPending ? 'Đang tính toán...' : 'Tính toán hàng loạt'}
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Tổng assessment"
            value={stats.total}
            icon="fact_check"
            accent="bg-[#E8F0FE] text-[#1A73E8]"
            loading={isHeatmapLoading}
          />
          <StatCard
            label="Rủi ro cao"
            value={stats.high}
            icon="priority_high"
            accent="bg-red-50 text-red-600"
            loading={isHeatmapLoading}
          />
          <StatCard
            label="Rủi ro trung bình"
            value={stats.medium}
            icon="warning"
            accent="bg-amber-50 text-amber-600"
            loading={isHeatmapLoading}
          />
          <StatCard
            label="Rủi ro thấp"
            value={stats.low}
            icon="check_circle"
            accent="bg-emerald-50 text-emerald-600"
            loading={isHeatmapLoading}
          />
        </div>

        {/* Heatmap */}
        <div className="mb-6">
          {isHeatmapLoading ? (
            <div className="h-64 animate-pulse rounded-xl border border-[#E8EAED] bg-white" />
          ) : (
            <RiskHeatmap assessments={heatmapAssessments} onCellClick={handleHeatmapCellClick} />
          )}
        </div>

        {/* Filter bar */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {(['', 'high', 'medium', 'low'] as const).map((lvl) => (
            <button
              key={lvl || 'all'}
              type="button"
              onClick={() => {
                setRiskLevelFilter(lvl);
                setPage(1);
              }}
              className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                riskLevelFilter === lvl
                  ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]'
                  : 'border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4]'
              }`}
            >
              {lvl === '' ? 'Tất cả' : lvl === 'high' ? 'Cao' : lvl === 'medium' ? 'TB' : 'Thấp'}
            </button>
          ))}
          <div className="flex items-center gap-2 rounded-md border border-[#DADCE0] bg-white px-3 py-1">
            <span className="material-symbols-outlined text-[16px] text-[#5F6368]">menu_book</span>
            <select
              value={courseIdFilter}
              onChange={(e) => {
                setCourseIdFilter(e.target.value);
                setPage(1);
              }}
              className="border-none bg-transparent text-[12px] text-[#202124] outline-none"
            >
              <option value="">Tất cả khóa học</option>
              {courseOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          {(riskLevelFilter || courseIdFilter) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#DADCE0] px-3 py-1 text-[12px] text-[#5F6368] hover:bg-[#F1F3F4]"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              Xóa bộ lọc
            </button>
          )}
          <button
            type="button"
            onClick={() => router.refresh()}
            className="ml-auto inline-flex items-center gap-1 rounded-md border border-[#DADCE0] bg-white px-3 py-1 text-[12px] text-[#5F6368] hover:bg-[#F1F3F4]"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Làm mới
          </button>
        </div>

        {/* Table */}
        <RiskLearnerTable
          assessments={tableAssessments}
          isLoading={tableQuery.isLoading}
          onView={handleView}
          onRecalculate={handleRecalculate}
          recalculatingIds={recalculatingIds}
          page={page}
          totalPages={tablePagination?.totalPages ?? 1}
          onPageChange={setPage}
          total={tablePagination?.total ?? 0}
        />
      </div>

      {/* Drill-down modal */}
      <RiskDrillDownModal
        assessment={selectedAssessment}
        open={!!selectedAssessment}
        onClose={() => setSelectedAssessment(null)}
        onRecalculate={handleRecalculate}
        isRecalculating={
          !!selectedAssessment && recalculatingIds.has(selectedAssessment.enrollment.id)
        }
        onRemind={handleRemind}
      />
    </>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  accent: string;
  loading: boolean;
}

function StatCard({ label, value, icon, accent, loading }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#E8EAED] bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#5F6368]">{label}</span>
        <div className={`rounded-lg p-1.5 ${accent}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-16 animate-pulse rounded bg-[#E8EAED]" />
      ) : (
        <div className="text-[26px] font-semibold text-[#202124]">{value}</div>
      )}
    </div>
  );
}
