'use client';

export const ReviewList = () => {
  const reviews = [
    {
      name: 'Hải Nam',
      avatar: 'HN',
      course: 'Consistent Hash',
      time: '20 ngày',
      status: 'Quá hạn',
      statusColor: 'text-red-600',
    },
    {
      name: 'Bảo Trần',
      avatar: 'BT',
      course: 'Rate Limiter',
      time: '5 ngày',
      status: 'Đúng hạn',
      statusColor: 'text-slate-500',
    },
    {
      name: 'Minh Tuấn',
      avatar: 'MT',
      course: 'Docker Compose',
      time: '10 ngày',
      status: 'Đúng hạn',
      statusColor: 'text-slate-500',
    },
  ];

  return (
    <div className="card border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <h2 className="text-base font-bold text-slate-800">
          Chờ Review <span className="text-slate-400">(12)</span>
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {reviews.map((review, idx) => (
          <div key={idx} className="flex items-center gap-3 p-4 hover:bg-slate-50">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
              {review.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-sm font-bold text-slate-800">{review.name}</div>
              <div className="font-mono text-xs text-slate-500">Lab: {review.course}</div>
            </div>
            <div className="text-right">
              <div className={`mb-1 text-xs font-semibold ${review.statusColor}`}>
                {review.status}
              </div>
              <div className="text-xs text-slate-400">{review.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-4 text-center">
        <button className="text-primary text-sm font-semibold hover:underline">
          Xem tất cả đánh giá
        </button>
      </div>
    </div>
  );
};
