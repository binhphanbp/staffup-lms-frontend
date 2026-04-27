'use client';

interface RadarPoint {
  label: string;
  current: number;
  target: number;
}

interface SkillRadarChartProps {
  points: RadarPoint[];
  size?: number;
  maxValue?: number;
}

export function SkillRadarChart({ points, size = 360, maxValue = 5 }: SkillRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 60;
  const n = points.length;

  if (n < 3) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400"
        style={{ height: size }}
      >
        Cần ít nhất 3 kỹ năng để vẽ biểu đồ radar
      </div>
    );
  }

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (value: number, i: number) => {
    const r = (value / maxValue) * radius;
    return {
      x: cx + r * Math.cos(angle(i)),
      y: cy + r * Math.sin(angle(i)),
    };
  };

  const polygon = (values: number[]) =>
    values.map((v, i) => `${point(v, i).x},${point(v, i).y}`).join(' ');

  const grid: number[] = [];
  for (let v = 1; v <= maxValue; v += 1) grid.push(v);

  const labelPos = (i: number) => {
    const r = radius + 26;
    return {
      x: cx + r * Math.cos(angle(i)),
      y: cy + r * Math.sin(angle(i)),
    };
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Biểu đồ radar kỹ năng"
    >
      {grid.map((g) => (
        <polygon
          key={g}
          points={polygon(points.map(() => g))}
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeDasharray={g === maxValue ? undefined : '3 3'}
          strokeWidth={1}
        />
      ))}
      {points.map((_, i) => {
        const p = point(maxValue, i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={polygon(points.map((p) => p.target))}
        fill="rgb(99 102 241 / 0.15)"
        stroke="rgb(99 102 241)"
        strokeWidth={2}
        strokeDasharray="4 4"
      />
      <polygon
        points={polygon(points.map((p) => p.current))}
        fill="rgb(16 185 129 / 0.35)"
        stroke="rgb(16 185 129)"
        strokeWidth={2}
      />
      {points.map((p, i) => {
        const cur = point(p.current, i);
        return (
          <circle
            key={`dot-${i}`}
            cx={cur.x}
            cy={cur.y}
            r={4}
            className="fill-emerald-500 stroke-white dark:stroke-slate-900"
            strokeWidth={2}
          />
        );
      })}

      {points.map((p, i) => {
        const lp = labelPos(i);
        const a = angle(i);
        const cos = Math.cos(a);
        const anchor = Math.abs(cos) < 0.3 ? 'middle' : cos > 0 ? 'start' : 'end';
        return (
          <text
            key={`lbl-${i}`}
            x={lp.x}
            y={lp.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-slate-700 text-xs font-medium dark:fill-slate-200"
          >
            {p.label.length > 18 ? `${p.label.slice(0, 17)}…` : p.label}
          </text>
        );
      })}
    </svg>
  );
}
