'use client';

export const CompletionChart = () => {
  const courses = [
    { name: 'System Design', completion: 85, color: 'bg-blue-500' },
    { name: 'GoLang Backend', completion: 40, color: 'bg-green-500' },
  ];

  return (
    <div className="card border border-gray-200 p-5">
      <h3 className="mb-4 text-sm font-bold text-slate-800">Tỷ lệ hoàn thành</h3>

      <div className="space-y-4">
        {courses.map((course, idx) => (
          <div key={idx}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">{course.name}</span>
              <span className="font-bold text-slate-800">{course.completion}% Pass</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${course.color}`}
                style={{ width: `${course.completion}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-orange-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb text-orange-500"></i>
          <span className="text-sm font-bold text-orange-800">AI Insight:</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600">
          Học viên thường mắc kẹt ở Bài 4 (GoLang). Đề xuất bổ sung thêm video về Goroutines.
        </p>
      </div>
    </div>
  );
};
