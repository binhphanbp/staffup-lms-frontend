import { StudentSidebar } from '@/components/shared/StudentSidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5]">
      <StudentSidebar />
      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
