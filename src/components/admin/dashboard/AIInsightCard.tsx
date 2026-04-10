export const AIInsightCard = () => {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#C2E7FF] bg-[#E8F4FD] p-4">
      <div className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full bg-[#1A73E8]">
        <span className="material-symbols-outlined text-[24px] text-white">lightbulb</span>
      </div>
      <div className="flex-1">
        <h3 className="mb-1 text-[14px] font-semibold text-[#202124]">
          AI Insight: Cảnh báo từ Phân hệ Học viên
        </h3>
        <p className="mb-2 text-[13px] leading-[1.5] text-[#5F6368]">
          Mô hình dự đoán có <strong>12 học viên</strong> thuộc khóa{' '}
          <strong>Kinh doanh đường cơ nguy cơ bỏ dở 80 khóa học</strong> &ldquo;Kỹ năng Đàm
          phán&rdquo;. Nguyên nhân chính: Trung tâc vốt tài liệu gần 80% trong 7 ngày qua.
        </p>
        <div className="flex gap-3">
          <button className="text-[13px] font-medium text-[#1A73E8] hover:underline">
            Xem danh sách chi tiết
          </button>
          <button className="text-[13px] font-medium text-[#1A73E8] hover:underline">
            Gửi email nhắc nhở tự động
          </button>
        </div>
      </div>
    </div>
  );
};
