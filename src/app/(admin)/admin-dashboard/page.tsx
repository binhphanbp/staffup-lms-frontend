import type { Metadata } from 'next';
import { AIInsightCard } from '@/components/admin/dashboard/AIInsightCard';
import { StatCards } from '@/components/admin/dashboard/StatCards';
import { TrendChart } from '@/components/admin/dashboard/TrendChart';
import { UserPieChart } from '@/components/admin/dashboard/UserPieChart';
import { StudentProgressTable } from '@/components/admin/dashboard/StudentProgressTable';
import { InstructorActivityTable } from '@/components/admin/dashboard/InstructorActivityTable';
import { ActivityLog } from '@/components/admin/dashboard/ActivityLog';

export const metadata: Metadata = {
  title: 'Bảng điều khiển Trung tâm',
};

export default function AdminDashboardPage() {
  return (
    <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="m-0 text-[22px] font-normal text-[#202124]">Bảng điều khiển Trung tâm</h1>
        <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#1A73E8] transition-all hover:bg-[#F8F9FA]">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Xuất báo cáo
        </button>
      </div>

      {/* AI Insight Card */}
      <AIInsightCard />

      {/* Stat Cards */}
      <StatCards />

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <TrendChart />
        </div>
        <div className="col-span-1">
          <UserPieChart />
        </div>
      </div>

      {/* Tables Row */}
      <div className="mb-6 grid grid-cols-2 gap-6">
        <StudentProgressTable />
        <InstructorActivityTable />
      </div>

      {/* Activity Log */}
      <ActivityLog />
    </div>
  );
}
