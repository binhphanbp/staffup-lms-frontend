export const StudentProgressTable = () => {
  const students = [
    {
      initial: 'N',
      name: 'Nguyễn Tuấn Anh',
      role: 'Phòng Kinh doanh',
      course: 'Kỹ năng Giao tiếp cao B2B',
      progress: 85,
    },
    {
      initial: 'T',
      name: 'Trần Thị Bé',
      role: 'Phòng Marketing',
      course: 'Digital Marketing 2024',
      progress: 100,
    },
    {
      initial: 'L',
      name: 'Lê Minh Trí',
      role: 'Phòng Công nghệ',
      course: 'An toàn thông tin nội bộ',
      progress: 20,
    },
    {
      initial: 'P',
      name: 'Phạm Văn Đức',
      role: 'Phòng Nhân sự',
      course: 'Văn hóa doanh nghiệp',
      progress: 65,
    },
  ];

  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-[#202124]">Tiến độ Học viên mới nhất</h3>
        <button className="text-[13px] font-medium text-[#1A73E8] hover:underline">
          Xem tất cả
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-[#DADCE0]">
            <th className="pb-3 text-left text-[13px] font-medium text-[#5F6368]">Học viên</th>
            <th className="pb-3 text-left text-[13px] font-medium text-[#5F6368]">
              Khóa học đang tham gia
            </th>
            <th className="pb-3 text-left text-[13px] font-medium text-[#5F6368]">Tiến độ</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="border-b border-[#F1F3F4]">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E8F0FE] text-[14px] font-medium text-[#1A73E8]">
                    {student.initial}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#202124]">{student.name}</div>
                    <div className="text-[12px] text-[#5F6368]">{student.role}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 text-[13px] text-[#202124]">{student.course}</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-[100px] overflow-hidden rounded-full bg-[#F1F3F4]">
                    <div
                      className="h-full bg-[#1A73E8]"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[13px] font-medium text-[#202124]">
                    {student.progress}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
