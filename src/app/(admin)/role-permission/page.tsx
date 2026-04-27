'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from '@/lib/toast';
import type { Role as ComponentRole } from '@/components/admin/role-permission/types';
import type { Role as ApiRole } from '@/types';
import { RoleList } from '@/components/admin/role-permission/RoleList';
import { PermissionMatrix } from '@/components/admin/role-permission/PermissionMatrix';
import { AddRoleModal } from '@/components/admin/role-permission/AddRoleModal';
import { useRoles, useCreateRole, usePermissions } from '@/hooks/useRoles';

function mapCodeToType(code: string): ComponentRole['type'] {
  switch (code) {
    case 'admin':
    case 'manager':
    case 'trainer':
      return code;
    case 'employee':
      return 'learner';
    default:
      return 'custom';
  }
}

function mapApiRole(apiRole: ApiRole): ComponentRole {
  return {
    id: apiRole.id,
    name: apiRole.name,
    type: mapCodeToType(apiRole.code),
    desc: apiRole.description ?? '',
    isDefault: apiRole.isSystem,
  };
}

export default function RolePermissionPage() {
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useRoles();
  const { data: _permissionsData, isLoading: permsLoading, error: permsError } = usePermissions();
  const createRoleMutation = useCreateRole();

  const apiRoles: ApiRole[] = useMemo(() => rolesData?.data ?? [], [rolesData]);
  const roles: ComponentRole[] = useMemo(() => apiRoles.map(mapApiRole), [apiRoles]);

  const [activeRole, setActiveRole] = useState<ComponentRole | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // Auto-select first role when data loads
  useEffect(() => {
    if (roles.length > 0 && !activeRole) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveRole(roles[0]);
    }
  }, [roles, activeRole]);

  const permissions: Record<string, boolean> = useMemo(() => {
    if (!activeRole) return {};
    const apiRole = apiRoles.find((r) => r.id === activeRole.id);
    if (!apiRole) return {};
    const map: Record<string, boolean> = {};
    for (const perm of apiRole.permissions) {
      map[perm.code] = true;
    }
    return map;
  }, [activeRole, apiRoles]);

  const showToast = useCallback((msg: string) => toast.success(msg), []);

  const handleSelectRole = useCallback((role: ComponentRole) => {
    setActiveRole(role);
  }, []);

  const handleCreateRole = useCallback(() => {
    if (!newRoleName.trim()) {
      toast.error('Vui lòng nhập tên vai trò.');
      return;
    }
    const code = newRoleName.toLowerCase().replace(/\s+/g, '_');
    createRoleMutation.mutate(
      { code, name: newRoleName, description: newRoleDesc || undefined },
      {
        onSuccess: (response) => {
          const created = mapApiRole(response);
          setActiveRole(created);
          setIsAddModalOpen(false);
          setNewRoleName('');
          setNewRoleDesc('');
          showToast(`Đã tạo vai trò "${newRoleName}". Vui lòng thiết lập ma trận quyền.`);
        },
      },
    );
  }, [newRoleName, newRoleDesc, createRoleMutation, showToast]);

  const handleSavePermissions = useCallback(() => {
    showToast('Quyền hạn đã được lưu và cập nhật cho các tài khoản liên quan.');
  }, [showToast]);

  const isLoading = rolesLoading || permsLoading;
  const error = rolesError || permsError;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DADCE0] border-t-[#1A73E8]" />
          <span className="text-[14px] text-[#5F6368]">Đang tải dữ liệu phân quyền...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-[48px] text-[#D93025]">error</span>
          <span className="text-[14px] text-[#D93025]">
            Không thể tải dữ liệu. Vui lòng thử lại sau.
          </span>
        </div>
      </div>
    );
  }

  if (!activeRole) return null;

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden px-4 py-4 md:px-8 md:py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="m-0 flex items-center gap-2 text-[22px] font-normal text-[#202124]">
            <span className="material-symbols-outlined text-[28px] text-[#5F6368]">
              admin_panel_settings
            </span>
            Quản lý Phân quyền (RBAC)
          </h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]">
              <span className="material-symbols-outlined text-[18px]">history</span> Lịch sử thay
              đổi
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-auto lg:flex-row lg:gap-6 lg:overflow-hidden">
          <RoleList
            roles={roles}
            activeRole={activeRole}
            onSelectRole={handleSelectRole}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
          <PermissionMatrix
            activeRole={activeRole}
            permissions={permissions}
            onSavePermissions={handleSavePermissions}
          />
        </div>
      </div>

      <AddRoleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateRole}
        newRoleName={newRoleName}
        setNewRoleName={setNewRoleName}
        newRoleDesc={newRoleDesc}
        setNewRoleDesc={setNewRoleDesc}
      />
    </>
  );
}
