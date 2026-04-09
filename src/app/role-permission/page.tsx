'use client';

import React, { useState } from 'react';
import type { Role } from '@/components/admin/role-permission/types';
import { RoleSidebar } from '@/components/admin/role-permission/RoleSidebar';
import { RoleHeader } from '@/components/admin/role-permission/RoleHeader';
import { RoleList } from '@/components/admin/role-permission/RoleList';
import { PermissionMatrix } from '@/components/admin/role-permission/PermissionMatrix';
import { AddRoleModal } from '@/components/admin/role-permission/AddRoleModal';

const INITIAL_ROLES: Role[] = [
  {
    id: 'r1',
    name: 'System Administrator',
    type: 'admin',
    desc: 'Toàn quyền truy cập và thay đổi cấu hình hệ thống, AI.',
    isDefault: true,
  },
  {
    id: 'r2',
    name: 'L&D Manager',
    type: 'manager',
    desc: 'Quản lý đào tạo, xem báo cáo, quản lý khóa học và học viên.',
    isDefault: true,
  },
  {
    id: 'r3',
    name: 'Trainer / Tech Lead',
    type: 'trainer',
    desc: 'Soạn thảo khóa học, tạo câu hỏi, chấm điểm bài tự luận.',
    isDefault: true,
  },
  {
    id: 'r4',
    name: 'Learner',
    type: 'learner',
    desc: 'Truy cập khóa học được gán, làm bài tập, xem chứng chỉ cá nhân.',
    isDefault: true,
  },
  {
    id: 'r5',
    name: 'Giảng viên Thuê ngoài',
    type: 'custom',
    desc: 'Chỉ có quyền xem và chấm điểm khóa học được chỉ định. Không có quyền sửa nội dung.',
    isDefault: false,
  },
];

export default function RolePermissionPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [activeRole, setActiveRole] = useState<Role>(INITIAL_ROLES[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleSelectRole = (role: Role) => {
    setActiveRole(role);
    if (role.type === 'admin') {
      setPermissions({});
    } else if (role.type === 'custom') {
      setPermissions({ 'read-course': true, 'update-grade': true });
    } else {
      setPermissions({ 'read-dashboard': true, 'read-course': true });
    }
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      alert('Vui lòng nhập tên vai trò.');
      return;
    }
    const newRole: Role = {
      id: `r${Date.now()}`,
      name: newRoleName,
      type: 'custom',
      desc: newRoleDesc || 'Vai trò tùy chỉnh.',
      isDefault: false,
    };
    setRoles([...roles, newRole]);
    setActiveRole(newRole);
    setIsAddModalOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
    showToast(`Đã tạo vai trò "${newRoleName}". Vui lòng thiết lập ma trận quyền.`);
  };

  const handleSavePermissions = () => {
    showToast('Quyền hạn đã được lưu và cập nhật cho các tài khoản liên quan.');
  };

  return (
    <>
      <div
        style={{ fontFamily: "'Roboto', sans-serif" }}
        className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#202124] antialiased"
      >
        <RoleSidebar />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <RoleHeader />

          <div className="flex flex-1 flex-col overflow-hidden px-8 py-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="m-0 flex items-center gap-2 text-[22px] font-normal text-[#202124]">
                <span className="material-symbols-outlined text-[28px] text-[#5F6368]">
                  admin_panel_settings
                </span>
                Quản lý Phân quyền (RBAC)
              </h1>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]">
                  <span className="material-symbols-outlined text-[18px]">history</span> Lịch sử
                  thay đổi
                </button>
              </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
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
        </main>

        <AddRoleModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleCreateRole}
          newRoleName={newRoleName}
          setNewRoleName={setNewRoleName}
          newRoleDesc={newRoleDesc}
          setNewRoleDesc={setNewRoleDesc}
        />

        {/* TOAST NOTIFICATION */}
        <div
          className={`fixed bottom-6 left-6 z-[3000] flex items-center gap-3 rounded-[4px] bg-[#323232] px-6 py-[14px] text-white shadow-[0_4px_6px_0_rgba(60,64,67,0.15),0_12px_16px_0_rgba(60,64,67,0.15)] transition-transform duration-300 ${toast.visible ? 'translate-y-0' : 'translate-y-[100px]'}`}
        >
          <span className="material-symbols-outlined text-[24px] text-[#81C995]">check_circle</span>
          <span className="text-[14px]">{toast.message}</span>
        </div>
      </div>
    </>
  );
}
