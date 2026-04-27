import React from 'react';
import Link from 'next/link';
import { useMyProfile } from '@/hooks/useSkillGap';
import type { UserSkillEntry } from '@/types/skill-gap';

const MAX_LEVEL = 5;

const LEVEL_LABELS: Record<number, string> = {
  1: 'Intern',
  2: 'Junior',
  3: 'Mid',
  4: 'Senior',
  5: 'Expert',
};

const BAR_COLOR = '#6366f1';

function SkillBar({ entry }: { entry: UserSkillEntry }) {
  const level = entry.currentLevel;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium">
        <span className="truncate text-slate-700">{entry.skill.name}</span>
        <span className="ml-2 shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
          Lvl {level} · {LEVEL_LABELS[level] ?? level}
        </span>
      </div>
      <div className="flex h-2 gap-0.5">
        {Array.from({ length: MAX_LEVEL }).map((_, i) => {
          const filled = i < level;
          return (
            <div
              key={i}
              className={`flex-1 transition-all ${i === 0 ? 'rounded-l-full' : ''} ${i === MAX_LEVEL - 1 ? 'rounded-r-full' : ''}`}
              style={{
                backgroundColor: filled ? BAR_COLOR : '#e2e8f0',
                opacity: filled ? 1 - i * 0.06 : 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export const SkillProfile = () => {
  const { data, isLoading } = useMyProfile();
  const skills = data?.skills ?? [];

  if (isLoading) {
    return (
      <div className="card p-4">
        <div className="mb-3 h-4 w-32 animate-pulse rounded bg-slate-100" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="mb-1.5 h-3 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-2 w-full animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (skills.length === 0) return null;

  return (
    <div className="card overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
        <h3 className="flex items-center gap-2 text-[13px] font-bold text-slate-800">
          <i className="fa-solid fa-chart-bar text-primary text-sm" />
          Hồ sơ Năng lực
        </h3>
        <Link
          href="/skill-profile"
          className="text-primary bg-primary-bg rounded px-2 py-1 text-[10px] font-semibold transition-colors hover:underline"
        >
          Chi tiết
        </Link>
      </div>

      <div className="space-y-3.5 px-4 py-4">
        {skills.slice(0, 5).map((entry) => (
          <SkillBar key={entry.skillId} entry={entry} />
        ))}
      </div>

      {/* Level legend */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
        {Object.entries(LEVEL_LABELS).map(([lvl, label]) => (
          <div key={lvl} className="text-center">
            <div className="font-mono text-[9px] font-bold text-slate-400">{lvl}</div>
            <div className="text-[9px] text-slate-400">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
