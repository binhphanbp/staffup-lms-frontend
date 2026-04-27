'use client';

import { motion } from 'motion/react';
import { AIInsightCard } from '@/components/admin/dashboard/AIInsightCard';
import { StatCards } from '@/components/admin/dashboard/StatCards';
import { TrendChart } from '@/components/admin/dashboard/TrendChart';
import { UserPieChart } from '@/components/admin/dashboard/UserPieChart';
import { StudentProgressTable } from '@/components/admin/dashboard/StudentProgressTable';
import { InstructorActivityTable } from '@/components/admin/dashboard/InstructorActivityTable';
import { ActivityLog } from '@/components/admin/dashboard/ActivityLog';
import { useAdminDashboard } from '@/hooks/useDashboard';
import { useEnrollments } from '@/hooks/useEnrollments';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboard();
  const { data: enrollments, isLoading: isLoadingEnrollments } = useEnrollments({
    page: 1,
    limit: 8,
    status: 'in_progress',
  });

  const progressData = enrollments?.data?.map((e) => ({
    fullName: e.user.fullName,
    email: e.user.email,
    courseTitle: e.course.title,
    progressPercent: e.progressPercent,
  }));

  const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  };

  return (
    <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-6 flex items-center justify-between"
      >
        <h1 className="m-0 text-[22px] font-normal text-[#202124] dark:text-slate-100">
          Bảng điều khiển Trung tâm
        </h1>
        <button className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 py-2 text-[13px] font-medium text-[#1A73E8] transition-all hover:bg-[#F8F9FA] dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Xuất báo cáo
        </button>
      </motion.div>

      {/* AI Insight Card */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <AIInsightCard />
      </motion.div>

      {/* Stat Cards */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.05 }}>
        <StatCards
          totalUsers={stats?.users.total}
          activeCourses={stats?.courses.published}
          totalTrainers={stats?.users.byRole.trainer}
          completionRate={stats?.enrollments.completionRate}
          loading={isLoading}
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.1 }}
        className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6"
      >
        <div className="col-span-1 lg:col-span-2">
          <TrendChart />
        </div>
        <div className="col-span-1">
          <UserPieChart />
        </div>
      </motion.div>

      {/* Tables Row */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.15 }}
        className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6"
      >
        <StudentProgressTable data={progressData} loading={isLoadingEnrollments} />
        <InstructorActivityTable />
      </motion.div>

      {/* Activity Log */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
        <ActivityLog />
      </motion.div>
    </div>
  );
}
