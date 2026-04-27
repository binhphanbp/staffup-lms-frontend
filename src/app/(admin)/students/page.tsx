'use client';

import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Student } from '@/components/admin/students/types';
import { StudentsTable } from '@/components/admin/students/StudentsTable';
import { toast } from '@/lib/toast';
import {
  useCreateUser,
  useDeleteUser,
  useImportUsers,
  useToggleUserStatus,
  useUpdateUser,
  useUsers,
} from '@/hooks/useUsers';
import { departmentService } from '@/services/department.service';

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
    'Nguyen Van A',
    'nguyenvana@example.com',
    'Staffup123',
    'Engineering',
    'Frontend Developer',
    '',
    'employee',
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

function downloadTemplate() {
  const csv = TEMPLATE_CONTENT.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'learners-import-template.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function LearnerFormModal({
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
            {mode === 'create' ? 'Thêm học viên' : 'Sửa học viên'}
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
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">Chức danh</label>
            <input
              value={value.positionTitle}
              onChange={(event) => onChange('positionTitle', event.target.value)}
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
            {submitting ? 'Đang lưu...' : mode === 'create' ? 'Tạo học viên' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentsPage() {
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
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, isError } = useUsers({
    roleCode: 'employee',
    search: search || undefined,
    page,
    limit: LIMIT,
  });
  const importUsers = useImportUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const toggleUserStatus = useToggleUserStatus();
  const { data: departmentsData } = useQuery({
    queryKey: ['departments-for-users'],
    queryFn: () => departmentService.list(),
  });

  const departments =
    departmentsData?.map((department) => ({
      id: department.id,
      name: department.name,
    })) ?? [];

  const students: Student[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data
      .filter((user) => {
        if (statusFilter === '') return true;
        return statusFilter === 'active' ? user.isActive : !user.isActive;
      })
      .map((user, idx) => ({
        id: idx + 1 + (page - 1) * LIMIT,
        userId: user.id,
        initial: (user.fullName ?? '?')[0].toUpperCase(),
        name: user.fullName,
        email: user.email,
        departmentId: user.department?.id ?? null,
        department: user.department?.name ?? '--',
        role: user.positionTitle ?? user.roles?.[0]?.name ?? '--',
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        courses: 0,
        joinDate: new Date(user.createdAt).toLocaleDateString('vi-VN'),
        status: user.isActive ? 'active' : 'inactive',
      }));
  }, [data, page, statusFilter]);

  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const showToast = (message: string) => toast.success(message);

  const openCreateModal = () => {
    setFormMode('create');
    setEditingStudent(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setFormMode('edit');
    setEditingStudent(student);
    setForm({
      fullName: student.name,
      email: student.email,
      password: '',
      departmentId: student.departmentId ?? '',
      positionTitle: student.role === '--' ? '' : student.role,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStudent(null);
    setForm(EMPTY_FORM);
  };

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitForm = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.departmentId) {
      showToast('Vui lòng nhập đủ thông tin bắt buộc.');
      return;
    }

    if (formMode === 'create' && !form.password.trim()) {
      showToast('Vui lòng nhập mật khẩu cho học viên mới.');
      return;
    }

    try {
      if (formMode === 'create') {
        await createUser.mutateAsync({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          departmentId: form.departmentId,
          positionTitle: form.positionTitle.trim() || undefined,
          roleCode: 'employee',
        });
        showToast('Đã tạo học viên mới');
      } else if (editingStudent) {
        await updateUser.mutateAsync({
          id: editingStudent.userId,
          payload: {
            fullName: form.fullName.trim(),
            departmentId: form.departmentId,
            positionTitle: form.positionTitle.trim() || undefined,
          },
        });
        showToast('Đã cập nhật học viên');
      }

      closeModal();
    } catch (error: any) {
      showToast(error?.response?.data?.message || error?.message || 'Không thể lưu học viên.');
    }
  };

  const handleToggleStatus = async (student: Student) => {
    try {
      await toggleUserStatus.mutateAsync({
        id: student.userId,
        isActive: student.status !== 'active',
      });
      showToast(student.status === 'active' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || error?.message || 'Không thể cập nhật trạng thái.',
      );
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!window.confirm(`Xóa học viên "${student.name}"?`)) {
      return;
    }

    try {
      await deleteUser.mutateAsync(student.userId);
      showToast('Đã xóa học viên');
    } catch (error: any) {
      showToast(error?.response?.data?.message || error?.message || 'Không thể xóa học viên.');
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
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Không thể import file Excel.';
      showToast(message);
    }
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">
            Danh sách Học viên (Learners)
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
              Thêm học viên
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-[#5F6368]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
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
          {meta && <span className="text-[13px] text-[#5F6368]">{meta.total} học viên</span>}
        </div>

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

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DADCE0] border-t-[#1A73E8]" />
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20 text-[#D93025]">
            <span className="material-symbols-outlined text-[32px]">error</span>
            <span className="text-[14px]">Không thể tải danh sách học viên. Vui lòng thử lại.</span>
          </div>
        ) : (
          <>
            <StudentsTable
              students={students}
              onEdit={openEditModal}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteStudent}
            />

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[13px] text-[#5F6368]">
                  Trang {page} / {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-1.5 text-[13px] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    Trước
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-1.5 text-[13px] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <LearnerFormModal
        open={modalOpen}
        mode={formMode}
        value={form}
        departments={departments}
        onChange={updateForm}
        onClose={closeModal}
        onSubmit={submitForm}
        submitting={createUser.isPending || updateUser.isPending}
      />
    </>
  );
}
