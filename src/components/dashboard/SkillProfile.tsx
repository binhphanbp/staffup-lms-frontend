import React from 'react';

const MAX_LEVEL = 5;

const LEVEL_LABELS: Record<number, string> = {
  1: 'Intern',
  2: 'Junior',
  3: 'Mid',
  4: 'Senior',
  5: 'Expert',
};

interface Skill {
  name: string;
  icon: string;
  iconColor: string;
  barColor: string;
  level: number;
}

const SKILLS: Skill[] = [
  {
    name: 'AWS Services',
    icon: 'fa-brands fa-aws',
    iconColor: '#ff9900',
    barColor: '#ff9900',
    level: 3,
  },
  {
    name: 'Docker / K8s',
    icon: 'fa-brands fa-docker',
    iconColor: '#2496ed',
    barColor: '#2496ed',
    level: 4,
  },
  {
    name: 'Python / Scripting',
    icon: 'fa-brands fa-python',
    iconColor: '#3776ab',
    barColor: '#3776ab',
    level: 2,
  },
];

function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium">
        <span className="flex items-center gap-1.5 text-slate-700">
          <i className={`${skill.icon} text-sm`} style={{ color: skill.iconColor }} />
          {skill.name}
        </span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
          Lvl {skill.level} · {LEVEL_LABELS[skill.level]}
        </span>
      </div>
      <div className="flex h-2 gap-0.5">
        {Array.from({ length: MAX_LEVEL }).map((_, i) => {
          const filled = i < skill.level;
          const isFirst = i === 0;
          const isLast = i === MAX_LEVEL - 1;
          return (
            <div
              key={i}
              className={`flex-1 transition-all ${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`}
              style={{
                backgroundColor: filled ? skill.barColor : '#e2e8f0',
                opacity: filled ? 1 - i * 0.08 : 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export const SkillProfile = () => {
  return (
    <div className="card overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
        <h3 className="flex items-center gap-2 text-[13px] font-bold text-slate-800">
          <i className="fa-solid fa-chart-radar text-primary text-sm" />
          Hồ sơ Năng lực
        </h3>
        <a
          href="#"
          className="text-primary bg-primary-bg rounded px-2 py-1 text-[10px] font-semibold transition-colors hover:underline"
        >
          Chi tiết
        </a>
      </div>

      <div className="space-y-3.5 px-4 py-4">
        {SKILLS.map((skill) => (
          <SkillBar key={skill.name} skill={skill} />
        ))}
      </div>

      {/* Skill gap warning */}
      <div className="mx-4 mb-4 flex items-start gap-2.5 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-3">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100">
          <i className="fa-solid fa-triangle-exclamation text-[10px] text-orange-600" />
        </div>
        <div className="text-[11px] leading-relaxed text-orange-800">
          <span className="font-bold">Bảo mật hệ thống (Security)</span> đang ở mức 0. Đây là kỹ
          năng bắt buộc trong Quý này.{' '}
          <a
            href="/courses"
            className="font-bold underline underline-offset-2 hover:text-orange-900"
          >
            Học ngay →
          </a>
        </div>
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
