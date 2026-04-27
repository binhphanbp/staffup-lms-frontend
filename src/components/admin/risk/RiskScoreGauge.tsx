'use client';

import type { RiskLevel } from '@/services/risk.service';

interface RiskScoreGaugeProps {
  score: number;
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SIZES = {
  sm: { diameter: 40, stroke: 5, fontSize: 11 },
  md: { diameter: 64, stroke: 6, fontSize: 14 },
  lg: { diameter: 120, stroke: 10, fontSize: 26 },
} as const;

function resolveLevel(score: number, explicit?: RiskLevel): RiskLevel {
  if (explicit) return explicit;
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function colorsFor(level: RiskLevel) {
  switch (level) {
    case 'high':
      return { stroke: '#EA4335', text: '#B71C1C' };
    case 'medium':
      return { stroke: '#F9AB00', text: '#AD6C00' };
    case 'low':
    default:
      return { stroke: '#34A853', text: '#0F7B3A' };
  }
}

// Simple circular gauge (SVG). No external chart library.
export function RiskScoreGauge({
  score,
  level,
  size = 'md',
  showLabel = true,
}: RiskScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const lvl = resolveLevel(clamped, level);
  const colors = colorsFor(lvl);
  const { diameter, stroke, fontSize } = SIZES[size];

  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center"
      style={{ width: diameter, height: diameter }}
    >
      <svg width={diameter} height={diameter} className="rotate-[-90deg]">
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="#E8EAED"
          strokeWidth={stroke}
        />
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 400ms ease-out' }}
        />
      </svg>
      {showLabel && (
        <div
          className="absolute inset-0 flex items-center justify-center font-semibold"
          style={{ fontSize, color: colors.text }}
        >
          {clamped}
        </div>
      )}
    </div>
  );
}
