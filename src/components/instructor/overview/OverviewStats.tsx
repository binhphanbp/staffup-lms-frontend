export const OverviewStats = () => {
  const stats = [
    {
      label: 'Học viên tham gia',
      value: '452',
      change: '5.2% so với tháng trước',
      icon: 'fa-users',
      trend: 'up',
    },
    {
      label: 'Đánh giá trung bình',
      value: '4.8',
      subtitle: '/5.0',
      subtext: 'Dựa trên 128 lượt phản hồi',
      icon: 'fa-star',
    },
    {
      label: 'Bài tập chờ chấm',
      value: '12',
      subtext: '3 bài quá hạn SLA',
      icon: 'fa-clipboard-check',
      alert: true,
    },
    {
      label: 'Tổng giờ giảng dạy',
      value: '1,240',
      subtitle: 'h',
      change: '12h tuần này',
      icon: 'fa-clock',
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="card border border-gray-200 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">{stat.label}</span>
            <i className={`fa-solid ${stat.icon} text-slate-300`}></i>
          </div>
          <div className="mb-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
            {stat.subtitle && <span className="text-lg text-slate-400">{stat.subtitle}</span>}
          </div>
          {stat.change && (
            <div className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-slate-500'}`}>
              {stat.trend === 'up' && <i className="fa-solid fa-arrow-up mr-1"></i>}
              {stat.change}
            </div>
          )}
          {stat.subtext && (
            <div className={`text-xs ${stat.alert ? 'text-red-600' : 'text-slate-500'}`}>
              {stat.subtext}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
