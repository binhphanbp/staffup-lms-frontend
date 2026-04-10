'use client';

export const StudentQueue = () => {
  const students = [
    {
      name: 'Nguyễn Văn A',
      avatar: 'VA',
      course: 'System Design / Bài 4',
      question: 'Xử lý Split-Brain trong Active-Active DB?',
      preview:
        'Nếu đột nhiên giữa 2 node Master thì khi nào sẽ quyết conflict như thế nào? Mong anh giải đáp.',
      time: '4-5 giờ trước',
    },
    {
      name: 'Trần Developer',
      avatar: 'TB',
      course: 'GoLang / Lab 3',
      question: 'Lỗi Deadlock Goroutines',
      preview:
        'Em chạy thử bài Lab thì bị báo lỗi: all goroutines are asleep - deadlock. Sếp xem giúp em.',
      time: '4 tiếng trước',
      hasLink: true,
    },
  ];

  return (
    <div className="card border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <h2 className="text-base font-bold text-slate-800">
          Cần hỗ trợ học viên <span className="text-slate-400">(5)</span>
        </h2>
        <button className="text-primary text-sm font-semibold hover:underline">Xem tất cả</button>
      </div>

      <div className="divide-y divide-gray-100">
        {students.map((student, idx) => (
          <div key={idx} className="p-5 hover:bg-slate-50">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                {student.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{student.name}</span>
                  <span className="text-xs text-slate-400">{student.time}</span>
                </div>
                <div className="mb-2 font-mono text-xs text-slate-500">Nhóm: {student.course}</div>
                <div className="mb-2 text-sm font-semibold text-slate-700">{student.question}</div>
                <p className="mb-3 text-sm leading-relaxed text-slate-600">{student.preview}</p>
                {student.hasLink && (
                  <a
                    href="#"
                    className="text-primary mb-3 block text-xs font-medium hover:underline"
                  >
                    Mở phòng thảo luận
                  </a>
                )}
                <button className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
