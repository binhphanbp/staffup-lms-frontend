'use client';

export const CourseTable = () => {
  const courses = [
    {
      id: 'SYS-SYS-01',
      name: 'System Design: Phân tích hệ thống lớn',
      status: 'Đang chạy',
      statusColor: 'text-green-600',
      students: 184,
      progress: 65,
    },
    {
      id: 'DEV-GO-02',
      name: 'GoLang Concurrency & Microservices',
      status: 'Cập nhật',
      statusColor: 'text-blue-600',
      students: 85,
      progress: 40,
    },
    {
      id: 'DEV-ARC-03',
      name: 'Cloud Native Architecture (Draft)',
      status: 'Bản nháp',
      statusColor: 'text-slate-400',
      students: 0,
      progress: 0,
      draft: true,
    },
  ];

  return (
    <div className="card border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <h2 className="text-base font-bold text-slate-800">
          Khóa học phụ trách <span className="text-slate-400">(3)</span>
        </h2>
        <button className="text-primary text-sm font-semibold hover:underline">
          + Soạn giáo trình
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold text-slate-500 uppercase">
              <th scope="col" className="px-5 py-3">
                Tên khóa học
              </th>
              <th scope="col" className="px-5 py-3">
                Trạng thái
              </th>
              <th scope="col" className="px-5 py-3">
                Học viên
              </th>
              <th scope="col" className="px-5 py-3">
                Tiến độ
              </th>
              <th scope="col" className="px-5 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <i
                      className={`fa-solid fa-book text-lg ${course.draft ? 'text-slate-300' : 'text-blue-500'}`}
                    ></i>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{course.name}</div>
                      <div className="font-mono text-xs text-slate-400">{course.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-sm font-medium ${course.statusColor}`}>
                    <i className="fa-solid fa-circle mr-1 text-[6px]"></i>
                    {course.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-users text-slate-400"></i>
                    <span className="text-sm font-semibold text-slate-700">{course.students}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">{course.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-blue-600" title="Chỉnh sửa">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button className="text-slate-400 hover:text-blue-600" title="Xem chi tiết">
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {courses.length === 0 && (
        <div className="py-12 text-center text-sm text-slate-400">Chưa có khóa học nào</div>
      )}
    </div>
  );
};
