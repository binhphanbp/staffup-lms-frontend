'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { departmentService, type Department } from '@/services/department.service';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserListItem } from '@/types';

type FormMode = 'create' | 'edit';

interface FormState {
  name: string;
  managerUserId: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  name: '',
  managerUserId: '',
  isActive: true,
};

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function DepartmentModal({
  open,
  mode,
  value,
  managers,
  submitting,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: FormMode;
  value: FormState;
  managers: UserListItem[];
  submitting: boolean;
  onChange: <K extends keyof FormState>(field: K, nextValue: FormState[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-semibold text-[#202124]">
              {mode === 'create' ? 'Tạo phòng ban' : 'Cập nhật phòng ban'}
            </h2>
            <p className="mt-1 text-[13px] text-[#5F6368]">
              {mode === 'create'
                ? 'Thiết lập phòng ban mới và gán quản lý nếu cần.'
                : 'Chỉnh sửa thông tin và trạng thái phòng ban.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#5F6368] transition-colors hover:bg-[#F1F3F4]"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid gap-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">
              Tên phòng ban
            </label>
            <input
              value={value.name}
              onChange={(event) => onChange('name', event.target.value)}
              placeholder="Ví dụ: Engineering"
              className="w-full rounded-[4px] border border-[#DADCE0] px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#202124]">
              Quản lý phòng ban
            </label>
            <select
              value={value.managerUserId}
              onChange={(event) => onChange('managerUserId', event.target.value)}
              className="w-full rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#1A73E8]"
            >
              <option value="">Chưa gán quản lý</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.fullName} ({manager.email})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 rounded-[4px] border border-[#DADCE0] px-3 py-3">
            <input
              type="checkbox"
              checked={value.isActive}
              onChange={(event) => onChange('isActive', event.target.checked)}
              className="h-4 w-4 accent-[#1A73E8]"
            />
            <span className="text-[13px] text-[#202124]">Phòng ban đang hoạt động</span>
          </label>
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
            {submitting ? 'Đang lưu...' : mode === 'create' ? 'Tạo phòng ban' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roleCodes?.includes('admin') ?? false;
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const {
    data: departments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.list(),
  });

  const { data: managersData } = useQuery({
    queryKey: ['department-managers'],
    queryFn: () => userService.list({ roleCode: 'manager', page: 1, limit: 100 }),
    enabled: isAdmin,
  });

  const managers = managersData?.data ?? [];

  const createDepartment = useMutation({
    mutationFn: departmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const updateDepartment = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormState }) =>
      departmentService.update(id, {
        name: payload.name,
        isActive: payload.isActive,
        managerUserId: payload.managerUserId || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const deleteDepartment = useMutation({
    mutationFn: (id: string) => departmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const showToast = (message: string) => toast.success(message);

  const filteredDepartments = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return departments.filter((department) => {
      const matchesSearch =
        keyword === '' ||
        department.name.toLowerCase().includes(keyword) ||
        department.manager?.fullName.toLowerCase().includes(keyword) ||
        department.manager?.email.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? department.isActive : !department.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: departments.length,
      active: departments.filter((department) => department.isActive).length,
      inactive: departments.filter((department) => !department.isActive).length,
      assignedManager: departments.filter((department) => department.manager).length,
    }),
    [departments],
  );

  const resetModal = () => {
    setModalOpen(false);
    setEditingDepartment(null);
    setFormMode('create');
    setForm(EMPTY_FORM);
  };

  const openCreateModal = () => {
    setFormMode('create');
    setEditingDepartment(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setFormMode('edit');
    setEditingDepartment(department);
    setForm({
      name: department.name,
      managerUserId: department.manager?.id ?? '',
      isActive: department.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showToast('Vui lòng nhập tên phòng ban.');
      return;
    }

    try {
      if (formMode === 'create') {
        await createDepartment.mutateAsync({
          name: form.name.trim(),
          isActive: form.isActive,
          managerUserId: form.managerUserId || null,
        });
        showToast('Đã tạo phòng ban mới');
      } else if (editingDepartment) {
        await updateDepartment.mutateAsync({
          id: editingDepartment.id,
          payload: {
            name: form.name.trim(),
            isActive: form.isActive,
            managerUserId: form.managerUserId,
          },
        });
        showToast('Đã cập nhật phòng ban');
      }

      resetModal();
    } catch (error) {
      showToast(getErrorMessage(error, 'Không thể lưu phòng ban.'));
    }
  };

  const handleDelete = async (department: Department) => {
    const confirmed = window.confirm(`Xóa phòng ban "${department.name}"?`);
    if (!confirmed) return;

    try {
      await deleteDepartment.mutateAsync(department.id);
      showToast('Đã xóa phòng ban');
    } catch (error) {
      showToast(getErrorMessage(error, 'Không thể xóa phòng ban.'));
    }
  };

  if (!isAdmin) {
    return (
      <div className="px-6 py-6 lg:px-10">
        <div className="rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm">
          <h1 className="text-[22px] font-semibold text-[#202124]">Quản lý phòng ban</h1>
          <p className="mt-2 text-[14px] text-[#5F6368]">
            Chỉ tài khoản admin mới có quyền quản lý phòng ban.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-6 lg:px-10">
        <div className="rounded-[28px] border border-[#DADCE0] bg-white shadow-sm">
          <div className="border-b border-[#E8EAED] px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-[28px] leading-none font-normal text-[#202124]">
                  Quản lý phòng ban
                </div>
                <p className="mt-2 max-w-2xl text-[14px] text-[#5F6368]">
                  Admin có thể tạo, cập nhật, kích hoạt hoặc gỡ bỏ phòng ban và gán quản lý cho từng
                  đơn vị.
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#1A73E8] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#174EA6]"
              >
                <span className="material-symbols-outlined mr-2 text-[18px]">add</span>
                Tạo phòng ban
              </button>
            </div>
          </div>

          <div className="grid gap-4 border-b border-[#E8EAED] px-6 py-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-[#F8F9FA] p-4">
              <div className="text-[13px] text-[#5F6368]">Tổng phòng ban</div>
              <div className="mt-2 text-[28px] font-semibold text-[#202124]">{stats.total}</div>
            </div>
            <div className="rounded-2xl bg-[#E6F4EA] p-4">
              <div className="text-[13px] text-[#137333]">Đang hoạt động</div>
              <div className="mt-2 text-[28px] font-semibold text-[#137333]">{stats.active}</div>
            </div>
            <div className="rounded-2xl bg-[#FCE8E6] p-4">
              <div className="text-[13px] text-[#C5221F]">Ngừng hoạt động</div>
              <div className="mt-2 text-[28px] font-semibold text-[#C5221F]">{stats.inactive}</div>
            </div>
            <div className="rounded-2xl bg-[#E8F0FE] p-4">
              <div className="text-[13px] text-[#1A73E8]">Đã gán quản lý</div>
              <div className="mt-2 text-[28px] font-semibold text-[#1A73E8]">
                {stats.assignedManager}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-[#E8EAED] px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-[#5F6368]">
                  search
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm theo tên phòng ban hoặc quản lý"
                  className="h-11 w-full rounded-full border border-[#DADCE0] bg-white pr-4 pl-11 text-[14px] text-[#202124] outline-none focus:border-[#1A73E8]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as 'all' | 'active' | 'inactive')
                }
                className="h-11 rounded-full border border-[#DADCE0] bg-white px-4 text-[14px] text-[#202124] outline-none focus:border-[#1A73E8]"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F8F9FA]">
                <tr className="text-left text-[12px] font-medium tracking-[0.3px] text-[#5F6368] uppercase">
                  <th className="px-6 py-4">Phòng ban</th>
                  <th className="px-6 py-4">Quản lý</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[14px] text-[#5F6368]">
                      Đang tải danh sách phòng ban...
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[14px] text-[#C5221F]">
                      Không thể tải dữ liệu phòng ban.
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && filteredDepartments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[14px] text-[#5F6368]">
                      Không có phòng ban phù hợp.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !isError &&
                  filteredDepartments.map((department) => (
                    <tr key={department.id} className="border-t border-[#E8EAED]">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#202124]">{department.name}</div>
                        <div className="mt-1 text-[13px] text-[#5F6368]">ID: {department.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        {department.manager ? (
                          <div>
                            <div className="font-medium text-[#202124]">
                              {department.manager.fullName}
                            </div>
                            <div className="mt-1 text-[13px] text-[#5F6368]">
                              {department.manager.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[14px] text-[#5F6368]">Chưa gán</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ${
                            department.isActive
                              ? 'bg-[#E6F4EA] text-[#137333]'
                              : 'bg-[#FCE8E6] text-[#C5221F]'
                          }`}
                        >
                          {department.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#5F6368]">
                        {new Date(department.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(department)}
                            className="inline-flex h-9 items-center rounded-full border border-[#DADCE0] px-4 text-[13px] font-medium text-[#202124] transition-colors hover:bg-[#F1F3F4]"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(department)}
                            disabled={deleteDepartment.isPending}
                            className="inline-flex h-9 items-center rounded-full border border-[#F4C7C3] px-4 text-[13px] font-medium text-[#C5221F] transition-colors hover:bg-[#FCE8E6] disabled:opacity-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DepartmentModal
        open={modalOpen}
        mode={formMode}
        value={form}
        managers={managers}
        submitting={createDepartment.isPending || updateDepartment.isPending}
        onChange={(field, nextValue) => setForm((prev) => ({ ...prev, [field]: nextValue }))}
        onClose={resetModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
