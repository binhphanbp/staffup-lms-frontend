import type { Student } from './types';
import { resolveMediaUrl } from '@/lib/media';
import { EmptyState } from '@/components/ui/empty-state';

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onToggleStatus: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentsTable({ students, onEdit, onToggleStatus, onDelete }: StudentsTableProps) {
  if (students.length === 0) {
    return (
      <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          icon={<span className="material-symbols-outlined text-[28px]">person_search</span>}
          title="Không tìm thấy học viên nào"
          description="Thử bỏ bớt bộ lọc, hoặc thêm học viên mới để bắt đầu."
        />
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Desktop table view */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead className="bg-[#F8F9FA] dark:bg-slate-800">
            <tr>
              <th
                scope="col"
                className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368] dark:border-slate-700 dark:text-slate-400"
              >
                Thông tin học viên
              </th>
              <th
                scope="col"
                className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368] dark:border-slate-700 dark:text-slate-400"
              >
                Phòng ban
              </th>
              <th
                scope="col"
                className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368] dark:border-slate-700 dark:text-slate-400"
              >
                Khóa đang học
              </th>
              <th
                scope="col"
                className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368] dark:border-slate-700 dark:text-slate-400"
              >
                Ngày tham gia LMS
              </th>
              <th
                scope="col"
                className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368] dark:border-slate-700 dark:text-slate-400"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368] dark:border-slate-700 dark:text-slate-400"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.userId}
                className="transition-colors hover:bg-[#F8F9FA] dark:hover:bg-slate-800/60"
              >
                <td className="border-b border-[#F1F3F4] px-4 py-3 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    {student.avatarUrl ? (
                      <img
                        src={resolveMediaUrl(student.avatarUrl)!}
                        alt={student.name}
                        className="h-[32px] w-[32px] rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]"
                        aria-hidden="true"
                      >
                        {student.initial}
                      </div>
                    )}
                    <div>
                      <div className="text-[13px] font-medium text-[#202124] dark:text-slate-100">
                        {student.name}
                      </div>
                      <div className="text-[12px] text-[#5F6368] dark:text-slate-400">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#F1F3F4] px-4 py-3 dark:border-slate-800">
                  <div className="text-[13px] font-medium text-[#202124] dark:text-slate-100">
                    {student.department}
                  </div>
                  <div className="text-[12px] text-[#5F6368] dark:text-slate-400">
                    {student.role}
                  </div>
                </td>
                <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124] dark:border-slate-800 dark:text-slate-100">
                  {student.courses > 0 ? `${student.courses} khóa học` : 'Chưa gán khóa'}
                </td>
                <td className="border-b border-[#F1F3F4] px-4 py-3 text-[13px] text-[#202124] dark:border-slate-800 dark:text-slate-100">
                  {student.joinDate}
                </td>
                <td className="border-b border-[#F1F3F4] px-4 py-3 dark:border-slate-800">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium ${
                      student.status === 'active'
                        ? 'bg-[#E6F4EA] text-[#34A853] dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-[#F1F3F4] text-[#5F6368] dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {student.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td className="border-b border-[#F1F3F4] px-4 py-3 dark:border-slate-800">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="flex h-9 w-9 items-center justify-center rounded border border-[#DADCE0] text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      aria-label="Sửa học viên"
                    >
                      <i className="fa-solid fa-pen text-[13px]" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => onToggleStatus(student)}
                      className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${
                        student.status === 'active'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
                          : 'bg-[#E8F0FE] text-[#174EA6] hover:bg-[#D8E3FD] dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50'
                      }`}
                      aria-label={
                        student.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'
                      }
                    >
                      <i
                        className={`fa-solid ${student.status === 'active' ? 'fa-lock' : 'fa-lock-open'} text-[13px]`}
                        aria-hidden="true"
                      ></i>
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      className="flex h-9 w-9 items-center justify-center rounded bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                      aria-label="Xóa học viên"
                    >
                      <i className="fa-solid fa-trash text-[13px]" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 p-4 md:hidden">
        {students.map((student) => (
          <div
            key={student.userId}
            className="rounded-lg border border-[#DADCE0] bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {student.avatarUrl ? (
                  <img
                    src={resolveMediaUrl(student.avatarUrl)!}
                    alt={student.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F0FE] text-[15px] font-medium text-[#1A73E8]"
                    aria-hidden="true"
                  >
                    {student.initial}
                  </div>
                )}
                <div>
                  <div className="text-[14px] font-semibold text-[#202124] dark:text-slate-100">
                    {student.name}
                  </div>
                  <div className="text-[12px] text-[#5F6368] dark:text-slate-400">
                    {student.email}
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
                  student.status === 'active'
                    ? 'bg-[#E6F4EA] text-[#34A853] dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-[#F1F3F4] text-[#5F6368] dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {student.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
              <div>
                <span className="text-[#5F6368] dark:text-slate-500">Phòng ban: </span>
                <span className="font-medium text-[#202124] dark:text-slate-200">
                  {student.department}
                </span>
              </div>
              <div>
                <span className="text-[#5F6368] dark:text-slate-500">Vai trò: </span>
                <span className="font-medium text-[#202124] dark:text-slate-200">
                  {student.role}
                </span>
              </div>
              <div>
                <span className="text-[#5F6368] dark:text-slate-500">Khóa học: </span>
                <span className="font-medium text-[#202124] dark:text-slate-200">
                  {student.courses > 0 ? `${student.courses} khóa` : 'Chưa gán'}
                </span>
              </div>
              <div>
                <span className="text-[#5F6368] dark:text-slate-500">Ngày tham gia: </span>
                <span className="font-medium text-[#202124] dark:text-slate-200">
                  {student.joinDate}
                </span>
              </div>
            </div>
            <div className="mt-3 flex gap-2 border-t border-[#F1F3F4] pt-3 dark:border-slate-700">
              <button
                onClick={() => onEdit(student)}
                className="flex items-center gap-1.5 rounded-md border border-[#DADCE0] px-3 py-1.5 text-[12px] font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4] dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label="Sửa học viên"
              >
                <i className="fa-solid fa-pen" aria-hidden="true"></i> Sửa
              </button>
              <button
                onClick={() => onToggleStatus(student)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  student.status === 'active'
                    ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
                    : 'border border-blue-200 bg-[#E8F0FE] text-[#174EA6] hover:bg-[#D8E3FD] dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50'
                }`}
                aria-label={student.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              >
                <i
                  className={`fa-solid ${student.status === 'active' ? 'fa-lock' : 'fa-lock-open'}`}
                  aria-hidden="true"
                ></i>
                {student.status === 'active' ? 'Khóa' : 'Mở khóa'}
              </button>
              <button
                onClick={() => onDelete(student)}
                className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                aria-label="Xóa học viên"
              >
                <i className="fa-solid fa-trash" aria-hidden="true"></i> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#DADCE0] px-6 py-3 dark:border-slate-800">
        <div className="text-[13px] text-[#5F6368] dark:text-slate-400">
          Đang hiển thị {students.length} học viên
        </div>
      </div>
    </div>
  );
}
