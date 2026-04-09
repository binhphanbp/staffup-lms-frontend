export const ReportStatCards = () => {
  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {/* Tổng lượt đăng ký */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 text-[13px] text-[#5F6368]">Tổng lượt đăng ký (Enrollments)</div>
        <div className="mb-1 text-[32px] font-normal text-[#202124]">3,452</div>
        <div className="flex items-center gap-1 text-[12px] text-[#34A853]">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          +12% so với kỳ trước
        </div>
      </div>

      {/* Tỷ lệ hoàn thành */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 text-[13px] text-[#5F6368]">Tỷ lệ hoàn thành (Completion Rate)</div>
        <div className="mb-1 text-[32px] font-normal text-[#34A853]">78.5%</div>
        <div className="flex items-center gap-1 text-[12px] text-[#34A853]">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          +2.1% so với kỳ trước
        </div>
      </div>

      {/* Điểm số trung bình */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 text-[13px] text-[#5F6368]">Điểm số trung bình (Avg Score)</div>
        <div className="mb-1 text-[32px] font-normal text-[#F9AB00]">82.4</div>
        <div className="flex items-center gap-1 text-[12px] text-[#5F6368]">
          Mục tiêu công ty: 80.0
        </div>
      </div>

      {/* Giờ học tích lũy */}
      <div className="rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 text-[13px] text-[#5F6368]">Giờ học tích lũy</div>
        <div className="mb-1 text-[32px] font-normal text-[#202124]">12,050h</div>
        <div className="flex items-center gap-1 text-[12px] text-[#5F6368]">
          Trung bình 6.5h / nhân viên
        </div>
      </div>
    </div>
  );
};
