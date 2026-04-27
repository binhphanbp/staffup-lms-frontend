'use client';

import { useMemo } from 'react';
import type { RiskAssessmentListItem, RiskLevel } from '@/services/risk.service';

interface RiskHeatmapProps {
  assessments: RiskAssessmentListItem[];
  onCellClick?: (courseId: string, riskLevel: RiskLevel) => void;
  maxCourses?: number;
}

interface CourseRow {
  courseId: string;
  title: string;
  counts: Record<RiskLevel, number>;
  total: number;
  highRisk: number;
}

const LEVELS: RiskLevel[] = ['low', 'medium', 'high'];
const LEVEL_LABEL: Record<RiskLevel, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
};

// Tailwind class families per level; intensity is chosen by density bucket.
function cellClass(level: RiskLevel, count: number, max: number): string {
  if (count === 0) return 'bg-slate-50 text-slate-400';
  const ratio = max > 0 ? count / max : 0;
  if (level === 'high') {
    if (ratio >= 0.66) return 'bg-red-500 text-white';
    if (ratio >= 0.33) return 'bg-red-300 text-red-900';
    return 'bg-red-100 text-red-700';
  }
  if (level === 'medium') {
    if (ratio >= 0.66) return 'bg-amber-500 text-white';
    if (ratio >= 0.33) return 'bg-amber-300 text-amber-900';
    return 'bg-amber-100 text-amber-700';
  }
  if (ratio >= 0.66) return 'bg-emerald-500 text-white';
  if (ratio >= 0.33) return 'bg-emerald-300 text-emerald-900';
  return 'bg-emerald-100 text-emerald-700';
}

export function RiskHeatmap({ assessments, onCellClick, maxCourses = 10 }: RiskHeatmapProps) {
  const rows = useMemo<CourseRow[]>(() => {
    const byCourse = new Map<string, CourseRow>();
    for (const a of assessments) {
      const id = a.enrollment.course.id;
      let row = byCourse.get(id);
      if (!row) {
        row = {
          courseId: id,
          title: a.enrollment.course.title,
          counts: { low: 0, medium: 0, high: 0 },
          total: 0,
          highRisk: 0,
        };
        byCourse.set(id, row);
      }
      row.counts[a.riskLevel] += 1;
      row.total += 1;
      if (a.riskLevel === 'high') row.highRisk += 1;
    }
    return Array.from(byCourse.values())
      .sort((a, b) => b.highRisk - a.highRisk || b.total - a.total)
      .slice(0, maxCourses);
  }, [assessments, maxCourses]);

  const maxCount = useMemo(() => {
    let m = 0;
    for (const r of rows) {
      for (const l of LEVELS) {
        if (r.counts[l] > m) m = r.counts[l];
      }
    }
    return m;
  }, [rows]);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#DADCE0] bg-[#F8F9FA] p-8 text-center text-sm text-[#5F6368]">
        Chưa có dữ liệu rủi ro. Nhấn &quot;Tính toán hàng loạt&quot; để khởi tạo điểm rủi ro cho các
        enrollment hiện có.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E8EAED] bg-white">
      <div className="border-b border-[#E8EAED] px-5 py-4">
        <h2 className="text-[15px] font-semibold text-[#202124]">
          Heatmap rủi ro theo khóa học (top {rows.length})
        </h2>
        <p className="mt-1 text-[12px] text-[#5F6368]">
          Click vào một ô để lọc danh sách bên dưới theo khóa học và mức rủi ro.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F8F9FA] text-[11px] font-medium tracking-wide text-[#5F6368] uppercase">
              <th className="px-4 py-3 text-left">Khóa học</th>
              {LEVELS.map((l) => (
                <th key={l} className="px-4 py-3 text-center">
                  {LEVEL_LABEL[l]}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.courseId} className="border-t border-[#F1F3F4]">
                <td className="max-w-[240px] truncate px-4 py-3 text-[13px] font-medium text-[#202124]">
                  {row.title}
                </td>
                {LEVELS.map((lvl) => {
                  const count = row.counts[lvl];
                  const clickable = count > 0 && !!onCellClick;
                  return (
                    <td key={lvl} className="px-1 py-1 text-center align-middle">
                      <button
                        type="button"
                        onClick={clickable ? () => onCellClick!(row.courseId, lvl) : undefined}
                        disabled={!clickable}
                        className={`h-10 min-w-[64px] rounded-md text-[13px] font-semibold transition-all ${cellClass(
                          lvl,
                          count,
                          maxCount,
                        )} ${clickable ? 'cursor-pointer hover:ring-2 hover:ring-[#1A73E8]/40' : 'cursor-default'}`}
                        title={`${count} học viên ở mức ${LEVEL_LABEL[lvl].toLowerCase()}`}
                      >
                        {count}
                      </button>
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-right text-[13px] font-semibold text-[#202124]">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
