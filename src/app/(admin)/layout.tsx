import { AdminSidebar } from '@/components/shared/AdminSidebar';
import { AdminHeader } from '@/components/shared/AdminHeader';

// ============================================================
// Admin Layout — Sidebar + Header + Main Content Area
// ============================================================

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#202124] antialiased"
    >
      <AdminSidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
