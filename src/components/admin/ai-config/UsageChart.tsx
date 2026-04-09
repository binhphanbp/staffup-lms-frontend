'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export const UsageChart = () => {
  const chartData = {
    labels: ['1', '5', '10', '15', '20', '25', '30'],
    datasets: [
      {
        label: 'Tokens (k)',
        data: [12, 45, 30, 80, 120, 95, 150],
        borderColor: '#9334E6',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(147, 52, 230, 0.2)');
          gradient.addColorStop(1, 'rgba(147, 52, 230, 0)');
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="mb-6 flex flex-col overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
      <div className="border-b border-[#DADCE0] bg-[#FAFAFA] px-6 py-4">
        <h3 className="m-0 flex items-center gap-2 text-[15px] font-medium text-[#202124]">
          <span className="material-symbols-outlined text-[#5F6368]">data_usage</span> Lưu lượng &
          Chi phí
        </h3>
      </div>
      <div className="p-6">
        <div className="mb-2 flex justify-between">
          <span className="text-[13px] text-[#5F6368]">Token đã sử dụng (Tháng này)</span>
          <span className="font-medium text-[#202124]">450.2K / 1M</span>
        </div>
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F3F4]">
          <div className="h-full w-[45%] rounded-full bg-[#9334E6]"></div>
        </div>

        <div className="mb-4 h-[150px] w-full">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: '#202124',
                  displayColors: false,
                  callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: function (context: any) {
                      return context.raw + 'k tokens';
                    },
                  },
                },
              },
              scales: {
                y: { display: false, min: 0 },
                x: {
                  grid: { display: false },
                  ticks: { color: '#9AA0A6', font: { size: 10 } },
                },
              },
            }}
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#DADCE0] pt-4">
          <span className="text-[12px] text-[#5F6368]">Chi phí ước tính:</span>
          <strong className="text-[16px] text-[#202124]">$12.50</strong>
        </div>
      </div>
    </div>
  );
};
