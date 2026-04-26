/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { StudentSidebar } from '@/components/shared/StudentSidebar';
import { LearningPath } from '@/components/dashboard/LearningPath';
import { SkillProfile } from '@/components/dashboard/SkillProfile';
import { StatCards } from '@/components/dashboard/StatCards';
import { useEmployeeDashboard } from '@/hooks/useDashboard';
import { useEnrollments } from '@/hooks/useEnrollments';
import { resolveMediaUrl } from '@/lib/media';
import { MobileNavProvider, useMobileNav } from '@/context/MobileNavContext';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { useAuthStore } from '@/store/useAuthStore';
import type { EmployeeDashboardStats } from '@/types';

// ── helpers ────────────────────────────────────────────────────────────────
function statusBadge(status: string) {
  if (status === 'completed')
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
        Hoàn thành
      </span>
    );
  if (status === 'in_progress')
    return (
      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
        Đang học
      </span>
    );
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
      Được giao
    </span>
  );
}

function daysTag(days: number) {
  if (days <= 3) return 'text-red-600 bg-red-50';
  if (days <= 7) return 'text-orange-600 bg-orange-50';
  return 'text-slate-600 bg-slate-100';
}

// ── sub-sections ────────────────────────────────────────────────────────────
function CoursesList({ courses }: { courses: EmployeeDashboardStats['myCourses']['courses'] }) {
  const active = courses.filter((c) => c.status === 'in_progress' || c.status === 'assigned');
  if (active.length === 0)
    return (
      <div className="card p-6 text-center text-sm text-slate-400">
        Bạn chưa có khóa học nào đang học.{' '}
        <Link href="/courses" className="text-primary hover:underline">
          Khám phá khóa học
        </Link>
      </div>
    );
  return (
    <div className="flex flex-col gap-3">
      {active.map((c) => {
        const thumb = resolveMediaUrl(c.courseThumbnail);
        return (
          <Link
            key={c.enrollmentId}
            href={`/courses/detail/learning-room?courseId=${c.courseId}`}
            className="card group flex cursor-pointer flex-col gap-4 p-4 transition-shadow hover:shadow-md sm:flex-row"
          >
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-md bg-slate-100 sm:w-40">
              {thumb ? (
                <img src={thumb} className="h-full w-full object-cover" alt={c.courseTitle} />
              ) : (
                <div className="flex h-full items-center justify-center p-2 text-center text-[11px] text-slate-400">
                  {c.courseTitle}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="bg-primary/90 flex h-9 w-9 items-center justify-center rounded-full text-white shadow">
                  <i className="fa-solid fa-play ml-0.5 text-xs"></i>
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
              <div>
                <div className="mb-1 flex flex-wrap items-start gap-2">
                  <h3 className="group-hover:text-primary min-w-0 flex-1 truncate text-sm font-bold text-slate-800 transition-colors">
                    {c.courseTitle}
                  </h3>
                  {statusBadge(c.status)}
                </div>
                <p className="text-[11px] text-slate-400">
                  Ghi danh: {new Date(c.enrolledAt).toLocaleDateString('vi-VN')}
                  {c.dueAt && (
                    <span className="ml-2 font-medium text-orange-500">
                      · Hạn: {new Date(c.dueAt).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="font-medium text-slate-500">Tiến độ</span>
                  <span className="text-primary font-bold">{c.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function RecentCertificates({ certs }: { certs: EmployeeDashboardStats['certificates'] }) {
  if (certs.total === 0) return null;
  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <i className="fa-solid fa-award text-warning text-sm"></i> Chứng chỉ đạt được
        </h2>
        <Link href="/certificates" className="text-primary text-xs font-semibold hover:underline">
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {certs.certificates.slice(0, 4).map((cert) => (
          <Link
            key={cert.certificateId}
            href={`/certificates/${cert.certificateId}`}
            className="card group flex items-center gap-4 p-4 transition-shadow hover:shadow-md"
          >
            <div className="bg-warning/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <i className="fa-solid fa-certificate text-warning text-xl"></i>
            </div>
            <div className="min-w-0">
              <div className="group-hover:text-primary truncate text-sm font-bold text-slate-800 transition-colors">
                {cert.courseTitle}
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                {cert.certificateCode}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                {new Date(cert.issuedAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function UpcomingDeadlines({
  deadlines,
}: {
  deadlines: EmployeeDashboardStats['progressSummary']['upcomingDeadlines'];
}) {
  if (deadlines.length === 0)
    return (
      <div className="flex flex-col items-center gap-1.5 py-5 text-center">
        <i className="fa-solid fa-circle-check text-2xl text-green-400"></i>
        <p className="text-[11px] text-slate-400">Không có deadline nào sắp tới.</p>
      </div>
    );
  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {deadlines.map((d) => (
        <Link
          key={d.courseId}
          href={`/courses/detail/learning-room?courseId=${d.courseId}`}
          className={`group flex flex-col gap-2 border-l-2 px-3 py-3 transition-colors hover:bg-slate-50 ${
            d.daysRemaining <= 3
              ? 'border-red-400'
              : d.daysRemaining <= 7
                ? 'border-orange-400'
                : 'border-slate-200'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="group-hover:text-primary min-w-0 flex-1 truncate text-[12px] leading-tight font-bold text-slate-800 transition-colors">
              {d.courseTitle}
            </span>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${daysTag(d.daysRemaining)}`}
            >
              {d.daysRemaining === 0 ? 'Hôm nay' : `${d.daysRemaining}d`}
            </span>
          </div>
          <div>
            <div className="mb-0.5 flex justify-between text-[10px] text-slate-400">
              <span>Tiến độ</span>
              <span className="font-bold">{d.currentProgress}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${d.daysRemaining <= 3 ? 'bg-red-500' : d.daysRemaining <= 7 ? 'bg-orange-400' : 'bg-primary'}`}
                style={{ width: `${d.currentProgress}%` }}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── main page ───────────────────────────────────────────────────────────────
function DashboardContent() {
  const hasRole = useAuthStore((s) => s.hasRole);
  const isEmployee = hasRole('employee');
  const { data: stats, isLoading } = useEmployeeDashboard();
  const { data: _enrollmentFallback } = useEnrollments(isEmployee ? undefined : { limit: 100 });
  const { mobileOpen, closeMobileNav } = useMobileNav();
  const deadlines = stats?.progressSummary?.upcomingDeadlines ?? [];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] text-sm text-slate-700">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileNav}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:relative lg:z-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <StudentSidebar />
      </div>

      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <StudentHeader
          breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bảng điều khiển' }]}
        />

        <div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth p-6 lg:p-8">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-slate-400">
              <i className="fa-solid fa-spinner mr-2 animate-spin"></i> Đang tải...
            </div>
          ) : (
            <>
              <StatCards stats={stats ?? null} />

              <div className="flex flex-col gap-8 xl:flex-row">
                {/* ── Left column ── */}
                <div className="flex min-w-0 flex-1 flex-col gap-8">
                  {/* Courses in progress / assigned */}
                  <div>
                    <div className="mb-4 flex items-end justify-between">
                      <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
                        <i className="fa-solid fa-book-open text-primary text-sm"></i> Khóa học của
                        bạn
                        {(stats?.myCourses?.inProgress ?? 0) + (stats?.myCourses?.assigned ?? 0) >
                          0 && (
                          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-bold">
                            {(stats?.myCourses?.inProgress ?? 0) +
                              (stats?.myCourses?.assigned ?? 0)}
                          </span>
                        )}
                      </h2>
                      <Link
                        href="/courses"
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        Xem tất cả
                      </Link>
                    </div>
                    <CoursesList courses={stats?.myCourses?.courses ?? []} />
                  </div>

                  {/* Roadmaps */}
                  <LearningPath roadmaps={stats?.myRoadmaps ?? null} />

                  {/* Certificates */}
                  {stats && <RecentCertificates certs={stats.certificates} />}
                </div>

                {/* ── Right column ── */}
                <div className="flex w-full shrink-0 flex-col gap-5 xl:w-[340px]">
                  {/* Deadlines */}
                  <div className="card overflow-hidden p-0">
                    <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-4 py-3">
                      <h3 className="flex items-center gap-2 text-[13px] font-bold text-slate-800">
                        <i className="fa-solid fa-clock text-sm text-orange-400"></i>
                        Deadline sắp tới
                        {deadlines.length > 0 && (
                          <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                            {deadlines.length}
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="p-3">
                      <UpcomingDeadlines deadlines={deadlines} />
                    </div>
                  </div>

                  {/* Skill Profile */}
                  <SkillProfile />

                  {/* AI Suggestions */}
                  <div className="card overflow-hidden p-0">
                    <div className="flex items-center justify-between border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-white px-4 py-3">
                      <h3 className="flex items-center gap-2 text-[13px] font-bold text-purple-900">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100">
                          <i className="fa-solid fa-wand-magic-sparkles text-[10px] text-purple-600"></i>
                        </span>
                        AI đề xuất cho bạn
                      </h3>
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-purple-600 uppercase">
                        Beta
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {/* Suggestion 1 */}
                      <div className="group flex gap-3 p-4 transition-colors hover:bg-slate-50">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                          <i className="fa-solid fa-shield-halved text-[13px] text-purple-600"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 text-[12px] leading-snug font-bold text-slate-800 transition-colors group-hover:text-purple-700">
                            Bảo mật Web &amp; Phòng chống tấn công
                          </div>
                          <div className="mb-2 text-[11px] leading-relaxed text-slate-500">
                            Lấp đầy khoảng trống kỹ năng Security bắt buộc trong Quý này.
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold tracking-wide text-red-600 uppercase">
                              Ưu tiên cao
                            </span>
                            <Link
                              href="/courses"
                              className="text-primary border-primary hover:bg-primary ml-auto rounded-md border px-2.5 py-1 text-[10px] font-bold transition-colors hover:text-white"
                            >
                              Xem khóa học
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Suggestion 2 */}
                      <div className="group flex gap-3 p-4 transition-colors hover:bg-slate-50">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                          <i className="fa-brands fa-aws text-[13px] text-[#ff9900]"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 text-[12px] leading-snug font-bold text-slate-800 transition-colors group-hover:text-purple-700">
                            AWS Solutions Architect
                          </div>
                          <div className="mb-2 text-[11px] leading-relaxed text-slate-500">
                            Nâng cấp AWS từ Lvl 3 lên Lvl 4 theo lộ trình phát triển.
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold tracking-wide text-blue-600 uppercase">
                              Gợi ý
                            </span>
                            <Link
                              href="/courses"
                              className="text-primary border-primary hover:bg-primary ml-auto rounded-md border px-2.5 py-1 text-[10px] font-bold transition-colors hover:text-white"
                            >
                              Xem khóa học
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-center">
                      <Link
                        href="/courses"
                        className="text-primary text-[11px] font-semibold hover:underline"
                      >
                        Xem tất cả đề xuất →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={['employee', 'trainer', 'manager', 'admin']}>
      <MobileNavProvider>
        <DashboardContent />
      </MobileNavProvider>
    </RoleGuard>
  );
}
