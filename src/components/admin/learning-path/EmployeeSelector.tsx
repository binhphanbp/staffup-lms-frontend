'use client';

import type { EmployeeListItem } from '@/services/learning-path.service';

interface Props {
  employees: EmployeeListItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  disabled?: boolean;
}

export function EmployeeSelector({ employees, selectedId, onSelect, disabled }: Props) {
  const selected = employees.find((e) => e.id === selectedId) ?? null;
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Nhân viên</label>
      <select
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        value={selectedId ?? ''}
        onChange={(e) => onSelect(e.target.value || null)}
        disabled={disabled}
      >
        <option value="">— Chọn nhân viên —</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.fullName} {emp.position ? `· ${emp.position}` : ''}{' '}
            {emp.department ? `· ${emp.department.name}` : ''}
          </option>
        ))}
      </select>
      {selected ? (
        <div className="text-[11px] text-slate-500 dark:text-slate-400">{selected.email}</div>
      ) : null}
    </div>
  );
}
