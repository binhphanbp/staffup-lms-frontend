'use client';

import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Toast } from '@/components/shared/Toast';
import { resolveMediaUrl } from '@/lib/media';
import {
  useCreateUser,
  useDeleteUser,
  useImportUsers,
  useToggleUserStatus,
  useUpdateUser,
  useUsers,
} from '@/hooks/useUsers';
import { useAdminDashboard } from '@/hooks/useDashboard';
import { useAllQuizAttempts } from '@/hooks/useQuiz';
import { departmentService } from '@/services/department.service';
import type { UserListItem } from '@/types';

const LIMIT = 10;
const TEMPLATE_CONTENT = [
  [
    'fullName',
    'email',
    'password',
    'department',
    'positionTitle',
    'avatarUrl',
    'roleCode',
    'isActive',
  ],
  [
    'Tran Van B',
    'tranvanb@example.com',
    'Staffup123',
    'Engineering',
    'Tech Lead',
    '',
    'trainer',
    'true',
  ],
];

type FormMode = 'create' | 'edit';

interface FormState {
  fullName: string;
  email: string;
  password: string;
  departmentId: string;
  positionTitle: string;
}

const EMPTY_FORM: FormState = {
  fullName: '',
  email: '',
  password: '',
  departmentId: '',
  positionTitle: '',
};

function getInitial(fullName: string): string {
  const words = fullName.trim().split(/\s+/);
  if (words.length < 2) return words[0]?.[0]?.toUpperCase() ?? '';
  return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
}

function downloadTemplate() {
  const csv = TEMPLATE_CONTENT.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'instructors-import-template.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function InstructorFormModal({
  open,
  mode,
  value,
  departments,
  onChange,
  onClose,
  onSubmit,
  submitting,
}: {
  open: boolean;
  mode: FormMode;
  value: FormState;
  departments: Array<{ id: string; name: string }>;
  onChange: (field: keyof FormState, nextValue: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-4">
          <h2 className="text-[18px] font-semibold text-[#202124]">
            {mode === 'create' ? 'Thêm Giảng viên' : 'Sửa Giảng viên'}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#5F6368] transition-colors hover:bg-[#F1F3F4]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid gap-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">Họ tên</label>
            <input
              value={value.fullName}
              onChange={(event) => onChange('fullName', event.target.value)}
              className="w-full rounded-[4px] border border-[#DADCE0] px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">Email</label>
            <input
              type="email"
              value={value.email}
              disabled={mode === 'edit'}
              onChange={(event) => onChange('email', event.target.value)}
              className="w-full rounded-[4px] border border-[#DADCE0] px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8] disabled:bg-[#F8F9FA]"
            />
          </div>

          {mode === 'create' && (
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#202124]">Mật khẩu</label>
              <input
                type="password"
                value={value.password}
                onChange={(event) => onChange('password', event.target.value)}
                className="w-full rounded-[4px] border border-[#DADCE0] px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">Phòng ban</label>
            <select
              value={value.departmentId}
              onChange={(event) => onChange('departmentId', event.target.value)}
              className="w-full rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
            >
              <option value="">Chọn phòng ban</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">Chuyên môn</label>
            <input
              value={value.positionTitle}
              onChange={(event) => onChange('positionTitle', event.target.value)}
              placeholder="VD: Tech Lead, Senior Developer..."
              className="w-full rounded-[4px] border border-[#DADCE0] px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#E0E0E0] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-[4px] border border-[#DADCE0] px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4]"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#174EA6] disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : mode === 'create' ? 'Tạo giảng viên' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InstructorsPage() {
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'inactive'>('');
  const [importResult, setImportResult] = useState<{
    summary: {
      totalRows: number;
      successCount: number;
      errorCount: number;
      createdDepartmentCount: number;
    };
    errors: Array<{ row: number; email: string; reason: string }>;
    acceptedColumns: string[];
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingInstructor, setEditingInstructor] = useState<UserListItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, isError, error } = useUsers({
    roleCode: 'trainer',
    search: search || undefined,
    page,
    limit: LIMIT,
  });
  const importUsers = useImportUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const toggleUserStatus = useToggleUserStatus();
  const { data: adminStats } = useAdminDashboard();
  const { data: pendingGradingData } = useAllQuizAttempts({
    aiStatus: 'pending',
    limit: 1,
  });
  const { data: departmentsData } = useQuery({
    queryKey: ['departments-for-instructors'],
    queryFn: () => departmentService.list(),
  });

  const coursesCount = adminStats?.courses?.published ?? 0;
  const pendingGradingCount = pendingGradingData?.pagination.total ?? 0;

  const departments =
    departmentsData?.map((department) => ({
      id: department.id,
      name: department.name,
    })) ?? [];

  const instructors = useMemo(() => {
    if (!data?.data) return [];
    if (statusFilter === '') return data.data;
    return data.data.filter((user) => (statusFilter === 'active' ? user.isActive : !user.isActive));
  }, [data, statusFilter]);

  const meta = data?.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 1 };

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    window.setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const openCreateModal = () => {
    setFormMode('create');
    setEditingInstructor(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (instructor: UserListItem) => {
    setFormMode('edit');
    setEditingInstructor(instructor);
    setForm({
      fullName: instructor.fullName,
      email: instructor.email,
      password: '',
      departmentId: instructor.department?.id ?? '',
      positionTitle: instructor.positionTitle ?? '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingInstructor(null);
    setForm(EMPTY_FORM);
  };

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitForm = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      showToast('Vui lòng nhập đủ thông tin bắt buộc.');
      return;
    }

    if (formMode === 'create' && !form.password.trim()) {
      showToast('Vui lòng nhập mật khẩu cho giảng viên mới.');
      return;
    }

    try {
      if (formMode === 'create') {
        await createUser.mutateAsync({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          departmentId: form.departmentId || undefined,
          positionTitle: form.positionTitle.trim() || undefined,
          roleCode: 'trainer',
        });
        showToast('Đã tạo giảng viên mới');
      } else if (editingInstructor) {
        await updateUser.mutateAsync({
          id: editingInstructor.id,
          payload: {
            fullName: form.fullName.trim(),
            departmentId: form.departmentId || undefined,
            positionTitle: form.positionTitle.trim() || undefined,
          },
        });
        showToast('Đã cập nhật giảng viên');
      }

      closeModal();
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Không thể lưu giảng viên.');
    }
  };

  const handleToggleStatus = async (instructor: UserListItem) => {
    try {
      await toggleUserStatus.mutateAsync({
        id: instructor.id,
        isActive: !instructor.isActive,
      });
      showToast(instructor.isActive ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Không thể cập nhật trạng thái.');
    }
  };

  const handleDelete = async (instructor: UserListItem) => {
    if (!window.confirm(`Xóa giảng viên "${instructor.fullName}"?`)) {
      return;
    }

    try {
      await deleteUser.mutateAsync(instructor.id);
      showToast('Đã xóa giảng viên');
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Không thể xóa giảng viên.');
    }
  };

  const openImportPicker = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const result = await importUsers.mutateAsync(file);
      setImportResult({
        summary: result.summary,
        errors: result.errors,
        acceptedColumns: result.acceptedColumns,
      });
      showToast(
        `Import xong: ${result.summary.successCount}/${result.summary.totalRows} dòng thành công`,
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Không thể import file Excel.';
      showToast(message);
    }
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">
            Quản lý Giảng viên &amp; Tech Lead
          </h1>
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportFile}
            />
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Tải template
            </button>
            <button
              onClick={openImportPicker}
              disabled={importUsers.isPending}
              className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              {importUsers.isPending ? 'Đang import...' : 'Nhập từ Excel'}
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#174EA6]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Thêm Giảng viên
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-[#E8F0FE]">
              <span className="material-symbols-outlined text-[24px] text-[#1A73E8]">
                co_present
              </span>
            </div>
            <div>
              <div className="text-[28px] font-normal text-[#202124]">
                {isLoading ? '—' : meta.total}
              </div>
              <div className="text-[12px] text-[#5F6368]">TỔNG GIẢNG VIÊN</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-[#E6F4EA]">
              <span className="material-symbols-outlined text-[24px] text-[#34A853]">school</span>
            </div>
            <div>
              <div className="text-[28px] font-normal text-[#202124]">{coursesCount}</div>
              <div className="text-[12px] text-[#5F6368]">KHÓA HỌC ĐANG PHỤ TRÁCH</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-[#FEF7E0]">
              <span className="material-symbols-outlined text-[24px] text-[#F9AB00]">
                assignment
              </span>
            </div>
            <div>
              <div className="text-[28px] font-normal text-[#202124]">{pendingGradingCount}</div>
              <div className="text-[12px] text-[#5F6368]">BÀI TỰ LUẬN CHỜ CHẤM ĐIỂM</div>
            </div>
          </div>
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
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Tìm tên, email giảng viên..."
              className="w-full rounded-[4px] border border-[#DADCE0] bg-white py-2 pr-4 pl-10 text-[13px] text-[#202124] transition-colors outline-none focus:border-[#1A73E8]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as '' | 'active' | 'inactive');
              setPage(1);
            }}
            className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] transition-colors outline-none focus:border-[#1A73E8]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
          {/* <span className="text-[13px] text-[#5F6368]">{meta.total} giảng viên</span> */}
        </div>

        {/* Import Result */}
        {importResult && (
          <div className="mb-4 rounded-lg border border-[#DADCE0] bg-white p-4">
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#202124]">
              <span>Tổng dòng: {importResult.summary.totalRows}</span>
              <span>Thành công: {importResult.summary.successCount}</span>
              <span>Lỗi: {importResult.summary.errorCount}</span>
              <span>Phòng ban mới: {importResult.summary.createdDepartmentCount}</span>
            </div>
            {importResult.errors.length > 0 && (
              <div className="mt-3 rounded-md bg-[#FEF7E0] p-3 text-[12px] text-[#8A5B00]">
                <div className="mb-2 font-semibold">Một số dòng import lỗi:</div>
                <div className="space-y-1">
                  {importResult.errors.slice(0, 5).map((item) => (
                    <div key={`${item.row}-${item.email}`}>
                      Dòng {item.row} - {item.email || 'không có email'}: {item.reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-3 text-[12px] text-[#5F6368]">
              Cột hợp lệ: {importResult.acceptedColumns.join(', ')}
            </div>
          </div>
        )}

        {/* Loading / Error / Table */}
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
              <span className="text-[14px] text-[#202124]">Không thể tải danh sách giảng viên</span>
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
                      Thông tin Giảng viên
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Đơn vị / Phòng ban
                    </th>
                    <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                      Chuyên môn
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
                  {instructors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-[13px] text-[#5F6368]">
                        Không tìm thấy giảng viên nào
                      </td>
                    </tr>
                  ) : (
                    instructors.map((instructor) => (
                      <tr key={instructor.id} className="transition-colors hover:bg-[#F8F9FA]">
                        <td className="border-b border-[#F1F3F4] px-4 py-3">
                          <div className="flex items-center gap-3">
                            {instructor.avatarUrl ? (
                              <img
                                src={resolveMediaUrl(instructor.avatarUrl)!}
                                alt={instructor.fullName}
                                className="h-[32px] w-[32px] rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#FCE8E6] text-[12px] font-medium text-[#EA4335]">
                                {getInitial(instructor.fullName)}
                              </div>
                            )}
                            <div>
                              <div className="text-[13px] font-medium text-[#202124]">
                                {instructor.fullName}
                              </div>
                              <div className="text-[12px] text-[#5F6368]">{instructor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-[#F1F3F4] px-4 py-3">
                          <div className="text-[13px] font-medium text-[#202124]">
                            {instructor.department?.name ?? '—'}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {instructor.roles.map((role) => (
                              <span
                                key={role.id}
                                className="rounded bg-[#E8F0FE] px-2 py-0.5 text-[11px] text-[#1A73E8]"
                              >
                                {role.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="border-b border-[#F1F3F4] px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {instructor.positionTitle ? (
                              <span className="rounded bg-[#F1F3F4] px-2 py-1 text-[11px] text-[#5F6368]">
                                {instructor.positionTitle}
                              </span>
                            ) : (
                              <span className="text-[12px] text-[#5F6368]">—</span>
                            )}
                          </div>
                        </td>
                        <td className="border-b border-[#F1F3F4] px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium ${
                              instructor.isActive
                                ? 'bg-[#E6F4EA] text-[#34A853]'
                                : 'bg-[#F1F3F4] text-[#5F6368]'
                            }`}
                          >
                            {instructor.isActive ? 'Hoạt động' : 'Đã khóa'}
                          </span>
                        </td>
                        <td className="border-b border-[#F1F3F4] px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openEditModal(instructor)}
                              className="flex h-9 w-9 items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]"
                              title="Sửa giảng viên"
                            >
                              <i className="fa-solid fa-pen text-[13px]"></i>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(instructor)}
                              className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${
                                instructor.isActive
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-[#E8F0FE] text-[#174EA6] hover:bg-[#D8E3FD]'
                              }`}
                              title={instructor.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                            >
                              <i
                                className={`fa-solid ${instructor.isActive ? 'fa-lock' : 'fa-lock-open'} text-[13px]`}
                              ></i>
                            </button>
                            <button
                              onClick={() => handleDelete(instructor)}
                              className="flex h-9 w-9 items-center justify-center rounded bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                              title="Xóa giảng viên"
                            >
                              <i className="fa-solid fa-trash text-[13px]"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-[#DADCE0] px-6 py-3">
                <div className="text-[13px] text-[#5F6368]">
                  Trang {meta.page} / {meta.totalPages} — Tổng {meta.total} giảng viên
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-1.5 text-[13px] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    Trước
                  </button>
                  <button
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-1.5 text-[13px] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <InstructorFormModal
        open={modalOpen}
        mode={formMode}
        value={form}
        departments={departments}
        onChange={updateForm}
        onClose={closeModal}
        onSubmit={submitForm}
        submitting={createUser.isPending || updateUser.isPending}
      />

      <Toast visible={toast.visible} message={toast.message} />
    </>
  );
}
