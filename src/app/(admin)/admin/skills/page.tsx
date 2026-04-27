'use client';

import { useMemo, useState } from 'react';
import { Edit2, Plus, Search, Sparkles, Tag, Target, Trash2, X } from 'lucide-react';
import { AdminHeader } from '@/components/shared/AdminHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog } from '@/components/ui/dialog';
import { toast } from '@/lib/toast';
import {
  useAiSuggestSkills,
  useCreateSkill,
  useDeletePositionSkill,
  useDeleteSkill,
  usePositionSkills,
  usePositionTitles,
  useSkills,
  useUpdateSkill,
  useUpsertPositionSkill,
} from '@/hooks/useSkillGap';
import type { AiSkillSuggestion, Skill } from '@/types/skill-gap';

export default function AdminSkillsPage() {
  const [tab, setTab] = useState<'catalog' | 'positions'>('catalog');

  return (
    <>
      <AdminHeader />
      <div className="px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý Skill</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Quản lý kho kỹ năng và yêu cầu kỹ năng cho từng vị trí. Hệ thống dựa vào đây để tính
            skill gap cho mọi nhân viên.
          </p>
        </div>

        <div className="mb-4 inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          <TabButton active={tab === 'catalog'} onClick={() => setTab('catalog')}>
            Kho kỹ năng
          </TabButton>
          <TabButton active={tab === 'positions'} onClick={() => setTab('positions')}>
            Mapping theo vị trí
          </TabButton>
        </div>

        {tab === 'catalog' ? <CatalogTab /> : <PositionMappingTab />}
      </div>
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
        active
          ? 'bg-indigo-500 text-white shadow-sm'
          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

// ============================================================
// Catalog Tab
// ============================================================

function CatalogTab() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const { data: skills = [], isLoading } = useSkills();
  const create = useCreateSkill();
  const update = useUpdateSkill();
  const remove = useDeleteSkill();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: '' });
  const [confirmDelete, setConfirmDelete] = useState<Skill | null>(null);

  const filtered = useMemo(
    () =>
      skills.filter((s) => {
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (category && s.category !== category) return false;
        return true;
      }),
    [skills, search, category],
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(skills.map((s) => s.category).filter((c): c is string => Boolean(c))),
      ).sort(),
    [skills],
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', category: '' });
    setShowForm(true);
  };

  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description ?? '', category: s.category ?? '' });
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Tên kỹ năng không được để trống');
      return;
    }
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, input: form });
        toast.success('Đã cập nhật');
      } else {
        await create.mutateAsync(form);
        toast.success('Đã tạo kỹ năng');
      }
      setShowForm(false);
    } catch (err) {
      toast.error((err as Error).message || 'Lỗi xảy ra');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Tìm kỹ năng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-10 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Tất cả nhóm</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          Thêm kỹ năng
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Tag className="size-10" />}
          title="Chưa có kỹ năng"
          description="Thêm kỹ năng đầu tiên để bắt đầu mapping cho các vị trí."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{s.name}</h3>
                  {s.category && (
                    <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {s.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(s)}
                    aria-label="Chỉnh sửa"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(s)}
                    aria-label="Xóa"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {s.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300">{s.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onClose={() => setShowForm(false)} ariaLabel="Form kỹ năng">
        <form onSubmit={submit} className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {editing ? 'Sửa kỹ năng' : 'Thêm kỹ năng mới'}
          </h3>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Tên kỹ năng *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Nhóm
            </label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Soft Skills / Technical / Leadership..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Mô tả
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={create.isPending || update.isPending}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-60"
            >
              {editing ? 'Cập nhật' : 'Tạo'}
            </button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        ariaLabel="Xác nhận xóa"
      >
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Xóa kỹ năng?</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Sẽ xóa <strong>{confirmDelete?.name}</strong> và mọi đánh giá / mapping liên quan. Không
            thể hoàn tác.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!confirmDelete) return;
                try {
                  await remove.mutateAsync(confirmDelete.id);
                  toast.success('Đã xóa');
                  setConfirmDelete(null);
                } catch (err) {
                  toast.error((err as Error).message);
                }
              }}
              disabled={remove.isPending}
              className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-60"
            >
              Xóa
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

// ============================================================
// Position Mapping Tab
// ============================================================

function PositionMappingTab() {
  const { data: positions = [] } = usePositionTitles();
  const [pickedPosition, setPickedPosition] = useState<string | null>(null);
  const position = useMemo(
    () => pickedPosition ?? (positions.length > 0 ? positions[0] : null),
    [pickedPosition, positions],
  );

  const { data: positionSkills = [], isLoading } = usePositionSkills(position);
  const { data: allSkills = [] } = useSkills({ isActive: true });
  const upsert = useUpsertPositionSkill();
  const remove = useDeletePositionSkill();
  const aiSuggest = useAiSuggestSkills();
  const create = useCreateSkill();
  const [showAdd, setShowAdd] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [aiContext, setAiContext] = useState('');
  const [aiResult, setAiResult] = useState<AiSkillSuggestion[] | null>(null);
  const [aiSource, setAiSource] = useState<'ai' | 'fallback' | null>(null);

  const [pickedSkillId, setPickedSkillId] = useState('');
  const [form, setForm] = useState({
    targetLevel: 4,
    weight: 1,
    isCore: false,
  });

  const availableSkills = useMemo(
    () => allSkills.filter((s) => !positionSkills.some((p) => p.skillId === s.id)),
    [allSkills, positionSkills],
  );

  const formSkillId = useMemo(
    () =>
      pickedSkillId && availableSkills.some((s) => s.id === pickedSkillId)
        ? pickedSkillId
        : (availableSkills[0]?.id ?? ''),
    [pickedSkillId, availableSkills],
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position || !formSkillId) return;
    try {
      await upsert.mutateAsync({
        positionTitle: position,
        skillId: formSkillId,
        targetLevel: form.targetLevel,
        weight: form.weight,
        isCore: form.isCore,
      });
      toast.success('Đã thêm kỹ năng cho vị trí');
      setShowAdd(false);
      setPickedSkillId('');
      setForm({ targetLevel: 4, weight: 1, isCore: false });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const updateRow = async (
    psId: string,
    skillId: string,
    field: 'targetLevel' | 'weight' | 'isCore',
    value: number | boolean,
    base: { targetLevel: number; weight: number; isCore: boolean },
  ) => {
    if (!position) return;
    try {
      await upsert.mutateAsync({
        positionTitle: position,
        skillId,
        targetLevel: field === 'targetLevel' ? (value as number) : base.targetLevel,
        weight: field === 'weight' ? (value as number) : base.weight,
        isCore: field === 'isCore' ? (value as boolean) : base.isCore,
      });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const runAiSuggest = async () => {
    if (!position) return;
    try {
      const r = await aiSuggest.mutateAsync({ positionTitle: position, context: aiContext });
      setAiResult(r.suggestions);
      setAiSource(r.source);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const applyAiSuggestion = async (sug: AiSkillSuggestion) => {
    if (!position) return;
    try {
      const existing = allSkills.find((s) => s.name.toLowerCase() === sug.name.toLowerCase());
      const skill =
        existing ??
        (await create.mutateAsync({
          name: sug.name,
          description: sug.description,
          category: sug.category,
        }));
      await upsert.mutateAsync({
        positionTitle: position,
        skillId: skill.id,
        targetLevel: sug.targetLevel,
        weight: sug.weight,
        isCore: sug.isCore,
      });
      toast.success(`Đã thêm "${sug.name}"`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Target className="h-4 w-4 text-slate-500" />
          <select
            value={position ?? ''}
            onChange={(e) => setPickedPosition(e.target.value || null)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Chọn vị trí</option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {position && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {positionSkills.length} kỹ năng yêu cầu
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowAi(true)}
            disabled={!position}
            className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4" />
            AI gợi ý
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            disabled={!position || availableSkills.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Thêm kỹ năng
          </button>
        </div>
      </div>

      {!position ? (
        <EmptyState
          icon={<Target className="size-10" />}
          title="Chưa chọn vị trí"
          description="Chọn một vị trí để xem và thiết lập kỹ năng yêu cầu."
        />
      ) : isLoading ? (
        <Skeleton className="h-64" />
      ) : positionSkills.length === 0 ? (
        <EmptyState
          icon={<Target className="size-10" />}
          title="Vị trí chưa có kỹ năng yêu cầu"
          description="Thêm thủ công hoặc dùng AI để gợi ý nhanh các kỹ năng phù hợp."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs tracking-wide text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Kỹ năng</th>
                <th className="px-4 py-3">Nhóm</th>
                <th className="px-4 py-3">Mức yêu cầu</th>
                <th className="px-4 py-3">Trọng số</th>
                <th className="px-4 py-3">Cốt lõi</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {positionSkills.map((ps) => (
                <tr
                  key={ps.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/30"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {ps.skill.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {ps.skill.category ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() =>
                            updateRow(ps.id, ps.skillId, 'targetLevel', lvl, {
                              targetLevel: ps.targetLevel,
                              weight: ps.weight,
                              isCore: ps.isCore,
                            })
                          }
                          className={`h-7 w-7 rounded-md text-xs font-semibold transition ${
                            ps.targetLevel === lvl
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="3"
                      value={ps.weight}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (Number.isFinite(v)) {
                          updateRow(ps.id, ps.skillId, 'weight', v, {
                            targetLevel: ps.targetLevel,
                            weight: ps.weight,
                            isCore: ps.isCore,
                          });
                        }
                      }}
                      className="w-20 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={ps.isCore}
                        onChange={(e) =>
                          updateRow(ps.id, ps.skillId, 'isCore', e.target.checked, {
                            targetLevel: ps.targetLevel,
                            weight: ps.weight,
                            isCore: ps.isCore,
                          })
                        }
                        className="h-4 w-4 rounded"
                      />
                      <span className="text-slate-600 dark:text-slate-300">Core</span>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await remove.mutateAsync(ps.id);
                          toast.success('Đã xóa');
                        } catch (err) {
                          toast.error((err as Error).message);
                        }
                      }}
                      aria-label="Xóa"
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={showAdd} onClose={() => setShowAdd(false)} ariaLabel="Thêm kỹ năng cho vị trí">
        <form onSubmit={handleAdd} className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Thêm kỹ năng cho {position}
          </h3>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Kỹ năng
            </label>
            <select
              required
              value={formSkillId}
              onChange={(e) => setPickedSkillId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {availableSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Mức yêu cầu
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.targetLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    targetLevel: Math.max(1, Math.min(5, parseInt(e.target.value) || 3)),
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Trọng số
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="3"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 1 })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isCore}
              onChange={(e) => setForm({ ...form, isCore: e.target.checked })}
              className="h-4 w-4 rounded"
            />
            <span className="text-slate-700 dark:text-slate-200">Là kỹ năng cốt lõi</span>
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={upsert.isPending}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-60"
            >
              Thêm
            </button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={showAi}
        onClose={() => {
          setShowAi(false);
          setAiResult(null);
          setAiContext('');
        }}
        ariaLabel="AI gợi ý kỹ năng"
      >
        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              AI gợi ý kỹ năng cho {position}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowAi(false);
                setAiResult(null);
                setAiContext('');
              }}
              aria-label="Đóng"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!aiResult ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Ngữ cảnh thêm (tuỳ chọn)
                </label>
                <textarea
                  rows={3}
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  placeholder="VD: Công ty SaaS, vị trí remote-first, làm với khách hàng quốc tế..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={runAiSuggest}
                  disabled={aiSuggest.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-60"
                >
                  <Sparkles className="h-4 w-4" />
                  {aiSuggest.isPending ? 'Đang gợi ý...' : 'Gợi ý kỹ năng'}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {aiSource === 'fallback' && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                  AI không khả dụng — đang dùng gợi ý mẫu. Cấu hình GEMINI_API_KEY để có gợi ý
                  chuyên sâu hơn.
                </p>
              )}
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {aiResult.map((s, i) => (
                  <div
                    key={`${s.name}-${i}`}
                    className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{s.name}</h4>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {s.category}
                          </span>
                          {s.isCore && (
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                              CORE
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Mức {s.targetLevel} · weight {s.weight.toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          {s.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyAiSuggestion(s)}
                        disabled={upsert.isPending || create.isPending}
                        className="shrink-0 rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-600 disabled:opacity-60"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAiResult(null)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Gợi ý lại với ngữ cảnh khác
              </button>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
