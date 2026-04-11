'use client';

import { useState } from 'react';
import { ReportStatCards } from '@/components/admin/reports/ReportStatCards';
import { CompletionTrendChart } from '@/components/admin/reports/CompletionTrendChart';
import { DepartmentCompletionChart } from '@/components/admin/reports/DepartmentCompletionChart';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="m-0 text-[22px] font-normal text-[#202124]">
          Trung tâm Phân tích Dữ liệu (Analytics)
        </h1>
        <button className="flex items-center gap-2 rounded-[4px] bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#174EA6]">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Tải báo cáo (.xlsx)
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-8 border-b border-[#DADCE0]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`border-b-2 pb-3 text-[13px] font-medium tracking-[0.5px] uppercase transition-colors ${
            activeTab === 'overview'
              ? 'border-[#1A73E8] text-[#1A73E8]'
              : 'border-transparent text-[#5F6368] hover:text-[#202124]'
          }`}
        >
          Tổng quan
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`border-b-2 pb-3 text-[13px] font-medium tracking-[0.5px] uppercase transition-colors ${
            activeTab === 'courses'
              ? 'border-[#1A73E8] text-[#1A73E8]'
              : 'border-transparent text-[#5F6368] hover:text-[#202124]'
          }`}
        >
          Báo cáo theo Khóa học
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`border-b-2 pb-3 text-[13px] font-medium tracking-[0.5px] uppercase transition-colors ${
            activeTab === 'employees'
              ? 'border-[#1A73E8] text-[#1A73E8]'
              : 'border-transparent text-[#5F6368] hover:text-[#202124]'
          }`}
        >
          Báo cáo theo Nhân viên
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
            <span className="text-[13px] text-[#5F6368]">Bộ lọc dữ liệu:</span>
          </div>
          <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
            <option>30 ngày qua</option>
            <option>7 ngày qua</option>
            <option>90 ngày qua</option>
            <option>Tùy chỉnh</option>
          </select>
          <select className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none">
            <option>Tất cả Phòng ban</option>
            <option>Sales</option>
            <option>Tech</option>
            <option>HR</option>
            <option>Marketing</option>
            <option>Finance</option>
          </select>
        </div>
        <button className="flex items-center gap-1 text-[13px] text-[#1A73E8] hover:underline">
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Cập nhật lần cuối: Vài giây trước
        </button>
      </div>

      {/* Stat Cards */}
      <ReportStatCards />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="col-span-1 lg:col-span-2">
          <CompletionTrendChart />
        </div>
        <div className="col-span-1">
          <DepartmentCompletionChart />
        </div>
      </div>
    </div>
  );
}
