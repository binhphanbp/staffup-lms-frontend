'use client';

import React from 'react';
import { useMyCodeSubmissionsForProblem } from '@/hooks/useCodeLab';
import type { CodeLabOverallStatus, CodeSubmissionSummary } from '@/services/code-lab.service';

interface SubmissionHistoryDrawerProps {
  slug: string;
  open: boolean;
  onClose: () => void;
  onPick: (submission: CodeSubmissionSummary) => void;
}

const STATUS_LABEL: Record<CodeLabOverallStatus, string> = {
  passed: 'Đạt',
  partial: 'Một phần',
  failed: 'Chưa đạt',
  error: 'Code lỗi',
};

const STATUS_BADGE: Record<CodeLabOverallStatus, string> = {
  passed: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40',
  partial: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/40',
  failed: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/40',
  error: 'bg-rose-700/20 text-rose-300 ring-1 ring-rose-500/40',
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export function SubmissionHistoryDrawer({
  slug,
  open,
  onClose,
  onPick,
}: SubmissionHistoryDrawerProps) {
  const { data, isLoading, isError } = useMyCodeSubmissionsForProblem(open ? slug : null, {
    limit: 30,
  });

  return (
    <>
      {/* backdrop */}
      {open && (
        <button aria-label="Đóng" className="fixed inset-0 z-30 bg-black/60" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 right-0 z-40 flex h-full w-full max-w-md flex-col border-l border-black/40 bg-[#1f2228] text-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#181a1f] px-4">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-purple-400" />
            <h2 className="text-sm font-bold">Lịch sử nộp bài của tôi</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Đóng"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg border border-white/5 bg-white/5"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
              Không tải được lịch sử nộp bài.
            </div>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
              <i className="fa-solid fa-inbox mb-3 text-3xl text-slate-500" />
              <p className="text-sm">Bạn chưa nộp bài nào cho bài lab này.</p>
              <p className="mt-1 text-xs">Hãy viết code và nhấn Submit để bắt đầu.</p>
            </div>
          ) : (
            data.map((s) => (
              <button
                key={s.id}
                onClick={() => onPick(s)}
                className="block w-full rounded-lg border border-white/5 bg-[#282c34] p-3 text-left transition hover:border-purple-400/40 hover:bg-[#2c3038]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_BADGE[s.status]}`}
                    >
                      {STATUS_LABEL[s.status]}
                    </span>
                    <span className="font-mono text-xs text-slate-300">{s.score}/100</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{formatDate(s.createdAt)}</span>
                </div>
                {s.summary && (
                  <p className="mt-2 line-clamp-2 text-xs text-slate-400">{s.summary}</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono uppercase">
                    {s.language}
                  </span>
                  <span>•</span>
                  <span>Click để xem lại code</span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
