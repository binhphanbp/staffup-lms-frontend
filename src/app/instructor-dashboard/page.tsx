import React from 'react';
import { InstructorSidebar } from '@/components/instructor/InstructorSidebar';
import { InstructorHeader } from '@/components/instructor/InstructorHeader';
import { StatsOverview } from '@/components/instructor/StatsOverview';
import { ActivityWidgets } from '@/components/instructor/ActivityWidgets';
import { QueueWidgets } from '@/components/instructor/QueueWidgets';

export default function InstructorDashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-700">
      <InstructorSidebar />

      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <InstructorHeader />

        <div className="custom-scrollbar flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
            {/* Hàng 1: Thống kê */}
            <StatsOverview />

            {/* Hàng 2: Split Columns */}
            <div className="flex flex-col gap-6 lg:flex-row">
              <ActivityWidgets />
              <QueueWidgets />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
