import React from 'react';
import type { Role } from './types';

interface RoleListProps {
  roles: Role[];
  activeRole: Role;
  onSelectRole: (role: Role) => void;
  onOpenAddModal: () => void;
}

export const RoleList = ({ roles, activeRole, onSelectRole, onOpenAddModal }: RoleListProps) => {
  return (
    <div className="flex w-[300px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
      <div className="flex items-center justify-between border-b border-[#DADCE0] bg-[#FAFAFA] p-4">
        <h3 className="m-0 text-[14px] font-medium text-[#202124]">Vai trò hiện có (Roles)</h3>
        <button
          onClick={onOpenAddModal}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-[#1A73E8] transition-colors hover:bg-[#F1F3F4]"
          title="Thêm vai trò mới"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
      <div className="custom-scrollbar flex-1 overflow-y-auto p-2">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => onSelectRole(role)}
            className={`mb-1 flex cursor-pointer flex-col gap-1 rounded-md border border-transparent p-3 transition-colors ${activeRole.id === role.id ? 'border-[#D2E3FC] bg-[#E8F0FE]' : 'hover:bg-[#F1F3F4]'}`}
            style={
              !role.isDefault && roles[roles.length - 1].id === role.id
                ? {
                    marginTop: '12px',
                    borderTop: '1px dashed #DADCE0',
                    paddingTop: '16px',
                    borderRadius: '0',
                  }
                : {}
            }
          >
            <div
              className={`flex items-center justify-between text-[14px] font-medium ${activeRole.id === role.id ? 'text-[#1A73E8]' : 'text-[#202124]'}`}
            >
              {role.name}
              {role.isDefault ? (
                <span className="flex items-center gap-0.5 rounded bg-[#F1F3F4] px-1.5 py-0.5 text-[10px] font-medium text-[#5F6368]">
                  <span className="material-symbols-outlined text-[12px]">lock</span> Mặc định
                </span>
              ) : (
                <span className="flex items-center gap-0.5 rounded bg-[#E6F4EA] px-1.5 py-0.5 text-[10px] font-medium text-[#34A853]">
                  Tùy chỉnh
                </span>
              )}
            </div>
            <div className="line-clamp-2 text-[12px] leading-[1.4] text-[#5F6368]">{role.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
