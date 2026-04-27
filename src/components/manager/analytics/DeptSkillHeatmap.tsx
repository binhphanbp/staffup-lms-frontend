'use client';

import Link from 'next/link';
import { Layers } from 'lucide-react';
import type { SkillDistribution } from '@/services/department-analytics.service';

interface DeptSkillHeatmapProps {
  skills: SkillDistribution[];
}

const gapTone = (gap: number): { bg: string; text: string; label: string } => {
  if (gap >= 50) {
    return {
      bg: 'bg-rose-200 dark:bg-rose-900/50',
      text: 'text-rose-900 dark:text-rose-100',
      label: 'Khoảng trống lớn',
    };
  }
  if (gap >= 25) {
    return {
      bg: 'bg-amber-200 dark:bg-amber-900/50',
      text: 'text-amber-900 dark:text-amber-100',
      label: 'Cần cải thiện',
    };
  }
  if (gap > 5) {
    return {
      bg: 'bg-yellow-100 dark:bg-yellow-900/40',
      text: 'text-yellow-900 dark:text-yellow-100',
      label: 'Sát yêu cầu',
    };
  }
  return {
    bg: 'bg-emerald-200 dark:bg-emerald-900/50',
    text: 'text-emerald-900 dark:text-emerald-100',
    label: 'Đạt yêu cầu',
  };
};

export function DeptSkillHeatmap({ skills }: DeptSkillHeatmapProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E8EAED] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h3 className="flex items-center gap-2 text-base font-semibold text-[#202124] dark:text-white">
          <Layers className="h-4 w-4 text-violet-500" />
          Khoảng trống kỹ năng
        </h3>
        <Link
          href="/manager/skill-gap"
          className="text-xs font-medium text-[#1A73E8] hover:underline dark:text-sky-300"
        >
          Xem chi tiết →
        </Link>
      </header>
      {skills.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-[#5F6368] dark:text-slate-400">
          Chưa có dữ liệu kỹ năng cho phòng ban này. Cần thiết lập kỹ năng yêu cầu cho vị trí công
          việc và đánh giá năng lực học viên.
        </div>
      ) : (
        <div className="grid gap-2 p-5 sm:grid-cols-2">
          {skills.map((skill) => {
            const tone = gapTone(skill.gapPercent);
            return (
              <Link
                key={skill.skillId}
                href={`/manager/skill-gap?skill=${skill.skillId}`}
                className={`group flex flex-col gap-2 rounded-xl border border-transparent p-3 transition hover:border-slate-300 hover:shadow-sm dark:hover:border-slate-700 ${tone.bg}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className={`truncate text-sm font-semibold ${tone.text}`}>
                      {skill.skillName}
                    </div>
                    {skill.category && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-300/80">
                        {skill.category}
                      </div>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold dark:bg-black/30 ${tone.text}`}
                  >
                    Gap {skill.gapPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-200/90">
                  <span>
                    Hiện tại:{' '}
                    <span className="font-semibold">{skill.averageCurrentLevel.toFixed(1)}</span> /{' '}
                    Mục tiêu:{' '}
                    <span className="font-semibold">{skill.averageTargetLevel.toFixed(1)}</span>
                  </span>
                  <span>{skill.learnersCovered} học viên</span>
                </div>
                <div className={`text-[10px] font-semibold tracking-wide uppercase ${tone.text}`}>
                  {tone.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
