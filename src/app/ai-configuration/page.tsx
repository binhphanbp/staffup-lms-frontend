'use client';

import React, { useState } from 'react';
import { AiSidebar } from '@/components/admin/ai-config/AiSidebar';
import { AiHeader } from '@/components/admin/ai-config/AiHeader';
import { ApiConnection } from '@/components/admin/ai-config/ApiConnection';
import { AiModules } from '@/components/admin/ai-config/AiModules';
import { UsageChart } from '@/components/admin/ai-config/UsageChart';
import { SystemPrompt } from '@/components/admin/ai-config/SystemPrompt';

export default function AIConfigurationPage() {
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  return (
    <>
      <div
        style={{ fontFamily: "'Roboto', sans-serif" }}
        className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#202124] antialiased"
      >
        <AiSidebar />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AiHeader />

          <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-8 py-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="m-0 flex items-center gap-2 text-[22px] font-normal text-[#202124]">
                <span className="material-symbols-outlined text-[28px] text-[#9334E6] [font-variation-settings:'FILL'_1]">
                  robot_2
                </span>
                Cấu hình Trí tuệ Nhân tạo (AI Core)
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => showToast('Đang khôi phục về cấu hình mặc định.')}
                  className="rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4] hover:text-[#202124]"
                >
                  Khôi phục mặc định
                </button>
                <button
                  onClick={() => showToast('Đã cập nhật toàn bộ cấu hình AI cho hệ thống.')}
                  className="flex items-center gap-2 rounded-[4px] border border-transparent bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#174EA6]"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span> Lưu cấu hình
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#FCE8B2] bg-[#FEF7E0] px-4 py-3">
              <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#B06000] [font-variation-settings:'FILL'_1]">
                lock
              </span>
              <p className="m-0 text-[13px] leading-[1.5] text-[#B06000]">
                <strong>Bảo mật API Key:</strong> API Key được lưu trữ dưới dạng mã hóa (Encrypted)
                trên cơ sở dữ liệu. Không chia sẻ API Key này cho bất kỳ ai để tránh phát sinh chi
                phí ngoài ý muốn. Hệ thống khuyến nghị sử dụng Google Gemini Pro cho dự án này.
              </p>
            </div>

            <div className="mb-6 grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <ApiConnection onShowToast={showToast} />
                <AiModules />
              </div>
              <div className="col-span-4">
                <UsageChart />
                <SystemPrompt />
              </div>
            </div>
          </div>
        </main>

        {/* TOAST NOTIFICATION */}
        <div
          className={`fixed bottom-6 left-6 z-[3000] flex items-center gap-3 rounded-[4px] bg-[#323232] px-6 py-[14px] text-white shadow-[0_4px_6px_0_rgba(60,64,67,0.15),0_12px_16px_0_rgba(60,64,67,0.15)] transition-transform duration-300 ${toast.visible ? 'translate-y-0' : 'translate-y-[100px]'}`}
        >
          <span className="material-symbols-outlined text-[24px] text-[#81C995]">check_circle</span>
          <span className="text-[14px]">{toast.message}</span>
        </div>
      </div>
    </>
  );
}
