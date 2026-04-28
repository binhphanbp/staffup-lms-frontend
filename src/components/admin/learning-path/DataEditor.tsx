'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';
import {
  learningPathService,
  type CurriculumEdge,
  type CurriculumNode,
} from '@/services/learning-path.service';

interface Props {
  nodes: CurriculumNode[];
  edges: CurriculumEdge[];
  onMutate: () => Promise<void> | void;
}

function isAxiosErr(err: unknown): err is { response?: { data?: { message?: string } } } {
  return typeof err === 'object' && err !== null && 'response' in err;
}

export function DataEditor({ nodes, edges, onMutate }: Props) {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');

  async function add() {
    if (!fromId || !toId) {
      toast.error('Chọn cả 2 bài học.');
      return;
    }
    setBusy(true);
    try {
      await learningPathService.addEdge(fromId, toId);
      toast.success(`Đã thêm cạnh ${fromId} → ${toId}`);
      setFromId('');
      setToId('');
      await onMutate();
    } catch (err) {
      const msg = isAxiosErr(err)
        ? (err.response?.data?.message ?? 'Không thể thêm cạnh.')
        : 'Không thể thêm cạnh.';
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function remove(edgeId: number) {
    setBusy(true);
    try {
      await learningPathService.removeEdge(edgeId);
      toast.success('Đã xoá cạnh.');
      await onMutate();
    } catch (err) {
      const msg = isAxiosErr(err)
        ? (err.response?.data?.message ?? 'Không thể xoá cạnh.')
        : 'Không thể xoá cạnh.';
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  const filteredEdges = search
    ? edges.filter((e) => e.fromId.includes(search) || e.toId.includes(search))
    : edges;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] leading-tight text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
        Chế độ <strong>BGK</strong>: thay đổi cấu trúc DAG live. Hệ thống tự kiểm tra chu trình
        trước khi thêm.
      </div>

      <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="text-xs font-semibold">Thêm cạnh prerequisite</div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="">Từ bài…</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} — {n.title}
              </option>
            ))}
          </select>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="">Đến bài…</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} — {n.title}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={add}
          disabled={busy || !fromId || !toId}
          className="w-full rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {busy ? 'Đang xử lý…' : '+ Thêm cạnh'}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">Cạnh hiện có ({edges.length})</span>
          <input
            type="text"
            placeholder="Tìm Lxx…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-24 rounded border border-slate-300 px-2 py-0.5 text-[11px] dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <div className="max-h-[320px] space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
          {filteredEdges.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded px-2 py-1 text-[11px] hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <span className="font-mono">
                {e.fromId} <span className="text-slate-400">→</span> {e.toId}
              </span>
              <button
                onClick={() => remove(e.id)}
                disabled={busy}
                className="rounded px-1.5 py-0.5 text-rose-600 hover:bg-rose-100 disabled:opacity-50 dark:hover:bg-rose-900/30"
                title="Xoá cạnh"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
              </button>
            </div>
          ))}
          {filteredEdges.length === 0 ? (
            <div className="px-2 py-3 text-center text-[11px] text-slate-400">
              Không có cạnh phù hợp.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
