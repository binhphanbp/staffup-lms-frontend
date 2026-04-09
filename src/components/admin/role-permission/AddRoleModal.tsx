import React from 'react';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  newRoleName: string;
  setNewRoleName: (name: string) => void;
  newRoleDesc: string;
  setNewRoleDesc: (desc: string) => void;
}

export const AddRoleModal = ({
  isOpen,
  onClose,
  onSave,
  newRoleName,
  setNewRoleName,
  newRoleDesc,
  setNewRoleDesc,
}: AddRoleModalProps) => {
  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-[#202124]/60 transition-opacity duration-200 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div
        className={`flex w-[450px] flex-col rounded-lg bg-white shadow-[0_4px_6px_0_rgba(60,64,67,0.15),0_12px_16px_0_rgba(60,64,67,0.15)] transition-transform duration-200 ${isOpen ? 'translate-y-0' : 'translate-y-5'}`}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h2 className="m-0 text-[18px] font-medium text-[#202124]">
            Tạo Vai trò mới (Custom Role)
          </h2>
          <button
            onClick={onClose}
            className="flex cursor-pointer border-none bg-transparent text-[#5F6368]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-medium text-[#202124]">
              Tên vai trò (*)
            </label>
            <input
              type="text"
              className="w-full rounded border border-[#DADCE0] px-3 py-2.5 font-sans text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
              placeholder="Ví dụ: Trợ giảng, Giám đốc khối..."
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
          </div>
          <div className="mb-0">
            <label className="mb-2 block text-[13px] font-medium text-[#202124]">Mô tả</label>
            <textarea
              className="min-h-[80px] w-full resize-y rounded border border-[#DADCE0] px-3 py-2.5 font-sans text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
              placeholder="Nhập mô tả ngắn gọn về quyền hạn của vai trò này..."
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
            ></textarea>
          </div>
          <div className="mt-4 rounded-[4px] bg-[#F1F3F4] p-3 text-[12px] text-[#5F6368]">
            💡 <strong>Mẹo:</strong> Sau khi tạo, hệ thống sẽ sao chép cấu hình quyền rỗng. Bạn cần
            phải cấu hình thủ công tại Ma trận quyền hạn.
          </div>
        </div>
        <div className="flex justify-end gap-3 rounded-b-lg border-t border-[#DADCE0] bg-[#FAFAFA] px-6 py-4">
          <button
            className="rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="rounded-[4px] border border-transparent bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#174EA6]"
            onClick={onSave}
          >
            Tạo vai trò
          </button>
        </div>
      </div>
    </div>
  );
};
