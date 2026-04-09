import { InstructorSidebar } from '@/components/instructor/InstructorSidebar';
import { InstructorHeader } from '@/components/instructor/InstructorHeader';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-700">
      <InstructorSidebar />
      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <InstructorHeader />
        {children}
      </main>
    </div>
  );
}
