'use client';

export const UserPieChart = () => {
  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white p-6">
      <h3 className="mb-4 text-[16px] font-medium text-[#202124]">Cơ cấu Người dùng hệ thống</h3>

      {/* Pie chart */}
      <div className="mb-6 flex justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Blue - Học viên (Learner) - 70% */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#1A73E8"
            strokeWidth="40"
            strokeDasharray="352 528"
            transform="rotate(-90 100 100)"
          />
          {/* Yellow - Giảng viên (Trainer) - 15% */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#F9AB00"
            strokeWidth="40"
            strokeDasharray="79 528"
            strokeDashoffset="-352"
            transform="rotate(-90 100 100)"
          />
          {/* Green - Quản lý (Manager) - 10% */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#34A853"
            strokeWidth="40"
            strokeDasharray="53 528"
            strokeDashoffset="-431"
            transform="rotate(-90 100 100)"
          />
          {/* Red - Admin - 5% */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#EA4335"
            strokeWidth="40"
            strokeDasharray="26 528"
            strokeDashoffset="-484"
            transform="rotate(-90 100 100)"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#1A73E8]"></div>
            <span className="text-[13px] text-[#5F6368]">Học viên (Learner)</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#F9AB00]"></div>
            <span className="text-[13px] text-[#5F6368]">Giảng viên (Trainer)</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#34A853]"></div>
            <span className="text-[13px] text-[#5F6368]">Quản lý (Manager)</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#EA4335]"></div>
            <span className="text-[13px] text-[#5F6368]">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};
