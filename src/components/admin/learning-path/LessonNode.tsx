'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { memo } from 'react';
import type { ClassifiedNode, NodeStatus } from '@/services/learning-path.service';

const STATUS_STYLE: Record<
  NodeStatus,
  { bg: string; border: string; text: string; icon: string; label: string }
> = {
  exempt: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    border: 'border-emerald-500',
    text: 'text-emerald-900 dark:text-emerald-200',
    icon: 'check_circle',
    label: 'Miễn',
  },
  available: {
    bg: 'bg-sky-50 dark:bg-sky-900/30',
    border: 'border-sky-500',
    text: 'text-sky-900 dark:text-sky-200',
    icon: 'play_circle',
    label: 'Học ngay',
  },
  locked: {
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    border: 'border-slate-400',
    text: 'text-slate-600 dark:text-slate-400',
    icon: 'lock',
    label: 'Khóa',
  },
};

export type LessonNodeData = ClassifiedNode;

function LessonNodeComponent({ data, selected }: NodeProps) {
  const node = data as unknown as LessonNodeData;
  const style = STATUS_STYLE[node.status];

  const tooltip =
    node.status === 'locked' && node.unmetPrereqs.length > 0
      ? `Đang chờ: ${node.unmetPrereqs.join(', ')}`
      : node.status === 'available'
        ? 'Sẵn sàng học'
        : node.status === 'exempt'
          ? 'Đã miễn (qua test)'
          : '';

  return (
    <div
      className={`group relative w-[200px] rounded-lg border-2 px-3 py-2 shadow-sm transition-all ${
        style.bg
      } ${style.border} ${selected ? 'ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
      title={tooltip}
    >
      <Handle type="target" position={Position.Left} className="!bg-slate-400" />
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${style.text}`}>
        <span className="material-symbols-outlined text-[16px]">{style.icon}</span>
        <span>
          {node.id} · {style.label}
        </span>
      </div>
      <div className={`mt-1 text-xs leading-tight font-medium ${style.text}`}>{node.title}</div>
      <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
        {node.estimatedHours}h · {node.category}
      </div>
      {node.status === 'locked' && node.unmetPrereqs.length > 0 ? (
        <div className="pointer-events-none absolute -top-2 left-2 hidden rounded bg-slate-800 px-2 py-0.5 text-[10px] text-white shadow-lg group-hover:block dark:bg-slate-700">
          Chờ: {node.unmetPrereqs.join(', ')}
        </div>
      ) : null}
      <Handle type="source" position={Position.Right} className="!bg-slate-400" />
    </div>
  );
}

export const LessonNode = memo(LessonNodeComponent);
