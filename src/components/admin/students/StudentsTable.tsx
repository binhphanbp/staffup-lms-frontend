import type { Student } from './types';

interface StudentsTableProps {
  students: Student[];
}

export function StudentsTable({ students }: StudentsTableProps) {
  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
      <table className="w-full border-collapse">
        <thead className="bg-[#F8F9FA]">
          <tr>
            <th className="w-[40px] border-b border-[#DADCE0] px-4 py-3">
              <input type="checkbox" className="h-[18px] w-[18px] cursor-pointer" />
            </th>
            <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
              Thông tin Học viên
            </th>
            <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
              Phòng ban
            </th>
            <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
              Khóa đang học
            </th>
            <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
              Ngày tham gia LMS
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
          {students.map((student) => (
            <tr key={student.id} className="transition-colors hover:bg-[#F8F9FA]">
              <td className="border-b border-[#F1F3F4] px-4 py-3">
                <input type="checkbox" className="h-[18px] w-[18px] cursor-pointer" />
              </td>
              <td className="border-b border-[#F1F3F4] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]">
                    {student.initial}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#202124]">{student.name}</div>
                    <div className="text-[12px] text-[#5F6368]">{student.email}</div>
                  </div>
                </div>
              </td>
              <td className="border-b border-[#F1F3F4] px-4 py-3">
                <div className="text-[13px] font-medium text-[#202124]">{student.department}</div>
                <div className="text-[12px] text-[#5F6368]">{student.role}</div>
              </td>
              <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                {student.courses > 0 ? `${student.courses} khóa học` : 'Chưa gán khóa'}
              </td>
              <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124]">
                {student.joinDate}
              </td>
              <td className="border-b border-[#F1F3F4] px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium ${
                    student.status === 'active'
                      ? 'bg-[#E6F4EA] text-[#34A853]'
                      : 'bg-[#F1F3F4] text-[#5F6368]'
                  }`}
                >
                  {student.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                </span>
              </td>
              <td className="border-b border-[#F1F3F4] px-4 py-3">
                <button className="material-symbols-outlined text-[20px] text-[#5F6368] transition-colors hover:text-[#202124]">
                  more_vert
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-[#DADCE0] px-6 py-3">
        <div className="text-[13px] text-[#5F6368]">
          Đang hiển thị {students.length} trong tổng số {students.length} học viên
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#5F6368]">Số hàng mỗi trang:</span>
            <select className="rounded border border-[#DADCE0] px-2 py-1 text-[13px] outline-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div className="text-[13px] text-[#5F6368]">1-10 của 45</div>
          <div className="flex gap-1">
            <button className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4]">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4]">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
