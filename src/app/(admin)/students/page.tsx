'use client';

import { useState } from 'react';
import type { Student } from '@/components/admin/students/types';
import { StudentsTable } from '@/components/admin/students/StudentsTable';
import { StudentsToolbar } from '@/components/admin/students/StudentsToolbar';
import { Toast } from '@/components/shared/Toast';

export default function StudentsPage() {
  const [toast, setToast] = useState({ visible: false, message: '' });

  const students: Student[] = [
    {
      id: 1,
      initial: 'N',
      name: 'Nguyễn Văn An',
      email: 'nguyen.an@company.com',
      department: 'Sales',
      role: 'Chuyên viên B2B',
      courses: 3,
      joinDate: '12/01/2026',
      status: 'active',
    },
    {
      id: 2,
      initial: 'T',
      name: 'Trần Thị Bình',
      email: 'tran.binh@company.com',
      department: 'Marketing',
      role: 'Content Strategy',
      courses: 1,
      joinDate: '15/01/2026',
      status: 'active',
    },
    {
      id: 3,
      initial: 'L',
      name: 'Lê Minh Dương',
      email: 'le.duong@company.com',
      department: 'Tech',
      role: 'Backend Developer',
      courses: 4,
      joinDate: '05/02/2026',
      status: 'active',
    },
    {
      id: 4,
      initial: 'P',
      name: 'Phạm Thu Dung',
      email: 'pham.dung@company.com',
      department: 'HR',
      role: 'C&B Executive',
      courses: 2,
      joinDate: '20/02/2026',
      status: 'inactive',
    },
    {
      id: 5,
      initial: 'H',
      name: 'Hoàng Tùng',
      email: 'hoang.tung@company.com',
      department: 'Sales',
      role: 'Trưởng nhóm Telesale',
      courses: 5,
      joinDate: '01/03/2026',
      status: 'active',
    },
    {
      id: 6,
      initial: 'Đ',
      name: 'Đỗ Mai Anh',
      email: 'do.maianh@company.com',
      department: 'Tech',
      role: 'QA Engineer',
      courses: 0,
      joinDate: '10/03/2026',
      status: 'active',
    },
  ];

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 md:px-8 py-4 md:py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">
            Danh sách Học viên (Learners)
          </h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Nhập từ Excel
            </button>
            <button
              onClick={() => showToast('Thao tác thành công')}
              className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#174EA6]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Thêm học viên
            </button>
          </div>
        </div>

        <StudentsToolbar />
        <StudentsTable students={students} />
      </div>

      <Toast visible={toast.visible} message={toast.message} />
    </>
  );
}
