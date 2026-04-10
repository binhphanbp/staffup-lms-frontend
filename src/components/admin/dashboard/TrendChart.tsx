'use client';

export const TrendChart = () => {
  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-[#202124]">
          Xu hướng Đăng ký & Hoàn thành (30 ngày)
        </h3>
        <button className="material-symbols-outlined text-[20px] text-[#5F6368]">more_vert</button>
      </div>

      <div className="mb-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#1A73E8]"></div>
          <span className="text-[13px] text-[#5F6368]">Lượt đăng ký mới (học viên)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border-2 border-dashed border-[#34A853]"></div>
          <span className="text-[13px] text-[#5F6368]">Lượt hoàn thành chứng chỉ</span>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="relative h-[280px] rounded bg-[#F8F9FA]">
        <svg className="h-full w-full" viewBox="0 0 600 280">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1="40"
              y1={40 + i * 40}
              x2="580"
              y2={40 + i * 40}
              stroke="#E0E0E0"
              strokeWidth="1"
            />
          ))}

          {/* Solid line (Đăng ký) */}
          <polyline
            points="60,180 140,160 220,200 300,140 380,120 460,100 540,80"
            fill="none"
            stroke="#1A73E8"
            strokeWidth="2"
          />

          {/* Dashed line (Hoàn thành) */}
          <polyline
            points="60,240 140,220 220,200 300,180 380,160 460,140 540,120"
            fill="none"
            stroke="#34A853"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* X-axis labels */}
          {['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6'].map((label, i) => (
            <text key={i} x={60 + i * 96} y="270" fill="#5F6368" fontSize="12" textAnchor="middle">
              {label}
            </text>
          ))}

          {/* Y-axis labels */}
          {['100', '80', '60', '40', '20', '0'].map((label, i) => (
            <text key={i} x="30" y={50 + i * 40} fill="#5F6368" fontSize="12" textAnchor="end">
              {label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
