import React from 'react';

interface CourseStatsProps {
  totalStudents?: number;
  completionRate?: number;
  averageRating?: number;
  totalReviews?: number;
  lastUpdated?: string;
  language?: string;
  certificateAvailable?: boolean;
}

export const CourseStats = ({
  totalStudents = 0,
  completionRate = 0,
  averageRating = 0,
  totalReviews = 0,
  lastUpdated,
  language = 'Tiếng Việt',
  certificateAvailable = true,
}: CourseStatsProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  const stats = [
    {
      icon: 'fa-users',
      label: 'Học viên',
      value: totalStudents.toLocaleString(),
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: 'fa-chart-line',
      label: 'Tỷ lệ hoàn thành',
      value: `${completionRate}%`,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: 'fa-star',
      label: 'Đánh giá',
      value: `${averageRating}/5`,
      subValue: `(${totalReviews} reviews)`,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      icon: 'fa-language',
      label: 'Ngôn ngữ',
      value: language,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="card border border-gray-200 p-6">
      <h3 className="mb-5 text-sm font-bold text-slate-800">Thông tin khóa học</h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-lg ${stat.bg} p-4 text-center`}>
            <i className={`fa-solid ${stat.icon} mb-2 text-2xl ${stat.color}`}></i>
            <div className="mb-1 text-lg font-bold text-slate-800">{stat.value}</div>
            {stat.subValue && <div className="mb-1 text-[10px] text-slate-500">{stat.subValue}</div>}
            <div className="text-xs text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
        {lastUpdated && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Cập nhật lần cuối:</span>
            <span className="font-semibold text-slate-800">{formatDate(lastUpdated)}</span>
          </div>
        )}

        {certificateAvailable && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Chứng chỉ:</span>
            <span className="flex items-center gap-1 font-semibold text-green-600">
              <i className="fa-solid fa-circle-check"></i>
              Có chứng chỉ
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Truy cập:</span>
          <span className="font-semibold text-slate-800">Trọn đời</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Thiết bị:</span>
          <span className="font-semibold text-slate-800">Mobile & Desktop</span>
        </div>
      </div>
    </div>
  );
};
