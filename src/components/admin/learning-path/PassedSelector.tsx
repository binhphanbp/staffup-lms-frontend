'use client';

import { useMemo, useState } from 'react';
import type { CurriculumNode } from '@/services/learning-path.service';

interface Props {
  nodes: CurriculumNode[];
  passedIds: string[];
  onChange: (ids: string[]) => void;
  onSavePassedToDb?: () => void;
  saving?: boolean;
}

const CATEGORY_LABEL: Record<string, string> = {
  company: 'Văn hóa Công ty',
  soft_skills: 'Kỹ năng Mềm',
  professional: 'Nghiệp vụ',
  compliance: 'Tuân thủ',
  leadership: 'Lãnh đạo',
};

export function PassedSelector({ nodes, passedIds, onChange, onSavePassedToDb, saving }: Props) {
  const [search, setSearch] = useState('');

  const passedSet = useMemo(() => new Set(passedIds), [passedIds]);
  const grouped = useMemo(() => {
    const map = new Map<string, CurriculumNode[]>();
    for (const n of nodes) {
      if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.id.includes(search))
        continue;
      if (!map.has(n.category)) map.set(n.category, []);
      map.get(n.category)!.push(n);
    }
    return map;
  }, [nodes, search]);

  function toggle(id: string) {
    const next = new Set(passedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange([...next].sort());
  }

  function clear() {
    onChange([]);
  }

  function selectPreset(preset: 'student1' | 'senior' | 'empty') {
    if (preset === 'student1') onChange(['L11']);
    else if (preset === 'senior') onChange(['L11', 'L12', 'L15', 'L16', 'L18', 'L21', 'L26']);
    else if (preset === 'empty') onChange([]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Tìm bài học…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        />
        <button
          onClick={clear}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700"
        >
          Bỏ chọn hết
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-slate-500">Preset:</span>
        <button
          onClick={() => selectPreset('student1')}
          className="rounded-full bg-sky-100 px-2 py-0.5 font-medium text-sky-800 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300"
        >
          Test (chỉ L11)
        </button>
        <button
          onClick={() => selectPreset('senior')}
          className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-800 hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-300"
        >
          Senior (7 bài)
        </button>
        <button
          onClick={() => selectPreset('empty')}
          className="rounded-full bg-slate-200 px-2 py-0.5 font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
        >
          Empty (chưa pass gì)
        </button>
      </div>

      {onSavePassedToDb ? (
        <button
          onClick={onSavePassedToDb}
          disabled={saving}
          className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Đang lưu…' : '💾 Lưu vào hồ sơ nhân viên (DB)'}
        </button>
      ) : null}

      <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {[...grouped.entries()].map(([cat, items]) => (
          <div key={cat}>
            <div className="mb-1 text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
              {CATEGORY_LABEL[cat] ?? cat} ({items.length})
            </div>
            <div className="space-y-1">
              {items.map((n) => (
                <label
                  key={n.id}
                  className={`flex cursor-pointer items-start gap-2 rounded border px-2 py-1.5 transition-colors ${
                    passedSet.has(n.id)
                      ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={passedSet.has(n.id)}
                    onChange={() => toggle(n.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      <span className="font-mono text-slate-500">{n.id}</span> · {n.title}
                    </div>
                    <div className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                      {n.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        Đã chọn: <strong>{passedIds.length}</strong>/{nodes.length}
      </div>
    </div>
  );
}
