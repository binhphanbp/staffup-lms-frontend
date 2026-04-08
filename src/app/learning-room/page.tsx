'use client';

import React, { useState } from 'react';
import { LearningHeader } from '@/components/learning-room/LearningHeader';
import { VideoPlayer } from '@/components/learning-room/VideoPlayer';
import { LearningTabs } from '@/components/learning-room/LearningTabs';
import { SyllabusSidebar } from '@/components/learning-room/SyllabusSidebar';

export default function LearningRoomPage() {
  // State duy nhất còn lại để điều phối layout giữa Cột Trái và Cột Phải
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-900 text-slate-800">
      <LearningHeader />

      <div className="relative flex flex-1 overflow-hidden bg-slate-900">
        {/* KHỐI TRÁI: Video và Tabs */}
        <div className="custom-scrollbar flex h-full flex-1 flex-col overflow-y-auto bg-white">
          <VideoPlayer />
          <LearningTabs />
        </div>

        {/* KHỐI PHẢI: Giáo trình (Truyền state và hàm thay đổi state qua props) */}
        <SyllabusSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    </div>
  );
}
