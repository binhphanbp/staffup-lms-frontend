export const InstructorActivityTable = () => {
  const activities = [
    {
      initial: 'V',
      name: 'Vũ Hải Đăng',
      role: 'Giảng viên (Tech Lead)',
      task: 'Chấm 13 bài tự luận (Python Cơ bản)',
      status: 'Cần xử lý',
      statusColor: 'text-[#EA4335]',
    },
    {
      initial: 'H',
      name: 'Hoàng Ngọc Lan',
      role: 'Giảng viên Hội tây',
      task: 'Đăng soạn Kỹ năng quản lý thời gian',
      status: 'Đang soạn thảo',
      statusColor: 'text-[#F9AB00]',
    },
    {
      initial: 'Đ',
      name: 'Đỗ Kiên Quốc',
      role: 'Tech Lead (Phát triển)',
      task: 'Duyệt khóa học: Sales Pipeline',
      status: 'Đã duyệt',
      statusColor: 'text-[#34A853]',
    },
    {
      initial: 'A',
      name: 'AI Auto-Grader',
      role: 'Hệ thống AI',
      task: 'Chấm tự động 179 bài trắc nghiệm',
      status: 'Hoàn tất',
      statusColor: 'text-[#34A853]',
    },
  ];

  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-[#202124]">
          Hoạt động của Giảng viên / Chấm điểm
        </h3>
        <button className="text-[13px] font-medium text-[#1A73E8] hover:underline">
          Quản lý Giảng viên
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-[#DADCE0]">
            <th scope="col" className="pb-3 text-left text-[13px] font-medium text-[#5F6368]">
              Giảng viên (Tech Lead)
            </th>
            <th scope="col" className="pb-3 text-left text-[13px] font-medium text-[#5F6368]">
              Nhiệm vụ
            </th>
            <th scope="col" className="pb-3 text-left text-[13px] font-medium text-[#5F6368]">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index} className="border-b border-[#F1F3F4]">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]">
                    {activity.initial}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#202124]">{activity.name}</div>
                    <div className="text-[12px] text-[#5F6368]">{activity.role}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 text-[13px] text-[#202124]">{activity.task}</td>
              <td className="py-3">
                <span className={`text-[13px] font-medium ${activity.statusColor}`}>
                  {activity.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
