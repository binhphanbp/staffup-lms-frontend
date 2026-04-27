'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { TrendPoint } from '@/services/department-analytics.service';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface DeptTrendLineChartProps {
  enrollments: TrendPoint[];
  completions: TrendPoint[];
  active: TrendPoint[];
}

const formatLabel = (iso: string): string => {
  const [, mm, dd] = iso.split('-');
  return `${dd}/${mm}`;
};

export function DeptTrendLineChart({ enrollments, completions, active }: DeptTrendLineChartProps) {
  const labels = enrollments.map((p) => formatLabel(p.date));

  const data = {
    labels,
    datasets: [
      {
        label: 'Đăng ký mới',
        data: enrollments.map((p) => p.count),
        borderColor: '#1A73E8',
        backgroundColor: 'rgba(26, 115, 232, 0.10)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Hoàn thành',
        data: completions.map((p) => p.count),
        borderColor: '#34A853',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
      },
      {
        label: 'Học viên hoạt động',
        data: active.map((p) => p.count),
        borderColor: '#F4B400',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#202124] dark:text-white">
            Xu hướng theo ngày
          </h3>
          <p className="text-xs text-[#5F6368] dark:text-slate-400">
            Đăng ký mới · Hoàn thành · Học viên hoạt động
          </p>
        </div>
      </div>
      <div className="h-[280px]">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } },
              tooltip: {
                backgroundColor: '#202124',
                titleFont: { size: 12 },
                bodyFont: { size: 12 },
              },
            },
            scales: {
              x: {
                ticks: { maxTicksLimit: 10, font: { size: 11 } },
                grid: { display: false },
              },
              y: {
                beginAtZero: true,
                ticks: { precision: 0, font: { size: 11 } },
                grid: { color: '#F1F3F4' },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
