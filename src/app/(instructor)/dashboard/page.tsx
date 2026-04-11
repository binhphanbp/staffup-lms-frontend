'use client';

import React from 'react';
import { AIInsightCard } from '@/components/admin/dashboard/AIInsightCard';
import { StatsOverview } from '@/components/instructor/StatsOverview';
import { ActivityWidgets } from '@/components/instructor/ActivityWidgets';
import { QueueWidgets } from '@/components/instructor/QueueWidgets';
import { useTrainerDashboard } from '@/hooks/useDashboard';

export default function InstructorDashboardPage() {
  const { data: stats, isLoading } = useTrainerDashboard();

  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mx-auto flex w-full flex-col gap-6">
        {/* AI Insights */}
        <AIInsightCard />

        {/* Hàng 1: Thống kê */}
        <StatsOverview
          totalStudents={stats?.enrollments?.total}
          pendingGrading={stats?.pendingGrading?.total}
          totalCourses={stats?.courses?.total}
          loading={isLoading}
        />

        {/* Hàng 2: Split Columns */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <ActivityWidgets />
          <QueueWidgets />
        </div>
      </div>
    </div>
  );
}
