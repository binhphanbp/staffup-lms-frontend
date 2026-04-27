'use client';

import { useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Loader2,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import {
  useAssignableUsers,
  useAssignOnboardingPlan,
  useDeleteOnboardingPlan,
  useOnboardingPlan,
  useOnboardingPlans,
  useOnboardingTemplates,
} from '@/hooks/useOnboarding';
import { toast } from '@/lib/toast';
import type { OnboardingPlanStatus, OnboardingTaskStatus } from '@/types/onboarding';

const STATUS_LABELS: Record<OnboardingPlanStatus, { label: string; classes: string }> = {
  active: {
    label: 'Đang chạy',
    classes:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  completed: {
    label: 'Hoàn thành',
    classes: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
  },
  paused: {
    label: 'Tạm dừng',
    classes: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
  },
  cancelled: {
    label: 'Đã hủy',
    classes: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
  },
};

const TASK_STATUS_LABEL: Record<OnboardingTaskStatus, string> = {
  pending: 'Chưa làm',
  in_progress: 'Đang làm',
  done: 'Hoàn thành',
  skipped: 'Bỏ qua',
};

function formatDate(iso: string) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}

function PlanRowDetail({ planId }: { planId: string }) {
  const { data, isLoading } = useOnboardingPlan(planId);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-[#1A73E8]" />
      </div>
    );
  }
  if (!data) return <div className="p-4 text-sm text-[#5F6368]">Không tải được chi tiết</div>;
  return (
    <div className="space-y-3 p-4">
      {data.notes && (
        <div className="rounded-lg bg-[#FEF7E0] p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          📝 {data.notes}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-3">
        {data.stages.map((stage) => {
          const done = stage.tasks.filter((t) => t.status === 'done').length;
          return (
            <div
              key={stage.id}
              className="rounded-xl border border-[#E8EAED] bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#202124] dark:text-slate-100">
                  {stage.name}
                </h4>
                <span className="text-xs text-[#5F6368] dark:text-slate-400">
                  {done}/{stage.tasks.length}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs">
                {stage.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start gap-2 rounded p-1.5 hover:bg-[#F8F9FA] dark:hover:bg-slate-800/60"
                  >
                    <CircleCheck
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                        task.status === 'done'
                          ? 'text-emerald-500'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate ${
                          task.status === 'done'
                            ? 'text-[#5F6368] line-through dark:text-slate-500'
                            : 'text-[#202124] dark:text-slate-200'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[10px] text-[#9AA0A6] dark:text-slate-500">
                        {TASK_STATUS_LABEL[task.status]}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AssignDialogProps {
  open: boolean;
  onClose: () => void;
}

function AssignDialog({ open, onClose }: AssignDialogProps) {
  const { data: templates } = useOnboardingTemplates({ isActive: true });
  const { data: users } = useAssignableUsers();
  const assignMutation = useAssignOnboardingPlan();
  const [templateId, setTemplateId] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const handleSubmit = async () => {
    if (!templateId || !assigneeId) {
      toast.error('Cần chọn mẫu và người được assign');
      return;
    }
    try {
      await assignMutation.mutateAsync({
        templateId,
        assigneeId,
        startDate,
        notes: notes || null,
      });
      toast.success('Đã giao kế hoạch onboarding');
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không giao được';
      toast.error('Lỗi giao kế hoạch', { description: msg });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-[#202124] dark:text-slate-100">
          Giao kế hoạch onboarding
        </h3>
        <p className="mt-0.5 text-sm text-[#5F6368] dark:text-slate-400">
          Chọn mẫu và hire mới — task sẽ được snapshot vào kế hoạch riêng cho người này.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5F6368] dark:text-slate-300">
              Mẫu onboarding
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#DADCE0] bg-white px-3 text-sm outline-none focus:border-[#1A73E8] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">— Chọn mẫu —</option>
              {templates?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.totalDays}d)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5F6368] dark:text-slate-300">
              Hire mới
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#DADCE0] bg-white px-3 text-sm outline-none focus:border-[#1A73E8] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">— Chọn người —</option>
              {users?.users.map((u) => (
                <option key={u.id} value={u.id} disabled={Boolean(u.activePlanId)}>
                  {u.fullName} {u.positionTitle ? `· ${u.positionTitle}` : ''}{' '}
                  {u.activePlanId ? '(đã có plan đang chạy)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5F6368] dark:text-slate-300">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#DADCE0] bg-white px-3 text-sm outline-none focus:border-[#1A73E8] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5F6368] dark:text-slate-300">
              Ghi chú cá nhân (tuỳ chọn)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Vd: ưu tiên làm việc với team Fintech…"
              className="w-full resize-none rounded-lg border border-[#DADCE0] bg-white p-2 text-sm outline-none focus:border-[#1A73E8] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#DADCE0] px-4 py-2 text-sm font-medium text-[#5F6368] transition hover:bg-[#F1F3F4] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={assignMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A73E8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1765c1] disabled:opacity-50"
          >
            {assignMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Giao kế hoạch
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManagerOnboardingPlansPage() {
  const [statusFilter, setStatusFilter] = useState<OnboardingPlanStatus | 'all'>('all');
  const [assignOpen, setAssignOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data, isLoading } = useOnboardingPlans({
    scope: 'team',
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const deleteMutation = useDeleteOnboardingPlan();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hủy kế hoạch của ${name}? Task hoàn thành sẽ không thể khôi phục.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Đã huỷ kế hoạch');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không huỷ được';
      toast.error('Lỗi huỷ', { description: msg });
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-[#5F6368] uppercase dark:text-slate-400">
            <span className="material-symbols-outlined text-base">checklist</span>
            Onboarding Plans
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-[#202124] dark:text-slate-100">
            Kế hoạch onboarding của team
          </h1>
          <p className="mt-1 text-sm text-[#5F6368] dark:text-slate-400">
            Theo dõi tiến độ hội nhập của từng hire mới. Click để mở task chi tiết.
          </p>
        </div>
        <button
          onClick={() => setAssignOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1A73E8] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#1765c1]"
        >
          <Plus className="h-4 w-4" /> Giao mẫu cho hire
        </button>
      </div>

      <div className="mb-5 flex items-center gap-2">
        {(['all', 'active', 'completed', 'paused', 'cancelled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              statusFilter === s
                ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8] dark:border-sky-500 dark:bg-sky-950/40 dark:text-sky-300'
                : 'border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            {s === 'all' ? 'Tất cả' : STATUS_LABELS[s].label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-[#E8EAED] bg-white">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse border-b border-[#E8EAED] last:border-b-0 dark:border-slate-800"
            />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DADCE0] bg-[#F8F9FA] p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FE] text-[#1A73E8]">
            <User className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#202124] dark:text-slate-100">
            Chưa có kế hoạch nào
          </h3>
          <p className="mt-1 text-sm text-[#5F6368] dark:text-slate-400">
            Bấm “Giao mẫu cho hire” để bắt đầu onboard người mới.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E8EAED] bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA] text-xs tracking-wide text-[#5F6368] uppercase dark:bg-slate-900/60 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Hire</th>
                <th className="px-4 py-3 text-left">Mẫu</th>
                <th className="px-4 py-3 text-left">Bắt đầu</th>
                <th className="px-4 py-3 text-left">Tiến độ</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => {
                const isOpen = expanded === p.id;
                return (
                  <>
                    <tr
                      key={p.id}
                      className="cursor-pointer border-t border-[#E8EAED] transition hover:bg-[#F8F9FA] dark:border-slate-800 dark:hover:bg-slate-800/40"
                      onClick={() => setExpanded(isOpen ? null : p.id)}
                    >
                      <td className="px-4 py-3 font-medium text-[#202124] dark:text-slate-100">
                        {p.assigneeName}
                      </td>
                      <td className="px-4 py-3 text-[#5F6368] dark:text-slate-400">
                        {p.templateName}
                      </td>
                      <td className="px-4 py-3 text-[#5F6368] dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(p.startDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#5F6368] dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className="h-full bg-emerald-500 transition-all"
                              style={{ width: `${p.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {p.progressPercent}% ({p.completedTaskCount}/{p.totalTaskCount})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_LABELS[p.status].classes}`}
                        >
                          {STATUS_LABELS[p.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-[#5F6368] transition hover:bg-[#F1F3F4] dark:text-slate-400 dark:hover:bg-slate-800"
                          aria-label={isOpen ? 'Thu gọn' : 'Mở rộng'}
                        >
                          {isOpen ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id, p.assigneeName);
                          }}
                          className="ml-1 inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          aria-label="Huỷ"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-t border-[#E8EAED] bg-[#F8F9FA] dark:border-slate-800 dark:bg-slate-900/60">
                        <td colSpan={6}>
                          <PlanRowDetail planId={p.id} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AssignDialog open={assignOpen} onClose={() => setAssignOpen(false)} />
    </div>
  );
}
