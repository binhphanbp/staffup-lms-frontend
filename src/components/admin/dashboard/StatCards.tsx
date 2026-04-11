interface StatCardsProps {
  totalUsers?: number;
  activeCourses?: number;
  totalTrainers?: number;
  completionRate?: number;
  loading?: boolean;
}

const Skeleton = () => <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />;

export const StatCards = ({
  totalUsers,
  activeCourses,
  totalTrainers,
  completionRate,
  loading,
}: StatCardsProps) => {
  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {/* Tổng số học viên */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-[#5F6368]">Tổng số học viên</span>
          <span className="material-symbols-outlined text-[20px] text-[#1A73E8]">school</span>
        </div>
        <div className="mb-1 text-[32px] font-normal text-[#202124]">
          {loading ? <Skeleton /> : (totalUsers?.toLocaleString() ?? '—')}
        </div>
      </div>

      {/* Khóa học đang hoạt động */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-[#5F6368]">Khóa học đang hoạt động</span>
          <span className="material-symbols-outlined text-[20px] text-[#34A853]">
            library_books
          </span>
        </div>
        <div className="mb-1 text-[32px] font-normal text-[#202124]">
          {loading ? <Skeleton /> : (activeCourses?.toLocaleString() ?? '—')}
        </div>
      </div>

      {/* Giảng viên / Tech Lead */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-[#5F6368]">Giảng viên / Tech Lead</span>
          <span className="material-symbols-outlined text-[20px] text-[#F9AB00]">co_present</span>
        </div>
        <div className="mb-1 text-[32px] font-normal text-[#202124]">
          {loading ? <Skeleton /> : (totalTrainers?.toLocaleString() ?? '—')}
        </div>
      </div>

      {/* Tỷ lệ hoàn thành toàn tuyến */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-[#5F6368]">Tỷ lệ hoàn thành toàn tuyến</span>
          <span className="material-symbols-outlined text-[20px] text-[#EA4335]">check_circle</span>
        </div>
        <div className="mb-1 text-[32px] font-normal text-[#202124]">
          {loading ? (
            <Skeleton />
          ) : completionRate !== null && completionRate !== undefined ? (
            `${completionRate}%`
          ) : (
            '—'
          )}
        </div>
      </div>
    </div>
  );
};
