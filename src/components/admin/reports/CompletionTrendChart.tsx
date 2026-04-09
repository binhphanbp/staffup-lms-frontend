'use client';

export const CompletionTrendChart = () => {
  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-[#202124]">
          Xu hướng Hoàn thành Khóa học theo Tháng
        </h3>
        <button className="material-symbols-outlined text-[20px] text-[#5F6368]">more_vert</button>
      </div>

      <div className="mb-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#34A853]"></div>
          <span className="text-[13px] text-[#5F6368]">Lượt hoàn thành</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border-2 border-dashed border-[#1A73E8]"></div>
          <span className="text-[13px] text-[#5F6368]">Lượt đăng ký</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[280px] rounded bg-[#F8F9FA]">
        <svg className="h-full w-full" viewBox="0 0 700 280">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1="40"
              y1={40 + i * 40}
              x2="680"
              y2={40 + i * 40}
              stroke="#E0E0E0"
              strokeWidth="1"
            />
          ))}

          {/* Solid line (Hoàn thành) - Green */}
          <polyline
            points="60,180 160,160 260,140 360,120 460,100 560,80 660,60"
            fill="none"
            stroke="#34A853"
            strokeWidth="2"
          />
          {/* Points */}
          {[
            [60, 180],
            [160, 160],
            [260, 140],
            [360, 120],
            [460, 100],
            [560, 80],
            [660, 60],
          ].map((point, i) => (
            <circle key={i} cx={point[0]} cy={point[1]} r="4" fill="#34A853" />
          ))}

          {/* Dashed line (Đăng ký) - Blue */}
          <polyline
            points="60,200 160,190 260,180 360,170 460,160 560,150 660,140"
            fill="none"
            stroke="#1A73E8"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          {/* Points */}
          {[
            [60, 200],
            [160, 190],
            [260, 180],
            [360, 170],
            [460, 160],
            [560, 150],
            [660, 140],
          ].map((point, i) => (
            <circle key={i} cx={point[0]} cy={point[1]} r="4" fill="#1A73E8" />
          ))}

          {/* X-axis labels */}
          {['Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12', 'Tháng 1', 'Tháng 2'].map((label, i) => (
            <text key={i} x={60 + i * 120} y="270" fill="#5F6368" fontSize="12" textAnchor="middle">
              {label}
            </text>
          ))}

          {/* Y-axis labels */}
          {['500', '400', '300', '200', '100', '0'].map((label, i) => (
            <text key={i} x="30" y={50 + i * 40} fill="#5F6368" fontSize="12" textAnchor="end">
              {label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
