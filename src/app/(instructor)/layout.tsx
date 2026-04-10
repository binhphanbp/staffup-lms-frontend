'use client';

import { InstructorSidebar } from '@/components/instructor/InstructorSidebar';
import { InstructorHeader } from '@/components/instructor/InstructorHeader';
import { MobileNavProvider, useMobileNav } from '@/context/MobileNavContext';

function InstructorLayoutContent({ children }: { children: React.ReactNode }) {
  const { mobileOpen, closeMobileNav } = useMobileNav();
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-700">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
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
        <InstructorSidebar />
      </div>
      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <InstructorHeader />
        {children}
      </main>
    </div>
  );
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileNavProvider>
      <InstructorLayoutContent>{children}</InstructorLayoutContent>
    </MobileNavProvider>
  );
}
