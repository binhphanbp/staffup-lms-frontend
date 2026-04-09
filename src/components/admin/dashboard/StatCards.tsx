export const StatCards = () => {
  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {/* Tổng số học viên */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-[#5F6368]">Tổng số học viên</span>
          <span className="material-symbols-outlined text-[20px] text-[#1A73E8]">school</span>
        </div>
        <div className="mb-1 text-[32px] font-normal text-[#202124]">1,248</div>
        <div className="flex items-center gap-1 text-[12px] text-[#34A853]">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          +45 đăng ký mới tháng này
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
        <div className="mb-1 text-[32px] font-normal text-[#202124]">36</div>
        <div className="flex items-center gap-1 text-[12px] text-[#34A853]">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          +3 khóa vừa được duyệt
        </div>
      </div>

      {/* Giảng viên / Tech Lead */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-[#5F6368]">Giảng viên / Tech Lead</span>
          <span className="material-symbols-outlined text-[20px] text-[#F9AB00]">co_present</span>
        </div>
        <div className="mb-1 text-[32px] font-normal text-[#202124]">24</div>
        <div className="flex items-center gap-1 text-[12px] text-[#5F6368]">
          <span className="material-symbols-outlined text-[14px]">remove</span>
          Ổn định so với tháng trước
        </div>
      </div>

      {/* Tỷ lệ hoàn thành toàn tuyến */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-[#5F6368]">Tỷ lệ hoàn thành toàn tuyến</span>
          <span className="material-symbols-outlined text-[20px] text-[#EA4335]">check_circle</span>
        </div>
        <div className="mb-1 text-[32px] font-normal text-[#202124]">78.5%</div>
        <div className="flex items-center gap-1 text-[12px] text-[#34A853]">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          Tăng 2.1% nhờ nhắc nhở AI
        </div>
      </div>
    </div>
  );
};
