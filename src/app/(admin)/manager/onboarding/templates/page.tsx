'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarRange,
  Copy,
  Layers,
  ListChecks,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import {
  useCloneOnboardingTemplate,
  useDeleteOnboardingTemplate,
  useOnboardingTemplates,
} from '@/hooks/useOnboarding';
import { toast } from '@/lib/toast';

export default function ManagerOnboardingTemplatesPage() {
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const { data, isLoading } = useOnboardingTemplates(showInactive ? {} : { isActive: true });
  const cloneMutation = useCloneOnboardingTemplate();
  const deleteMutation = useDeleteOnboardingTemplate();

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((t) =>
      [t.name, t.targetPosition, t.description].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [data, search]);

  const handleClone = async (id: string) => {
    try {
      await cloneMutation.mutateAsync(id);
      toast.success('Đã nhân bản mẫu onboarding');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không nhân bản được';
      toast.error('Không nhân bản được', { description: msg });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa mẫu "${name}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Đã xóa mẫu');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không xóa được';
      toast.error('Không xóa được', { description: msg });
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-[#5F6368] uppercase dark:text-slate-400">
            <span className="material-symbols-outlined text-base">flight_takeoff</span>
            Onboarding Builder
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-[#202124] dark:text-slate-100">
            Mẫu onboarding 30 / 60 / 90 ngày
          </h1>
          <p className="mt-1 text-sm text-[#5F6368] dark:text-slate-400">
            Thiết kế hành trình hội nhập cho từng vị trí. Manager kéo-thả task, AI Gemini gợi ý nội
            dung, sau đó assign cho hire mới.
          </p>
        </div>
        <Link
          href="/manager/onboarding/templates/new"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#1A73E8] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#1765c1]"
        >
          <Plus className="h-4 w-4" /> Tạo mẫu mới (AI gợi ý)
        </Link>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#5F6368]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên / vị trí / mô tả…"
            className="h-10 w-full rounded-lg border border-[#DADCE0] bg-white pr-3 pl-10 text-sm outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#E8F0FE] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-[#5F6368] dark:text-slate-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#DADCE0]"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          Hiển thị mẫu đã ngừng dùng
        </label>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-[#E8EAED] bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DADCE0] bg-[#F8F9FA] p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FE] text-[#1A73E8]">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#202124] dark:text-slate-100">
            Chưa có mẫu nào
          </h3>
          <p className="mt-1 text-sm text-[#5F6368] dark:text-slate-400">
            Tạo mẫu đầu tiên với gợi ý từ AI Gemini.
          </p>
          <Link
            href="/manager/onboarding/templates/new"
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[#1A73E8] px-4 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" /> Tạo mẫu mới
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="group flex flex-col rounded-2xl border border-[#E8EAED] bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {tpl.isSystem && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                        Hệ thống
                      </span>
                    )}
                    {!tpl.isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Đã ngừng
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 line-clamp-2 text-base font-semibold text-[#202124] dark:text-slate-100">
                    {tpl.name}
                  </h3>
                  {tpl.targetPosition && (
                    <p className="mt-0.5 text-xs text-[#5F6368] dark:text-slate-400">
                      Vị trí: {tpl.targetPosition}
                    </p>
                  )}
                </div>
              </div>
              <p className="mb-4 line-clamp-2 text-sm text-[#5F6368] dark:text-slate-400">
                {tpl.description || 'Chưa có mô tả'}
              </p>
              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-[#E8EAED] pt-3 text-xs dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[#5F6368] dark:text-slate-400">
                  <CalendarRange className="h-3.5 w-3.5" /> {tpl.totalDays}d
                </div>
                <div className="flex items-center gap-1.5 text-[#5F6368] dark:text-slate-400">
                  <Layers className="h-3.5 w-3.5" /> {tpl.stageCount} stage
                </div>
                <div className="flex items-center gap-1.5 text-[#5F6368] dark:text-slate-400">
                  <ListChecks className="h-3.5 w-3.5" /> {tpl.taskCount} task
                </div>
              </div>
              {tpl.planCount > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <Users className="h-3.5 w-3.5" /> Đã assign cho {tpl.planCount} hire
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/manager/onboarding/templates/${tpl.id}/builder`}
                  className="flex-1 rounded-lg bg-[#E8F0FE] px-3 py-1.5 text-center text-xs font-medium text-[#1A73E8] transition hover:bg-[#D2E3FC]"
                >
                  Mở trình thiết kế
                </Link>
                <button
                  onClick={() => handleClone(tpl.id)}
                  disabled={cloneMutation.isPending}
                  className="rounded-lg border border-[#DADCE0] p-1.5 text-[#5F6368] transition hover:bg-[#F1F3F4] disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label="Nhân bản mẫu"
                  title="Nhân bản"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {!tpl.isSystem && (
                  <button
                    onClick={() => handleDelete(tpl.id, tpl.name)}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg border border-rose-200 p-1.5 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    aria-label="Xóa mẫu"
                    title="Xóa"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
