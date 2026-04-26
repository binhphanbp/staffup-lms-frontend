import type { Student } from './types';
import { resolveMediaUrl } from '@/lib/media';

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onToggleStatus: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentsTable({ students, onEdit, onToggleStatus, onDelete }: StudentsTableProps) {
  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
      <table className="w-full border-collapse">
        <thead className="bg-[#F8F9FA]">
          <tr>
            <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
              Thông tin học viên
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
            <tr key={student.userId} className="transition-colors hover:bg-[#F8F9FA]">
              <td className="border-b border-[#F1F3F4] px-4 py-3">
                <div className="flex items-center gap-3">
                  {student.avatarUrl ? (
                    <img
                      src={resolveMediaUrl(student.avatarUrl)!}
                      alt={student.name}
                      className="h-[32px] w-[32px] rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]">
                      {student.initial}
                    </div>
                  )}
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
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onEdit(student)}
                    className="flex h-9 w-9 items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]"
                    title="Sửa học viên"
                  >
                    <i className="fa-solid fa-pen text-[13px]"></i>
                  </button>
                  <button
                    onClick={() => onToggleStatus(student)}
                    className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${
                      student.status === 'active'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-[#E8F0FE] text-[#174EA6] hover:bg-[#D8E3FD]'
                    }`}
                    title={student.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  >
                    <i
                      className={`fa-solid ${student.status === 'active' ? 'fa-lock' : 'fa-lock-open'} text-[13px]`}
                    ></i>
                  </button>
                  <button
                    onClick={() => onDelete(student)}
                    className="flex h-9 w-9 items-center justify-center rounded bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                    title="Xóa học viên"
                  >
                    <i className="fa-solid fa-trash text-[13px]"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-[#DADCE0] px-6 py-3">
        <div className="text-[13px] text-[#5F6368]">Đang hiển thị {students.length} học viên</div>
      </div>
    </div>
  );
}
