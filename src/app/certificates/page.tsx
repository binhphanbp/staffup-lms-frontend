'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';
import { ProfileBanner } from '@/components/certificates/ProfileBanner';
import { BadgeTab } from '@/components/certificates/BadgeTab';
import { CertificateTab } from '@/components/certificates/CertificateTab';

export default function CertificatesPage() {
  // State quản lý Tab đang mở
  const [activeTab, setActiveTab] = useState<'certificates' | 'badges'>('certificates');
  // State quản lý hiển thị Toast Notification
  const [showToast, setShowToast] = useState(false);

  // Hàm xử lý copy text và hiện Toast
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    // Tự động ẩn sau 2.5 giây
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] text-sm text-slate-700">
      <Sidebar />

      <main className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Thành tích & Chứng chỉ' }]}
        />

        <div className="custom-scrollbar relative flex-1 overflow-y-auto p-6 lg:p-8">
          {/* KHỐI 1: BANNER PROFILE */}
          <ProfileBanner />

          {/* KHỐI 2: TAB NAVIGATION */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex gap-8 text-[14px] font-semibold">
              <button
                onClick={() => setActiveTab('certificates')}
                className={`flex items-center gap-2 border-b-2 py-3 transition-colors ${activeTab === 'certificates' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <i className="fa-solid fa-file-contract"></i> Chứng chỉ (Certificates)
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`flex items-center gap-2 border-b-2 py-3 transition-colors ${activeTab === 'badges' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <i className="fa-solid fa-shield"></i> Huy hiệu Kỹ năng (Badges)
              </button>
            </nav>
          </div>

          {/* KHỐI 3: NỘI DUNG TABS */}
          {/* TAB 1: CERTIFICATES */}
          {activeTab === 'certificates' && <CertificateTab onCopy={handleCopy} />}

          {/* TAB 2: BADGES */}
          {activeTab === 'badges' && <BadgeTab />}

          <footer className="mt-8 border-t border-gray-200 py-6 text-center text-[11px] text-slate-400">
            &copy; 2026 TechCorp LMS. Blockchain Credential Verification System Active.
          </footer>
        </div>
      </main>

      {/* TOAST NOTIFICATION (Copy ID) */}
      <div
        className={`fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-xs font-medium text-white shadow-2xl ${showToast ? 'animate-slide-up-toast' : 'invisible opacity-0'}`}
      >
        <i className="fa-solid fa-circle-check text-success text-sm"></i>
        <span>Đã sao chép Credential ID vào Clipboard!</span>
      </div>
    </div>
  );
}
