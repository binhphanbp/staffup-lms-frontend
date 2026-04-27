'use client';

import { useMemo, useState } from 'react';
import { BarChart3, Download, RefreshCw } from 'lucide-react';
import { useDepartmentAnalytics } from '@/hooks/useDepartmentAnalytics';
import type { AnalyticsRange } from '@/services/department-analytics.service';
import { DeptSummaryStats } from '@/components/manager/analytics/DeptSummaryStats';
import { DeptTrendLineChart } from '@/components/manager/analytics/DeptTrendLineChart';
import { DeptPerformerLists } from '@/components/manager/analytics/DeptPerformerLists';
import { DeptCourseDistribution } from '@/components/manager/analytics/DeptCourseDistribution';
import { DeptSkillHeatmap } from '@/components/manager/analytics/DeptSkillHeatmap';

const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
  { value: 7, label: '7 ngày' },
  { value: 30, label: '30 ngày' },
  { value: 60, label: '60 ngày' },
  { value: 90, label: '90 ngày' },
];

function exportCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((cell) => {
          const s = String(cell ?? '');
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(','),
    )
    .join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800 ${className}`} />
  );
}

export default function DepartmentAnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>(30);
  const { data, isLoading, isFetching, refetch } = useDepartmentAnalytics(range);

  const generatedAtLabel = useMemo(() => {
    if (!data) return null;
    return new Date(data.generatedAt).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, [data]);

  const handleExportCsv = () => {
    if (!data) return;
    const rows: (string | number)[][] = [
      ['Phòng ban', data.department.name],
      ['Tạo lúc', new Date(data.generatedAt).toISOString()],
      ['Khoảng thời gian (ngày)', data.rangeDays],
      [],
      ['== TÓM TẮT =='],
      ['Tổng học viên', data.summary.totalLearners],
      ['Hoạt động 7 ngày', data.summary.activeLast7Days],
      ['Hoạt động 30 ngày', data.summary.activeLast30Days],
      ['Tiến độ TB (%)', data.summary.averageProgressPercent],
      ['Tỉ lệ hoàn thành (%)', data.summary.completionRate],
      ['Tỉ lệ rủi ro (%)', data.summary.atRiskRate],
      ['So với công ty: tiến độ TB delta (pp)', data.summary.benchmark.deltaAverageProgressPercent],
      ['So với công ty: hoàn thành delta (pp)', data.summary.benchmark.deltaCompletionRate],
      ['So với công ty: rủi ro delta (pp)', data.summary.benchmark.deltaAtRiskRate],
      [],
      ['== TOP HỌC VIÊN =='],
      ['Họ tên', 'Email', 'Vị trí', 'Tiến độ TB (%)', 'Khóa hoàn thành', 'XP'],
      ...data.topPerformers.map((p) => [
        p.fullName,
        p.email,
        p.positionTitle ?? '',
        p.totalProgressPercent,
        p.completedCount,
        p.totalXp,
      ]),
      [],
      ['== HỌC VIÊN CẦN HỖ TRỢ =='],
      ['Họ tên', 'Email', 'Vị trí', 'Tiến độ TB (%)', 'Số ngày không hoạt động'],
      ...data.bottomPerformers.map((p) => [
        p.fullName,
        p.email,
        p.positionTitle ?? '',
        p.totalProgressPercent,
        p.daysSinceLastActivity ?? 'n/a',
      ]),
      [],
      ['== PHÂN BỔ KHÓA HỌC =='],
      ['Tên khóa', 'Tổng đăng ký', 'Hoàn thành', 'Đang học', 'Chưa bắt đầu', 'Tiến độ TB (%)'],
      ...data.courseDistribution.map((c) => [
        c.title,
        c.totalEnrollments,
        c.completed,
        c.inProgress,
        c.notStarted,
        c.averageProgressPercent,
      ]),
      [],
      ['== KHOẢNG TRỐNG KỸ NĂNG =='],
      ['Kỹ năng', 'Lĩnh vực', 'Hiện tại TB', 'Mục tiêu TB', 'Gap (%)', 'Học viên đã có dữ liệu'],
      ...data.skillDistribution.map((s) => [
        s.skillName,
        s.category ?? '',
        s.averageCurrentLevel,
        s.averageTargetLevel,
        s.gapPercent,
        s.learnersCovered,
      ]),
    ];
    const stamp = new Date().toISOString().slice(0, 10);
    exportCsv(`department-analytics-${data.department.name}-${stamp}.csv`, rows);
  };

  return (
    <div className="custom-scrollbar min-h-full bg-[#F8F9FA] px-4 py-4 md:px-8 md:py-6 dark:bg-slate-950">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DADCE0] bg-white px-3 py-1 text-xs font-semibold text-[#1A73E8] dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300">
            <BarChart3 className="h-3.5 w-3.5" />
            Phân tích phòng ban
          </div>
          <h1 className="text-2xl font-semibold text-[#202124] dark:text-white">
            {data?.department.name ?? 'Đang tải...'}
          </h1>
          <p className="mt-1 text-sm text-[#5F6368] dark:text-slate-400">
            Xu hướng đào tạo {data?.rangeDays ?? range} ngày · So với benchmark toàn công ty
            {generatedAtLabel ? ` · Cập nhật ${generatedAtLabel}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-[#DADCE0] bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-900">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRange(opt.value)}
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  range === opt.value
                    ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-blue-950/40 dark:text-sky-300'
                    : 'text-[#5F6368] hover:bg-[#F1F3F4] dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-[#DADCE0] bg-white px-3 py-2 text-sm font-medium text-[#1A73E8] hover:bg-[#F1F3F4] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300 dark:hover:bg-slate-800"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={handleExportCsv}
            disabled={!data}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A73E8] px-3 py-2 text-sm font-semibold text-white hover:bg-[#174EA6] disabled:opacity-60"
            title="Xuất dữ liệu CSV"
          >
            <Download className="h-4 w-4" />
            Xuất CSV
          </button>
        </div>
      </div>

      {/* Body */}
      {isLoading || !data ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
          </div>
          <SkeletonBlock className="h-[340px]" />
          <div className="grid gap-4 lg:grid-cols-2">
            <SkeletonBlock className="h-[280px]" />
            <SkeletonBlock className="h-[280px]" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <DeptSummaryStats summary={data.summary} />

          <DeptTrendLineChart
            enrollments={data.trends.enrollmentsByDay}
            completions={data.trends.completionsByDay}
            active={data.trends.activeLearnersByDay}
          />

          <DeptPerformerLists top={data.topPerformers} bottom={data.bottomPerformers} />

          <DeptCourseDistribution courses={data.courseDistribution} />

          <DeptSkillHeatmap skills={data.skillDistribution} />
        </div>
      )}
    </div>
  );
}
