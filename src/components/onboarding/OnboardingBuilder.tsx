'use client';

import { useMemo, useState } from 'react';
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertCircle,
  ArrowLeft,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Wand2,
} from 'lucide-react';
import {
  type OnboardingTaskCategory,
  type OnboardingTaskPriority,
  type UpsertStageInput,
  type UpsertTaskInput,
  type UpsertTemplateInput,
  type AiTemplateSuggestion,
} from '@/types/onboarding';
import { useGenerateOnboardingTemplate } from '@/hooks/useOnboarding';
import { toast } from '@/lib/toast';

interface DraftTask extends UpsertTaskInput {
  uid: string;
}

interface DraftStage extends Omit<UpsertStageInput, 'tasks'> {
  uid: string;
  tasks: DraftTask[];
}

interface DraftTemplate {
  name: string;
  description: string;
  targetPosition: string;
  totalDays: number;
  isActive: boolean;
  stages: DraftStage[];
}

const CATEGORY_OPTIONS: Array<{ value: OnboardingTaskCategory; label: string; color: string }> = [
  { value: 'learning', label: 'Học tập', color: 'bg-blue-100 text-blue-700' },
  { value: 'admin', label: 'Hành chính', color: 'bg-slate-100 text-slate-700' },
  { value: 'meeting', label: 'Họp 1-1', color: 'bg-amber-100 text-amber-700' },
  { value: 'practice', label: 'Thực hành', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'review', label: 'Đánh giá', color: 'bg-violet-100 text-violet-700' },
  { value: 'other', label: 'Khác', color: 'bg-slate-100 text-slate-700' },
];

const PRIORITY_OPTIONS: Array<{ value: OnboardingTaskPriority; label: string; color: string }> = [
  { value: 'high', label: 'Cao', color: 'border-rose-300 bg-rose-50 text-rose-700' },
  { value: 'medium', label: 'TB', color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { value: 'low', label: 'Thấp', color: 'border-slate-200 bg-slate-50 text-slate-600' },
];

const DEFAULT_STAGES: DraftStage[] = [
  {
    uid: stageUid(),
    name: '30 ngày đầu',
    description: 'Định hướng & hội nhập',
    startOffsetDays: 0,
    endOffsetDays: 30,
    tasks: [],
  },
  {
    uid: stageUid(),
    name: 'Day 31-60',
    description: 'Bắt nhịp & giao việc thật',
    startOffsetDays: 30,
    endOffsetDays: 60,
    tasks: [],
  },
  {
    uid: stageUid(),
    name: 'Day 61-90',
    description: 'Chủ động & đánh giá',
    startOffsetDays: 60,
    endOffsetDays: 90,
    tasks: [],
  },
];

function stageUid() {
  return `stage-${Math.random().toString(36).slice(2, 11)}`;
}
function taskUid() {
  return `task-${Math.random().toString(36).slice(2, 11)}`;
}

function categoryStyle(cat: OnboardingTaskCategory) {
  return CATEGORY_OPTIONS.find((c) => c.value === cat)?.color ?? 'bg-slate-100 text-slate-700';
}

function priorityStyle(p: OnboardingTaskPriority) {
  return PRIORITY_OPTIONS.find((o) => o.value === p)?.color ?? 'border-slate-200';
}

function fromInitial(initial?: {
  name: string;
  description: string;
  targetPosition: string | null;
  totalDays: number;
  isActive: boolean;
  stages: Array<{
    name: string;
    description: string | null;
    startOffsetDays: number;
    endOffsetDays: number;
    tasks: Array<{
      title: string;
      description: string | null;
      category: OnboardingTaskCategory;
      priority: OnboardingTaskPriority;
      estimatedHours: number;
      courseId?: string | null;
      resourceUrl?: string | null;
    }>;
  }>;
}): DraftTemplate {
  if (!initial) {
    return {
      name: '',
      description: '',
      targetPosition: '',
      totalDays: 90,
      isActive: true,
      stages: DEFAULT_STAGES.map((s) => ({ ...s, tasks: [] })),
    };
  }
  return {
    name: initial.name,
    description: initial.description,
    targetPosition: initial.targetPosition ?? '',
    totalDays: initial.totalDays,
    isActive: initial.isActive,
    stages: initial.stages.map((s) => ({
      uid: stageUid(),
      name: s.name,
      description: s.description ?? '',
      startOffsetDays: s.startOffsetDays,
      endOffsetDays: s.endOffsetDays,
      tasks: s.tasks.map((t) => ({
        uid: taskUid(),
        title: t.title,
        description: t.description ?? '',
        category: t.category,
        priority: t.priority,
        estimatedHours: t.estimatedHours,
        courseId: t.courseId ?? null,
        resourceUrl: t.resourceUrl ?? null,
      })),
    })),
  };
}

function toUpsertInput(draft: DraftTemplate): UpsertTemplateInput {
  return {
    name: draft.name.trim(),
    description: draft.description.trim() || undefined,
    targetPosition: draft.targetPosition.trim() || null,
    totalDays: draft.totalDays,
    isActive: draft.isActive,
    stages: draft.stages.map((s) => ({
      name: s.name.trim(),
      description: s.description?.trim() || null,
      startOffsetDays: s.startOffsetDays,
      endOffsetDays: s.endOffsetDays,
      tasks: s.tasks.map((t) => ({
        title: t.title.trim(),
        description: t.description?.toString().trim() || null,
        category: t.category,
        priority: t.priority,
        estimatedHours: t.estimatedHours,
        courseId: t.courseId ?? null,
        resourceUrl: t.resourceUrl?.toString().trim() || null,
      })),
    })),
  };
}

function applyAiSuggestion(suggestion: AiTemplateSuggestion, draft: DraftTemplate): DraftTemplate {
  return {
    ...draft,
    name: draft.name || suggestion.name,
    description: draft.description || suggestion.description,
    totalDays: suggestion.totalDays || draft.totalDays,
    stages: suggestion.stages.map((s) => ({
      uid: stageUid(),
      name: s.name,
      description: s.description,
      startOffsetDays: s.startOffsetDays,
      endOffsetDays: s.endOffsetDays,
      tasks: s.tasks.map((t) => ({
        uid: taskUid(),
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        estimatedHours: t.estimatedHours,
      })),
    })),
  };
}

interface SortableTaskCardProps {
  task: DraftTask;
  onChange: (patch: Partial<DraftTask>) => void;
  onDelete: () => void;
}

function SortableTaskCard({ task, onChange, onDelete }: SortableTaskCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.uid,
    data: { type: 'task' },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-[#E8EAED] bg-white p-3 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab text-[#5F6368] active:cursor-grabbing"
          aria-label="Kéo để sắp xếp"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1 space-y-1.5">
          <input
            value={task.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Tên task…"
            className="w-full bg-transparent text-sm font-medium text-[#202124] outline-none placeholder:text-[#9AA0A6] dark:text-slate-100"
          />
          <textarea
            value={(task.description as string | null) ?? ''}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Mô tả ngắn (tuỳ chọn)…"
            rows={2}
            className="w-full resize-none bg-transparent text-xs text-[#5F6368] outline-none placeholder:text-[#9AA0A6] dark:text-slate-400"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value={task.category}
              onChange={(e) => onChange({ category: e.target.value as OnboardingTaskCategory })}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium outline-none ${categoryStyle(
                (task.category ?? 'learning') as OnboardingTaskCategory,
              )}`}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              value={task.priority}
              onChange={(e) => onChange({ priority: e.target.value as OnboardingTaskPriority })}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium outline-none ${priorityStyle(
                (task.priority ?? 'medium') as OnboardingTaskPriority,
              )}`}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <div className="inline-flex items-center gap-1 rounded-full border border-[#DADCE0] px-2 py-0.5 text-[10px] text-[#5F6368] dark:border-slate-600 dark:text-slate-400">
              <input
                type="number"
                min={1}
                max={80}
                value={task.estimatedHours ?? 2}
                onChange={(e) =>
                  onChange({ estimatedHours: Math.max(1, Number(e.target.value) || 1) })
                }
                className="w-9 bg-transparent text-right outline-none"
              />
              <span>giờ</span>
            </div>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="rounded p-1 text-[#5F6368] transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
          aria-label="Xóa task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

interface StageColumnProps {
  stage: DraftStage;
  onPatchStage: (patch: Partial<DraftStage>) => void;
  onPatchTask: (taskUid: string, patch: Partial<DraftTask>) => void;
  onDeleteTask: (taskUid: string) => void;
  onAddTask: () => void;
  onDeleteStage: () => void;
  canDelete: boolean;
}

function StageColumn({
  stage,
  onPatchStage,
  onPatchTask,
  onDeleteTask,
  onAddTask,
  onDeleteStage,
  canDelete,
}: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.uid, data: { type: 'stage' } });
  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-h-[420px] flex-col rounded-2xl border bg-[#F8F9FA] p-3 transition dark:bg-slate-900/40 ${
        isOver
          ? 'border-[#1A73E8] bg-[#E8F0FE] dark:border-sky-500 dark:bg-sky-950/30'
          : 'border-[#E8EAED] dark:border-slate-800'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <input
            value={stage.name}
            onChange={(e) => onPatchStage({ name: e.target.value })}
            placeholder="Tên giai đoạn"
            className="w-full bg-transparent text-sm font-semibold text-[#202124] outline-none placeholder:text-[#9AA0A6] dark:text-slate-100"
          />
          <input
            value={(stage.description as string | null) ?? ''}
            onChange={(e) => onPatchStage({ description: e.target.value })}
            placeholder="Mô tả mục tiêu giai đoạn…"
            className="mt-0.5 w-full bg-transparent text-xs text-[#5F6368] outline-none placeholder:text-[#9AA0A6] dark:text-slate-400"
          />
          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#5F6368] dark:text-slate-400">
            Day{' '}
            <input
              type="number"
              min={0}
              max={365}
              value={stage.startOffsetDays}
              onChange={(e) => onPatchStage({ startOffsetDays: Number(e.target.value) || 0 })}
              className="w-12 rounded border border-[#DADCE0] bg-white px-1 py-0.5 text-center outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            -
            <input
              type="number"
              min={1}
              max={365}
              value={stage.endOffsetDays}
              onChange={(e) => onPatchStage({ endOffsetDays: Number(e.target.value) || 1 })}
              className="w-12 rounded border border-[#DADCE0] bg-white px-1 py-0.5 text-center outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[#5F6368] dark:bg-slate-800 dark:text-slate-300">
              {stage.tasks.length} task
            </span>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={onDeleteStage}
            className="rounded p-1 text-[#5F6368] transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
            aria-label="Xóa giai đoạn"
            title="Xóa giai đoạn"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <SortableContext items={stage.tasks.map((t) => t.uid)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {stage.tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#DADCE0] bg-white/60 p-4 text-center text-xs text-[#9AA0A6] dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-500">
              Kéo task qua đây hoặc bấm “+ Thêm task”
            </div>
          ) : (
            stage.tasks.map((task) => (
              <SortableTaskCard
                key={task.uid}
                task={task}
                onChange={(patch) => onPatchTask(task.uid, patch)}
                onDelete={() => onDeleteTask(task.uid)}
              />
            ))
          )}
        </div>
      </SortableContext>

      <button
        onClick={onAddTask}
        className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#DADCE0] py-2 text-xs font-medium text-[#1A73E8] transition hover:border-[#1A73E8] hover:bg-[#E8F0FE] dark:border-slate-700 dark:hover:bg-sky-950/30"
      >
        <Plus className="h-3.5 w-3.5" /> Thêm task
      </button>
    </div>
  );
}

interface OnboardingBuilderProps {
  initial?: Parameters<typeof fromInitial>[0];
  isSaving: boolean;
  onSave: (input: UpsertTemplateInput) => Promise<void>;
  onCancel: () => void;
  saveLabel?: string;
  title?: string;
}

export function OnboardingBuilder({
  initial,
  isSaving,
  onSave,
  onCancel,
  saveLabel = 'Lưu mẫu',
  title = 'Thiết kế mẫu onboarding',
}: OnboardingBuilderProps) {
  const [draft, setDraft] = useState<DraftTemplate>(() => fromInitial(initial));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState({
    targetPosition: '',
    departmentName: '',
    totalDays: 90,
    extraNotes: '',
  });

  const generate = useGenerateOnboardingTemplate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const totalTasks = useMemo(
    () => draft.stages.reduce((acc, s) => acc + s.tasks.length, 0),
    [draft.stages],
  );

  const findTaskLocation = (uid: string) => {
    for (let s = 0; s < draft.stages.length; s += 1) {
      const idx = draft.stages[s].tasks.findIndex((t) => t.uid === uid);
      if (idx !== -1) return { stageIndex: s, taskIndex: idx };
    }
    return null;
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const fromLoc = findTaskLocation(String(active.id));
    if (!fromLoc) return;

    const overData = over.data.current as { type?: string } | undefined;
    let toStageIndex: number | null = null;
    let toTaskIndex: number | null = null;

    if (overData?.type === 'stage') {
      toStageIndex = draft.stages.findIndex((s) => s.uid === String(over.id));
      toTaskIndex = draft.stages[toStageIndex]?.tasks.length ?? 0;
    } else {
      const overLoc = findTaskLocation(String(over.id));
      if (overLoc) {
        toStageIndex = overLoc.stageIndex;
        toTaskIndex = overLoc.taskIndex;
      }
    }

    if (toStageIndex === null || toTaskIndex === null) return;
    if (fromLoc.stageIndex === toStageIndex && fromLoc.taskIndex === toTaskIndex) {
      return;
    }

    setDraft((prev) => {
      const stages = prev.stages.map((s) => ({ ...s, tasks: [...s.tasks] }));
      const [moved] = stages[fromLoc.stageIndex].tasks.splice(fromLoc.taskIndex, 1);
      stages[toStageIndex!].tasks.splice(toTaskIndex!, 0, moved);
      return { ...prev, stages };
    });
  };

  const handleAddStage = () => {
    setDraft((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          uid: stageUid(),
          name: `Giai đoạn ${prev.stages.length + 1}`,
          description: '',
          startOffsetDays: prev.stages[prev.stages.length - 1]?.endOffsetDays ?? 0,
          endOffsetDays: (prev.stages[prev.stages.length - 1]?.endOffsetDays ?? 0) + 30,
          tasks: [],
        },
      ],
    }));
  };

  const handleSubmit = async () => {
    if (!draft.name.trim()) {
      toast.error('Tên mẫu là bắt buộc');
      return;
    }
    if (draft.stages.length === 0) {
      toast.error('Cần ít nhất 1 giai đoạn');
      return;
    }
    for (const stage of draft.stages) {
      if (!stage.name.trim()) {
        toast.error('Mỗi giai đoạn cần tên');
        return;
      }
      for (const task of stage.tasks) {
        if (!task.title.trim()) {
          toast.error('Có task chưa đặt tên');
          return;
        }
      }
    }
    const input = toUpsertInput(draft);
    await onSave(input);
  };

  const handleAiGenerate = async () => {
    if (!aiInput.targetPosition.trim()) {
      toast.error('Cần điền vị trí mục tiêu');
      return;
    }
    try {
      const suggestion = await generate.mutateAsync({
        targetPosition: aiInput.targetPosition,
        departmentName: aiInput.departmentName || null,
        totalDays: aiInput.totalDays,
        extraNotes: aiInput.extraNotes || null,
      });
      setDraft((prev) => applyAiSuggestion(suggestion, prev));
      toast.success('AI đã gợi ý mẫu — review và chỉnh trước khi lưu');
      setAiOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không tạo được gợi ý';
      toast.error('Lỗi AI', { description: msg });
    }
  };

  const activeTask = activeId
    ? draft.stages.flatMap((s) => s.tasks).find((t) => t.uid === activeId)
    : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={onCancel}
            className="mt-1 rounded-lg border border-[#DADCE0] p-2 text-[#5F6368] transition hover:bg-[#F1F3F4] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-[#5F6368] uppercase dark:text-slate-400">
              <span className="material-symbols-outlined text-base">flight_takeoff</span>
              {title}
            </div>
            <input
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Tên mẫu (vd: Onboarding Junior Frontend Dev 90 ngày)…"
              className="mt-1 w-full bg-transparent text-2xl font-semibold text-[#202124] outline-none placeholder:text-[#9AA0A6] dark:text-slate-100"
            />
            <input
              value={draft.targetPosition}
              onChange={(e) => setDraft((prev) => ({ ...prev, targetPosition: e.target.value }))}
              placeholder="Vị trí mục tiêu (vd: Frontend Engineer, Sales Executive)…"
              className="mt-1 w-full bg-transparent text-sm text-[#5F6368] outline-none placeholder:text-[#9AA0A6] dark:text-slate-400"
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            onClick={() => setAiOpen((v) => !v)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-300 bg-violet-50 px-3 text-sm font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300"
          >
            <Sparkles className="h-4 w-4" /> AI gợi ý
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1A73E8] px-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#1765c1] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saveLabel}
          </button>
        </div>
      </div>

      <textarea
        value={draft.description}
        onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
        placeholder="Mô tả ngắn cho mẫu (sẽ hiển thị ở trang danh sách)…"
        rows={2}
        className="mb-4 w-full resize-none rounded-xl border border-[#E8EAED] bg-white p-3 text-sm text-[#5F6368] outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#E8F0FE] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      />

      {aiOpen && (
        <div className="mb-5 rounded-2xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-900/60 dark:bg-violet-950/30">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-700 dark:text-violet-300">
            <Wand2 className="h-4 w-4" /> Gemini sẽ tạo dàn 30/60/90 ngày dựa trên context bạn cung
            cấp
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={aiInput.targetPosition}
              onChange={(e) => setAiInput((p) => ({ ...p, targetPosition: e.target.value }))}
              placeholder="Vị trí (vd: Junior Backend Dev)"
              className="h-9 rounded-lg border border-violet-200 bg-white px-3 text-sm outline-none focus:border-violet-400 dark:border-violet-800 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              value={aiInput.departmentName}
              onChange={(e) => setAiInput((p) => ({ ...p, departmentName: e.target.value }))}
              placeholder="Phòng ban (tuỳ chọn)"
              className="h-9 rounded-lg border border-violet-200 bg-white px-3 text-sm outline-none focus:border-violet-400 dark:border-violet-800 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              type="number"
              min={7}
              max={180}
              value={aiInput.totalDays}
              onChange={(e) =>
                setAiInput((p) => ({ ...p, totalDays: Number(e.target.value) || 90 }))
              }
              placeholder="Tổng số ngày"
              className="h-9 rounded-lg border border-violet-200 bg-white px-3 text-sm outline-none focus:border-violet-400 dark:border-violet-800 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              value={aiInput.extraNotes}
              onChange={(e) => setAiInput((p) => ({ ...p, extraNotes: e.target.value }))}
              placeholder="Ghi chú thêm (vd: focus về team Fintech, dùng tech NodeJS…)"
              className="h-9 rounded-lg border border-violet-200 bg-white px-3 text-sm outline-none focus:border-violet-400 dark:border-violet-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="flex items-center gap-1 text-xs text-violet-700 dark:text-violet-300">
              <AlertCircle className="h-3.5 w-3.5" />
              AI sẽ ghi đè giai đoạn + task hiện tại. Tên + mô tả mẫu được giữ nếu đã nhập.
            </p>
            <button
              onClick={handleAiGenerate}
              disabled={generate.isPending}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-xs font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              {generate.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              Sinh gợi ý
            </button>
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs text-[#5F6368] dark:text-slate-400">
          Tổng: {draft.stages.length} giai đoạn · {totalTasks} task · {draft.totalDays} ngày
        </div>
        <button
          onClick={handleAddStage}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#DADCE0] bg-white px-2.5 text-xs font-medium text-[#1A73E8] transition hover:bg-[#E8F0FE] dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-sky-950/30"
        >
          <Plus className="h-3.5 w-3.5" /> Thêm giai đoạn
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {draft.stages.map((stage) => (
            <StageColumn
              key={stage.uid}
              stage={stage}
              canDelete={draft.stages.length > 1}
              onPatchStage={(patch) =>
                setDraft((prev) => ({
                  ...prev,
                  stages: prev.stages.map((s) => (s.uid === stage.uid ? { ...s, ...patch } : s)),
                }))
              }
              onPatchTask={(taskId, patch) =>
                setDraft((prev) => ({
                  ...prev,
                  stages: prev.stages.map((s) =>
                    s.uid === stage.uid
                      ? {
                          ...s,
                          tasks: s.tasks.map((t) => (t.uid === taskId ? { ...t, ...patch } : t)),
                        }
                      : s,
                  ),
                }))
              }
              onDeleteTask={(taskId) =>
                setDraft((prev) => ({
                  ...prev,
                  stages: prev.stages.map((s) =>
                    s.uid === stage.uid
                      ? { ...s, tasks: s.tasks.filter((t) => t.uid !== taskId) }
                      : s,
                  ),
                }))
              }
              onAddTask={() =>
                setDraft((prev) => ({
                  ...prev,
                  stages: prev.stages.map((s) =>
                    s.uid === stage.uid
                      ? {
                          ...s,
                          tasks: [
                            ...s.tasks,
                            {
                              uid: taskUid(),
                              title: '',
                              description: '',
                              category: 'learning',
                              priority: 'medium',
                              estimatedHours: 2,
                            },
                          ],
                        }
                      : s,
                  ),
                }))
              }
              onDeleteStage={() =>
                setDraft((prev) => ({
                  ...prev,
                  stages: prev.stages.filter((s) => s.uid !== stage.uid),
                }))
              }
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <div className="rounded-xl border border-[#1A73E8] bg-white p-3 text-sm shadow-lg">
              {activeTask.title || '(Task không tên)'}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
