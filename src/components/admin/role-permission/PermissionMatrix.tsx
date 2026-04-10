import React from 'react';
import type { Role } from './types';

interface PermissionMatrixProps {
  activeRole: Role;
  permissions: Record<string, boolean>;
  onSavePermissions: () => void;
}

export const PermissionMatrix = ({
  activeRole,
  permissions,
  onSavePermissions,
}: PermissionMatrixProps) => {
  const isSystemAdmin = activeRole.type === 'admin';

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
      <div className="flex items-start justify-between border-b border-[#DADCE0] bg-white px-6 py-5">
        <div>
          <h2 className="m-0 mb-2 flex items-center gap-3 text-[18px] font-medium text-[#202124]">
            {activeRole.name}
            {activeRole.isDefault ? (
              <span className="flex items-center gap-1 rounded bg-[#F1F3F4] px-2 py-0.5 text-[11px] font-medium text-[#5F6368]">
                <span className="material-symbols-outlined text-[14px]">lock</span> Hệ thống
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded bg-[#E6F4EA] px-2 py-0.5 text-[11px] font-medium text-[#34A853]">
                Tùy chỉnh
              </span>
            )}
          </h2>
          <p className="m-0 text-[13px] text-[#5F6368]">{activeRole.desc}</p>
        </div>
        <button
          className={`rounded-[4px] border bg-transparent px-4 py-2 text-[13px] font-medium transition-all ${!activeRole.isDefault ? 'border-[#FCE8E6] text-[#EA4335] hover:bg-[#FCE8E6]' : 'cursor-not-allowed border-[#DADCE0] text-[#9AA0A6]'}`}
          disabled={activeRole.isDefault}
        >
          Xóa vai trò
        </button>
      </div>

      <div className="flex gap-8 border-b border-[#DADCE0] bg-[#FAFAFA] px-6">
        <div className="cursor-pointer border-b-2 border-[#1A73E8] py-3 text-[13px] font-medium tracking-[0.5px] text-[#1A73E8] uppercase">
          Ma trận Quyền hạn (Permissions)
        </div>
        <div className="cursor-pointer border-b-2 border-transparent py-3 text-[13px] font-medium tracking-[0.5px] text-[#5F6368] uppercase transition-colors hover:text-[#202124]">
          Người dùng được gán (12)
        </div>
      </div>

      <div className="custom-scrollbar relative flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_#DADCE0]">
            <tr>
              <th className="w-[40%] border-b border-[#DADCE0] px-4 py-3 pl-6 text-[13px] font-medium text-[#5F6368]">
                Phân hệ / Chức năng
              </th>
              <th className="border-b border-[#DADCE0] px-4 py-3 text-center text-[13px] font-medium text-[#5F6368]">
                Xem (Read)
              </th>
              <th className="border-b border-[#DADCE0] px-4 py-3 text-center text-[13px] font-medium text-[#5F6368]">
                Thêm (Create)
              </th>
              <th className="border-b border-[#DADCE0] px-4 py-3 text-center text-[13px] font-medium text-[#5F6368]">
                Sửa (Update)
              </th>
              <th className="border-b border-[#DADCE0] px-4 py-3 text-center text-[13px] font-medium text-[#5F6368]">
                Xóa (Delete)
              </th>
              <th className="border-b border-[#DADCE0] px-4 py-3 text-center text-[13px] font-medium text-[#5F6368]">
                Tất cả
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Bảng Điều Khiển */}
            <tr>
              <td
                colSpan={6}
                className="border-y border-[#DADCE0] bg-[#F8F9FA] px-6 py-2.5 text-[12px] font-semibold text-[#5F6368] uppercase"
              >
                Phân hệ Tổng quan & Báo cáo
              </td>
            </tr>
            <tr className="transition-colors hover:bg-[#F1F3F4]">
              <td className="border-b border-[#DADCE0] px-4 py-3 pl-6 text-[14px] text-[#202124]">
                Bảng điều khiển (Dashboard)
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin || activeRole.type !== 'custom'}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center text-[#9AA0A6]">-</td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center text-[#9AA0A6]">-</td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center text-[#9AA0A6]">-</td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin || activeRole.type !== 'custom'}
                  disabled={isSystemAdmin}
                />
              </td>
            </tr>

            {/* Học viên */}
            <tr>
              <td
                colSpan={6}
                className="border-y border-[#DADCE0] bg-[#F8F9FA] px-6 py-2.5 text-[12px] font-semibold text-[#5F6368] uppercase"
              >
                Phân hệ Học viên
              </td>
            </tr>
            <tr className="transition-colors hover:bg-[#F1F3F4]">
              <td className="border-b border-[#DADCE0] px-4 py-3 pl-6 text-[14px] text-[#202124]">
                Quản lý Danh sách Học viên
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
            </tr>

            {/* Giảng viên */}
            <tr>
              <td
                colSpan={6}
                className="border-y border-[#DADCE0] bg-[#F8F9FA] px-6 py-2.5 text-[12px] font-semibold text-[#5F6368] uppercase"
              >
                Phân hệ Giảng viên (Đào tạo)
              </td>
            </tr>
            <tr className="transition-colors hover:bg-[#F1F3F4]">
              <td className="border-b border-[#DADCE0] px-4 py-3 pl-6 text-[14px] text-[#202124]">
                Quản lý Khóa học (Nội dung)
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin || !!permissions['read-course']}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
            </tr>
            <tr className="transition-colors hover:bg-[#F1F3F4]">
              <td className="border-b border-[#DADCE0] px-4 py-3 pl-6 text-[14px] text-[#202124]">
                Chấm bài & Đánh giá
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin || !!permissions['update-grade']}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center text-[#9AA0A6]">-</td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin || !!permissions['update-grade']}
                  disabled={isSystemAdmin}
                  title="Vào điểm"
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center text-[#9AA0A6]">-</td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin || !!permissions['update-grade']}
                  disabled={isSystemAdmin}
                />
              </td>
            </tr>

            {/* Hệ thống */}
            <tr>
              <td
                colSpan={6}
                className="border-y border-[#DADCE0] bg-[#F8F9FA] px-6 py-2.5 text-[12px] font-semibold text-[#5F6368] uppercase"
              >
                Hệ thống & AI
              </td>
            </tr>
            <tr className="transition-colors hover:bg-[#F1F3F4]">
              <td className="border-b border-[#DADCE0] px-4 py-3 pl-6 text-[14px] text-[#202124]">
                Cấu hình AI (Gemini)
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center text-[#9AA0A6]">-</td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center text-[#9AA0A6]">-</td>
              <td className="border-b border-[#DADCE0] px-4 py-3 text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer accent-[#1A73E8]"
                  checked={isSystemAdmin}
                  disabled={isSystemAdmin}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 border-t border-[#DADCE0] bg-[#FAFAFA] px-6 py-4">
        <span className="mr-auto flex items-center gap-1 self-center text-[12px] text-[#9AA0A6]">
          <span className="material-symbols-outlined text-[14px]">info</span>
          {isSystemAdmin
            ? 'Vai trò "System Administrator" không thể chỉnh sửa phân quyền.'
            : 'Vai trò hệ thống có thể bị giới hạn một số quyền nhất định.'}
        </span>
        <button
          className="rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSystemAdmin}
        >
          Hủy thay đổi
        </button>
        <button
          onClick={onSavePermissions}
          className="flex items-center gap-2 rounded-[4px] border border-transparent bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#174EA6] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          disabled={isSystemAdmin}
        >
          <span className="material-symbols-outlined text-[18px]">save</span> Lưu Quyền
        </button>
      </div>
    </div>
  );
};
