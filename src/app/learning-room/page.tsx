'use client';

import React, { useState } from 'react';
import { LearningHeader } from '@/components/learning-room/LearningHeader';
import { VideoPlayer } from '@/components/learning-room/VideoPlayer';
import { LearningTabs } from '@/components/learning-room/LearningTabs';
import { SyllabusSidebar } from '@/components/learning-room/SyllabusSidebar';

export default function LearningRoomPage() {
  // Mặc định đóng trên mobile, mở trên desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-900 text-slate-800">
      <LearningHeader onOpenSyllabus={() => setIsSidebarOpen(true)} />

      <div className="relative flex flex-1 overflow-hidden bg-slate-900">
        {/* KHỐI TRÁI: Video và Tabs */}
        <div className="custom-scrollbar flex h-full flex-1 flex-col overflow-y-auto bg-white">
          <VideoPlayer />
          <LearningTabs />
        </div>

        {/* Backdrop — chỉ hiện trên mobile khi sidebar mở */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* KHỐI PHẢI: Giáo trình */}
        <SyllabusSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    </div>
  );
}
