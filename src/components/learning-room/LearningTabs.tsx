/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const LearningTabs = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'qa'>('overview');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-6 lg:px-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
            4. Database Replication & Partitioning (Sharding)
          </h2>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <img
              src="https://ui-avatars.com/api/?name=Le+Nam&background=0f172a&color=fff"
              className="h-6 w-6 rounded-full"
              alt="Author"
            />
            <span className="font-medium text-slate-700">Lê Hoài Nam</span>
            <span className="text-slate-300">•</span>
            <span>Cập nhật: 12/03/2026</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="hover:text-primary hover:border-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 shadow-sm transition-colors"
            title="Lưu khóa học"
          >
            <i className="fa-regular fa-bookmark"></i>
          </button>
          <button
            className="hover:text-primary hover:border-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 shadow-sm transition-colors"
            title="Tải tài liệu"
          >
            <i className="fa-solid fa-download"></i>
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-6 text-[13px] font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 py-3 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1 border-b-2 py-3 transition-colors ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Ghi chú{' '}
            <span className="bg-primary rounded-full px-1.5 py-0.5 text-[9px] text-white">2</span>
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`border-b-2 py-3 transition-colors ${activeTab === 'qa' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Hỏi đáp (Q&A)
          </button>
        </nav>
      </div>

      <div className="flex-1 pb-10">
        {activeTab === 'overview' && (
          <div className="max-w-4xl animate-[fadeIn_0.3s_ease-in-out] space-y-4 text-[14px] leading-relaxed text-slate-600">
            <p>
              Trong bài học này, chúng ta sẽ đi sâu vào các chiến lược mở rộng cơ sở dữ liệu khi hệ
              thống vượt quá giới hạn của một máy chủ vật lý duy nhất (Scale Up không còn khả thi).
            </p>
            <h4 className="mt-6 text-base font-bold text-slate-800">Nội dung chính bao gồm:</h4>
            <ul className="marker:text-primary ml-2 list-inside list-disc space-y-2">
              <li>
                <strong>Replication (Nhân bản):</strong> Master-Slave architecture, Active-Active,
                xử lý Replication Lag.
              </li>
              <li>
                <strong>Partitioning / Sharding (Phân mảnh):</strong> Horizontal vs Vertical
                partitioning.
              </li>
              <li>
                Các thuật toán Sharding: Range based, Hash based, và{' '}
                <strong>Consistent Hashing</strong>.
              </li>
              <li>Demo thực tế: Cấu hình Read-Replica trên AWS RDS.</li>
            </ul>
            <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-800">
                <i className="fa-solid fa-link"></i> Tài liệu đính kèm
              </h4>
              <div className="flex flex-col gap-2">
                <Link
                  href="#"
                  className="text-primary flex items-center gap-2 text-[13px] hover:underline"
                >
                  <i className="fa-regular fa-file-pdf"></i> Slides_Bài4_DB_Sharding.pdf (2.4 MB)
                </Link>
                <Link
                  href="#"
                  className="text-primary flex items-center gap-2 text-[13px] hover:underline"
                >
                  <i className="fa-solid fa-code"></i> sample_consistent_hashing.py (Source code)
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="max-w-4xl animate-[fadeIn_0.3s_ease-in-out]">
            <div className="mb-8 rounded-lg border border-gray-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Tạo ghi chú mới</span>
                <button className="hover:bg-primary flex items-center gap-1 rounded bg-slate-200 px-2 py-1 font-mono text-[11px] font-bold text-slate-700 transition-colors hover:text-white">
                  <i className="fa-solid fa-thumbtack"></i> Đính kèm lúc 10:05
                </button>
              </div>
              <textarea
                className="focus:ring-primary focus:border-primary h-24 w-full resize-none rounded-md border border-gray-300 p-3 font-mono text-[13px] transition-all outline-none focus:ring-1"
                placeholder="Gõ ghi chú hoặc dán đoạn code vào đây... Markdown được hỗ trợ."
              ></textarea>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-[10px] text-slate-400">
                  Ghi chú của bạn được lưu riêng tư và không ai khác có thể xem.
                </div>
                <button className="rounded bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-black">
                  Lưu ghi chú
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="group rounded-lg border border-gray-100 p-4 transition-colors hover:border-gray-300">
                <div className="flex items-start gap-3">
                  <button className="bg-primary-bg text-primary border-primary/20 hover:bg-primary mt-0.5 flex-shrink-0 cursor-pointer rounded border px-2 py-1 font-mono text-[11px] font-bold transition-colors hover:text-white">
                    04:15
                  </button>
                  <div className="flex-1">
                    <p className="font-mono text-[13px] leading-relaxed text-slate-700">
                      Sự khác biệt chính giữa Master-Slave: Master xử lý Write, Slave xử lý Read.
                      Cần cẩn thận với Replication Lag (tức là ghi xong đọc liền có thể không thấy
                      data).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="max-w-4xl animate-[fadeIn_0.3s_ease-in-out]">
            <div className="mb-8 flex gap-3">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi trong bài này..."
                  className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-200 bg-slate-50 py-2 pr-4 pl-9 text-[13px] outline-none focus:bg-white focus:ring-1"
                />
              </div>
              <button className="hover:border-primary hover:text-primary rounded-md border border-slate-300 bg-white px-4 py-2 text-[13px] font-bold whitespace-nowrap text-slate-700 transition-colors">
                Đặt câu hỏi mới
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex w-8 flex-shrink-0 flex-col items-center gap-1">
                  <button className="hover:text-primary text-slate-300">
                    <i className="fa-solid fa-caret-up text-2xl leading-none"></i>
                  </button>
                  <span className="text-sm font-bold text-slate-600">12</span>
                  <button className="hover:text-danger text-slate-300">
                    <i className="fa-solid fa-caret-down text-2xl leading-none"></i>
                  </button>
                </div>
                <div className="flex-1">
                  <h4 className="text-primary mb-1 cursor-pointer text-[14px] font-bold hover:underline">
                    Xử lý vấn đề Split-Brain trong Active-Active DB như thế nào?
                  </h4>
                  <p className="mb-2 line-clamp-2 text-[13px] text-slate-600">
                    Giảng viên có nhắc đến việc setup 2 con Master đồng thời. Nhưng nếu đường mạng
                    bị đứt...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
