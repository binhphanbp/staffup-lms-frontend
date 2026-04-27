'use client';

import { AdminSidebar } from '@/components/shared/AdminSidebar';
import { AdminHeader } from '@/components/shared/AdminHeader';
import { MobileNavProvider, useMobileNav } from '@/context/MobileNavContext';
import { RoleGuard } from '@/components/shared/RoleGuard';

// ============================================================
// Admin Layout — Sidebar + Header + Main Content Area
// ============================================================

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { mobileOpen, closeMobileNav } = useMobileNav();
  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#202124] antialiased dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileNav}
          aria-hidden="true"
        />
      )}
      {/* Sidebar: slide-in on mobile, always visible on lg+ */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:relative lg:z-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <AdminSidebar />
      </div>
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin', 'manager', 'trainer']}>
      <MobileNavProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </MobileNavProvider>
    </RoleGuard>
  );
}
