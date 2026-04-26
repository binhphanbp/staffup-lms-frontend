'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/shared/Toast';
import { resolveMediaUrl } from '@/lib/media';
import {
  useCategories,
  useCourses,
  useCreateCourse,
  useDeleteCourse,
  useUpdateCourse,
  useUpdateCourseStatus,
} from '@/hooks/useCourses';
import { useMediaFolders } from '@/hooks/useMedia';
import { useUsers } from '@/hooks/useUsers';
import type { CourseListItem, CourseListParams, CourseStatus } from '@/types';

const LIMIT = 10;

const STATUS_MAP: Record<CourseStatus, { label: string; cls: string }> = {
  published: { label: 'Đã xuất bản', cls: 'bg-[#E6F4EA] text-[#1E8E3E]' },
  draft: { label: 'Bản nháp', cls: 'bg-[#F1F3F4] text-[#5F6368]' },
  archived: { label: 'Lưu trữ', cls: 'bg-[#FCE8E6] text-[#C5221F]' },
};

type FormMode = 'create' | 'edit';

interface FormState {
  title: string;
  description: string;
  categoryId: string;
  trainerId: string;
  estimatedDurationMinutes: string;
  thumbnailUrl: string;
  status: CourseStatus;
}

const EMPTY: FormState = {
  title: '',
  description: '',
  categoryId: '',
  trainerId: '',
  estimatedDurationMinutes: '',
  thumbnailUrl: '',
  status: 'draft',
};

/* ── Media Folder Modal ───────────────────────────────── */
function CourseMediaModal({
  course,
  onClose,
  onSuccess,
}: {
  course: CourseListItem | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [currentPath, setCurrentPath] = useState<string | null>(course?.mediaFolder ?? null);
  const updateCourse = useUpdateCourse();
  const { data, isLoading, isError } = useMediaFolders(currentPath, Boolean(course));
  const folders = data?.items ?? [];
  if (!course) return null;

  const pathSegments = (currentPath ?? '').split('/').filter(Boolean);

  const handleAssign = (folderPath: string | null) => {
    updateCourse.mutate(
      { id: course.id, payload: { mediaFolder: folderPath } },
      {
        onSuccess: () => {
          onSuccess(folderPath ? `Đã gán folder: ${folderPath}` : 'Đã bỏ gán folder');
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-semibold text-[#202124]">Gán folder media</h2>
            <p className="mt-1 text-[12px] text-[#5F6368]">{course.title}</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-[#5F6368] hover:bg-[#F1F3F4]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div className="rounded-lg border border-[#DADCE0] bg-[#F8F9FA] p-3 text-[12px] text-[#5F6368]">
            <div>
              Folder hiện tại: <strong>{course.mediaFolder ?? 'Chưa gán'}</strong>
            </div>
            <div className="mt-1">
              Đang duyệt: <strong>{currentPath ?? 'ROOT'}</strong>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAssign(currentPath)}
              disabled={!currentPath || updateCourse.isPending}
              className="rounded bg-[#1A73E8] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#174EA6] disabled:opacity-50"
            >
              Chọn folder đang mở
            </button>
            <button
              type="button"
              onClick={() => setCurrentPath(null)}
              className="rounded border border-[#DADCE0] px-3 py-2 text-[12px] font-medium text-[#5F6368] hover:bg-[#F1F3F4]"
            >
              Về root
            </button>
            <button
              type="button"
              onClick={() => handleAssign(null)}
              disabled={updateCourse.isPending}
              className="rounded border border-[#DADCE0] px-3 py-2 text-[12px] font-medium text-[#5F6368] hover:bg-[#F1F3F4] disabled:opacity-50"
            >
              Bỏ gán folder
            </button>
          </div>
          {/* Breadcrumb */}
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setCurrentPath(null)}
              className={`rounded-full px-2.5 py-1 text-[11px] ${currentPath === null ? 'bg-[#E8F0FE] text-[#174EA6]' : 'bg-[#F1F3F4] text-[#5F6368] hover:bg-[#E0E0E0]'}`}
            >
              ROOT
            </button>
            {pathSegments.map((_, i) => {
              const p = pathSegments.slice(0, i + 1).join('/');
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPath(p)}
                  className={`rounded-full px-2.5 py-1 text-[11px] ${p === currentPath ? 'bg-[#E8F0FE] text-[#174EA6]' : 'bg-[#F1F3F4] text-[#5F6368] hover:bg-[#E0E0E0]'}`}
                >
                  {pathSegments[i]}
                </button>
              );
            })}
          </div>
          {/* Folder list */}
          {isLoading && (
            <div className="py-4 text-center text-[13px] text-[#5F6368]">Đang tải...</div>
          )}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-600">
              Không tải được danh sách folder.
            </div>
          )}
          {!isLoading && !isError && (
            <div className="max-h-[320px] space-y-2 overflow-y-auto">
              {folders.length === 0 ? (
                <div className="py-4 text-center text-[13px] text-[#5F6368]">
                  Không có folder con.
                </div>
              ) : (
                folders.map((f) => (
                  <div
                    key={f.path}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 ${f.path === course.mediaFolder ? 'border-[#1A73E8] bg-[#E8F0FE]' : 'border-[#DADCE0] hover:bg-[#F8F9FA]'}`}
                  >
                    <div>
                      <div className="text-[13px] font-medium text-[#202124]">{f.name}</div>
                      <div className="text-[11px] text-[#5F6368]">{f.path}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAssign(f.path)}
                        disabled={updateCourse.isPending}
                        className="rounded bg-[#1A73E8] px-3 py-1.5 text-[11px] font-medium text-white hover:bg-[#174EA6] disabled:opacity-50"
                      >
                        Gán
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPath(f.path)}
                        className="rounded border border-[#DADCE0] px-3 py-1.5 text-[11px] font-medium text-[#5F6368] hover:bg-[#F1F3F4]"
                      >
                        Mở
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Modal ────────────────────────────────────────────── */
function CourseFormModal({
  open,
  mode,
  value,
  categories,
  trainers,
  onChange,
  onClose,
  onSubmit,
  submitting,
}: {
  open: boolean;
  mode: FormMode;
  value: FormState;
  categories: Array<{ id: string; name: string }>;
  trainers: Array<{ id: string; fullName: string }>;
  onChange: (f: keyof FormState, v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-4">
          <h2 className="text-[18px] font-semibold text-[#202124]">
            {mode === 'create' ? 'Thêm khóa học' : 'Chỉnh sửa khóa học'}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-[#5F6368] hover:bg-[#F1F3F4]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">
              Tên khóa học <span className="text-red-500">*</span>
            </label>
            <input
              value={value.title}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full rounded border border-[#DADCE0] px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">Mô tả</label>
            <textarea
              rows={3}
              value={value.description}
              onChange={(e) => onChange('description', e.target.value)}
              className="w-full rounded border border-[#DADCE0] px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#202124]">Danh mục</label>
              <select
                value={value.categoryId}
                onChange={(e) => onChange('categoryId', e.target.value)}
                className="w-full rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#202124]">
                Giảng viên
              </label>
              <select
                value={value.trainerId}
                onChange={(e) => onChange('trainerId', e.target.value)}
                className="w-full rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
              >
                <option value="">Chọn giảng viên</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">
              Ảnh thumbnail (URL)
            </label>
            <input
              value={value.thumbnailUrl}
              onChange={(e) => onChange('thumbnailUrl', e.target.value)}
              placeholder="https://... hoặc /uploads/..."
              className="w-full rounded border border-[#DADCE0] px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
            />
            {value.thumbnailUrl && (
              <div className="mt-2">
                <img
                  src={resolveMediaUrl(value.thumbnailUrl) ?? value.thumbnailUrl}
                  alt="preview"
                  className="h-20 rounded border border-[#DADCE0] object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#202124]">
                Thời lượng (phút)
              </label>
              <input
                type="number"
                min={0}
                value={value.estimatedDurationMinutes}
                onChange={(e) => onChange('estimatedDurationMinutes', e.target.value)}
                className="w-full rounded border border-[#DADCE0] px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
              />
            </div>
            {mode === 'edit' && (
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#202124]">
                  Trạng thái
                </label>
                <select
                  value={value.status}
                  onChange={(e) => onChange('status', e.target.value)}
                  className="w-full rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#E0E0E0] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded border border-[#DADCE0] px-4 py-2 text-[13px] font-medium text-[#5F6368] hover:bg-[#F1F3F4]"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="rounded bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#174EA6] disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : mode === 'create' ? 'Tạo khóa học' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function CoursesManagementPage() {
  const router = useRouter();
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<CourseStatus | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingCourse, setEditingCourse] = useState<CourseListItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [mediaModalCourse, setMediaModalCourse] = useState<CourseListItem | null>(null);

  const params: CourseListParams = {
    page,
    limit: LIMIT,
    expand: 'counts',
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
  };

  const { data, isLoading, isError, error } = useCourses(params);
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const updateStatus = useUpdateCourseStatus();
  const { data: categoriesData } = useCategories();
  const { data: trainersData } = useUsers({ roleCode: 'trainer', limit: 100 });

  const courses = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 1 };
  const categories = useMemo(
    () => categoriesData?.map((c) => ({ id: c.id, name: c.name })) ?? [],
    [categoriesData],
  );
  const trainers = useMemo(
    () => trainersData?.data?.map((t) => ({ id: t.id, fullName: t.fullName })) ?? [],
    [trainersData],
  );

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    window.setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const openCreate = () => {
    setFormMode('create');
    setEditingCourse(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (c: CourseListItem) => {
    setFormMode('edit');
    setEditingCourse(c);
    setForm({
      title: c.title,
      description: c.description ?? '',
      categoryId: c.category?.id ?? '',
      trainerId: c.trainer?.id ?? '',
      estimatedDurationMinutes: c.estimatedDurationMinutes?.toString() ?? '',
      thumbnailUrl: c.thumbnailUrl ?? '',
      status: c.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCourse(null);
    setForm(EMPTY);
  };

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitForm = async () => {
    if (!form.title.trim()) {
      showToast('Vui lòng nhập tên khóa học.');
      return;
    }

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      categoryId: form.categoryId || undefined,
      trainerId: form.trainerId || undefined,
      thumbnailUrl: form.thumbnailUrl.trim() || null,
      estimatedDurationMinutes: form.estimatedDurationMinutes
        ? Number(form.estimatedDurationMinutes)
        : undefined,
    };

    try {
      if (formMode === 'create') {
        await createCourse.mutateAsync(payload);
        showToast('Đã tạo khóa học mới');
      } else if (editingCourse) {
        if (form.status !== editingCourse.status) {
          payload.status = form.status;
        }
        await updateCourse.mutateAsync({ id: editingCourse.id, payload });
        showToast('Đã cập nhật khóa học');
      }
      closeModal();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Không thể lưu khóa học.');
    }
  };

  const handleDelete = async (c: CourseListItem) => {
    if (!window.confirm(`Xóa khóa học "${c.title}"?`)) return;
    try {
      await deleteCourse.mutateAsync(c.id);
      showToast('Đã xóa khóa học');
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Không thể xóa khóa học.');
    }
  };

  const handleStatusChange = (id: string, status: CourseStatus) => {
    updateStatus.mutate({ id, status }, { onSuccess: () => showToast('Đã cập nhật trạng thái') });
  };

  const fmtDuration = (m: number | null) => {
    if (!m) return '—';
    const h = Math.floor(m / 60);
    const r = m % 60;
    return h ? `${h}h${r ? ` ${r}m` : ''}` : `${r}m`;
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">Quản lý Khóa học</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/ai-course-studio')}
              className="flex items-center gap-2 rounded border border-[#1A73E8] bg-white px-4 py-2 text-[13px] font-medium text-[#1A73E8] shadow-sm hover:bg-[#E8F0FE]"
              title="Sinh nguyên khoá học bằng AI từ chủ đề / tài liệu"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              Tạo bằng AI
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-[#174EA6]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Thêm khóa học
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            {
              icon: 'school',
              bg: 'bg-[#E8F0FE]',
              color: 'text-[#1A73E8]',
              label: 'TỔNG KHÓA HỌC',
              val: meta.total,
            },
            {
              icon: 'check_circle',
              bg: 'bg-[#E6F4EA]',
              color: 'text-[#34A853]',
              label: 'ĐÃ XUẤT BẢN',
              val: courses.filter((c) => c.status === 'published').length,
            },
            {
              icon: 'edit_note',
              bg: 'bg-[#FEF7E0]',
              color: 'text-[#F9AB00]',
              label: 'BẢN NHÁP',
              val: courses.filter((c) => c.status === 'draft').length,
            },
            {
              icon: 'archive',
              bg: 'bg-[#FCE8E6]',
              color: 'text-[#EA4335]',
              label: 'LƯU TRỮ',
              val: courses.filter((c) => c.status === 'archived').length,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4"
            >
              <div
                className={`flex h-[48px] w-[48px] items-center justify-center rounded-lg ${s.bg}`}
              >
                <span className={`material-symbols-outlined text-[24px] ${s.color}`}>{s.icon}</span>
              </div>
              <div>
                <div className="text-[28px] font-normal text-[#202124]">
                  {isLoading ? '—' : s.val}
                </div>
                <div className="text-[12px] text-[#5F6368]">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-[#5F6368]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm tên khóa học..."
              className="w-full rounded border border-[#DADCE0] bg-white py-2 pr-4 pl-10 text-[13px] text-[#202124] outline-none focus:border-[#1A73E8]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as CourseStatus | '');
              setPage(1);
            }}
            className="rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none focus:border-[#1A73E8]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="published">Đã xuất bản</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DADCE0] border-t-[#1A73E8]" />
              <span className="text-[13px] text-[#5F6368]">Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="material-symbols-outlined text-[48px] text-[#EA4335]">error</span>
              <span className="text-[14px] text-[#202124]">Không thể tải danh sách khóa học</span>
              <span className="text-[12px] text-[#5F6368]">
                {error instanceof Error ? error.message : 'Đã xảy ra lỗi'}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
              <table className="w-full border-collapse">
                <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Khóa học
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Danh mục
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Giảng viên
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Thông tin
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Media folder
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Trạng thái
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-[13px] text-[#5F6368]">
                        Không tìm thấy khóa học nào
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => {
                      const st = STATUS_MAP[course.status];
                      const thumb = resolveMediaUrl(course.thumbnailUrl);
                      return (
                        <tr key={course.id} className="transition-colors hover:bg-[#F8F9FA]">
                          {/* Course info */}
                          <td className="border-b border-[#F1F3F4] px-4 py-3">
                            <div className="flex items-center gap-3">
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt=""
                                  className="h-10 w-14 rounded object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-14 items-center justify-center rounded bg-[#E8F0FE]">
                                  <span className="material-symbols-outlined text-[20px] text-[#1A73E8]">
                                    school
                                  </span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="truncate text-[13px] font-medium text-[#202124]">
                                  {course.title}
                                </div>
                                <div className="truncate text-[12px] text-[#5F6368]">
                                  {fmtDuration(course.estimatedDurationMinutes)}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Category */}
                          <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                            {course.category?.name ?? '—'}
                          </td>
                          {/* Trainer */}
                          <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                            {course.trainer?.fullName ?? '—'}
                          </td>
                          {/* Counts */}
                          <td className="border-b border-[#F1F3F4] px-4 py-3">
                            <div className="text-[12px] text-[#5F6368]">
                              {course.counts?.modules ?? 0} modules
                            </div>
                            <div className="text-[12px] text-[#5F6368]">
                              {course.counts?.enrollments ?? 0} học viên
                            </div>
                          </td>
                          {/* Status */}
                          {/* Media folder */}
                          <td className="border-b border-[#F1F3F4] px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="max-w-[120px] truncate text-[12px] text-[#5F6368]">
                                {course.mediaFolder ?? 'Chưa gán'}
                              </span>
                              <button
                                onClick={() => setMediaModalCourse(course)}
                                title="Gán folder"
                                className="flex h-7 w-7 items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] hover:bg-[#F1F3F4]"
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  folder_open
                                </span>
                              </button>
                            </div>
                          </td>
                          <td className="border-b border-[#F1F3F4] px-4 py-3">
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-[12px] font-medium ${st.cls}`}
                            >
                              {st.label}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="border-b border-[#F1F3F4] px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <button
                                onClick={() => openEdit(course)}
                                title="Sửa"
                                className="flex h-8 w-8 items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] hover:bg-[#F1F3F4]"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              {course.status === 'draft' && (
                                <button
                                  onClick={() => handleStatusChange(course.id, 'published')}
                                  title="Xuất bản"
                                  className="flex h-8 w-8 items-center justify-center rounded bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#CEEAD6]"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    publish
                                  </span>
                                </button>
                              )}
                              {course.status === 'published' && (
                                <button
                                  onClick={() => handleStatusChange(course.id, 'archived')}
                                  title="Lưu trữ"
                                  className="flex h-8 w-8 items-center justify-center rounded bg-[#FEF7E0] text-[#F9AB00] hover:bg-[#FEEFC3]"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    archive
                                  </span>
                                </button>
                              )}
                              {course.status === 'archived' && (
                                <button
                                  onClick={() => handleStatusChange(course.id, 'draft')}
                                  title="Chuyển về nháp"
                                  className="flex h-8 w-8 items-center justify-center rounded bg-[#F1F3F4] text-[#5F6368] hover:bg-[#E0E0E0]"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    undo
                                  </span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(course)}
                                title="Xóa"
                                className="flex h-8 w-8 items-center justify-center rounded bg-red-50 text-red-600 hover:bg-red-100"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-[#DADCE0] px-6 py-3">
                <div className="text-[13px] text-[#5F6368]">
                  Trang {meta.page} / {meta.totalPages} — Tổng {meta.total} khóa học
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded border border-[#DADCE0] bg-white px-3 py-1.5 text-[13px] text-[#5F6368] hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    Trước
                  </button>
                  <button
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded border border-[#DADCE0] bg-white px-3 py-1.5 text-[13px] text-[#5F6368] hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <CourseFormModal
        open={modalOpen}
        mode={formMode}
        value={form}
        categories={categories}
        trainers={trainers}
        onChange={updateForm}
        onClose={closeModal}
        onSubmit={submitForm}
        submitting={createCourse.isPending || updateCourse.isPending}
      />

      <CourseMediaModal
        key={mediaModalCourse?.id ?? 'course-media-modal'}
        course={mediaModalCourse}
        onClose={() => setMediaModalCourse(null)}
        onSuccess={showToast}
      />

      <Toast visible={toast.visible} message={toast.message} />
    </>
  );
}
