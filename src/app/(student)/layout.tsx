'use client';

import { StudentSidebar } from '@/components/shared/StudentSidebar';
import { MobileNavProvider, useMobileNav } from '@/context/MobileNavContext';
import { RoleGuard } from '@/components/shared/RoleGuard';

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const { mobileOpen, closeMobileNav } = useMobileNav();
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] dark:bg-slate-950 print:block print:h-auto print:overflow-visible">
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
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:relative lg:z-auto print:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <StudentSidebar />
      </div>
      <main id="main-content" className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['employee', 'trainer', 'manager', 'admin']}>
      <MobileNavProvider>
        <StudentLayoutContent>{children}</StudentLayoutContent>
      </MobileNavProvider>
    </RoleGuard>
  );
}
